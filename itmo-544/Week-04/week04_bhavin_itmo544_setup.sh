#!/bin/bash
## This file is used to initialize launched AWS instance
sudo apt-get update
sudo apt-get install git
sudo apt-get install apache2 -y
cd /var/www/html
sudo mv index.html index.html_bck_original
sudo git clone https://github.com/bhavinpatel9498/TempRepo
sudo cp ./TempRepo/index.html .
sudo rm -rf TempRepo