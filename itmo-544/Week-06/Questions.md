## Chapter 04 - Application Architectures

# Solution Week-06 Review Questions

### 1. Describe the single-machine, three-tier, and four-tier web application architectures.

   **Single-Machine Architecture :** In this architecture a single machine serves as a web server. This single machine is self sufficient that it uses HTTP protocal, receives input requests, process them and send response back. Web server generates response content through static content source, dynamic content source or database. Usually considerable small applications and small scale websites which does not require heavy processing or does not observe huge load use this architecture. The major advantage of this architecture is that it does not involve huge cost to setup this system. This architecture has few major limitations such as non-availability of disaster recovery system for such architectures, cannot handle heavy computing requests or huge load and its not easily scalable to meet future demands.


   **Three-tier Architecture :** As the name suggests in this kind of architecture there are three layers. First lelayervel of load balancer, second layer of web server or group of web serves and third layer of data service layer or database layer. Load balancer will receive requests and then it pass on this requests to web server layer for processing of requests. The web server may or may not interact with the database layer depending upon the request and send responses back to load balancer and then to request originator from there. This type of architectures are usually scalable to meet future demands by adding multiple load balancers, adding more replicas of web servers. There are no as such limitations for this architecture but rather some concerns to keep in mind which may requure additional efforts and smart planning such as synchronization or data between replicas, handling and routing requests from load balancer and handle more simultaneous operations and concurrency management.


   **Four-tier Architectures :** There are four layers in this type of architecture. First layer is of load balancer, second layer is of group of web servers or front end web servers, third layer of one or more application servers and final forth layer of data base server. This requets will be received by load balancer and passed on to the next layer of web servers. They process HTML requests and then calls application servers API of business layer for processing of this requets. Business layer may or may not contact database. There few major benefits of using this architecture is that it is more secured than above architectures. It has potential benfits of expansion based on need. Better encryption and certificate management. Also last but not the least flexibility to design fast protocols for communication between systems than just using slow HTTP. There are no limitations of the system but rather such systems require high level of planning of organizing such architecture systems.

### 2. Describe how a single-machine web server, which uses a database to generate content, might evolve to a three-tier web server. How would this be done with minimal downtime?

   Single-machine web servers have webserver and database in same machine. This leaves a limitation of assured downtime if there is a need to evolve or migrate single-tier to three tier web architecture. In my opinion following steps should be followed if there is a need to migrate from single-tier to three-tier.

   1. Configure a load balancer and starts accepting requests on load balancer. Now with load balancer first requests will be received by load balancer and then it routes to single-tier web server. This should be done with almost negligible downtime. 
   2. In second step replicate the single-tier web server to a new web server for all static contents.
   3. Now design a database layer for three-tier and configure it.
   4. Once the web server and database layer is ready, bring down single tier application to avoid  data integrity issues. Please note if we can implement some complicated real time data synchronization techniques for data sync between single tier and three tier DB there is no need to have a downtime. But with single-tier it is almost impossible to achieve that.
   5. Now do the data synchronization activitiy between both databases.
   6. Once step five is completed then start routig requets to new web server instead of old server.

   As per my understanding this is how we migrate from single-tier to three-tier with optimal downtime.


### 3. Describe the common web service architectures, in order from smallest to largest.




### 4. Describe how different local load balancer types work and what their pros and cons are. You may choose to make a comparison chart.

    Following is the comparison chart for local load balancer types.

   Load Balancer Type | Usage | Pros | Cons |
   ------------------ | ----- | ---- | ---- |
   `DNS Round Robin`             | IP addresses of all replicas are mentioned in DNS against name of web server. Web browser will pick one of the web servers to try at random. This is how load is distributed | It is easy to implement and free. No hardware involved. | It is not very responsive. No control on requests received by servers. One server may be overloaded by huge number of requests. Client sends repeated requests to same server even if it is down resulting in web page appearing to be down. |
   `Layer 3 and 4 Load Balancer` | It receives TCP session and redirects to one of the replicas. It works on network and session layer. Load balancers track ip addresses of source and destination at layer three and tracks ports at layer four. So same client can be routed to same webserver for all TCP interactions. | They are fast and responsive. They are simple to implment. It automaticallys routes requests to new server in case of downtime. | If the IP address is altered by load balancer than servers assume it is coming from same host. Debugging and tracking is difficult and challenging in such situations. |
   `Layer 7 Load Balancer`       | It works similar to layer 3 and layer 4 load balancer but works at application level. They can analyze HTTP requets such as cookies, URL and headers etc. and decide where to route such requets. | They are better for serving priority customers by sending them to fast servers. Logging and monitoring is better. | This requires additional configuration and processing of cookies, URL or headers. | 

### 5. What is “shared state” and how is it maintained between replicas?



### 6. What are the services that a four-tier architecture provides in the first tier?



### 7. What does a reverse proxy do? When is it needed?



### 8. Suppose you wanted to build a simple image-sharing web site. How would you design it if the site was intended to serve people in one region of the world? How would you then expand it to work globally?



### 9. What is a message bus architecture and how might one be used?



### 10. What is an SOA?



### 11. Why are SOAs loosely coupled?



### 12. How would you design an email system as an SOA?



### 13. Who was Christopher Alexander and what was his contribution to architecture?

