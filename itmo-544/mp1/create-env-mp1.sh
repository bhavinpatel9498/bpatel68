#!/bin/bash
## This file is used to initialize launched AWS instance
echo "========== Installing Updates ==========="
sudo apt-get update

echo "========== Installing GIT ==========="
sudo apt-get install git -y

echo "=========== Installing Apache ==========="
sudo apt-get install apache2 -y

#Deploy file from github
cd /var/www/html

sudo mv index.html index.html_bck_original

sudo git clone git@github.com:illinoistech-itm/bpatel68.git

sudo cp ./bpatel68/itmo-544/mp1/index.html .

sudo rm -rf bpatel68

#Wait up to 10 mins to format and mount additional EBS volume. Retry to mount every 15 sec.

x=0

while [ $x -lt 40 ]
do	
	sudo mkfs -t ext4 /dev/xvdh
  
	if [ "$?" -ne "0" ]
	then
		x=$(( $x + 1 ))
		sleep 15
	else
		x=$(( $x + 100 ))	
		
		sudo mkdir -p /mnt/datadisk
		sudo mount -t ext4 /dev/xvdh /mnt/datadisk
		sudo chown -R ubuntu:ubuntu /mnt/datadisk		
	fi      
done

############

