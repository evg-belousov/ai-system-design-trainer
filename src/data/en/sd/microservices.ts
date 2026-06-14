import type { Question } from '@/data/types';

export const microservicesQuestions: Question[] = [
  {
    id: 'sd-ms-001',
    block: 'sd',
    topic: 'microservices',
    topicLabel: 'Microservices',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is the main advantage of microservices architecture over monolith?',
    options: [
      'Microservices always run faster than monolith',
      'Microservices are easier to develop than monolith',
      'Each microservice can be developed, deployed, and scaled independently',
      'Microservices do not require monitoring',
    ],
    correctIndex: 2,
    explanation:
      'The main advantage of microservices architecture is the independence of components. Each service can be developed by a separate team, use an appropriate technology stack, be deployed on its own schedule, and scale according to load. This allows large organizations to move faster. However, microservices introduce significant operational complexity: distributed transactions, network communication, monitoring, debugging, data consistency.',
  },
  {
    id: 'sd-ms-002',
    block: 'sd',
    topic: 'microservices',
    topicLabel: 'Microservices',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is the Circuit Breaker pattern in microservice architecture?',
    options: [
      'A mechanism for routing requests between services',
      'A pattern that prevents cascading failures by stopping calls to an unavailable service',
      'A way to share data between microservices',
      'A tool for automatic service scaling',
    ],
    correctIndex: 1,
    explanation:
      'Circuit Breaker (automatic switch) is a pattern borrowed from electrical engineering. It monitors the number of errors when calling an external service. When errors exceed a threshold, the "switch" opens and subsequent requests immediately return an error without attempting the call (fail fast). After a specified time, the switch transitions to half-open state, allowing a trial request. If successful—the switch closes. This prevents cascading failures, saves resources, and gives time for recovery. Implementations: Netflix Hystrix (deprecated), Resilience4j, Polly.',
  },
  {
    id: 'sd-ms-003',
    block: 'sd',
    topic: 'microservices',
    topicLabel: 'Microservices',
    difficulty: 'senior',
    type: 'open',
    question: 'Describe the Saga pattern for managing distributed transactions in microservice architecture. What types of Saga exist and what are their drawbacks?',
    sampleAnswer:
      'Saga is a pattern for managing distributed transactions, where a long transaction is broken down into a sequence of local transactions across different services. Each local transaction updates data in its service and publishes an event that triggers the next step. Upon error, compensating transactions execute in reverse order. Types: 1) Choreography: each service listens to events and decides what to do next. No central coordinator. Simple for small number of steps, but hard to track overall progress and debug. 2) Orchestration: a central orchestrator manages the sequence of steps, sending commands to services. Logic in one place, easier to track, but orchestrator can become a single point of failure. Saga drawbacks: no isolation (intermediate states visible to other transactions), compensating transactions are difficult to implement (how to "undo" a sent email?), debugging complexity, eventual consistency.',
    explanation:
      'Saga is an alternative to two-phase commit (2PC), which works poorly in microservices due to its blocking nature and coordinator dependency. Example of Saga for an order: 1) Create order -> 2) Reserve item -> 3) Charge payment -> 4) Confirm order. If step 3 fails: compensate step 2 (return item) -> compensate step 1 (cancel order). In practice, used in e-commerce, banking systems, booking platforms.',
  },
  {
    id: 'sd-ms-004',
    block: 'sd',
    topic: 'microservices',
    topicLabel: 'Microservices',
    difficulty: 'middle',
    type: 'open',
    question: 'What is an API Gateway in microservice architecture? What functions does it perform?',
    sampleAnswer:
      'API Gateway is a single entry point for all client requests in microservice architecture. It acts as a reverse proxy, routing requests to appropriate microservices. Main functions: 1) Request routing to needed services based on URL, headers, or content. 2) Authentication and authorization—centralized token verification (JWT, OAuth). 3) Rate limiting—request frequency limitation. 4) Response aggregation—combining data from multiple services. 5) Protocol translation—converting REST to gRPC. 6) Caching at gateway level. 7) Logging and monitoring. 8) SSL termination. Examples: Kong, AWS API Gateway, Nginx, Envoy + Istio.',
    explanation:
      'API Gateway implements the "facade" pattern for microservices. Without it, the client would have to know addresses of all services, manage authentication for each request, and make multiple calls to assemble one page. However, gateway can become a bottleneck and single point of failure, so it must be scaled and highly available.',
  },
  {
    id: 'sd-ms-005',
    block: 'sd',
    topic: 'microservices',
    topicLabel: 'Microservices',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Which pattern allows each microservice to have its own database while maintaining data consistency across services?',
    options: [
      'Shared Database—all services use a common database',
      'Database per Service + Event-Driven Architecture with eventual consistency',
      'Two-Phase Commit (2PC) between all services',
      'Distributed Lock Manager for synchronizing data access',
    ],
    correctIndex: 1,
    explanation:
      'The Database per Service pattern means each microservice owns its data and does not directly access databases of other services. Consistency is provided through event-driven architecture: when data changes, the service publishes an event, other services subscribe and update their local data asynchronously. This ensures eventual consistency. Shared Database violates the isolation principle, 2PC scales poorly, and Distributed Lock Manager creates a bottleneck.',
  },
];
