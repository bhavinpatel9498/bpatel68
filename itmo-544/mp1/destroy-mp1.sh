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
	
	echo "Waiting for Instances to terminate"
	
	aws ec2 wait instance-terminated --instance-ids $InstanceIdList
	
	echo "All Instances Terminated"
	
fi

AllInstanceIdList=`aws ec2 describe-instances --filters '[{"Name": "instance-state-name","Values": ["pending", "running", "stopped"] }]' --query 'Reservations[*].Instances[*].InstanceId' --output text`

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi


if [ ! -z "$AllInstanceIdList" ]
then
	echo "Terminating other running instances"
	
	aws ec2 terminate-instances --instance-ids $AllInstanceIdList
	
	if [ "$?" -ne "0" ]
	then
		echo "End of Script"
		exit 1;
	fi	
	
	echo "Waiting for Instances to terminate"
	
	aws ec2 wait instance-terminated --instance-ids $AllInstanceIdList
	
	echo "All other Instances Terminated"

fi

#Deleting EBS Volumes

volumesList=`aws ec2 describe-volumes --filters '[{"Name":"tag:InstanceOwnerStudent","Values":["A20410380"]}, {"Name":"status", "Values":["available", "error", "creating"]}]' --query "Volumes[*].VolumeId" --output text`

if [ "$?" -ne "0" ]
then
	echo "End of Script"
	exit 1;
fi

echo "Deleting Volumes"

if [ ! -z "$volumesList" ]
then

	declare -a arrVolumesList=(${volumesList})
	# get length of an arrVolumesList
	arrVolumesListLength=${#arrVolumesList[@]}

	
	for (( i=1; i<${arrVolumesListLength}+1; i++ ));
	do		
		aws ec2 delete-volume --volume-id ${arrVolumesList[$i-1]}
		
		if [ "$?" -ne "0" ]
		then
			echo "End of Script"
			exit 1;
		fi	
	done
	
	#Wait while all volumes are deleted
	
	aws ec2 wait volume-deleted --volume-ids $volumesList
	
	if [ "$?" -ne "0" ]
	then
		echo "End of Script"
		exit 1;
	fi	
	
fi

echo "Volumes Deleted"

echo "End of Destroy Script"



