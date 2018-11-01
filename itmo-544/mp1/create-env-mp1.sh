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



echo "End of Script"