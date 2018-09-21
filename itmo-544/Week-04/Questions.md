## Chapter 03 - Selecting a Service Platform

# Solution Week-04 Review Questions

### 1. Compare IaaS, PaaS, and SaaS on the basis of cost, configurability, and control.

   Following table explains the comparison of IaaS, PaaS and SaaS on the basis of cost, configurability and control.

   Cloud Type | Cost | Configurability | Control |
   ---------- | ---- | --------------- | ------- |
   `IaaS`     |      |                 |         |
   `PaaS`     |      |                 |         |
   `SaaS`     |      |                 |         |

### 2. What are the caveats to consider in adopting Software as a Service?

   Following caveats should be considered while adopting SaaS.

   * The full control of the software lies with the provider. That means you have no flexibility to use the software the way you want rather use what is being offered. For example, if you are comfortable with lower version of the software but SaaS provider has upgraded the version then you must use the latest version. There is no going back to older version.
   
   * There is a security and data breach concern while using SaaS.
   
   * SaaS demands necessary infrastructure in terms of machine or network to work. If you do not satisfy the pre-requisite for SaaS then you cannot use it. E.g. if a SaaS requires 1GB internet service then you must get it or move to other SaaS provider. There is no negoation on the specification.
   
   * SaaS perform somewhat slower than local hosted applications or in house application. Hence keeping performance concerns in mind if a SaaS is heavy better to have it locally than using it from third party provider.
   
   * Although SaaS providers keep their software up to date or try to keep bugs free as much as possible, But if you face any issues then resolution may take more than expected (mostly within SLA) as the bug may be critical for your but not for other customers of the SaaS provider. Hence you may not get a special treatment by fixing it sooner or not fixing it at all.

### 3. List the key advantages of virtual machines.

   Following are the few considerable advantages of virtual machines.

   * Virtual machines can achieve effective compute with smart resource utilization.
   * They can be easily created and destroyed and they can be easily made available for use within notime.
   * Virtual machines can be controlled through software API while physical machine needs to assembled.
   * Virtual machines are fully programmable and configuration can be changed easily.
   * Virtual system can be easily moved between physical systems or migrated to another system as and when required. There is practically no downtime for virtual machines.

### 4. Why might you choose physical over virtual machines?

   Because of following reasons I may choose physica machines over virtual machines.

   * If virtual machines are idle then memory reserved for virtual machine is not released hence it cannot be used for other processing. While in case of physical machines, it can be easily allocated for other important tasks.
   * Steal time management mechanism is poor for virtual machines while its better for physical machines.
   * Running different virtual machines in one physical machine for computation is heavy while single OS in terms of physical machine can offer better computation at times.
   * Physical machines offer better disk I/O and optimal network usage.
   * Hardware accesibility is better for physical machine than virtual machine.
   * Operating system cost may be more for virtual systems as you may have to purchase additional license for each virtualization while one operating system is sufficient for one physical machine.

### 5. Which factors might make you choose private over public cloud services?

   I would consider following points for choosing private over public cloud.

   * Compliance: You can easily comply with all regulatory audits or laws if you own a private cloud. With a public cloud you may or may not comply with regulations depending upon the cloud provider.

   * Privacy: Data privacy and data security is best for private clouds. Thre is a risk of interntional or unintentional data leake with public clouds.

   * Cost: Private cloud is a good return on investment for long term projects.

   * Control: Private cloud offers you more flexibility and control of your system. You can easily upgrade, do the maintenance or decide on the best hardware for your system. The situation is not the same in public clouds where you have to adjust with whatever the cloud provider offers.

### 6. Which selection strategy does your current organization use? What are the benefits and caveats of using this strategy?

   IIT is using SaaS Google Apps provided by google for productivity tools such as email, google drive, google docs etc. So the selection strategy they use is Contract for an On-Premises, Externally run service. Google apps for higher educations is supported by IIT's OTS team under the guidance of experts from google advisory committee. Although google apps have been hosted remotely by google but IIT has full control and customization support from google (e.g. IIT authentication).

   _Benefits:_
   * IIT does not have to invest into infrastructure cost at all.
   * They can use world class google suite of applications which they can customize and control by themselves.
   * Google provides necessary expert support as and when requires.

   _Caveats:_
   * IIT may end up putting too much cost in using full google Apps. E.g. students usually use email and drive while rest of apps may be less useful for students.
   * OTS should take care of training and enabling people to work on google apps internal support.


