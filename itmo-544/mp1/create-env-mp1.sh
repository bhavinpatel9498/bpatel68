#!/bin/bash
## This file is used to initialize launched AWS instance
echo "========== Installing Updates ==========="
sudo apt-get update

echo "========== Installing GIT ==========="
sudo apt-get install git -y

echo "=========== Installing Apache ==========="
sudo apt-get install apache2 -y

cd /var/www/html

sudo mv index.html index.html_bck_original

sudo git clone git@github.com:illinoistech-itm/bpatel68.git

sudo cp ./bpatel68/itmo-544/mp1/index.html .

sudo rm -rf bpatel68



