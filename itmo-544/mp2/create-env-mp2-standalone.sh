#!/bin/bash

cd /home/ubuntu

sudo git clone git@github.com:illinoistech-itm/bpatel68.git

cd ./bpatel68/itmo-544/mp2/node-proj-translator-job

npm install

#sudo chown -R ubuntu:ubuntu /home/ubuntu

pm2 start server.js --name "translator-job"