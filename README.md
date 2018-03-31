# Data Store Service

A simple data storage service. Stores data without a schema
inside of a relational database. Keeps it searchable and fast
retrievable.


### Real Time Analytics Framework

This service is part of the INFECT Realtime Data Analytics (RDA) 
framework. The framework has similarities with apache spark but is 
lightweight and implemented 100% vanilla javascript. It is easy to 
set up and automatically scales based on the current usage patterns 
and data set size. It keeps data inside of the memory and applies 
functions on it. INFECT uses it to aggregate a huge number if samples
within fractions of a second.


The RDA framework consists of several components that work together
in order to transform data.

- **Coordinator**: knows everything about the datasets and transformation 
  functions. distributed the data over compute nodes using rendezvous hashing. 
- **Scheduler**: makes sure that the system has the right amount of compute
  power available to satisfy all requests.
- **data-storage**: central storage for the data of the system.
- **compute**: provides compute power to the system. keeps data in the local
  memory and applies functions against it