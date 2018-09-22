## This file contains all AWS CLI commands used to create and launch the instance
#!/bin/bash

aws ec2 create-key-pair --key-name bhavin_itmo544_key>bhavin_itmo544_key.key

aws ec2 create-security-group --description "This is a default group for ITMO544 by bhavin" --group-name "itmo544-default-group-bhavin"

aws ec2 authorize-security-group-ingress --group-name itmo544-default-group-bhavin --protocol tcp --port 22 --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress --group-name itmo544-default-group-bhavin --protocol tcp --port 80 --cidr 0.0.0.0/0

echo "groups created"
echo "User Name: $1"
echo "password : $2"


aws ec2 run-instances --image-id ami-0bbe6b35405ecebdb --count 1 --instance-type t2.micro --key-name bhavin_itmo544_key --security-groups itmo544-default-group-bhavin --user-data "file:///vagrant/week04_bhavin_itmo544_setup.sh $1 $2" 