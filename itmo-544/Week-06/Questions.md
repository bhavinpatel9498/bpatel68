## Chapter 04 - Application Architectures

# Solution Week-06 Review Questions

### 1. Describe the single-machine, three-tier, and four-tier web application architectures.

   **Single-Machine Architecture :** In this architecture a single machine serves as a web server. This single machine is self sufficient that it uses HTTP protocal, receives input requests, process them and send response back. Web server generates response content through static content source, dynamic content source or database. Usually considerable small applications and small scale websites which does not require heavy processing or does not observe huge load use this architecture. The major advantage of this architecture is that it does not involve huge cost to setup this system. This architecture has few major limitations such as non-availability of disaster recovery system for such architectures, cannot handle heavy computing requests or huge load and its not easily scalable to meet future demands.


### 2. Describe how a single-machine web server, which uses a database to generate content, might evolve to a three-tier web server. How would this be done with minimal downtime?



### 3. Describe the common web service architectures, in order from smallest to largest.



### 4. Describe how different local load balancer types work and what their pros and cons are. You may choose to make a comparison chart.



### 5. What is “shared state” and how is it maintained between replicas?



### 6. What are the services that a four-tier architecture provides in the first tier?



### 7. What does a reverse proxy do? When is it needed?



### 8. Suppose you wanted to build a simple image-sharing web site. How would you design it if the site was intended to serve people in one region of the world? How would you then expand it to work globally?



### 9. What is a message bus architecture and how might one be used?



### 10. What is an SOA?



### 11. Why are SOAs loosely coupled?



### 12. How would you design an email system as an SOA?



### 13. Who was Christopher Alexander and what was his contribution to architecture?

