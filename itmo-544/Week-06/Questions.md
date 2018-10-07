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

   When an HTTP request is routed to web servers it may generate some content e.g. login authorization cookies on that particular server. Now when there is another request there is a possibility that load balancer may route this to another server and that content is not available. "Shared state" is a strategy by which we can over come above situation. The conent will be generated at a place which is accesible by all web servers. That means no matter where the request was routed the generated information is still available and accesible to all servers.

   Following are few ways you can implement shared state.

   * Make use of database table on database server where every replica has access. This is the easiest approach.
   * Design the system to hold the data in RAM e.g. Memcached and Redis.

### 6. What are the services that a four-tier architecture provides in the first tier?

   A four-tier architecture has load balancer in its first tier. It provides following services.

   * Load balancer can handle act as a gateway to receive all requests and route them based on the load balancer configuration to handle requests.
   * Load balancers provide a flexibility to scale the system as per needed. E.g. if there is a need to have more webserves then they can be easily added and removed.
   * Load balancers restricts outside systems to access internal systems directly and implement a security.
   * Load balancers ensure that each request will have a response no matter what. If one web server is down it will route all requests to new server.
   * Load balancer makes downtime practically nil.
   * Load balancers can handle better redundancy and system failures. 

### 7. What does a reverse proxy do? When is it needed?

   Reverse proxy is a type of proxy server which received website requests from client browsers and retrives resources from actual one or more servers combine it and send it back to the browser. The browser feels as if the request was received from a single server but in actual it was sent by reverse proxy server. Indirectly different webservices are clubbed and displayed on a single page as one webservice.

   In following scenarions we may need reverse proxy.

   * When we want to isolate original server and its idendity from outside network.
   * If there is a need to reduce load on server by caching pages.
   * Multiple servers can be accessed by single ip address. E.g. more than one server can be access with just one reverse proxy ip.
   


### 8. Suppose you wanted to build a simple image-sharing web site. How would you design it if the site was intended to serve people in one region of the world? How would you then expand it to work globally?

   I would design it to work it locally in a data center in the region where I intend to server people. By deploying the system in their data center ensures that users find the image sharing web site fast and responsive. Now if I wish to expand it to work is globally the first thing I should do is introduce a global load balancer (GLB). After the GLB I should have data centers in different part of the world. You can either use WAN or Point of presence (PoP) to connect your data centers. A GLB is on top receiving all requests and it routes requets to different data centers based on config like sending the request to nearest data center, nearest available data center or most suitable data center based on matrics. Bringing in a GLB and having multiple data centers in different regions makes a website to work globally.


### 9. What is a message bus architecture and how might one be used?

   Message bus architecture is a many-to-many communication mechanism between servers. It is something like a channel in which one server passes message and all intended servers receives the message. This is better than quering database to get some information which is frequenyly changing. All mordern enterprise applications or web applications use this to interact between servers. It is something like a message distribution system or mechanism.

   Usage: There is a publisher who sends a message to the bus and there is a subscriber or group of subscribers who receives the request. A server can be a publisher or a subscriber depending upon channel it is connected to. There can be many to one, one to many and many to many communication between channels. A server will send real time updates to this channel and all subscribers will receive the same message. E.g. if there is some change in config server, it will push this to channels so that all intended server will receive a notification that there is a change in the config server.

### 10. What is an SOA?

   SOA stands for service oriented architectures. In general terms SOA is dividing a huge system into small systems where each small system provides a feature or service. In SOA verious services communicate with each other via API calls. The benfit of SOA is that large services can be managed more easily.

### 11. Why are SOAs loosely coupled?

   In SOA all services publish themselves as high level of abstraction. That means one service does not know any internals or implementations about another service. It just know the way to make an API call to that service, sending a request and, expected response from that service. So, in SOA if one service is down it does not impact other services or API calls. Also since internals of services are unknown to each other changing internals or enhancing the service does not impact API calls at all till the time the way service is called remains the same.


### 12. How would you design an email system as an SOA?

   I would design email system as following SOA serices.

   * Send Email Service: Client browser or application can call this service to send an email.
   * Delete Email Service: If there is a need to delete an email this service will be called.
   * Retrieve Emails Service: Client application will call this service and receive all latest emails using this service.
   * Purge Email Service: Old emails will be purged after this service call.

   This is how most email systeme can be designed as a service using SOA.


### 13. Who was Christopher Alexander and what was his contribution to architecture?

   He is a widely influential architect and design theorist, and currently  professor at the UCB. He is considered as father of pattern language movement. Cloud system complexity can be reduced by inspiration from pattern theory. Cloud system design and development was easy with pattern language. In simple terms pattern is something like a common design which everyone follows makes it easy to implement and understand. 

   Sources:

   https://en.wikipedia.org/wiki/Christopher_Alexander

   https://hillside.net/plop/2011/papers/A-20-Fehling.pdf

