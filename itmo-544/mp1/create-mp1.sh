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

#aws ec2 run-instances --image-id $1 --count $4 --instance-type t2.micro --key-name $2 --security-groups $3 --user-data "file:///vagrant/week04_bhavin_itmo544_setup.sh"

InstanceIdList=`aws ec2 run-instances --image-id $1 --count $4 --instance-type t2.micro --key-name $2 --security-groups $3 --query 'Instances[*].InstanceId' --output text`

echo "Created Instances $InstanceIdList"

#Fetch Instance Ids in a variable if required

#aws ec2 describe-instances --filters '[{"Name": "image-id", "Values": ["'$1'"]},{"Name": "instance-state-name","Values": ["pending"] }]' --query 'Reservations[*].Instances[*].InstanceId' --output text

#Creating tags for created instances to identify later on

aws ec2 create-tags --resources $InstanceIdList --tags Key="InstanceOwnerStudent",Value="A20410380"

#Wait command to check if instances are running

aws ec2 wait instance-running --instance-ids $InstanceIdList

echo "Instances are running. Creating Load balancer now."

#Create load balancer

aws elb create-load-balancer --load-balancer-name $5 --listeners "Protocol=HTTP,LoadBalancerPort=80,InstanceProtocol=HTTP,InstancePort=80" --availability-zones us-west-2a us-west-2b us-west-2c

#Creating tags for load balancer

aws elb add-tags --load-balancer-name $5 --tags "Key=InstanceOwnerStudent,Value=A20410380"

echo "Load balancer created. Registering instances now."


#Registering instances with load balancer

aws elb register-instances-with-load-balancer --load-balancer-name $5 --instances $InstanceIdList

echo "Instances registered with load balancer."


#Configure load balancer security groups

aws elb apply-security-groups-to-load-balancer --load-balancer-name $5 --security-groups $3

echo "Security groups attached with load balancer"


#Apply stickiness policy


aws elb create-lb-cookie-stickiness-policy --load-balancer-name $5 --policy-name $5-cookie-policy --cookie-expiration-period 60


echo "stickiness policy created"


#Load balancer on HTTP

aws elb create-load-balancer-listeners --load-balancer-name $5 --listeners "Protocol=HTTP,LoadBalancerPort=80,InstanceProtocol=HTTP,InstancePort=80"


aws elb set-load-balancer-policies-of-listener --load-balancer-name $5 --load-balancer-port 80 --policy-names $5-cookie-policy

echo "Listener configured and stickiness policy applied"


echo "End of Script"
