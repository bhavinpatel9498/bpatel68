#!/bin/bash
## This file is used to initialize launched AWS instance
echo "========== Installing Updates ===========" >>bhavin_initilization_log.txt
sudo apt-get update >>bhavin_initilization_log.txt

echo "========== Installing GIT ===========" >>bhavin_initilization_log.txt
sudo apt-get install git -y >>bhavin_initilization_log.txt

echo "========== Installing python pip ===========" >>bhavin_initilization_log.txt
sudo apt-get install python-pip -y >>bhavin_initilization_log.txt

echo "========== Installing ruby ===========" >>bhavin_initilization_log.txt
sudo apt-get install ruby gem ruby-dev -y >>bhavin_initilization_log.txt

echo "========== Installing jekyll ===========" >>bhavin_initilization_log.txt
sudo gem install bundler jekyll >>bhavin_initilization_log.txt

echo "========== Creating a new site ===========" >>bhavin_initilization_log.txt
sudo jekyll new bhavin-awesome-site >>bhavin_initilization_log.txt

cd bhavin-awesome-site

echo "========== Running Jekyll Server ==========="
sudo bundle exec jekyll serve --host 0.0.0.0
