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

InstanceIdList=`aws ec2 run-instances --image-id $1 --count $4 --instance-type t2.micro --key-name $2 --security-groups $3 --availability-zones us-west-2b --user-data "file://./create-env-init-mp1.sh" --query 'Instances[*].InstanceId' --output text` 

echo "Created Instances $InstanceIdList"

#Fetch Instance Ids in a variable if required

#aws ec2 describe-instances --filters '[{"Name": "image-id", "Values": ["'$1'"]},{"Name": "instance-state-name","Values": ["pending"] }]' --query 'Reservations[*].Instances[*].InstanceId' --output text

#Creating tags for created instances to identify later on

aws ec2 create-tags --resources $InstanceIdList --tags Key="InstanceOwnerStudent",Value="A20410380"

#Wait command to check if instances are running

aws ec2 wait instance-running --instance-ids $InstanceIdList
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

#aws elb create-load-balancer --load-balancer-name $5 --listeners "Protocol=HTTP,LoadBalancerPort=80,InstanceProtocol=HTTP,InstancePort=80" --availability-zones us-west-2b --security-groups $groupid

loadBalUrl=`aws elb create-load-balancer --load-balancer-name $5 --listeners "Protocol=HTTP,LoadBalancerPort=80,InstanceProtocol=HTTP,InstancePort=80" --availability-zones us-west-2b --security-groups $groupid --query 'DNSName' --output text`

#Creating tags for load balancer

aws elb add-tags --load-balancer-name $5 --tags "Key=InstanceOwnerStudent,Value=A20410380"

echo "Load balancer created. Registering instances now."

#aws elb configure-health-check --load-balancer-name $5 --health-check Target=TCP:80,Interval=30,UnhealthyThreshold=10,HealthyThreshold=10,Timeout=5

#Registering instances with load balancer

aws elb register-instances-with-load-balancer --load-balancer-name $5 --instances $InstanceIdList

echo "Instances registered with load balancer."


#Create stickiness policy


aws elb create-lb-cookie-stickiness-policy --load-balancer-name $5 --policy-name $5-cookie-policy --cookie-expiration-period 60


echo "stickiness policy created"


#Apply stickiness policy

aws elb set-load-balancer-policies-of-listener --load-balancer-name $5 --load-balancer-port 80 --policy-names $5-cookie-policy

echo "Stickiness policy applied load balancer."


#Waiting for Success message from Load Balancer

echo "Waiting for instance to come online."

aws elb wait instance-in-service --load-balancer-name $5 --instances $InstanceIdList

echo "Load Balancer is Up now. Please use below URL."
echo $loadBalUrl

echo "End of Script"