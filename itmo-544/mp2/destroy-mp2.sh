#!/bin/bash

loadBalancerList=`aws elb describe-load-balancers --query 'LoadBalancerDescriptions[*].LoadBalancerName' --output text`

if [ "$?" -ne "0" ]
then
	echo "Terminate Script"
	exit 1;
fi

if [ ! -z "$loadBalancerList" ]
then

	declare -a arrLoadBalancerList=(${loadBalancerList})
	# get length of an arrLoadBalancerList
	arrLoadBalancerListLength=${#arrLoadBalancerList[@]}
	
	for (( i=1; i<${arrLoadBalancerListLength}+1; i++ ));
	do	

		#Getting Load balancer instances

		InstanceIdList=`aws elb describe-load-balancers --load-balancer-name ${arrLoadBalancerList[$i-1]} --query 'LoadBalancerDescriptions[*].Instances' --output text`

		if [ "$?" -ne "0" ]
		then
			echo "Terminate Script"
			exit 1;
		fi

		echo "$InstanceIdList"

		############

		#Deregister Load Balancers instances

		if [ ! -z "$InstanceIdList" ]
		then
			echo "Deregister instances from load balancer"
			aws elb deregister-instances-from-load-balancer --load-balancer-name ${arrLoadBalancerList[$i-1]} --instances $InstanceIdList
			
			if [ "$?" -ne "0" ]
			then
				echo "Terminate Script"
				exit 1;
			fi
			
			echo "Instances deregistered"
			
		fi

		############

		#Delete Load balancer

		echo "Delete load balancer"
		aws elb delete-load-balancer --load-balancer-name ${arrLoadBalancerList[$i-1]}

		if [ "$?" -ne "0" ]
		then
			echo "Terminate Script"
			exit 1;
		fi

		echo "Load balancer deleted"


		############

		#Delete Instances now


		if [ ! -z "$InstanceIdList" ]
		then
			echo "Terminating all instance."
			aws ec2 terminate-instances --instance-ids $InstanceIdList
			
			if [ "$?" -ne "0" ]
			then
				echo "Terminate Script"
				exit 1;
			fi
			
			echo "Waiting for Instances to terminate"
			
			aws ec2 wait instance-terminated --instance-ids $InstanceIdList
			
			echo "All Instances Terminated"
		
		else
			
			echo "No instances to delete for Load balancer ${arrLoadBalancerList[$i-1]}"
			
		fi
	
	done

else
	
	echo "No Load Balancer to Delete"

fi
############

AllInstanceIdList=`aws ec2 describe-instances --filters '[{"Name": "instance-state-name","Values": ["pending", "running", "stopped"] }]' --query 'Reservations[*].Instances[*].InstanceId' --output text`

if [ "$?" -ne "0" ]
then
	echo "Terminate Script"
	exit 1;
fi


if [ ! -z "$AllInstanceIdList" ]
then
	echo "Terminating other running instances"
	
	aws ec2 terminate-instances --instance-ids $AllInstanceIdList
	
	if [ "$?" -ne "0" ]
	then
		echo "Terminate Script"
		exit 1;
	fi	
	
	echo "Waiting for Instances to terminate"
	
	aws ec2 wait instance-terminated --instance-ids $AllInstanceIdList
	
	echo "All other Instances Terminated"
	
else

	echo "No Extra Instances running"

fi

############

#Deleting EBS Volumes

volumesList=`aws ec2 describe-volumes --filters '[{"Name":"tag:InstanceOwnerStudent","Values":["A20410380"]}, {"Name":"status", "Values":["available", "error", "creating"]}]' --query "Volumes[*].VolumeId" --output text`

if [ "$?" -ne "0" ]
then
	echo "Terminate Script"
	exit 1;
fi


if [ ! -z "$volumesList" ]
then

	echo "Deleting Volumes"

	declare -a arrVolumesList=(${volumesList})
	# get length of an arrVolumesList
	arrVolumesListLength=${#arrVolumesList[@]}

	
	for (( i=1; i<${arrVolumesListLength}+1; i++ ));
	do		
		aws ec2 delete-volume --volume-id ${arrVolumesList[$i-1]}
		
		if [ "$?" -ne "0" ]
		then
			echo "Terminate Script"
			exit 1;
		fi	
	done
	
	#Wait while all volumes are deleted
	
	aws ec2 wait volume-deleted --volume-ids $volumesList
	
	if [ "$?" -ne "0" ]
	then
		echo "Terminate Script"
		exit 1;
	fi	
	
	echo "Volumes Deleted"
	
else

	echo "No volumes to delete"
	
fi



############

#Delete S3 Bucket


bucketList=`aws s3api list-buckets --query "Buckets[].Name" --output text`

if [ "$?" -ne "0" ]
then
	echo "Terminate Script"
	exit 1;
fi

if [ ! -z "$bucketList" ]
then

	echo "Delete S3 Buckets"

	declare -a arrBucketList=(${bucketList})
	# get length of an arrVolumesList
	arrBucketListLength=${#arrBucketList[@]}

	#Getting Buckets
	for (( i=1; i<${arrBucketListLength}+1; i++ ));
	do		
		
		echo "Deleting objects for bucket ${arrBucketList[$i-1]}"
		
		objectList=`aws s3api list-objects-v2 --bucket ${arrBucketList[$i-1]} --query 'Contents[].Key' --output text`
		
		if [ "$?" -ne "0" ]
		then
			echo "Terminate Script"
			exit 1;
		fi	
		
		if [ ! -z "$objectList" ]
		then
			declare -a arrObjectList=(${objectList})
			# get length of an arrVolumesList
			arrObjectListLength=${#arrObjectList[@]}
			
			for (( j=1; j<${arrObjectListLength}+1; j++ ));
			do	
				#aws s3api delete-objects --bucket ${arrBucketList[$i-1]} --delete '{"Objects":[{"Key":"${arrObjectList[$j-1]}"}]}'>/dev/null 2>&1
				
				aws s3api delete-object --bucket ${arrBucketList[$i-1]} --key ${arrObjectList[$j-1]}>/dev/null 2>&1
				
				aws s3api wait object-not-exists --bucket ${arrBucketList[$i-1]} --key ${arrObjectList[$j-1]}
			
			done		
		fi
		
		echo "Objects Deleted"
		
		echo "Delete Bucket ${arrBucketList[$i-1]}"		
		
		aws s3api delete-bucket --bucket ${arrBucketList[$i-1]}

		if [ "$?" -ne "0" ]
		then
			echo "Terminate Script"
			exit 1;
		fi

		aws s3api wait bucket-not-exists --bucket ${arrBucketList[$i-1]}

		echo "Bucket Deleted"	
		
	done

else

	echo "No buckets to delete"
	
fi

############


echo "End of Destroy Script"



