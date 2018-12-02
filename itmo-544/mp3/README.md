# Steps to Run mp3

### 1. Copy create-mp3.sh, create-env-mp3.sh, destroy-mp3.sh and create-env-mp3-standalone.sh to your vagrant box in same directory.
### 2. Run destroy scripts to make sure everything is clean. You should expect o/p something like below screenshot if everything is clean. If there is something it would be removed and status of the operation will be displayed on console.

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp3/images/pic1.jpg" alt="" style="width: 400px;"/> |
|:--:| 
| *Sample o/p of initial destroy scripts* |

### 3. Run create-mp3.sh to create EC2 instances, ELB, EBS, and S3 bucket. Sample script with positional parameters provided below. All other parameters are same as mp1 except the last one where you have to give IAM role name.

   *./create-mp3.sh ami-0f3871024fa157995 bhavin_itmo544_key itmo544-default-group-bhavin 1 bhavin-elb-itmo544 bpatel68-data-mp2 admin-role*

   Note:
   * Always use my custom AMI image ami-0f3871024fa157995
   * Always pass S3 bucket name as bpatel68-data-mp2.
   * SQS Name is always used as bpatel68-sqs-mp2-msg.
   * ElastiCache is used as bpatel68-mp3-cache
   * Replace your key and group name.
   * Necessary ports are open for your security group. I am opening ports 3000, 6379 and 3306 via commands but this is just to make sure they are open.
   * Make sure your AWS CLI user has AdministratorAccess policy attached. Sample policy below.

   {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}

   * Make sure your IAM role has following policies attached. AmazonRDSFullAccess, AmazonSQSFullAccess, AmazonElastiCacheFullAccess, AmazonS3FullAccess and AmazonSNSFullAccess.


### 4. Use the ELB url displayed on console to see the home page.


### 5. Click on Add Message button which will take you to following page. All details are mandatory. For ease I am defaulting my email id and phone number. You can replace your email id and phone number here. You will get a notification on mentioned details for your message completion. Once you provide your email id make sure you visit your mailbox and confirm the subscription. It may happen that confirm subscription takes time and the translation has been completed so you will receive only SMS and not an email.

### 6. You can go to admin home page and enable disable add message button.

### 7. Run destroy scripts to remove everything.

*./destroy-mp3.sh*


### Assumptions and Additional Notes

   * Execution is sequential for all scripts. If some command fails it will display error and terminate execution of script from that point without executing further commands.
   * Destroy script is assuming to delete everything leaving your AWS a clean slate. Only exception to this is EBS volumes where I am just removing volumes having tags with key "InstanceOwnerStudent" having value "A20410380".
   * There are wait commands in create and destroy scripts. If by any chance wait commands fails script execution will terminate with status code 255. You have to execute entire script again.
   * When formatting additional EBS in instance initialization script the time out is 10 minutes. So, if volume is not attached to the instance within 10 min. It will not be mounted.
   * Region is us-west-2 and availability zone is us-west-2b for everything.
   * DB name has been used as bhavin-mp2-db and bhavin-mp2-db-read in the application.
   * Everytime you create a new message there will be new subscription created based on the username provided.
   * Text translation job is not using read replica changes.
   * Additional table created named config which will save parameter to enable/disable add message button.
   * ElastiCache is used for caching enable/disable parameter. If it is available in cache it will be used from cache. If it is not available in cache then it will be fetched from DB and placed in cache for future.
   * Your very first request may take some additional time considering table creation taking place DB.
   * Session management is done for Admin Home page. User cannot go to Admin Home Page without login. Credentials are hardcoded as admin/admin. Also, the session will be active for 10 seconds.
   * There is an export button on Admin home page which will download a txt file with all DB records having comma separated value.
   * Necessary code is commented in application to identify read replica changes.
   * Enable/disable button is on admin home page.
   * Admin home page is displaying gallery of messages in list.
   * Creating everything may take approx 15-18 minutes considering wait commands in place.