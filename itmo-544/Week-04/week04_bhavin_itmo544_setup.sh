## This file is used to initialize launched AWS instance
#!/bin/bash
sudo apt-get update
sudo apt-get install git
sudo apt-get install apache2 -y
cd /var/www/html
sudo mv index.html index.html_bck_original
sudo git clone https://$1:$2@github.com/illinoistech-itm/bpatel68
sudo cp ./bpatel68/itmo-544/Week-04/index.html .
sudo rm -rf bpatel68