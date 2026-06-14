import type { Question } from '@/data/types';

export const replicationQuestions: Question[] = [
  {
    id: 'sd-replication-001',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is database replication?',
    options: [
      'Splitting data across multiple servers by a certain key',
      'Creating and maintaining copies of data on multiple servers to increase availability and fault tolerance',
      'The process of migrating data from one DBMS to another',
      'Automatic scheduled backup of a database',
    ],
    correctIndex: 1,
    explanation:
      'Replication is the process of copying and synchronizing data across multiple database servers (replicas). Goals: increasing availability (when one server fails, others continue to work), fault tolerance, read scaling (distributing read requests among replicas), and reducing latency (a replica closer to the user).',
  },
  {
    id: 'sd-replication-002',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'How does the master-slave (primary-replica) replication scheme work?',
    options: [
      'All nodes are equal and accept both writes and reads',
      'One node (master) accepts all writes and replicates changes to slave nodes, which serve reads',
      'The data is split evenly between master and slave, each storing its own half',
      'A slave node automatically replaces the master on any configuration change',
    ],
    correctIndex: 1,
    explanation:
      'In the master-slave (primary-replica) scheme, one node (master/primary) accepts all write operations. The changes are then replicated to one or more slave nodes (replicas). Slave nodes serve read operations, offloading the master. On master failure, a failover can be performed — one of the slaves is promoted to master. This scheme is well suited for read-heavy workloads.',
  },
  {
    id: 'sd-replication-003',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is database sharding?',
    options: [
      'Creating multiple copies of the same data on different servers',
      'Splitting data into parts (shards), each of which is stored on a separate server',
      'Compressing data to save disk space',
      'Vertical scaling of a database by adding resources to a single server',
    ],
    correctIndex: 1,
    explanation:
      'Sharding is the horizontal partitioning of data across multiple servers (shards). Each shard contains a subset of the data. For example, users with IDs 1–1000000 on shard 1, 1000001–2000000 on shard 2. Sharding makes it possible to scale both writes and reads by distributing the load across servers. A key challenge is choosing a shard key that ensures even distribution.',
  },
  {
    id: 'sd-replication-004',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'How does synchronous replication differ from asynchronous replication?',
    options: [
      'Synchronous replication is faster than asynchronous',
      'In synchronous replication the master waits for confirmation from the replicas before confirming the write to the client; in asynchronous replication it does not wait',
      'Synchronous replication works only within a single data center',
      'Asynchronous replication guarantees no data loss on master failure',
    ],
    correctIndex: 1,
    explanation:
      'Synchronous replication: the master sends changes to the replicas and waits for confirmation from one or more replicas before confirming the write to the client. This guarantees that data is not lost on master failure but increases write latency. Asynchronous replication: the master confirms the write to the client immediately after the local write, and replicas are updated later. Lower write latency, but on master failure the most recent changes may be lost (replication lag).',
  },
  {
    id: 'sd-replication-005',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'What is a read replica and what is it used for?',
    options: [
      'A backup copy of the database that is activated only on failure',
      'A copy of the database intended for serving read requests, offloading read load from the master',
      'A special table in the database for caching the results of frequent queries',
      'A separate database that stores only indexes for fast lookup',
    ],
    correctIndex: 1,
    explanation:
      'A read replica is a database replica optimized for serving read requests. All writes go to the master, and the read replica receives changes via replication. This makes it possible to: scale reads horizontally (by adding more replicas), offload the master for write operations, and provide geographic locality (a replica closer to users). AWS RDS, Google Cloud SQL, and Azure SQL all support read replicas.',
  },
  {
    id: 'sd-replication-006',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'open',
    question:
      'Explain the difference between vertical and horizontal scaling of databases. When should sharding be applied?',
    sampleAnswer:
      'Vertical scaling (scale up) — increasing the power of a single server: more CPU, RAM, SSD. Simple, requires no architectural changes, but has a ceiling (physical limits) and high cost. Horizontal scaling (scale out) — adding new servers. Sharding is the primary method of horizontal database scaling. Sharding should be applied when: 1) The volume of data exceeds the capacity of a single server. 2) The write load is too high for a single master. 3) Latency requirements do not allow using a single server for all users. Before sharding it is worth considering query optimization, caching, and read replicas.',
    explanation:
      'Sharding is a last-resort scaling measure that introduces significant complexity: cross-shard queries, distributed transactions, and data rebalancing. It is recommended to exhaust the possibilities of vertical scaling, caching, and read replicas before moving to sharding.',
  },
  {
    id: 'sd-replication-007',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'What is consistent hashing and which sharding problem does it solve?',
    options: [
      'A method of encrypting data during transmission between shards',
      'An algorithm for distributing data across shards that minimizes data movement when nodes are added or removed',
      'A way to ensure data consistency between master and slave',
      'An algorithm for detecting conflicts in multi-master replication',
    ],
    correctIndex: 1,
    explanation:
      'Consistent hashing is an algorithm in which data and nodes are mapped onto a ring (hash ring). Each key is routed to the nearest node on the ring. When a node is added/removed, only a fraction of the data is moved (approximately 1/N, where N is the number of nodes), rather than all the data as with the usual hash % N. This solves the problem of mass rebalancing. Virtual nodes (vnodes) ensure even distribution. Used in DynamoDB, Cassandra, Riak, and caches (Memcached).',
  },
  {
    id: 'sd-replication-008',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'How does range-based sharding differ from hash-based sharding?',
    options: [
      'Range-based distributes data by key range, hash-based by the hash of the key; range supports range queries, hash provides more even distribution',
      'Range-based works only with numeric keys, hash-based only with string keys',
      'Range-based is slower on writes, hash-based on reads',
      'They are identical in performance and differ only in syntax',
    ],
    correctIndex: 0,
    explanation:
      'Range-based sharding: data is divided by key ranges (A-F on shard 1, G-L on shard 2, etc.). Advantage: support for range queries (all orders for the last month). Drawback: uneven distribution (hotspots) — if data concentrates in one range. Hash-based sharding: the key is hashed, and the shard is determined by the hash. Advantage: even distribution. Drawback: range queries require accessing all shards (scatter-gather). MongoDB and PostgreSQL support both types.',
  },
  {
    id: 'sd-replication-009',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'What does the quorum formula W + R > N mean in distributed systems?',
    options: [
      'The minimum number of nodes for the system to operate',
      'A formula guaranteeing that when reading (R nodes) and writing (W nodes) out of N replicas, at least one node holds the up-to-date data',
      'The number of replicas required for synchronous replication',
      'The maximum number of simultaneous connections to the database',
    ],
    correctIndex: 1,
    explanation:
      'In quorum-based systems, data is written to W nodes and read from R nodes out of N replicas. If W + R > N, then the sets of write nodes and read nodes necessarily overlap — at least one node holds the freshest version of the data. Examples: N=3, W=2, R=2 — strong consistency. N=3, W=1, R=1 — high availability, but reading stale data is possible. N=3, W=3, R=1 — fast reads, slow writes. This approach is used in Cassandra, DynamoDB, and Riak.',
  },
  {
    id: 'sd-replication-010',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'What is the main problem with multi-master (active-active) replication?',
    options: [
      'The inability to scale reads',
      'Write conflicts: two masters can modify the same data simultaneously, requiring conflict resolution mechanisms',
      'Each master must store a full copy of all data',
      'Multi-master replication does not support transactions',
    ],
    correctIndex: 1,
    explanation:
      'In multi-master replication, multiple nodes accept writes. If two masters simultaneously modify the same record, a write conflict occurs. Resolution strategies: Last Writer Wins (LWW) — the last write by timestamp wins (simple, but data loss is possible), application-level merge, CRDT (Conflict-free Replicated Data Types) — data structures that automatically resolve conflicts, custom conflict resolution. Multi-master is used for geo-distributed systems (the user writes to the nearest master).',
  },
  {
    id: 'sd-replication-011',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'What is rebalancing and when is it necessary in sharding?',
    options: [
      'The process of deleting stale data from shards to save space',
      'Redistributing data among shards when nodes are added/removed or when uneven load (a hotspot) arises',
      'Synchronizing indexes between shards',
      'Switching from hash-based to range-based sharding',
    ],
    correctIndex: 1,
    explanation:
      'Rebalancing is the process of moving data between shards to restore even distribution. It is necessary when: adding a new shard (scale out), removing a shard, or a hotspot arises (one shard is overloaded). Approaches: hash mod N — changes the placement of almost all keys (bad), consistent hashing — moves a minimum of data, fixed partitions — pre-sliced partitions are reassigned between nodes (Cassandra, Elasticsearch). Rebalancing should be online — the system continues to operate during rebalancing.',
  },
  {
    id: 'sd-replication-012',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'open',
    question:
      'What is replication lag? What problems does it cause and how can they be minimized?',
    sampleAnswer:
      'Replication lag is the delay between a write on the master and the appearance of the data on the replica in asynchronous replication. Problems: 1) Read-after-write inconsistency: a user creates a record, reads from a replica, and does not see their own data. 2) Monotonic reads violation: successive reads return data from different points in time. 3) Phantom reads: data appears and disappears. Solutions: 1) Read-your-writes: after a write, read from the master or wait for synchronization. 2) Monotonic reads: bind the user to a single replica (sticky sessions). 3) Semi-synchronous replication: at least one replica confirms the write synchronously. 4) Monitor lag and alert when it exceeds a threshold.',
    explanation:
      'Replication lag is a fundamental problem of asynchronous replication. Typical lag: milliseconds to seconds, but under peak load it can reach minutes. In PostgreSQL, lag is monitored via pg_stat_replication; in MySQL, via SHOW SLAVE STATUS (Seconds_Behind_Master). Application design must account for the possibility of lag.',
  },
  {
    id: 'sd-replication-013',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'open',
    question:
      'How do you choose a shard key? List the main criteria and provide examples of good and bad choices.',
    sampleAnswer:
      'Criteria: 1) High cardinality — many unique values for even distribution. 2) Even distribution — data is spread evenly across shards, without hotspots. 3) Awareness of query patterns — the key should allow accessing a single shard (rather than scatter-gather across all). 4) Stability — the key should not change frequently. Good examples: user_id (even distribution, queries are usually for a specific user), order_id (high cardinality). Bad examples: creation date (all new records on one shard — a hotspot), country (uneven distribution — some countries have millions of users, others thousands), a boolean field (2 values = a maximum of 2 shards).',
    explanation:
      'Choosing the shard key is one of the most critical and hardest-to-reverse decisions in architecture. A mistake leads to hotspots, cross-shard queries, and the need for a full rebalancing. Instagram chose user_id for sharding, but had to solve the problem of the timeline (which aggregates data from multiple users).',
  },
  {
    id: 'sd-replication-014',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'open',
    question:
      'Compare conflict resolution strategies in multi-master replication: Last Writer Wins (LWW), merge functions, and CRDT. When should each be used?',
    sampleAnswer:
      'Last Writer Wins (LWW): the write with the later timestamp wins. Simple, but data loss is possible. Depends on clock synchronization (clock skew). Suitable for non-critical data (last seen, metrics). Merge functions: the application implements the logic for merging conflicting versions. Flexible, but complex to implement. Suitable for complex business objects where manual or domain-specific logic is needed. CRDT (Conflict-free Replicated Data Types): mathematically guaranteed automatic conflict resolution. Examples: G-Counter (a counter), OR-Set (a set), LWW-Register. Limitation: they support only a specific set of operations. Suitable for counters, shopping carts, collaborative editing. Riak uses CRDT, DynamoDB uses LWW, CouchDB stores all conflicting versions for application-level resolution.',
    explanation:
      'Conflict resolution is one of the hardest tasks in distributed systems. There is no universal solution. In practice, systems often combine approaches: CRDT for data structures, LWW for metadata, application-level merge for business logic.',
  },
  {
    id: 'sd-replication-015',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Which mechanism is used in PostgreSQL for physical replication?',
    options: [
      'Trigger-based replication — triggers on each table',
      'Streaming replication based on the WAL (Write-Ahead Log) — streaming of the write-ahead log',
      'Statement-based replication — re-executing SQL queries',
      'Snapshot replication — a periodic full copy of the database',
    ],
    correctIndex: 1,
    explanation:
      'PostgreSQL uses WAL-based streaming replication for physical replication. The WAL (Write-Ahead Log) is a log where all data changes are written before they are applied. The master streams WAL records to the replicas, which apply them to their own copy of the data. Advantages: low latency, consistency guarantees, replaying of all changes (including DDL). PostgreSQL also supports logical replication for selective replication of individual tables.',
  },
  {
    id: 'sd-replication-016',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Which cross-datacenter replication strategy provides the best balance between write latency and protection against data loss?',
    options: [
      'Fully synchronous replication between data centers',
      'Semi-synchronous: synchronous replication within the data center + asynchronous between data centers with confirmation from at least one remote replica',
      'Fully asynchronous replication with RPO = 0',
      'Hourly transfer of a full backup between data centers',
    ],
    correctIndex: 1,
    explanation:
      'Cross-datacenter replication is a critical component of disaster recovery. Fully synchronous replication gives RPO=0, but the latency between data centers (tens of ms) makes every write slow. The semi-synchronous approach: the write is confirmed locally and synchronously, and asynchronously replicated to the remote DC with an ack. This gives an RPO of ~seconds with acceptable latency. MySQL Semi-Sync Replication, PostgreSQL synchronous_standby_names with FIRST 1 are examples of implementation. For a geo-active system, multi-master with eventual consistency is often used.',
  },
  {
    id: 'sd-replication-017',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question:
      'Describe how automatic failover works in master-slave replication. What problems can arise and how do you solve them?',
    sampleAnswer:
      'Automatic failover: 1) Monitoring — a sentinel/orchestrator tracks the master\'s heartbeat. 2) Failure detection — if no heartbeat is received within the timeout, the master is considered unavailable. 3) Election — the best candidate among the slaves is determined (lowest replication lag, priority). 4) Promotion — the selected slave becomes the new master, and the remaining slaves switch to it. 5) Configuration update — applications learn about the new master (via DNS, service discovery, proxy). Problems: 1) Split brain — the old master recovers and accepts writes in parallel with the new one → conflicts. Solution: fencing (STONITH — Shoot The Other Node In The Head), lease checking. 2) Data loss — the slave may not have received the master\'s last transactions (replication lag). Solution: semi-synchronous replication. 3) False positives — a network failure rather than the master crashing. Solution: consensus-based detection (several sentinels vote).',
    explanation:
      'Failover is a critically important process for ensuring high availability. Redis Sentinel, MySQL Orchestrator, and PostgreSQL Patroni are popular solutions. A correct failover implementation requires careful testing (Chaos Engineering) and monitoring.',
  },
  {
    id: 'sd-replication-018',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question:
      'How do you design a globally distributed system with multi-region replication? Describe the architecture, trade-offs, and data handling strategy.',
    sampleAnswer:
      'Architecture: each region has a full stack (application servers, database). Data is classified: 1) Regional (user profile) — master in the user\'s "home" region, read replicas in others. 2) Global (product catalog) — a single global master, read replicas everywhere. 3) Regionally isolated (GDPR data) — only in one region. Write strategy: the user writes to their "home" region, and the write is replicated asynchronously. Cross-region writes via redirect or relay. Trade-offs: latency vs consistency (CAP), operational complexity, cost of cross-region traffic. Approaches: CockroachDB/Spanner — distributed SQL with global consistency (Spanner TrueTime). DynamoDB Global Tables — multi-master, LWW. Vitess/Citus — sharded PostgreSQL/MySQL. DNS-based routing directs users to the nearest region.',
    explanation:
      'Multi-region is one of the hardest tasks in distributed systems. Google Spanner solves it through TrueTime (atomic clocks + GPS), providing strong consistency. For most companies, an acceptable solution is eventual consistency with a read-your-writes guarantee in the "home" region.',
  },
  {
    id: 'sd-replication-019',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question:
      'Explain the problem of cross-shard queries and distributed transactions in sharding. What approaches exist for solving them?',
    sampleAnswer:
      'The problem: with sharding, the data for a single query may reside on different shards. For example, a JOIN of the orders and products tables if they are sharded differently. Cross-shard queries: scatter-gather — the query is sent to all shards, and the results are aggregated. Problems: high latency, network load, complexity of ORDER BY/LIMIT. Distributed transactions: 2PC (Two-Phase Commit) — coordinator + participants, guarantees ACID, but slow and blocking. 3PC — an improved variant, but more complex. Saga — eventual consistency through compensations. Approaches to solving: 1) Denormalization — store the needed data together on one shard. 2) Co-location — related data on one shard (tenant-based sharding). 3) Application-level join — aggregation at the application level. 4) Specialized solutions: Vitess (for MySQL) automatically routes cross-shard queries, CockroachDB — distributed SQL with transaction support.',
    explanation:
      'Cross-shard operations are the main "price" of sharding. A correct choice of shard key and data co-location can minimize the need for cross-shard queries. In practice, 2PC is rarely used due to its blocking nature; Saga and eventual consistency are more scalable alternatives.',
  },
  {
    id: 'sd-replication-020',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'What is chain replication and what advantage does it provide compared to classic master-slave?',
    options: [
      'The replicas are arranged in a chain: a write goes to the head, is passed along the chain, and reads come from the tail; this provides strong consistency at high throughput',
      'Each replica stores only part of the data, forming a chain of responsibility',
      'Data is written to all nodes in parallel via multicast',
      'The replicas automatically rebuild into a chain on failover',
    ],
    correctIndex: 0,
    explanation:
      'Chain replication is a model in which nodes are arranged in a chain. A write is directed to the head of the chain and is passed sequentially through all nodes to the tail. Reads are served only by the tail. Advantages: strong consistency (the tail contains all confirmed writes), high throughput (the write load is distributed across the chain), simple semantics. Used in Microsoft Azure Storage, HDFS (an adapted variant). Drawbacks: write latency is proportional to the chain length, and one slow node slows down the entire chain.',
  },
  {
    id: 'sd-replication-021',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is geo-replication and why is it needed?',
    options: [
      'Replicating data within a single data center',
      'Replicating data between geographically distributed data centers to reduce latency, provide disaster recovery, and comply with local legislation',
      'Encrypting data during transmission between regions',
      'Load balancing among servers in a single region',
    ],
    correctIndex: 1,
    explanation:
      'Geo-replication (cross-region replication) is the replication of data between data centers in different geographic regions. Goals: 1) Disaster Recovery — if one region is lost, the data is available in another. 2) Low latency — users read from the nearest region. 3) Data residency — data is stored in a region according to legislation (GDPR). 4) High availability — regional outages do not affect global availability. Examples: AWS Global Tables (DynamoDB), Azure Cosmos DB multi-region, PostgreSQL with logical replication.',
  },
  {
    id: 'sd-replication-022',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is a partition in the context of distributed databases?',
    options: [
      'A disk partition for storing data',
      'A logical division of data into parts, each of which can be stored and processed independently on different nodes',
      'A version of the database schema',
      'A type of index for speeding up queries',
    ],
    correctIndex: 1,
    explanation:
      'A partition is a logical division of data. Each partition contains a subset of the data and can be served by a separate node. Partition vs Shard: often synonyms, but partition can be a more general term (including division within a single server). In Kafka: a topic is divided into partitions for parallel processing. In PostgreSQL: table partitioning for managing large tables. In MongoDB: a shard = a set of partitions. The partition key determines which partition the data falls into.',
  },
  {
    id: 'sd-replication-023',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'open',
    question: 'What is a hot spot in sharding and how do you avoid it?',
    sampleAnswer:
      'A hot spot is a situation where one shard receives a disproportionately large load compared to the others. Causes: 1) A poor shard key: sharding by date → all new records on one shard. 2) The celebrity problem: a popular user/item generates the majority of requests. 3) Sequential IDs: an auto-increment ID with range sharding → all INSERTs go to the last shard. Solutions: 1) Choose a high-cardinality, evenly distributed shard key. 2) Hash-based sharding instead of range for sequential data. 3) Salting: adding a random prefix to the key (user_123 → shard_5_user_123). 4) Secondary sharding for hot entities. 5) Caching in front of hot keys. Monitoring: tracking the load per shard, alerting on imbalance.',
    explanation:
      'Hot spots are one of the main problems of sharding. Instagram solved the celebrity problem through separate caching of hot users. A correct shard key is a key architectural decision that is hard to change later.',
  },
  {
    id: 'sd-replication-024',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What are RPO and RTO in the context of replication and disaster recovery?',
    options: [
      'RPO — downtime, RTO — the amount of lost data',
      'RPO (Recovery Point Objective) — the maximum acceptable data loss; RTO (Recovery Time Objective) — the maximum acceptable recovery time',
      'RPO and RTO are replication performance metrics',
      'RPO — the number of replicas, RTO — the replication time',
    ],
    correctIndex: 1,
    explanation:
      'RPO (Recovery Point Objective) — how much data is acceptable to lose. RPO = 0 means zero data loss (requires synchronous replication). RPO = 1 hour — up to an hour of data can be lost. RTO (Recovery Time Objective) — how quickly the system must recover. RTO = 15 minutes — failover must complete within 15 minutes. These metrics define the DR strategy: strict RPO/RTO require synchronous geo-replication and automatic failover, which is expensive. A balance between cost and requirements.',
  },
  {
    id: 'sd-replication-025',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is logical replication in PostgreSQL and how does it differ from physical?',
    options: [
      'Logical replication works faster than physical',
      'Logical replication replicates logical changes (INSERT, UPDATE, DELETE) at the row level, allowing selective replication of tables and different PostgreSQL versions',
      'Logical replication uses less disk space',
      'Physical replication does not support failover',
    ],
    correctIndex: 1,
    explanation:
      'Physical replication (streaming replication): transfers WAL records byte-by-byte. The replica is an exact copy, only one master, all tables. Logical replication: transfers logical changes (row-level changes). Advantages: selective replication (individual tables), different PostgreSQL versions (for upgrades), a writable replica (for reports), multiple publishers/subscribers. Drawbacks: does not replicate DDL (schema changes), sequences, large objects. Use cases: zero-downtime upgrade, cross-DC selective replication, OLTP → OLAP sync.',
  },
  {
    id: 'sd-replication-026',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is split-brain in the context of replication and how do you prevent it?',
    options: [
      'Splitting data between shards',
      'A situation where two nodes consider themselves the master due to a network partition, leading to conflicts and data loss',
      'A method of optimizing queries in a distributed database',
      'A load balancing technique',
    ],
    correctIndex: 1,
    explanation:
      'Split-brain arises during a network partition: nodes do not see each other, each thinks the other has failed, and promotes itself to master. The result: two masters accept conflicting writes. Prevention: 1) Quorum-based: a majority of votes is required for promotion to master (during a partition, the minority cannot become master). 2) Fencing (STONITH): physically disabling the old master before promoting the new one. 3) Witness node: a third node in another DC to determine which side of the partition has the majority. 4) Lease-based: the master must periodically renew a lease; during a partition the lease expires.',
  },
  {
    id: 'sd-replication-027',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'open',
    question: 'Compare sharding strategies: range-based and hash-based. Provide example use cases.',
    sampleAnswer:
      'Range-based sharding: data is divided by key ranges. users A-M → shard 1, N-Z → shard 2. Or orders 2023-01 → shard 1, 2023-02 → shard 2. Pros: range queries are efficient (all data for January on one shard), logical structure. Cons: uneven distribution (hot spots), the need for manual rebalancing as it grows. Use cases: time-series data, geographic data. Hash-based sharding: shard = hash(key) % num_shards. Pros: even distribution, automatic. Cons: range queries require scatter-gather (all shards), rebalancing when adding shards is complex (consistent hashing helps). Use cases: user data, random access patterns. Hybrid: hash partition + range secondary. Directory-based: a separate table mapping key → shard, flexible, but a single point of failure.',
    explanation:
      'The choice of strategy depends on access patterns. Time-series — range by time. User data with random access — hash. MongoDB, PostgreSQL, and CockroachDB support both types.',
  },
  {
    id: 'sd-replication-028',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'open',
    question: 'What is data locality and how do you ensure it in geo-distributed replication?',
    sampleAnswer:
      "Data locality is placing data closer to the users or applications that access it. Goals: reducing latency, compliance (GDPR — EU data in the EU), reducing cross-region traffic costs. Strategies: 1) Geo-partitioning: a user's data is stored in their \"home\" region. user.region determines the shard. 2) Follow-the-sun: the active replica moves across time zones. 3) Local reads: read replicas in each region, reads are local, writes are routed to the master. 4) Multi-master with conflict resolution: writes to the local region, async replication, merge conflicts. CockroachDB locality-aware partitioning: CREATE TABLE users (...) PARTITION BY LIST (country) (PARTITION eu VALUES IN ('DE', 'FR') LOCATE IN 'eu-west', ...). Spanner: placement policies for geo-distribution.",
    explanation:
      'Data locality is critical for global-scale systems. Netflix and Uber use region-aware routing. Trade-off: locality vs consistency — local reads can be stale with async replication.',
  },
  {
    id: 'sd-replication-029',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is the Raft consensus algorithm and where is it used?',
    options: [
      'An algorithm for encrypting data during replication',
      'A distributed consensus algorithm for leader election and log replication that ensures consistency in distributed systems',
      'A method of compressing data in the WAL',
      'A load balancing protocol',
    ],
    correctIndex: 1,
    explanation:
      'Raft is a distributed consensus algorithm designed as an understandable alternative to Paxos. Components: Leader Election (one leader, the rest are followers), Log Replication (the leader replicates entries to followers), Safety (committed entries are not lost). A leader heartbeat maintains leadership. On loss of the leader — new elections with a quorum. Raft is used in: etcd (Kubernetes), CockroachDB, TiDB, Consul, HashiCorp Vault. Raft provides strong consistency through a replicated state machine.',
  },
  {
    id: 'sd-replication-030',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is Google Spanner and how does it ensure global consistency?',
    options: [
      'A cloud service for storing files',
      'A globally distributed NewSQL database with external consistency that uses TrueTime (atomic clocks + GPS) for time synchronization',
      'A tool for migrating data between regions',
      'A caching layer for PostgreSQL',
    ],
    correctIndex: 1,
    explanation:
      'Google Spanner is a globally distributed, strongly consistent database. Its uniqueness: the TrueTime API provides a bounded uncertainty interval for the current time (usually < 7ms) through atomic clocks and GPS in each data center. This allows Spanner to implement external consistency (linearizability) globally: transactions get timestamps, and commit wait guarantees ordering. Spanner: SQL interface, horizontal scaling, automatic sharding, synchronous replication. Trade-off: commit latency includes wait time for TrueTime uncertainty. Cloud Spanner is the managed version in GCP.',
  },
  {
    id: 'sd-replication-031',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is CockroachDB and how does it implement distributed SQL without TrueTime?',
    options: [
      'A NoSQL database for time-series',
      'A distributed SQL database with Raft-based replication and hybrid logical clocks (HLC) for ordering transactions without specialized hardware',
      'An in-memory cache for PostgreSQL',
      'A graph database for social networks',
    ],
    correctIndex: 1,
    explanation:
      'CockroachDB is an open-source distributed SQL database inspired by Spanner. The difference: instead of TrueTime, it uses Hybrid Logical Clocks (HLC) — a combination of a physical clock and a logical counter. HLC ensures causality, but not bounded uncertainty like TrueTime. The result: CockroachDB provides serializable isolation, but with potential stale reads under clock skew. Architecture: Raft for replication, automatic range splitting/merging for sharding, PostgreSQL-compatible SQL. Geo-partitioning, locality-aware queries. Deployment: any cloud, on-premise, Kubernetes.',
  },
  {
    id: 'sd-replication-032',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you implement online schema migration in a sharded database without downtime?',
    sampleAnswer:
      'Online schema migration in a sharded DB is a complex task. Approaches: 1) Ghost/pt-online-schema-change: creating a shadow table with the new schema, copying data in chunks, CDC for new changes, atomic rename. For a sharded DB: perform on each shard sequentially or in parallel. 2) Expand-Contract pattern: Phase 1 (Expand): add new columns/tables, the application writes to old + new. Phase 2: backfill the old data into the new structure. Phase 3 (Contract): the application uses only new, delete old. 3) Vitess for MySQL: online DDL via vreplication. 4) Blue-green deployment: a new cluster with the new schema, data migration, traffic switch. Challenges: foreign keys, constraints, triggers, long-running transactions. Important: testing on a copy of production, a rollback plan.',
    explanation:
      'Schema migrations are one of the hardest operations in distributed systems. GitHub and Facebook use ghost/pt-osc for MySQL. Zero-downtime migrations require careful planning and multiple application deploys.',
  },
  {
    id: 'sd-replication-033',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question: 'Describe the resharding strategy when changing the number of shards.',
    sampleAnswer:
      'Resharding is necessary when: adding shards (scale out), removing them (scale in), or changing the shard key. Strategies: 1) Hash-based with consistent hashing: when adding a node, ~1/N of the data is moved (from neighboring nodes on the ring). Virtual nodes improve balancing. 2) Double-write period: write to the old and new shards simultaneously, read from old, then switch reads to new, disable writes to old. 3) Background migration: read from old, lazily migrate on access (copy on a read miss to new), a background job for the rest. 4) New cluster approach: create a new cluster with a new sharding scheme, stream data via CDC, switch traffic. 5) Vitess for MySQL: vreplication for resharding. MongoDB: the automatic balancer moves chunks. Challenges: maintaining consistency during migration, handling hotspots during the process, rollback capability.',
    explanation:
      'Resharding is disruptive and resource-intensive. Proper initial design (a sufficient number of shards, a good shard key) minimizes the need for resharding. Consistent hashing is a best practice for systems with a dynamic number of nodes.',
  },
  {
    id: 'sd-replication-034',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is a replica set in MongoDB?',
    options: [
      'A set of indexes for a collection',
      'A group of MongoDB instances maintaining the same dataset: one primary for writes and several secondaries for replication and read scaling',
      'A sharding configuration',
      'A set of document validation rules',
    ],
    correctIndex: 1,
    explanation:
      'A Replica Set in MongoDB is a group of mongod processes that provide redundancy and high availability. The primary accepts all writes. Secondaries replicate data from the primary via the oplog (operations log). On primary failure, a new one is automatically elected (Raft-like). Read preferences: primary (default), primaryPreferred, secondary, secondaryPreferred, nearest. An arbiter is a node without data, used only for voting. A minimum of 3 nodes is needed for fault tolerance (quorum). A replica set is the foundation for a sharded cluster in MongoDB.',
  },
  {
    id: 'sd-replication-035',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is read-your-writes consistency and how do you ensure it?',
    options: [
      'A guarantee that data will never become stale',
      'A guarantee that after a write, a user will always see their changes in subsequent reads',
      'A guarantee of transaction atomicity',
      'A guarantee of primary key uniqueness',
    ],
    correctIndex: 1,
    explanation:
      'Read-your-writes (RYW) consistency is a guarantee that if a user has written data, their subsequent reads will see that write (or a newer one). The problem with async replication: a write to the master, a read from a replica → the replica may not have the write. Solutions: 1) After writes, read from the master (sticky connection). 2) Pass the write timestamp; the replica waits until it reaches that offset. 3) Session consistency: track the user\'s last write, read from a replica only if it is synchronized. 4) Causal consistency tokens. DynamoDB and Cosmos DB offer session consistency for RYW.',
  },
  {
    id: 'sd-replication-036',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'open',
    question: 'How do you monitor replication health? Which metrics should you track?',
    sampleAnswer:
      'Key replication metrics: 1) Replication lag: the delay of the replica behind the master (in seconds, bytes, or LSN). PostgreSQL: pg_stat_replication.replay_lag. MySQL: Seconds_Behind_Master. Alert: lag > threshold. 2) Replica status: connected/disconnected, streaming/catching up. 3) Write throughput: transactions per second on the master vs the replay rate on the replica. 4) Network bandwidth: between master and replicas. 5) Disk I/O: on replicas during replay. 6) Connection count: replication connections. 7) Failover metrics: time since last failover, failover success rate. 8) Quorum health: in Raft-based systems — leader election events, term changes. Tools: pg_stat_replication (PostgreSQL), SHOW SLAVE STATUS (MySQL), Prometheus exporters, Datadog/New Relic integrations. Dashboards: a replica lag graph, cluster topology visualization. Alerts: replication broken, lag > SLA, replica count < minimum.',
    explanation:
      'Replication lag is the "canary" of replication health. Growing lag signals problems: insufficient replica performance, network issues, heavy write load. Without monitoring, problems are discovered only at failover (too late).',
  },
  {
    id: 'sd-replication-037',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is a vector clock and what is it used for in distributed systems?',
    options: [
      'An algorithm for time synchronization via NTP',
      'A mechanism for tracking causal relationships between events to identify concurrent operations and resolve conflicts',
      'A method of measuring latency between nodes',
      'A data structure for storing timestamps',
    ],
    correctIndex: 1,
    explanation:
      'A vector clock is a logical clock for tracking causality in distributed systems. Each node maintains a vector of counters [N1: 5, N2: 3, N3: 7]. On a local event, the node increments its own counter. When sending a message, it attaches the vector clock. On receipt, it merges (max per component) + increments. Comparison: V1 < V2 if all components of V1 <= V2 and at least one <. Otherwise — concurrent (conflict). Used in Amazon Dynamo, Riak for conflict detection. Problem: the size of the vector grows with the number of nodes. Dotted Version Vectors, Interval Tree Clocks are optimizations.',
  },
  {
    id: 'sd-replication-038',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question: 'Compare geo-replication approaches: active-passive vs active-active. When should each be used?',
    sampleAnswer:
      'Active-Passive: one region (active) accepts all writes, the others (passive) are read replicas. Failover switches writes to passive. Pros: simple model, no write conflicts, strong consistency. Cons: writes have latency to the active region, manual/automated failover on disaster. Use case: systems with read-heavy load where strong consistency is more important than latency. Active-Active (multi-master): all regions accept writes locally, with asynchronous replication between them. Pros: low write latency (local writes), no single point of failure. Cons: write conflicts require resolution (LWW, CRDT, app-level merge), eventual consistency, complex operations. Use case: global systems with geo-distributed users where latency is critical (social media, gaming). Hybrid: geo-partitioning — each user "belongs" to a region, their writes go only there, other regions are read replicas for that user.',
    explanation:
      'The choice depends on the trade-off: consistency vs latency vs complexity. Banks often use active-passive (consistency). Social media — active-active (latency). CockroachDB and Spanner try to provide the best of both worlds through global consensus.',
  },
  {
    id: 'sd-replication-039',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you design sharding for a multi-tenant SaaS application?',
    sampleAnswer:
      'Multi-tenant sharding strategies: 1) Tenant-per-shard: each tenant on a separate shard. Pros: full isolation, simple queries. Cons: does not scale for millions of small tenants, resource waste. Suitable for enterprise customers. 2) Shared sharding by tenant_id: shard = hash(tenant_id) % N. Tenants are distributed across shards. Pros: efficient resource usage, scales well. Cons: less isolation, a noisy neighbor is possible. 3) Hybrid: large tenants — a dedicated shard, small tenants — shared. 4) Hierarchical: region → tenant → data sharding. Shard key: tenant_id is usually the best choice — all of a tenant\'s data on one shard, cross-tenant queries are rare. Migrations: as a tenant grows — move it to a dedicated shard. When adding shards — consistent hashing minimizes migration. Compliance: a tenant in a specific region for data residency.',
    explanation:
      'Multi-tenant sharding is a balance between isolation, efficiency, and complexity. Salesforce and Shopify use sophisticated tenant placement strategies. Noisy neighbor is the main problem of shared sharding.',
  },
  {
    id: 'sd-replication-040',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is partition tolerance in the CAP theorem?',
    options: [
      'Tolerance to data loss on failures',
      'The ability of a system to continue operating during network partitions between nodes',
      'Resilience to changes in the data schema',
      'Tolerance to high load on individual partitions',
    ],
    correctIndex: 1,
    explanation:
      'Partition Tolerance (P) in CAP: the system continues to operate during a network partition — when nodes cannot communicate with each other. In a distributed system, P is practically mandatory (the network is unreliable). CAP says: during a partition, choose between C (consistency) and A (availability). CP systems (MongoDB, HBase): during a partition they reject writes in the minority partition, preserving consistency. AP systems (Cassandra, DynamoDB): during a partition both sides continue to operate, eventual consistency. PACELC extends CAP: even without a partition there is a trade-off of latency vs consistency.',
  },
  {
    id: 'sd-replication-041',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'open',
    question: 'What are failover and failback? Explain the switchover process on master failure.',
    sampleAnswer:
      'Failover is the process of switching to a backup node on primary failure. Steps: 1) Detection: monitoring detects the master\'s unavailability (heartbeat timeout). 2) Confirmation: multiple checks to avoid false positives. 3) Election: selecting the best candidate among the replicas (lowest lag, highest priority). 4) Promotion: the replica becomes the new master (accepts writes). 5) Reconfiguration: the remaining replicas switch to the new master, clients update their connection. Failback is the return to the original master after its recovery. Options: automatic (risky — data loss is possible), manual (safer). The recovered node usually becomes a replica and can be promoted back during a planned maintenance window. Important: fence the old master to prevent split-brain.',
    explanation:
      'Failover is critical for HA. Automatic failover (Redis Sentinel, PostgreSQL Patroni) reduces RTO but requires careful configuration to avoid split-brain and data loss. Manual failback is usually safer.',
  },
  {
    id: 'sd-replication-042',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is a shard proxy (router) and why is it needed?',
    options: [
      'A caching layer in front of the shards',
      'A component that routes requests to the appropriate shard based on the shard key, abstracting the client from the sharding topology',
      'A backup shard for failover',
      'A tool for monitoring shards',
    ],
    correctIndex: 1,
    explanation:
      'A shard proxy (router) is middleware between clients and shards. Functions: 1) Routing: determines the appropriate shard by the shard key. 2) Query distribution: scatter-gather for cross-shard queries. 3) Topology abstraction: the client does not know about the location of the shards. 4) Connection pooling: reduces connections to the shards. 5) Failover handling: redirection on shard failure. Examples: MongoDB mongos, Vitess vtgate, ProxySQL for MySQL sharding, pgpool for PostgreSQL. Without a proxy, the client must know the topology itself and route the requests. A proxy can be a bottleneck — it scales through multiple instances.',
  },
  {
    id: 'sd-replication-043',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is CRDT (Conflict-free Replicated Data Types)?',
    options: [
      'A data serialization format for replication',
      'Data structures that mathematically guarantee automatic conflict-free merging on concurrent updates across different replicas',
      'An encryption protocol for replication',
      'A method of compressing data during transmission',
    ],
    correctIndex: 1,
    explanation:
      'CRDTs are data structures designed for eventual consistency. Examples: G-Counter (grow-only counter) — each node increments its own counter, merge = sum. PN-Counter — increment and decrement. G-Set — grow-only set, merge = union. OR-Set — a set with add/remove via unique tags. LWW-Register — last-write-wins register. Properties: commutativity, associativity, idempotence of the merge operation guarantee convergence regardless of order. Used in: Riak (data types), Redis (CRDT replication), collaborative editing (Yjs, Automerge). Trade-off: a limited set of operations, storage overhead.',
  },
  {
    id: 'sd-replication-044',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you ensure exactly-once delivery in replication? Is it possible?',
    sampleAnswer:
      'True exactly-once delivery in a distributed system is impossible (the Two Generals Problem). What is realistically achievable: at-least-once delivery + idempotent processing = effectively-once semantics. Strategies: 1) Idempotency keys: each operation has a unique ID; on retry we check — already processed? 2) Transactional outbox: atomic write to the DB + outbox, a separate publisher with deduplication. 3) Log sequence numbers (LSN): the replica tracks the last applied LSN and skips duplicates. 4) Two-phase commit: guarantees an atomic commit on multiple nodes, but blocking and slow. 5) Kafka exactly-once: transactional producer + idempotent writes + consumer read_committed. Works within the Kafka ecosystem. For cross-system replication: at-least-once with an idempotent consumer is the practical standard. Database CDC tools (Debezium) provide at-least-once, and the consumer deduplicates.',
    explanation:
      'Exactly-once is a marketing term. In reality: the system handles duplicates so that the side effects happen once. Idempotency is the key pattern. Kafka Transactions provide exactly-once for read-process-write within Kafka.',
  },
  {
    id: 'sd-replication-045',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is the replication factor and how do you choose it?',
    options: [
      'The data replication speed',
      'The number of copies of data in the system: RF=3 means three copies of each piece of data',
      'The compression ratio during replication',
      'The interval between replica synchronizations',
    ],
    correctIndex: 1,
    explanation:
      'Replication Factor (RF) is the number of copies of data. RF=3 is the standard: survives the failure of two nodes. RF=1 — no redundancy, data is lost on failure. RF=5 — high durability for critical data. Trade-offs: a higher RF → more storage, higher write latency (with sync replication), better durability and read scalability. Formula: to survive N failures you need RF >= N+1. For a quorum (majority): RF >= 2F+1 where F is the number of tolerable failures. Kafka: replication.factor per topic. Cassandra: replication factor per keyspace. AWS S3: data is replicated across 3+ AZs automatically.',
  },
  {
    id: 'sd-replication-046',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'open',
    question: 'What is a materialized view and how is it used with replication for read scaling?',
    sampleAnswer:
      'A materialized view is a pre-computed and stored result of a query. Unlike a regular view, the data is physically stored, and queries read from the cache without executing joins. Use with replication: 1) CQRS pattern: writes go to the normalized model on the master, materialized views (read models) on the replicas are optimized for specific queries. 2) Refresh strategies: full refresh (periodically recreate), incremental refresh (apply only changes), on-demand (on query). 3) CDC-based: Debezium captures changes → stream processing (Kafka Streams/Flink) → a materialized view in Elasticsearch/Redis. 4) PostgreSQL: REFRESH MATERIALIZED VIEW [CONCURRENTLY]. 5) ClickHouse, Druid: automatic materialized views for analytics. Materialized views are a form of denormalization for read performance, trade-off: storage and refresh complexity.',
    explanation:
      'Materialized views are a key pattern for read scaling. Netflix and LinkedIn use CDC + stream processing for real-time materialized views. Event Sourcing naturally produces materialized views through projections.',
  },
  {
    id: 'sd-replication-047',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is leaderless replication and where is it used?',
    options: [
      'Replication without a network connection',
      'A model without a dedicated leader: the client sends writes to several replicas, reads from several replicas, with consistency via quorum',
      'Replication of only metadata without data',
      'Asynchronous replication with delay',
    ],
    correctIndex: 1,
    explanation:
      'Leaderless replication (Dynamo-style): there is no single leader. Writes are sent to W replicas, reads from R replicas. When R + W > N, overlap is guaranteed — at least one replica has the latest version. Read repair: on read, a stale replica is detected and updated. Anti-entropy: a background process synchronizes the replicas. Conflicts: vector clocks for detection, LWW or application merge for resolution. Examples: Amazon DynamoDB, Apache Cassandra, Riak. Pros: no leader failover, writes always available. Cons: eventual consistency, conflict resolution complexity.',
  },
  {
    id: 'sd-replication-048',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question: 'Describe the architecture of Vitess for MySQL sharding. What are the components and how do they interact?',
    sampleAnswer:
      'Vitess is an open-source database clustering system for MySQL (YouTube, Slack). Components: 1) VTGate: a query router that accepts MySQL-protocol queries, routes them to shards, and aggregates results. Stateless, scales horizontally. 2) VTTablet: a sidecar to each MySQL instance. Connection pooling, query rewriting, health checking, replication management. 3) Topology Service: etcd/ZooKeeper/Consul stores the cluster metadata (topology, schema). 4) VTCtld: an admin UI and CLI for managing the cluster. 5) VReplication: stream-based data movement for resharding and schema changes. Sharding: keyspace → shards are determined by keyspace_id (hash or range). The Vschema describes routing rules. Queries: VTGate parses the SQL, determines the target shards, and performs scatter-gather. VTTablet manages MySQL replication, and health checking determines master/replica.',
    explanation:
      'Vitess is a production-proven solution for MySQL at scale. It is used by PlanetScale (DBaaS), Slack, and GitHub. It solves the main problems of MySQL sharding: connection management, query routing, online schema changes (via VReplication).',
  },
  {
    id: 'sd-replication-049',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is the binlog in MySQL and how is it used for replication?',
    options: [
      'The MySQL error log',
      'The binary log — a log of all data changes used for replication (the replica reads and applies it) and point-in-time recovery',
      'An index for binary data',
      'The MySQL query cache',
    ],
    correctIndex: 1,
    explanation:
      'The binary log (binlog) is a log of all events that change data (INSERT, UPDATE, DELETE, DDL). Formats: Statement-based (SQL statements), Row-based (actual row changes), Mixed. Replication: the replica connects to the master, reads the binlog via the replication protocol, and applies the events. The binlog position or GTID (Global Transaction ID) tracks progress. Point-in-time recovery: backup + replay the binlog up to the desired moment. CDC tools (Debezium) read the binlog to stream changes. The ROW format is preferred for replication (deterministic).',
  },
  {
    id: 'sd-replication-050',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Replication and Sharding',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you test the fault tolerance of replication? Describe the chaos engineering approach.',
    sampleAnswer:
      'Chaos engineering for replication: systematically testing failure scenarios. Experiments: 1) Master failure: kill the master process → verify automatic failover, RTO, data loss (RPO). 2) Replica failure: kill a replica → verify that the system continues to operate and the replica recovers. 3) Network partition: iptables/tc to simulate a partition between the master and replicas → verify split-brain prevention, quorum behavior. 4) High replication lag: throttle the network → verify alerts, read-your-writes handling. 5) Disk full on a replica: → verify graceful degradation. 6) Slow replica: inject latency → verify that it does not affect master performance. Tools: Chaos Monkey, Gremlin, LitmusChaos, tc/iptables (manual). Process: hypothesis → controlled experiment in staging → gradual rollout to production (with a limited blast radius). Game days: regular drills with failover.',
    explanation:
      'Chaos engineering is the only way to be sure of real fault tolerance. Netflix pioneered it with Chaos Monkey. Important: start small, have runbooks, the ability to stop an experiment. Verify not only that the system survives a failure, but also observability — that alerts fire and dashboards show the problem.',
  },
];
