#!/bin/bash

if [ -z $1 ]
then
	echo "Provide Load Balancer Name"
	exit 1
fi

#Getting Load balancer instances

InstanceIdList=`aws elb describe-load-balancers --load-balancer-name $1 --query 'LoadBalancerDescriptions[*].Instances' --output text`

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

echo "$InstanceIdList"



#Deregister Load Balancers instances

if [ ! -z "$InstanceIdList" ]
then
	echo "Deregister instances from load balancer"
	aws elb deregister-instances-from-load-balancer --load-balancer-name $1 --instances $InstanceIdList
	
	if [ "$?" -ne "0" ]
	then
		echo "End of Script"
		exit 1;
	fi
	
	echo "Instances deregistered"
	
fi

#Delete Load balancer

echo "Delete load balancer"
aws elb delete-load-balancer --load-balancer-name $1

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

echo "Load balancer deleted"


#Delete Instances now



if [ ! -z "$InstanceIdList" ]
then
	echo "Terminating all instance."
	aws ec2 terminate-instances --instance-ids $InstanceIdList
	
	if [ "$?" -ne "0" ]
	then
		echo "End of Script"
		exit 1;
	fi
	
	echo "All Instances Terminated"
fi

AllInstanceIdList=`aws ec2 describe-instances --filters '[{"Name": "instance-state-name","Values": ["pending", "running", "stopped", "stopping"] }]' --query 'Reservations[*].Instances[*].InstanceId' --output text`

if [ ! -z "$AllInstanceIdList" ]
then
	echo "Terminating other running instances"
	
	aws ec2 terminate-instances --instance-ids $AllInstanceIdList
	
	if [ "$?" -ne "0" ]
	then
		echo "End of Script"
		exit 1;
	fi	
	
	echo "All other Instances Terminated"

fi


echo "End of Destroy Script"



