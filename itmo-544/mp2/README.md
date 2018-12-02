# Steps to Run mp2

### 1. Copy create-mp2.sh, create-env-mp2.sh, destroy-mp2.sh and create-env-mp2-standalone.sh to your vagrant box in same directory.
### 2. Run destroy scripts to make sure everything is clean. You should expect o/p something like below screenshot if everything is clean. If there is something it would be removed and status of the operation will be displayed on console.

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp2/images/pic7.jpg" alt="" style="width: 400px;"/> |
|:--:| 
| *Sample o/p of initial destroy scripts* |

### 3. Run create-mp2.sh to create EC2 instances, ELB, EBS, and S3 bucket. Sample script with positional parameters provided below. All other parameters are same as mp1 except the last one where you have to give IAM role name.

   *./create-mp2.sh ami-0f3871024fa157995 bhavin_itmo544_key itmo544-default-group-bhavin 1 bhavin-elb-itmo544 bpatel68-data-mp2 admin-role*

   Note:
   * Always use my custom AMI image ami-0f3871024fa157995
   * Always pass S3 bucket name as bpatel68-data-mp2.
   * SQS Name is always used as bpatel68-sqs-mp2-msg.
   * Replace your key and group name.
   * Necessary ports are open for your security group. I am opening ports 3000 and 3306 via commands but this is just to make sure they are open.
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


### 4. On successful execution, you should see an o/p like below screenshot on console.

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp2/images/pic5.jpg" alt="" style="width: 400px;"/> |
|:--:| 
| *Sample o/p of create scripts 1* |

### 5. Use the ELB url displayed on console to see the home page. Sample home page screen is shown below.

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp2/images/pic1.jpg" alt="" style="width: 400px;"/> |
|:--:|
| *Sample Home Page Screen* |

### 6. Click on Add Message button which will take you to following page. All details are mandatory. For ease I am defaulting my email id and phone number. You can replace your email id and phone number here. You will get a notification on mentioned details for your message completion. Once you provide your email id make sure you visit your mailbox and confirm the subscription. It may happen that confirm subscription takes time and the translation has been completed so you will receive only SMS and not an email.

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp2/images/pic2.jpg" alt="" style="width: 400px;"/> |
|:--:|
| *Create Message Page* |

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp2/images/pic4.jpg" alt="" style="width: 400px;"/> |
|:--:|
| *Created Message with Status as Complete* |

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp2/images/pic3.jpg" alt="" style="width: 400px;"/> |
|:--:|
| *SMS Snapshot* |

### 6. Run destroy scripts to remove everything. You should see o/p similar to ones should in below screenshots.

*./destroy-mp2.sh*

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp2/images/pic6.jpg" alt="" style="width: 400px;"/> |
|:--:|
| *Sample O/P of destroy script* |

### Assumptions and Additional Notes

   * Execution is sequential for all scripts. If some command fails it will display error and terminate execution of script from that point without executing further commands.
   * Destroy script is assuming to delete everything leaving your AWS a clean slate. Only exception to this is EBS volumes where I am just removing volumes having tags with key "InstanceOwnerStudent" having value "A20410380".
   * There are wait commands in create and destroy scripts. If by any chance wait commands fails script execution will terminate with status code 255. You have to execute entire script again.
   * When formatting additional EBS in instance initialization script the time out is 10 minutes. So, if volume is not attached to the instance within 10 min. It will not be mounted.
   * Region is us-west-2 and availability zone is us-west-2b for everything.
   * DB name has been used as bhavin-mp2-db in the application.
   * Everytime you create a new message there will be new subscription created based on the username provided.