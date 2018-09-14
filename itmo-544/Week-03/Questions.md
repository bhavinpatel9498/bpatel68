## Chapter 02 - Designing for Operations

# Solution Week-02 Review Questions

### 1. Why is design for operations so important?

   Design for operations is crucial because of following reasons.

   * BAU activities like support, maintenance and upgrades will be smooth.
   * In full life cycle of any software or system operations is the biggest cycle. Hence optimal operations design is important.
   * A good design for operations is cost effective and increases productivity of any organization or team.
   * System will be more reliable, stable and consistent if designed considering operations features in mind.
   * Effective operations reflects customer satisfaction or results in pleasure experience for end users.    
    

### 2. How is automated configuration typically supported?

   Automated configuration can be supported via following options.

   * Using Text files
   * Binary blob files
   * Using API
   * From source code repository

   Use of text files to automate configuration is the most common and preferred mode. Text files are easy to generate and machines can easily process text files. If there is a need of manual review of configuration or need of any change users or humans can do it easily. Text files can be easily audited and it does not require any special skills to understand it's contents. Due to such potential benefits, automated configuration is typically supported using text files.

### 3. List the important factors for redundancy through replication.

   Redundancy   : Duplication of nodes to handle failover situations.

   Replication  : Synchronization of data between nodes.

### 4. Give an example of a partially implemented process in your current environment. What would you do to fully implement it?

   My current vagrant box needs to be started manually after I start my windows and stopped manually before shut down. As an ideal process vagrant box should be automated to start as soon as windows starts and stops perfectly before shutdown. It can be configured as a startup service which can start automatically once windows starts. Delay start can be implemented to avoid high load on RAM when the windows starts. One more such example is about checking update packages manually everytime the box is up. We have to ssh to ubuntu system and check for updates. Even this can be automated to check and install all updates everytime system starts.

### 5. Why might you not want to solve an issue by coding the solution yourself?

   Becuase of following reasons you should not solve an issue by coding yourself.

   * Lack of adequete coding knowledge, coding practices and other development process.
   * It sends a wrong message to developers and they don't focus on handling operation requirements.
   * It may impact other deliverables from developer causing more bugs than fixed issues.
   * Bugs in your code may result in developers not taking any responsibility for even their piece of code.
   * It disturbs the overall development and review process.

### 6. Which type of problems should appear first on your priority list?

   Probles with high impact should on top most priority for any operations. Problems which results in customer impact, financial loss or resource wastages should be treated with high priority. Problems follow 80-20 rule. That means 20% of the problems create 80% of the impact on the system. These 20% issues should be resolved on priority which may introduce further bugs and system may become unstable or unresponsive. As a measure high impact and low complexity should be treated immediately. Once these issues are sorted focus should be shifted to moderate to high complexity based on the time and resource availability. Cosmetic issues can be taken up later on based on the bandwidth of the developer. This is how issues should be treated.

### 7. Which factors can you bring to an outside vendor to get the vendor to take your issue seriously?

   * Report issues and have regular meetings with vendors to discuss about issues.
   * Use constructive criticism instead of blaming vendors for issues.
   * Work as a team and provide necessary support and infrastructe to vendors for work.
   * Remove any dependency by exposing the some framework which can ease their job.
   * Publish status reports and make them aware about the impact rather than just asking them to fix issues.
   * If vendor is unresponsive involve management support to resolve conflicts.