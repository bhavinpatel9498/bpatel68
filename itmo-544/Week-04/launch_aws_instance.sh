## This file is created to automate AWS EC2 instance creation. 
## It accepts github username and password to access the private repo to deploy index.html
#!/bin/bash

echo "Please provide your github user name. Your details will not be saved:"
read -p gituserid

echo "Please provide your github password. Your details will not be saved:"
read -sp gitpassword

echo "values read success"

# sh .create-env.sh "$gituserid" "$gitpassword"

echo "completed"