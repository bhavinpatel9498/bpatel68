# Steps to Run mp1

### 1. Copy create-mp1.sh, create-env-mp1.sh and destroy-mp1.sh to your vagrant box.
### 2. Run destroy scripts to make sure everything is clean. It will delete all existing ELB, EC2 Instances, EBS and S3 if there are any. You should expect o/p something like below screenshot if everything is clean. If there is something it would be removed and 

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


### Assumptions
