#!/bin/bash

#_=''

if [ $# -ne 6 ]
then

	echo "Provide only six positional parameters"
	exit 1

fi

if [ -z $1 ]
then
	echo "Provide valid Image-id"
	exit 1
fi


if [ -z $2 ]
then
	echo "Provide valid Key-name"
	exit 1
fi


if [ -z $3 ]
then
	echo "Provide valid Security-Group"
	exit 1
fi


if [ -z $4 ]
then
    echo "Provide Instance Count"
	exit 1
fi


if [ -z $5 ]
then
	echo "Provide valid ELB-name"
	exit 1
fi


if [ -z $6 ]
then
	echo "Provide valid S3-bucket-name"
	exit 1
fi


#Create EC2 Instance

#InstanceIdList=`aws ec2 run-instances --image-id $1 --count $4 --instance-type t2.micro --key-name $2 --security-groups $3 --query 'Instances[*].InstanceId' --output text`

InstanceIdList=`aws ec2 run-instances --image-id $1 --count $4 --instance-type t2.micro --key-name $2 --security-groups $3 --placement AvailabilityZone=us-west-2b --user-data "file://./create-env-mp1.sh" --query 'Instances[*].InstanceId' --output text` 

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

echo "Created Instances $InstanceIdList"

declare -a arrInstanceList=(${InstanceIdList})
# get length of an arrInstanceList
arrInstanceListLength=${#arrInstanceList[@]}

#Fetch Instance Ids in a variable if required

#aws ec2 describe-instances --filters '[{"Name": "image-id", "Values": ["'$1'"]},{"Name": "instance-state-name","Values": ["pending"] }]' --query 'Reservations[*].Instances[*].InstanceId' --output text

#Creating tags for created instances to identify later on

aws ec2 create-tags --resources $InstanceIdList --tags Key="InstanceOwnerStudent",Value="A20410380"

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi


#Wait command to check if instances are running


echo "Waiting for instances to run."
aws ec2 wait instance-running --instance-ids $InstanceIdList

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

#Creating EBS Volumes

echo "Creating Volumnes"

for (( i=1; i<${arrInstanceListLength}+1; i++ ));
do
  echo "Creating and attaching Volume for Instance ID ${arrInstanceList[$i-1]}"
  
  volumeId=`aws ec2 create-volume --availability-zone us-west-2b --size 10 --tag-specifications 'ResourceType=volume, Tags=[{Key=InstanceOwnerStudent,Value=A20410380}]' --query 'VolumeId' --output text`
  
  if [ "$?" -ne "0" ]
  then
	echo "End of Script"
	exit 1;
  fi
  
  aws ec2 wait volume-available --volume-ids $volumeId
  
  if [ "$?" -ne "0" ]
  then
	echo "End of Script"
	exit 1;
  fi
  
  aws ec2 attach-volume --volume-id $volumeId --instance-id ${arrInstanceList[$i-1]} --device /dev/xvdh  
  
  if [ "$?" -ne "0" ]
  then
	echo "End of Script"
	exit 1;
  fi
  
  echo "Volume Created and attached for Instance ID ${arrInstanceList[$i-1]}"
  
  #echo $i " / " ${arrInstanceListLength} " : " ${arrInstanceList[$i-1]}
done



#Creating S3 bucket-name

echo "Creating S3 bucket"

aws s3api create-bucket --bucket bpatel68-data --acl public-read --region us-west-2 --create-bucket-configuration LocationConstraint=us-west-2

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

sudo mkdir bhavin_temp
cd bhavin_temp
sudo git clone https://github.com/bhavinpatel9498/TempRepo>/dev/null 2>&1

aws s3api wait bucket-exists --bucket bpatel68-data

echo "Bucket Created"

aws s3api put-object --acl public-read --bucket bpatel68-data --key s3image.jpg --body ./TempRepo/s3image.jpg >/dev/null 2>&1

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

echo "Object Created in bucket"

cd ..

sudo rm -rf bhavin_temp


echo "Instances are running. Waiting for System status ok and Instance status ok."


#Wait command to check if system status is ok

aws ec2 wait system-status-ok --instance-ids $InstanceIdList
echo "system status ok"

#Wait command to check if instance status is ok

aws ec2 wait instance-status-ok --instance-ids $InstanceIdList
echo "Instance status ok"


echo "Creating Load balancer now."

#Create load balancer

groupid=`aws ec2 describe-security-groups --group-names $3 --query "SecurityGroups[*].GroupId" --output text`

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi


#aws elb create-load-balancer --load-balancer-name $5 --listeners "Protocol=HTTP,LoadBalancerPort=80,InstanceProtocol=HTTP,InstancePort=80" --availability-zones us-west-2b --security-groups $groupid

loadBalUrl=`aws elb create-load-balancer --load-balancer-name $5 --listeners "Protocol=HTTP,LoadBalancerPort=80,InstanceProtocol=HTTP,InstancePort=80" --availability-zones us-west-2b --security-groups $groupid --query 'DNSName' --output text`

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

#Creating tags for load balancer

aws elb add-tags --load-balancer-name $5 --tags "Key=InstanceOwnerStudent,Value=A20410380"

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi


echo "Load balancer created. Registering instances now."

#aws elb configure-health-check --load-balancer-name $5 --health-check Target=TCP:80,Interval=30,UnhealthyThreshold=10,HealthyThreshold=10,Timeout=5

#Registering instances with load balancer

aws elb register-instances-with-load-balancer --load-balancer-name $5 --instances $InstanceIdList

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

echo "Instances registered with load balancer."


#Create stickiness policy


aws elb create-lb-cookie-stickiness-policy --load-balancer-name $5 --policy-name $5-cookie-policy --cookie-expiration-period 60

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

echo "stickiness policy created"


#Apply stickiness policy

aws elb set-load-balancer-policies-of-listener --load-balancer-name $5 --load-balancer-port 80 --policy-names $5-cookie-policy

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

echo "Stickiness policy applied to load balancer."


#Waiting for Success message from Load Balancer

echo "Waiting for instance to come online."

aws elb wait instance-in-service --load-balancer-name $5 --instances $InstanceIdList

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

echo "Load Balancer is Up now. Please use below URL."
echo $loadBalUrl

echo "End of Script"