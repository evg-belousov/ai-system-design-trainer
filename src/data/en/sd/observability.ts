import type { Question } from '@/data/types';

export const observabilityQuestions: Question[] = [
  {
    id: 'sd-observability-001',
    block: 'sd',
    topic: 'observability',
    topicLabel: 'Monitoring and Observability',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What are the three pillars (pillars) of observability in modern distributed systems?',
    options: [
      'CPU, Memory, Disk',
      'Logs, Metrics, Traces',
      'Alerts, Dashboards, Reports',
      'Availability, Latency, Throughput',
    ],
    correctIndex: 1,
    explanation:
      'Three pillars of observability: Logs (discrete events with context); Metrics (numeric measurements aggregated over time); Traces (request path through distributed system). Each pillar gives unique perspective: logs explain "what happened", metrics show "how well system works", traces reveal "where problem occurred" in service chain.',
  },
  {
    id: 'sd-observability-002',
    block: 'sd',
    topic: 'observability',
    topicLabel: 'Monitoring and Observability',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is structured logging and how does it differ from plain text logging?',
    options: [
      'Logging only to specific format files (.log)',
      'Recording logs in structured format (JSON) with typed fields instead of arbitrary text',
      'Logging with mandatory level (INFO, WARN, ERROR)',
      'Storing logs in relational database with strict schema',
    ],
    correctIndex: 1,
    explanation:
      'Structured logging records logs in key-value format (usually JSON), where each field has name and type. Example: {"timestamp":"2024-01-15T10:30:00Z","level":"error","service":"payment","trace_id":"abc123","user_id":"u456","message":"Payment failed","error_code":"INSUFFICIENT_FUNDS"}. Allows efficient search, filtering, aggregation with tools (ELK, Loki), unlike arbitrary text requiring regex parsing.',
  },
  {
    id: 'sd-observability-003',
    block: 'sd',
    topic: 'observability',
    topicLabel: 'Monitoring and Observability',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is Prometheus used for in monitoring stack?',
    options: [
      'For metrics visualization and dashboard creation',
      'For collecting, storing and querying time series metrics',
      'For distributed request tracing across microservices',
      'For log aggregation and indexing',
    ],
    correctIndex: 1,
    explanation:
      'Prometheus is open-source monitoring system specializing in collecting and storing time series metrics. Uses pull-model: periodically scrapes (scrape) /metrics endpoints of services. Has own query language PromQL for metric analysis. Stores data locally and supports alerting via Alertmanager. For visualization usually uses Grafana as separate component.',
  },
  {
    id: 'sd-observability-004',
    block: 'sd',
    topic: 'observability',
    topicLabel: 'Monitoring and Observability',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What does SLO abbreviation mean in service reliability context?',
    options: [
      'Service Level Objective—target service quality level, expressed as percentage (e.g., 99.9% availability)',
      'Service Load Optimizer—load optimization component',
      'System Logging Output—log output standard',
      'Service Latency Overview—service delay overview',
    ],
    correctIndex: 0,
    explanation:
      'SLO (Service Level Objective) is target value for service quality metric. Example: "99.9% of requests must be processed faster than 200ms per 30-day window". SLO defined based on SLI (Service Level Indicator—actual metric), while SLA (Service Level Agreement) is legal agreement with customer including SLO and consequences of violation (compensation). Hierarchy: SLI → SLO → SLA.',
  },
];
