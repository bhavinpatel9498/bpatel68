#!/bin/bash
## This file is used to initialize launched AWS instance
sudo apt-get update
sudo apt-get install git -y
sudo apt-get install python-pip -y
sudo apt-get install ruby gem ruby-dev -y
sudo gem install bundler jekyll
sudo jekyll new bhavin-awesome-site
cd bhavin-awesome-site
sudo bundle exec jekyll serve
sudo apt-get install links