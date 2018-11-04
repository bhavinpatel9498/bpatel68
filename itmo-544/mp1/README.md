# Steps to Run mp1

### 1. Copy create-mp1.sh, create-env-mp1.sh and destroy-mp1.sh to your vagrant box in same directory.
### 2. Run destroy scripts to make sure everything is clean. It will delete all existing ELB, EC2 Instances, EBS and S3 if there are any. You should expect o/p something like below screenshot if everything is clean. If there is something it would be removed and status of the operation will be displayed on console.

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp1/images/pic5.jpg" alt="" style="width: 400px;"/> |
|:--:| 
| *Sample o/p of initial destroy scripts* |

### 3. Run create-mp1.sh to create EC2 instances, ELB, EBS, and S3 bucket. Sample script with positional parameters provided below.

   *./create-mp1.sh ami-0554270b745fc5061 bhavin_itmo544_key itmo544-default-group-bhavin 3 bhavin-elb-itmo544 bpatel68-data*

   Note:
   * Always use my custom AMI image ami-0554270b745fc5061
   * Always pass S3 bucket name as bpatel68-data. It has been used in index.html file to load the image.
   * Replace your key and group name.
   * Necessary ports are open for your security group. Especially HTTP 80.

### 4. On successful execution, you should see an o/p like below screenshot on console.

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp1/images/pic1.jpg" alt="" style="width: 400px;"/> |
|:--:| 
| *Sample o/p of create scripts 1* |

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp1/images/pic2.jpg" alt="" style="width: 400px;"/> |
|:--:| 
| *Sample o/p of create scripts 2* |

### 5. Use the ELB url displayed on console to see the home page. Sample home page screen is shown below.

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp1/images/pic6.jpg" alt="" style="width: 400px;"/> |
|:--:|
| *Sample Home Page Screen* |

### 6. Run destroy scripts to remove all ELB, EC2, EBS and S3. You should see o/p similar to ones should in below screenshots.

*./destroy-mp1.sh*

| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp1/images/pic3.jpg" alt="" style="width: 400px;"/> |
|:--:|
| *Sample O/P of destroy script* |


| <img src="https://github.com/illinoistech-itm/bpatel68/blob/master/itmo-544/mp1/images/pic4.jpg" alt="" style="width: 400px;"/> |
|:--:| 
| *Sample O/P of destroy script* |


### Assumptions and Additional Notes

   * Execution is sequential for all scripts. If some command fails it will display error and terminate execution of script from that point without executing further commands.
   * Destroy script is assuming to delete everything leaving your AWS a clean slate. Only exception to this is EBS volumes where I am just removing volumes having tags with key "InstanceOwnerStudent" having value "A20410380".
   * There are wait commands in create and destroy scripts. If by any chance wait commands fails script execution will terminate with status code 255. You have to execute entire script again.
   * When formatting additional EBS in instance initialization script the time out is 10 minutes. So, if volume is not attached to the instance within 10 min. It will not be mounted.
   * Region is us-west-2 and availability zone is us-west-2b for everything.