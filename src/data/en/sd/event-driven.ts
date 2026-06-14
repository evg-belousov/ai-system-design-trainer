import type { Question } from '@/data/types';

export const eventDrivenQuestions: Question[] = [
  {
    id: 'sd-event-driven-001',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'What is Event-Driven Architecture (EDA)?',
    options: [
      'An architecture in which all services communicate exclusively through synchronous HTTP requests',
      'An architecture in which components interact by sending and receiving events (asynchronous messages about facts that have occurred)',
      'An architecture in which the database automatically notifies all services whenever any record changes',
      'An architecture in which each service operates independently and does not interact with others',
    ],
    correctIndex: 1,
    explanation:
      'Event-Driven Architecture (EDA) is an architectural style in which system components interact by sending and receiving events. An event is an immutable record of a fact that occurred in the system (for example, "order created", "payment processed"). This enables loose coupling between services, high scalability, and flexibility in handling business logic.',
  },
  {
    id: 'sd-event-driven-002',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'Which of the listed components acts as an intermediary for delivering events between services?',
    options: [
      'Load Balancer',
      'Event Broker (for example, Apache Kafka, RabbitMQ)',
      'API Gateway',
      'CDN (Content Delivery Network)',
    ],
    correctIndex: 1,
    explanation:
      'An Event Broker is an infrastructure component that receives events from producers (publishers) and delivers them to consumers (subscribers). Examples: Apache Kafka, RabbitMQ, Amazon EventBridge, NATS. The broker decouples producers and consumers, buffers messages, and provides delivery guarantees and scalability.',
  },
  {
    id: 'sd-event-driven-003',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is a Dead Letter Queue (DLQ)?',
    options: [
      'A queue for storing stale events whose retention period has expired',
      'A queue that receives messages which could not be processed after a specified number of attempts',
      'The main queue through which all system events pass',
      'A special queue for priority events that require immediate processing',
    ],
    correctIndex: 1,
    explanation:
      'A Dead Letter Queue (DLQ) is a special queue where messages that could not be successfully processed after a specified number of attempts (retries) are placed. This prevents blocking the main queue and avoids losing problematic messages. The team can later analyze the DLQ, identify the cause of errors, and re-send the messages after fixing the issue. The DLQ is a critical element of fault-tolerant EDA.',
  },
  {
    id: 'sd-event-driven-004',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What does idempotency of event processing mean?',
    options: [
      'An event can only be sent to a single consumer',
      'Reprocessing the same event produces the same result as the first time it was processed',
      'Each event is processed exactly once with no possibility of repetition',
      'A consumer can only process events in the order they arrive',
    ],
    correctIndex: 1,
    explanation:
      'Idempotency is a property of an operation in which applying it multiple times with the same parameters yields the same result as applying it once. In EDA this is critically important because messages may be delivered more than once (at-least-once delivery). Typical approaches: storing processed event IDs in a database, using idempotency keys, and versioning state.',
  },
  {
    id: 'sd-event-driven-005',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'How does a domain event differ from an integration event?',
    options: [
      'A domain event is always synchronous, while an integration event is asynchronous',
      'A domain event describes a fact within a bounded context and has business meaning, while an integration event is intended for communication between services',
      'Domain events are stored only in memory, while integration events are stored in a database',
      'Domain events contain no data, only the identifier of the action that occurred',
    ],
    correctIndex: 1,
    explanation:
      'A domain event is a record of a significant fact within a specific bounded context. For example, OrderPlaced, PaymentReceived. It has a clear business meaning and belongs to the domain model. An integration event is used for communication between different bounded contexts / services. It may result from a domain event, but contains only the information that external consumers need and does not expose the internal model.',
  },
  {
    id: 'sd-event-driven-006',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'open',
    question:
      'Describe the advantages of event-driven architecture over synchronous interaction between services. Name at least three advantages.',
    sampleAnswer:
      '1) Loose coupling: producers do not know about consumers, which allows services to be added, removed, and changed independently. 2) Scalability: consumers can process events in parallel and scale independently. 3) Fault tolerance: if a consumer is temporarily unavailable, events are stored in the broker and processed after recovery. 4) Flexibility: a new consumer can be added for already existing events without modifying the producer. 5) Load buffering: the broker smooths out load spikes.',
    explanation:
      'EDA makes it possible to build distributed systems that better tolerate failures, scale more easily, and evolve more simply. However, this approach also has drawbacks: debugging complexity (tracing events across multiple services), eventual consistency, and the need to ensure idempotency and ordering of events.',
  },
  {
    id: 'sd-event-driven-007',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is Event Sourcing?',
    options: [
      'A pattern in which the current state of an object is reconstructed by sequentially replaying all events that have happened to it',
      'A mechanism for subscribing multiple consumers to a single event via fan-out',
      'A method of filtering events at the broker level before sending them to consumers',
      'A strategy for caching events to speed up reprocessing',
    ],
    correctIndex: 0,
    explanation:
      'Event Sourcing is a pattern in which, instead of storing the current state of an object in a database, the full sequence of events (event log) that led to that state is saved. The current state is reconstructed by "replaying" all events. Advantages: complete auditability, the ability to reproduce any past state, and natural integration with EDA. Drawbacks: complexity of querying the current state, storage growth, and the need for snapshots for optimization.',
  },
  {
    id: 'sd-event-driven-008',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Which pattern separates the read and write models of data, allowing each to be optimized independently?',
    options: [
      'Saga Pattern',
      'Outbox Pattern',
      'CQRS (Command Query Responsibility Segregation)',
      'Event Mesh',
    ],
    correctIndex: 2,
    explanation:
      'CQRS (Command Query Responsibility Segregation) is a pattern that separates read operations (Query) and write operations (Command) at the model level. The write model is optimized for handling commands and business logic, while the read model is optimized for fast queries (it can be denormalized and use a separate datastore). It is often used together with Event Sourcing: events from the write model are projected into the read model. This improves performance and scalability but increases system complexity.',
  },
  {
    id: 'sd-event-driven-009',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'How does orchestration differ from choreography in the Saga pattern?',
    options: [
      'Orchestration uses synchronous calls, while choreography uses asynchronous ones',
      'Orchestration involves a central coordinator that manages the saga steps, while choreography involves decentralized interaction through events',
      'Orchestration is used only for monoliths, while choreography is used only for microservices',
      'Orchestration guarantees strong consistency, while choreography does not',
    ],
    correctIndex: 1,
    explanation:
      'In orchestration (orchestration-based saga) there is a central coordinator (orchestrator) that sequentially calls the saga participants and manages the flow. It knows about all the steps and compensating actions. In choreography (choreography-based saga), each service independently reacts to events and publishes its own; there is no central coordinator. Orchestration is easier to understand and debug but creates a single point of failure. Choreography provides better coupling, but the flow is harder to track.',
  },
  {
    id: 'sd-event-driven-010',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is the Outbox Pattern used for?',
    options: [
      'For caching events before sending them to consumers in order to reduce load on the broker',
      'For guaranteeing the atomic recording of changes to the database and the publishing of an event, without losing data on failures',
      'For routing events to different topics depending on their content',
      'For deduplicating events on the consumer side',
    ],
    correctIndex: 1,
    explanation:
      'The Outbox Pattern solves the "dual write" problem: when you need to atomically save data to the database and publish an event to the broker. Without the pattern, a situation is possible where the data is saved but the event is lost (or vice versa). The solution: instead of sending the event directly, it is written to an outbox table within the same transaction as the business data. A separate process (a polling publisher or CDC — Change Data Capture, for example Debezium) reads the outbox and publishes events to the broker. This guarantees at-least-once delivery.',
  },
  {
    id: 'sd-event-driven-011',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Which approach to event schema evolution allows new fields to be added without breaking compatibility with existing consumers?',
    options: [
      'Strict Schema — a complete prohibition on changing the schema after publication',
      'Backward-compatible evolution with optional fields and a Schema Registry',
      'Full schema replacement with a forced update of all consumers',
      'Dual publishing of the event in both the old and new formats simultaneously',
    ],
    correctIndex: 1,
    explanation:
      'Backward-compatible evolution is the primary approach to event schema evolution. New fields are added as optional; old fields are not removed and do not change their type. A Schema Registry (for example, Confluent Schema Registry with Avro/Protobuf/JSON Schema) automatically checks compatibility when registering a new schema version. There are compatibility levels: backward (a new consumer reads old events), forward (an old consumer reads new events), full (both directions).',
  },
  {
    id: 'sd-event-driven-012',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question:
      'Explain what eventual consistency is and why it is inevitable in event-driven systems. How can its negative impact on user experience be minimized?',
    sampleAnswer:
      'Eventual consistency is a consistency model in which the system guarantees that all data replicas will eventually converge to a single state, but at any given moment the data may be inconsistent. In EDA it is inevitable because events are processed asynchronously: after an event is published, changes in the read model occur with a delay. Ways to minimize the impact: 1) Read-your-writes: after a write, redirect the user to read from the write model. 2) Optimistic UI: show the expected result before confirmation. 3) Notifications: inform the user about the processing status (WebSocket, polling). 4) Causal consistency: guarantee the order of processing of dependent events.',
    explanation:
      'Eventual consistency is a fundamental trade-off in distributed systems (the CAP theorem). In EDA systems it is important to design the UX with asynchrony in mind: use patterns like "order accepted for processing" instead of "order created", provide status-tracking mechanisms, and handle conflicts.',
  },
  {
    id: 'sd-event-driven-013',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question:
      'What is the Saga pattern? Explain how it ensures data consistency in a distributed system in the absence of distributed transactions. Provide an example.',
    sampleAnswer:
      'A Saga is a pattern for managing distributed transactions that replaces a single ACID transaction with a sequence of local transactions in different services. Each step has a compensating transaction that is executed on failure. Example: placing an order — 1) The order service creates the order (compensation: cancel the order). 2) The payment service charges the funds (compensation: refund the funds). 3) The inventory service reserves the item (compensation: release the reservation). 4) The delivery service creates a shipment. If step 3 fails, the compensations are executed in reverse order: refund the funds → cancel the order. A Saga provides eventual consistency rather than strict ACID.',
    explanation:
      'The Saga is one of the key patterns in microservice architecture. Implementing it correctly requires careful design of compensating actions, handling of timeouts, and ensuring idempotency of each step. The two implementation approaches — orchestration and choreography — have their own trade-offs in complexity and coupling.',
  },
  {
    id: 'sd-event-driven-014',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question:
      'Compare the message delivery models: at-most-once, at-least-once, and exactly-once. Which one is the most realistic for distributed systems and why?',
    sampleAnswer:
      'At-most-once: the message is delivered no more than once; loss is possible. The producer sends and does not wait for confirmation (fire-and-forget). At-least-once: the message is delivered at least once; duplicates are possible. The producer retries sending if no confirmation is received. At-least-once is the most realistic and common model, because true exactly-once in a distributed system is practically impossible (the Two Generals Problem). Exactly-once semantics is achieved through at-least-once delivery + idempotent processing on the consumer side (effectively-once). Kafka Streams and Apache Flink implement exactly-once through transactions and idempotent producers within their own ecosystem.',
    explanation:
      'Choosing the delivery guarantee is a key architectural decision. At-most-once is suitable for metrics and logs, where losing individual messages is acceptable. At-least-once + idempotency is the standard for business-critical operations. "Exactly-once" in broker marketing usually means "effectively-once" within a specific platform.',
  },
  {
    id: 'sd-event-driven-015',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'What is an Event Mesh and how does it differ from a simple Event Broker?',
    options: [
      'An Event Mesh is a caching layer on top of an Event Broker to speed up delivery',
      'An Event Mesh is a network of interconnected Event Brokers that provides routing of events across different environments, clouds, and regions',
      'An Event Mesh is a pattern for organizing event storage in a file system',
      'Event Mesh and Event Broker are synonyms for the same technology',
    ],
    correctIndex: 1,
    explanation:
      'An Event Mesh is an architectural layer consisting of a network of interconnected event brokers that dynamically routes events between applications, cloud providers, environments (dev/staging/prod), and data centers. Unlike a single broker, an event mesh provides global routing, protocol translation (MQTT, AMQP, REST), and fault tolerance at the infrastructure level. Examples: Solace PubSub+ Event Mesh, Confluent Platform with Multi-Region Clusters.',
  },
  {
    id: 'sd-event-driven-016',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Which strategy in Event Sourcing solves the problem of long state reconstruction when there is a large number of events?',
    options: [
      'Event Compaction — deleting all events and keeping only the latest state',
      'Snapshotting — periodically saving the aggregated state, from which replaying of subsequent events begins',
      'Event Batching — grouping several events into one aggregated event',
      'Parallel Replay — replaying all events in parallel across multiple threads',
    ],
    correctIndex: 1,
    explanation:
      'Snapshotting is a key optimization in Event Sourcing. Instead of replaying all events from the beginning of the aggregate\'s life, the system periodically (for example, every N events) saves a "snapshot" of the current state. During reconstruction, the latest snapshot is loaded and only the events after it are replayed. This dramatically reduces reconstruction time — from O(n) for all events to O(1) for the snapshot + O(k) for the remaining events. Important: the snapshot is an optimization; the event log remains the source of truth.',
  },
  {
    id: 'sd-event-driven-017',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question:
      'How do you implement the Outbox Pattern using Change Data Capture (CDC)? Describe the architecture, components, and guarantees that this approach provides.',
    sampleAnswer:
      'Architecture: 1) The service writes the business data and the event to an outbox table in a single database transaction. 2) A CDC connector (for example, Debezium) connects to the database\'s WAL (Write-Ahead Log) / binlog and tracks changes in the outbox table. 3) Each new record in the outbox is automatically captured by CDC and published to a Kafka topic. 4) Consumers subscribe to the topic and process the events. Components: PostgreSQL/MySQL (the database with the outbox table), Debezium (the CDC connector), Apache Kafka Connect (the infrastructure), Kafka (the broker). Guarantees: atomicity (the event and the data are in a single transaction), at-least-once delivery (CDC guarantees the capture of all changes from the WAL), low latency (CDC reads the WAL almost in real time, without polling). The consumer must be idempotent.',
    explanation:
      'The CDC-based Outbox Pattern is a production-grade solution used at Netflix, Uber, and Airbnb. Debezium + Kafka Connect is the de facto standard. An alternative is a polling publisher (SELECT from the outbox on a schedule), but CDC is more efficient because it does not load the database with queries and provides lower latency.',
  },
  {
    id: 'sd-event-driven-018',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question:
      'Design an order processing system based on Event Sourcing and CQRS. Describe the main aggregates, events, read models, and data flows.',
    sampleAnswer:
      'Order aggregate: manages the order lifecycle. Events: OrderCreated(orderId, items, customerId), OrderPaymentReceived(orderId, paymentId, amount), OrderItemReserved(orderId, itemId), OrderShipped(orderId, trackingNumber), OrderCancelled(orderId, reason). Write model: the Event Store holds all events. The Order aggregate is loaded from events, applies business rules (you cannot pay for a cancelled order), and generates new events. Read models (projections): 1) OrderSummaryView — a denormalized table for quickly displaying the list of orders. 2) OrderDetailView — full information about an order with its status history. 3) CustomerOrdersView — a customer\'s orders for their personal dashboard. 4) AnalyticsView — aggregated data for analytics. Flows: Command → Aggregate → Event Store → Event Bus → Projectors → Read Models. Projectors subscribe to the event stream and update the corresponding read models. The Read API queries the denormalized read models.',
    explanation:
      'Event Sourcing + CQRS is a powerful combination for complex domains. Key decisions: choice of Event Store (EventStoreDB, Kafka, PostgreSQL), projection strategy (synchronous/asynchronous), handling of projection errors (replay, dead letter), and snapshots for aggregates with a large number of events.',
  },
  {
    id: 'sd-event-driven-019',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question:
      'How do you ensure strict event processing order in a distributed system with multiple partitions in Kafka? What trade-offs arise?',
    sampleAnswer:
      'Kafka guarantees event order only within a single partition. Strategies for ensuring order: 1) Partitioning by key: all events for a single entity (for example, orderId) are routed to the same partition via a partition key. This guarantees order for a specific aggregate. 2) Single partition: use a single partition for the entire topic — order is global, but throughput is severely limited (a single consumer). 3) Sequence numbers: each event contains a sequence number; the consumer detects gaps and waits for the missing events. 4) Causal ordering: include a reference to the previous event (causation ID) in the event; the consumer builds the chain. Trade-offs: strict order limits parallelism (only one consumer per partition), increases latency (waiting for missing events), and complicates rebalancing. The optimal approach is ordering at the entity-key level rather than global ordering.',
    explanation:
      'Ordering is one of the most difficult problems in EDA. In real-world systems, global ordering is usually not needed — ordering for a specific entity is sufficient. Kafka with a partition key by entity ID is the standard solution. During consumer rebalancing it is important to consider that a new consumer must "catch up" to the current offset before processing new messages.',
  },
  {
    id: 'sd-event-driven-020',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'What problem arises when using Event Sourcing if you need to change the structure of already stored events?',
    options: [
      'The inability to add new event types to the system',
      'Event upcasting — the need to transform old events to the new schema during replay, which requires support for versioning and schema migration',
      'Automatic deletion of all events when the schema changes',
      'The inability to create a snapshot before all events are updated',
    ],
    correctIndex: 1,
    explanation:
      'Event upcasting is the process of transforming events from an old schema version to a new one "on the fly" when loading them from the Event Store. Since events are immutable, we cannot rewrite history. Approaches: 1) Upcasters — transformers that convert v1 → v2 → v3 during loading. 2) Lazy migration — the event stores its version number, and the aggregate knows how to handle all versions. 3) Copy-transform — creating a new stream with transformed events (expensive). A Schema Registry helps control compatibility, but upcasting remains the application\'s responsibility.',
  },
  {
    id: 'sd-event-driven-021',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is Event Storming and what is it used for?',
    options: [
      'A load testing technique for event-driven systems',
      'A workshop technique for collaboratively modeling business processes through the identification of domain events',
      'A method of protecting against DDoS attacks on a message broker',
      'A load balancing algorithm among consumers',
    ],
    correctIndex: 1,
    explanation:
      'Event Storming is an interactive modeling technique developed by Alberto Brandolini. Participants (developers, business experts) write events on sticky notes on a large wall in chronological order. Elements: Events (orange, past tense — OrderPlaced), Commands (blue — PlaceOrder), Aggregates (yellow), Policies (purple — when...then), External Systems, Read Models. The result: a shared understanding of the domain, identification of bounded contexts, and a foundation for Event Sourcing and CQRS.',
  },
  {
    id: 'sd-event-driven-022',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'How does a notification event differ from event-carried state transfer?',
    options: [
      'A notification event contains full data, while event-carried state transfer contains only the ID',
      'A notification event reports a fact with minimal data, while event-carried state transfer contains full data to update state without an additional request',
      'A notification event is asynchronous, while event-carried state transfer is synchronous',
      'These are synonyms for the same pattern',
    ],
    correctIndex: 1,
    explanation:
      'Notification event: "OrderCreated {orderId: 123}" — notifies about a fact; the consumer requests the details via the API if needed. Minimal payload, but coupling through the API. Event-carried state transfer: "OrderCreated {orderId: 123, items: [...], total: 500, customer: {...}}" — everything needed is in the event. The consumer updates its local copy of the data without requests. Less coupling, but a larger payload and more complexity in maintaining compatibility. The choice depends on the use case.',
  },
  {
    id: 'sd-event-driven-023',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'open',
    question: 'What is backpressure in event-driven systems? How do you deal with it?',
    sampleAnswer:
      'Backpressure occurs when a producer generates events faster than a consumer can process them. Signs: growing consumer lag, increasing latency, queue overflow. Strategies: 1) Buffering — increase queue size (a temporary solution). 2) Dropping — discard events on overflow (for non-critical data). 3) Sampling — process only a portion of the events. 4) Producer throttling — slow down the producer (signal via backpressure). 5) Scaling consumers — add instances, increase partitions. 6) Batching — process events in batches. Reactive Streams (Java), Kafka consumer pause/resume, RabbitMQ prefetch are backpressure mechanisms. Monitoring consumer lag is a key indicator.',
    explanation:
      'Backpressure is a fundamental problem of asynchronous systems. Without backpressure management, the system fails under load spikes. Kafka consumer lag is the canonical metric: if lag grows, the system is not keeping up.',
  },
  {
    id: 'sd-event-driven-024',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is a consumer group in Apache Kafka?',
    options: [
      'A group of topics combined by business domain',
      'A group of consumers that jointly process the partitions of a topic: each partition is assigned to only one consumer in the group',
      'An administrative group for managing the cluster',
      'A set of message filtering rules',
    ],
    correctIndex: 1,
    explanation:
      'A consumer group is the parallel processing mechanism in Kafka. Consumers with the same group.id form a group. Kafka assigns partitions among them: each partition is read by exactly one consumer in the group. When a consumer is added/removed, a rebalance occurs. If there are more consumers than partitions, the extra ones stay idle. Different consumer groups read the data independently (each with its own offset). This provides scalable processing and the multiple-consumers pattern.',
  },
  {
    id: 'sd-event-driven-025',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is Complex Event Processing (CEP)?',
    options: [
      'Encrypting events before sending them',
      'A technology for analyzing event streams in real time to detect patterns, correlations, and anomalies',
      'Compressing events to save space',
      'A mechanism for replicating events between data centers',
    ],
    correctIndex: 1,
    explanation:
      'Complex Event Processing (CEP) is the analysis of event streams to detect complex patterns. Operations: filtering, aggregation, windowing (time windows), pattern matching (A → B → C within 5 minutes), correlation of events from different sources. Examples: fraud detection (3 transactions from different countries within a minute), IoT alerting (temperature > 100°C for 5 minutes), algorithmic trading. Tools: Apache Flink, Kafka Streams, Esper, AWS Kinesis Data Analytics. CEP requires stateful processing and checkpointing for fault tolerance.',
  },
  {
    id: 'sd-event-driven-026',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'How do you handle event versioning for backward-incompatible changes?',
    options: [
      'Always delete old event versions',
      'Create a new topic/event type with a version (OrderCreatedV2), publishing both versions in parallel during a transition period',
      'Stop all consumers in order to update',
      'Use only forward-compatible changes',
    ],
    correctIndex: 1,
    explanation:
      'For breaking changes in an event schema: 1) New event type: OrderCreatedV2 alongside OrderCreated. 2) The producer publishes both events during a transition period. 3) Consumers migrate to V2, after which V1 is deprecated. 4) An alternative is a version in the event metadata (event_version: 2), where the consumer handles both versions. A Schema Registry (Confluent) automates compatibility checks when registering new versions. Compatibility levels: backward, forward, full. Rule: avoid breaking changes by adding optional fields.',
  },
  {
    id: 'sd-event-driven-027',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question: 'Compare pull-based (Kafka) and push-based (RabbitMQ) message delivery models. When should you choose each?',
    sampleAnswer:
      'Pull-based (Kafka): the consumer requests messages itself. Advantages: the consumer controls the rate (backpressure out of the box), replay is possible (read from any offset), batch processing is efficient. Drawbacks: higher latency (polling interval), more complex consumer. Suitable for: high throughput, stream processing, replay/reprocessing. Push-based (RabbitMQ): the broker sends messages to the consumer. Advantages: low latency (instant delivery), simpler consumer. Drawbacks: backpressure is harder (prefetch), no replay (the message is deleted after ack). Suitable for: task queues, RPC, when low latency is critical. Hybrid: Kafka with a reactive consumer (blocking poll) reduces latency. Choice: Kafka for data pipelines and event sourcing, RabbitMQ for traditional messaging and job queues.',
    explanation:
      'Kafka and RabbitMQ are different tools for different tasks. Kafka is a distributed log for event streaming. RabbitMQ is a message broker for task distribution. The modern trend: Kafka as a universal platform, RabbitMQ for legacy integrations.',
  },
  {
    id: 'sd-event-driven-028',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question: 'How do you implement the Transactional Outbox pattern without CDC? Describe the polling publisher approach.',
    sampleAnswer:
      'A Polling Publisher is an alternative to CDC for the Outbox Pattern. Implementation: 1) An outbox table in the database: id, aggregate_type, aggregate_id, event_type, payload, created_at, published_at (nullable). 2) The business transaction writes the data and the event to the outbox atomically. 3) A publisher process (separate or within the application) periodically (every N seconds) executes: SELECT * FROM outbox WHERE published_at IS NULL ORDER BY created_at LIMIT 100. 4) Publishes the events to the broker. 5) Updates published_at (or deletes the records). Nuances: exactly-once — if a failure occurs between publish and update there will be duplicates → the consumer must be idempotent. Ordering: ORDER BY + sequential processing, or a partition key for parallelism. Cleanup: periodic deletion of old records.',
    explanation:
      'A polling publisher is simpler than CDC (no Debezium needed) but less efficient (database load from polling, higher latency). For simple systems it is a good start. As they grow — migrate to CDC. Microservices Patterns (Chris Richardson) describes both approaches in detail.',
  },
  {
    id: 'sd-event-driven-029',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is event replay and what is it used for?',
    options: [
      'Re-sending an event on a network error',
      'Reprocessing historical events from an Event Store or topic to reconstruct state, migrate, or fix errors',
      'Caching events for fast access',
      'Replicating events between clusters',
    ],
    correctIndex: 1,
    explanation:
      'Event replay is the replaying of events from storage. Use cases: 1) Reconstructing aggregate state in Event Sourcing (load all events, apply). 2) Rebuilding read models: when a projection schema changes, re-read all events. 3) Bug fix: a bug in a handler was fixed — replay to correct the data. 4) New consumer: a new service subscribes and reads the history. 5) Testing: replay production events in staging. Requirements: events are immutable, idempotent processing, retention of sufficient history. Kafka retention, EventStoreDB, and a custom event store provide replay capability.',
  },
  {
    id: 'sd-event-driven-030',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is a Choreography-based Saga and what advantages does it have over Orchestration?',
    options: [
      'Choreography is faster because it does not use the network',
      'In choreography there is no central coordinator: each service reacts to events and publishes its own, which provides better decoupling and the absence of a single point of failure',
      'Choreography supports only two participants',
      'Choreography is easier to debug',
    ],
    correctIndex: 1,
    explanation:
      'Choreography-based Saga: services communicate only through events. OrderService publishes OrderCreated → PaymentService listens, processes, publishes PaymentProcessed → InventoryService listens, reserves, publishes InventoryReserved → ... Advantages: loose coupling (services do not know about each other), no single point of failure, better scalability. Drawbacks: harder to understand the full flow (it is distributed across services), harder to debug, cyclic dependencies are possible. Orchestration is easier to understand, but the orchestrator is a bottleneck. Choice: simple sagas (3-4 steps) — choreography, complex ones — orchestration.',
  },
  {
    id: 'sd-event-driven-031',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is a projection in the context of Event Sourcing and CQRS?',
    options: [
      'Forecasting future events based on ML',
      'A function that transforms a stream of events into an optimized read model (view) for queries',
      'A projection of a database onto another server',
      'Encrypting events during storage',
    ],
    correctIndex: 1,
    explanation:
      'A projection is the process of building a read model from a stream of events. A projector subscribes to events and updates a denormalized representation. Example: the events OrderCreated, ItemAdded, OrderShipped → OrderSummaryView (a table with the current order status). Types: sync projection (in the same transaction — strong consistency), async projection (a separate process — eventual consistency). Rebuild: when the projection logic changes — replay all events. Checkpoint: the projection saves the last processed event position for recovery.',
  },
  {
    id: 'sd-event-driven-032',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you achieve exactly-once semantics in Kafka? Describe the transactional producer and idempotent consumer mechanisms.',
    sampleAnswer:
      'Exactly-once in Kafka (Kafka Streams, the Transactional API): 1) Idempotent Producer: enable.idempotence=true. Kafka assigns a producer ID and sequence numbers. On retry, duplicate messages are discarded by the broker. This guarantees exactly-once per partition. 2) Transactional Producer: the transaction spans multiple partitions. initTransactions() → beginTransaction() → send() → sendOffsetsToTransaction() → commitTransaction(). The consumer reads only committed messages (isolation.level=read_committed). 3) Kafka Streams: exactly-once between read and write via processing.guarantee=exactly_once. It works within the Kafka ecosystem. 4) Idempotent Consumer: for external systems — deduplication by event ID in the consumer\'s database (INSERT ON CONFLICT DO NOTHING). Important: exactly-once is effectively-once (at-least-once + idempotency/transactions). True exactly-once between distributed systems is impossible.',
    explanation:
      'Exactly-once is a marketing term, but Kafka Transactions genuinely provide atomic read-process-write. For systems outside Kafka (DB, external API) an idempotent consumer is required. The Confluent documentation describes the guarantees and limitations in detail.',
  },
  {
    id: 'sd-event-driven-033',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Describe the Event-Driven Microservices pattern. How do you separate bounded contexts and define event contracts?',
    sampleAnswer:
      'Event-Driven Microservices: services communicate primarily through asynchronous events. Defining a Bounded Context: 1) Event Storming to identify domains and events. 2) Grouping events by ubiquitous language — different terms = different contexts. 3) Context Mapping: define relationships (customer/supplier, conformist, anticorruption layer). Event contracts: 1) Event Schema: the event structure in JSON Schema, Avro, Protobuf. 2) Schema Registry: centralized storage and versioning of schemas. 3) Consumer-Driven Contracts: the consumer defines the minimal required fields, and the producer commits to providing them (Pact, Spring Cloud Contract). 4) Event Catalog: documentation of all events (the AsyncAPI specification). 5) Compatibility rules: backward/forward compatible changes. Integration Events vs Domain Events: integration events are the public contract between contexts, domain events are internal.',
    explanation:
      'Event-driven microservices require discipline in managing contracts. Without a Schema Registry and compatibility checks — integration hell. AsyncAPI is the standard for documenting event-driven APIs, the analog of OpenAPI for async.',
  },
  {
    id: 'sd-event-driven-034',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is the fan-out pattern in event-driven systems?',
    options: [
      'Combining several events into one',
      'Delivering a single event to many independent consumers for parallel processing',
      'Sequential processing of events',
      'Filtering events by criteria',
    ],
    correctIndex: 1,
    explanation:
      'Fan-out is a pattern in which a single event is delivered to several independent consumers. Each consumer processes the event in its own way. Example: OrderCreated → NotificationService (email), AnalyticsService (statistics), InventoryService (reservation), RecommendationService (ML). Implementation: Kafka — different consumer groups, RabbitMQ — a fanout exchange, SNS → multiple SQS. Fan-out provides loose coupling — the producer does not know about the consumers, and adding a new consumer does not require changes to the producer.',
  },
  {
    id: 'sd-event-driven-035',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is event enrichment and when should it be used?',
    options: [
      'Compressing events to save space',
      'Adding additional data to an event from external sources before delivering it to the consumer',
      'Encrypting the event payload',
      'Removing unnecessary fields from an event',
    ],
    correctIndex: 1,
    explanation:
      'Event enrichment is the augmentation of an event with additional data. Example: OrderCreated {userId: 123} → an enricher adds the user data from the User Service → OrderCreated {userId: 123, userName: "John", userTier: "gold"}. Implementation: an enrichment service between the producer and consumer, or in Kafka Streams (a join with a KTable). Use: the consumer needs data that is not in the original event; reducing coupling (the consumer does not call the User Service). Caution: the enricher adds latency, a dependency on an external service, and stale data is possible.',
  },
  {
    id: 'sd-event-driven-036',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question: 'How do you test event-driven systems? Describe unit, integration, and contract testing strategies.',
    sampleAnswer:
      'Testing event-driven systems: 1) Unit tests: testing event handlers in isolation. Mock event → handler → assert state change / published events. For Event Sourcing: given events → when command → then events. 2) Integration tests: testing with a real broker. Testcontainers to spin up Kafka/RabbitMQ. Publish event → wait → assert the consumer processed it. Challenges: asynchrony (await/polling), timing. 3) Contract tests: Consumer-Driven Contracts (Pact). The consumer defines the expected event structure. The producer verifies that it generates compatible events. Protection against breaking changes. 4) E2E tests: the full flow across several services. Difficult, but necessary for critical paths. 5) Chaos testing: simulating broker failures, consumer lag, duplicates. Tools: Pact, Spring Cloud Contract (schema compatibility), ArchUnit (architecture rules).',
    explanation:
      'Testing EDA is harder than synchronous systems due to asynchrony and distribution. Contract tests are critically important — they prevent integration issues. Event Storming → scenario-based tests ensure coverage of business scenarios.',
  },
  {
    id: 'sd-event-driven-037',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is temporal coupling and how does event-driven architecture help avoid it?',
    options: [
      'Coupling services by the time of their deployment',
      'A dependency in which all participants must be available simultaneously to perform an operation; EDA eliminates this through asynchrony and buffering',
      'Tying events to a specific time of day',
      'Synchronizing clocks between services',
    ],
    correctIndex: 1,
    explanation:
      'Temporal coupling is a form of coupling in which components must be available at the same time. Synchronous call: Service A → HTTP → Service B. If B is unavailable, A cannot work. Event-driven: A publishes an event to the broker → B processes it when available. The broker buffers events. A and B are temporally decoupled — they work independently. This increases resilience: partial failures do not cascade, and systems can "catch up" after recovery. Trade-off: eventual consistency instead of strong consistency.',
  },
  {
    id: 'sd-event-driven-038',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you design a notification system based on event-driven architecture? Describe the key components.',
    sampleAnswer:
      'A notification system on EDA: 1) Event Sources: various services publish business events (OrderShipped, PaymentFailed, PasswordChanged). 2) Notification Router: subscribes to events, determines which notifications to send based on rules (OrderShipped → email + push, PaymentFailed → SMS + email). User preferences are taken into account. 3) Channel Services: separate services for each channel (EmailService, SMSService, PushService). Each listens to notification requests from its own queue. 4) Template Engine: notification templates with localization. 5) Delivery Tracking: delivery status (sent, delivered, failed), retry for failed ones. 6) Rate Limiting: protection against spam (no more than N notifications per hour). 7) Aggregation: grouping notifications (5 new messages instead of 5 separate ones). A DLQ for failed notifications, monitoring of delivery rates per channel.',
    explanation:
      'A notification system is a classic use case for EDA. Decoupling from business services through events, independent scaling of channels, resilience to failures of external providers (email/SMS). Twilio and SendGrid serve as managed channel providers.',
  },
  {
    id: 'sd-event-driven-039',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Explain the concept of an event-driven data mesh. How are events related to data products?',
    sampleAnswer:
      'Data Mesh (Zhamak Dehghani) is a decentralized data architecture. Principles: domain ownership (data is owned by domains), data as a product, self-serve platform, federated governance. Event-driven in a Data Mesh: 1) Events as data products: a stream of events is a domain\'s data product. The OrderDomain publishes an OrderEvents stream as a data product with an SLA, schema, and documentation. 2) Event streaming platform: Kafka as self-serve infrastructure for data products. Domains create topics, consumers subscribe. 3) Real-time data products: events → stream processing (Flink) → materialized views, aggregations as data products. 4) Event catalog: discovery of all event streams (schema registry + metadata). 5) Governance: standards for events (naming, schema evolution), quality metrics. Events provide decoupling between data producers and consumers in a data mesh.',
    explanation:
      'Data Mesh + Event-Driven is a powerful combination for data-intensive organizations. Events are a natural fit for real-time data products. Confluent actively promotes event streaming as the foundation of a data mesh.',
  },
  {
    id: 'sd-event-driven-040',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is event-driven serverless and which AWS services support it?',
    options: [
      'Serverless only for handling HTTP requests',
      'An architecture in which serverless functions are triggered by events from various sources; AWS: Lambda + EventBridge + SQS + SNS + Kinesis',
      'Using servers to process events',
      'Serverless databases',
    ],
    correctIndex: 1,
    explanation:
      'Event-driven serverless: functions run in response to events, and you pay only for execution time. AWS stack: Lambda — compute, EventBridge — event bus (routing, filtering, transformation), SQS — queue (buffering, DLQ), SNS — pub/sub (fan-out), Kinesis — streaming (high throughput, ordering), DynamoDB Streams — CDC for DynamoDB, S3 Events — reaction to upload. Patterns: EventBridge → Lambda (event routing), SQS → Lambda (decoupling, retry), Kinesis → Lambda (stream processing). Step Functions — orchestration for sagas. Advantages: auto-scaling, no infrastructure management, pay-per-use.',
  },
  {
    id: 'sd-event-driven-041',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'open',
    question: 'What is a message and how does it differ from an event? Provide examples.',
    sampleAnswer:
      'A message is a general term for data transmitted between components. An event is a type of message describing a fact that has occurred (past tense). Differences: Event: a fact (OrderCreated), immutable, no response expected, many consumers. Command: an instruction (CreateOrder), directed to a specific recipient, expects execution. Query: a data request (GetOrder), expects a response. Events vs Commands: an Event is "the order was created" (informing), a Command is "create the order" (a directive). Events are published without knowledge of the consumers (fire-and-forget); commands are addressed to a specific service. Events are stored for replay; commands usually are not. In CQRS: Commands change state, Events are the result of the change, Queries are reads.',
    explanation:
      'Distinguishing events, commands, and queries is the foundation for correctly modeling EDA. An event is what happened (a fact). A command is what needs to be done. Mixing them leads to tight coupling.',
  },
  {
    id: 'sd-event-driven-042',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is the competing consumers pattern?',
    options: [
      'Competition among producers for publishing to a topic',
      'A pattern where several consumers process messages from a single queue in parallel, and each message is processed by exactly one consumer',
      'Consumers compete for the right to subscribe',
      'Different consumer groups compete for messages',
    ],
    correctIndex: 1,
    explanation:
      'Competing consumers — several instances of a single consumer process a queue in parallel for scaling. Each message is delivered to exactly one consumer (unlike fan-out). Implementation: RabbitMQ — several consumers on one queue, Kafka — a consumer group with partition assignment. Challenges: 1) Ordering — messages are processed out-of-order (different consumers). 2) Visibility timeout — what if a consumer crashes before ack? Patterns: message locking, acknowledge after processing. Used for: task queues, job processing, work distribution.',
  },
  {
    id: 'sd-event-driven-043',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is event-carried state transfer vs event notification?',
    options: [
      'Event notification contains the full data of the object',
      'Event-carried state transfer includes the full data to update a local copy; event notification only signals a change, requiring a callback to obtain the data',
      'Event notification is for synchronous communication, event-carried state transfer is for asynchronous',
      'They are identical in structure',
    ],
    correctIndex: 1,
    explanation:
      'Event notification: {type: "CustomerUpdated", customerId: 123}. The consumer calls the Customer API if it needs the data. Pros: small payload, always fresh data. Cons: runtime coupling to the source service. Event-carried state transfer: {type: "CustomerUpdated", customerId: 123, name: "John", email: "john@example.com", tier: "gold"}. The consumer updates its local copy. Pros: no runtime coupling, works when the source is unavailable. Cons: large payload, stale data possible, schema evolution is harder. The choice depends on the requirements for coupling and data freshness.',
  },
  {
    id: 'sd-event-driven-044',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you implement distributed tracing in an event-driven system? What are the challenges?',
    sampleAnswer:
      'Distributed tracing in EDA: propagating the trace context through messages. Implementation: 1) Producer: adds a traceparent header to the message (W3C Trace Context or custom). 2) Message broker: preserves the headers. Kafka, RabbitMQ, and SQS support message attributes/headers. 3) Consumer: extracts the trace context and creates a child span with the parent from the message. Challenges: 1) Async nature: a trace can last hours (a message sits in a queue). 2) Fan-out: one message → several traces. Use links instead of parent-child. 3) Batching: one trace for the batch or separate ones? 4) Retry: do not create a new trace on retry. 5) DLQ: how to link a DLQ message to the original trace. OpenTelemetry: messaging semantic conventions, context propagation APIs. Tools: Jaeger, Zipkin support async patterns, but visualization is a challenge — long traces.',
    explanation:
      'Tracing in EDA is harder than synchronous because of decoupling in time. OpenTelemetry messaging instrumentation automates propagation for popular clients. Important: do not lose the trace context during error handling and DLQ processing.',
  },
  {
    id: 'sd-event-driven-045',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Why is a retention period needed for events in Kafka?',
    options: [
      'To encrypt old events',
      'To determine how long events are stored in a topic, allowing replay and new consumers to read the history',
      'To limit the write rate',
      'To compress events',
    ],
    correctIndex: 1,
    explanation:
      'The retention period in Kafka determines how long messages are stored in a topic. The default is 7 days. Settings: retention.ms (time), retention.bytes (size). Why: 1) Replay — reprocessing events for bugs, migrations. 2) New consumers — a new service reads the history from the beginning. 3) Recovery — restoring after a consumer failure. Compacted topics: instead of time-based retention — keeping the latest value for each key (log compaction). Used for changelogs, reference data. Infinite retention is possible but requires storage planning.',
  },
  {
    id: 'sd-event-driven-046',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question: 'Explain the Event Aggregator pattern. When should you use it?',
    sampleAnswer:
      'An Event Aggregator collects several related events and generates one aggregated event. Use cases: 1) Notification batching: instead of 10 emails about activity — one daily digest. Events are collected over a period, then a summary is sent. 2) Order completion: OrderCreated + PaymentReceived + ItemsPacked + Shipped → OrderCompleted (a summary event). 3) Analytics: raw click events → aggregated session events. Implementation: a stateful processor (Kafka Streams, Flink) with time windows or event correlation. A KTable to store partial state. A timer to emit the aggregated event. Challenges: determining completeness (when have all events been received?), handling late arrivals, state management. The Event Aggregator reduces load on downstream and simplifies consumer logic.',
    explanation:
      'The Event Aggregator is the opposite of fan-out. It is useful for notification systems, analytics, and business process completion. Kafka Streams windowing and Flink CEP are typical tools.',
  },
  {
    id: 'sd-event-driven-047',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is Apache Kafka Connect and what is it used for?',
    options: [
      'A client library for connecting to Kafka',
      'A framework for integrating Kafka with external systems through source and sink connectors without writing code',
      'A tool for monitoring a Kafka cluster',
      'An authentication service for Kafka',
    ],
    correctIndex: 1,
    explanation:
      'Kafka Connect is a framework for integrating Kafka with external systems. Source connectors: import data into Kafka (JDBC Source — from a database, Debezium — CDC). Sink connectors: export from Kafka (JDBC Sink — to a database, S3 Sink, Elasticsearch Sink). Advantages: ready-made connectors (Confluent Hub), no code (JSON configuration), auto-scaling, fault tolerance, exactly-once (with transactions). Standalone mode (a single process) and distributed mode (a cluster). Single Message Transforms (SMT) for simple transformation without Kafka Streams. A typical use case: Debezium CDC → Kafka → Elasticsearch Sink for search.',
  },
  {
    id: 'sd-event-driven-048',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Compare Kafka Streams and Apache Flink for stream processing. When should you choose each?',
    sampleAnswer:
      'Kafka Streams: a library (not a separate cluster), embedded in the application. Pros: simple deployment (a JAR), tight integration with Kafka, no separate cluster management, exactly-once with Kafka transactions. Cons: only Kafka as a source, scaling through application instances. Apache Flink: a distributed stream processing framework, a separate cluster. Pros: multiple sources/sinks (Kafka, Kinesis, files, databases), advanced windowing and CEP, lower latency, a more powerful API (Table API, SQL). Cons: operational complexity (cluster management), separate infrastructure. Choice: a Kafka-centric system, a simple use case → Kafka Streams. Complex processing, multiple sources, sub-second latency → Flink. Hybrid: Kafka Streams for simple transformations, Flink for complex analytics.',
    explanation:
      'Kafka Streams is "serverless stream processing" (no infrastructure), Flink is enterprise-grade with advanced features. Confluent ksqlDB adds a SQL interface to Kafka Streams. Databricks and Spark Streaming are alternatives for batch+stream.',
  },
  {
    id: 'sd-event-driven-049',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is log compaction in Kafka?',
    options: [
      'Compressing logs to save space',
      'A mechanism for keeping only the latest value for each key, turning a topic into a changelog/KTable',
      'Deleting all messages older than the retention period',
      'Merging several partitions into one',
    ],
    correctIndex: 1,
    explanation:
      'Log compaction is an alternative to time-based retention. Kafka keeps the latest message for each key, deleting the previous ones. Example: key=user123 → [{v1}, {v2}, {v3}] compacted to [{v3}]. Tombstone: a message with a null value deletes the key. Use cases: a changelog for state (KTable), reference data (a product catalog), CDC — the latest state of an entity. Configuration: cleanup.policy=compact. Compaction happens in the background, not instantly. Combination: cleanup.policy=compact,delete — compact + deletion by retention.',
  },
  {
    id: 'sd-event-driven-050',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Describe the architecture of a real-time fraud detection system based on event-driven principles.',
    sampleAnswer:
      'Fraud detection architecture: 1) Event Sources: the Payment Gateway publishes TransactionInitiated events to Kafka. 2) Enrichment: a stream processor (Flink) enriches the event: user profile, device fingerprint, historical patterns (joins with KTables). 3) Feature Engineering: computing features in real time — transactions per hour, avg amount, geo velocity. 4) ML Scoring: the event is sent to an ML model service (synchronously for low latency or asynchronously). The model returns a fraud probability. 5) Rules Engine: CEP rules — "3 transactions from different countries within 10 minutes". Flink CEP or custom. 6) Decision: score > threshold → FraudSuspected event → block the transaction, notify. 7) Feedback Loop: FraudConfirmed/FraudDismissed events for model retraining. 8) Storage: all events in a data lake for offline analysis and model training. Requirements: sub-second latency, high throughput, exactly-once (do not block a legitimate transaction twice).',
    explanation:
      'Fraud detection is a showcase for real-time event processing. Stripe and PayPal use event-driven ML pipelines. Latency is critical — a decision within 100ms. Feature stores (Feast, Tecton) speed up feature serving.',
  },
];
