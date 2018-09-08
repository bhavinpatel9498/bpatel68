# Solution Week-02 Review Questions

### 1. What is distributed computing?

   Distributed computing is a concept in which single problem is distributed among group of computers or machines which are connected with each other via network (same or different geography). In other words it is a concept by which a task can be divided and distributed among computers to achieve scalability and redundancy.

### 2. Describe the three major composition patterns in distributed computing.

  * Load Balancer with Multiple Backend Replicas
   
       In this composition request will come to load balancer first. Load balancer then routes requets to one of the backend based on the type of routing configured like round robin, least loaded or slow start. Here all backends are clone of each other in terms of producing results.

  * Server with Multiple Backends
   
       This composition consists of one server with multiple backends. Here the request received by server will be divided into different tasks and each tasks is performed by different backends. Server will combine output of each backend to produce the final response for the request received.

  * Server Tree
   
       A server tree composition consists of root server, parent server and leaf servers in tree fashion with root on top. Root receives the request and forwards to parents and then parents forwards it to leafs. Parents and roots will process results and then send response back.

### 3. What are the three patterns discussed for storing state?

  * State kept in one location
  * State is sharded and replicated
  * State updates using cached data

### 4. Sometimes a master server does not reply with an answer but instead replies with where the answer can be found. What are the benefits of this method?
  
  * Files with huge size which cannot fit into one machine can be created and stored.
  * Master server does not become over loaded with receiveing and processing of requests.

### 5. Section 1.4 describes a distributed file system, including an example of how reading terabytes of data would work. How would writing terabytes of data work?

   

### 6. Explain the CAP Principle. (If you think the CAP Principle is awesome, read “The Part-Time Parliament” (Lamport & Marzullo 1998) and “Paxos Made Simple” (Lamport 2001).)

   CAP (Consistency Availability and Partition Tolerance) principle exaplains that it is not possible to design a distrubited system having all three consistency, availability and partition tolerance. Either of two can be achieved at a large scale in distributed systems but not all three in parallel. So system designer should be aware on what should be achieved and what can be compromised while designing a distributed system.

### 7. What does it mean when a system is loosely coupled? What is the advantage of these systems?

   When a system is loosely coupled its components are almost independent of each other and has very little dependency on or knowledge about other components. An ideal system design should consist of N loosely coupled components.

   Loosely coupled systems offer following advantages.   
  * System components can be easily upgraded and enhanced.
  * Downtime of one component does not impact other components.
  * If implmentation of one component changes then it does not impact other components.

### 8. Give examples of loosely and tightly coupled systems you have experience with. What makes them loosely or tightly coupled? (if you haven't worked on any use a system you have seen or used)

### 9. How do we estimate how fast a system will be able to process a request such as retrieving an email message?

### 10. In Section 1.7 three design ideas are presented for how to process email deletion requests. Estimate how long the request will take for deleting an email message for each of the three designs. First outline the steps each would take, then break each one into individual operations until estimates can be created.