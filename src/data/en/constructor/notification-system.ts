import type { Scenario } from '@/data/constructor/types';

export const notificationSystemScenario: Scenario = {
  id: 'notification-system',
  title: 'Notification System',
  difficulty: 'middle',
  description:
    'Design a notification system for a large platform (push, SMS, email) that handles millions of notifications per day. The system must support multiple delivery channels, prioritization, retry logic, and analytics.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'ns-requirements',
      title: 'Requirements',
      description:
        'Define the delivery channels and the notification prioritization strategy. The queue and worker-pool architecture depends on these decisions.',
      decisions: [
        {
          id: 'ns-channels',
          category: 'Delivery channels',
          question: 'Which delivery channels should be supported?',
          multiSelect: true,
          options: [
            {
              id: 'push',
              label: 'Push (mobile)',
              description:
                'Push notifications via FCM (Android) and APNs (iOS). Instant delivery to the device.',
              pros: [
                'Instant delivery when a connection is available',
                'Low cost to send',
                'High user engagement',
              ],
              cons: [
                'Requires device token registration',
                'The user can disable notifications',
                'Dependency on external providers (Google, Apple)',
              ],
              bestWhen: 'You need instant delivery to mobile devices',
              impact: { latency: 2, scalability: 1, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'email',
              label: 'Email',
              description:
                'Sending email via SMTP or a provider API (SES, SendGrid). Supports HTML templates and attachments.',
              pros: [
                'Universal channel — every user has it',
                'Supports rich content (HTML, attachments)',
                'Allows re-delivery (inbox)',
              ],
              cons: [
                'High delivery latency (seconds to minutes)',
                'Spam-filter issues',
                'Requires DKIM/SPF/DMARC setup',
              ],
              bestWhen: 'You need to deliver long-form content or documents',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'sms',
              label: 'SMS',
              description:
                'Sending SMS via providers (Twilio, Vonage). High cost, but guaranteed delivery.',
              pros: [
                'Does not require internet on the device',
                'High read rate (>90%)',
                'Works on any phone',
              ],
              cons: [
                'High cost per message',
                'Length limit (160 characters)',
                'Regulatory requirements (opt-in, TCPA)',
              ],
              bestWhen: 'Critical notifications (OTP, alerts) where guaranteed delivery is required',
              impact: { latency: 1, scalability: -1, consistency: 2, complexity: 1, cost: -2 },
              capacityImpact: [
                {
                  label: 'Email/SMS costs',
                  value: '~$500K/day',
                  formula: '500M/day × 10% SMS × $0.01/SMS = $500K/day (50× more than email-only)',
                },
                {
                  label: 'Push payload bandwidth',
                  value: '~2.7 MB/s (SMS payloads are tiny)',
                  formula: '17K/sec × 10% SMS × 160 bytes = ~270 KB/s for SMS channel',
                },
              ],
            },
            {
              id: 'in-app',
              label: 'In-app',
              description:
                'Notifications inside the application. Bell icon, notification center, real-time via WebSocket.',
              pros: [
                'Full control over UI and UX',
                'Zero delivery cost',
                'No dependency on external providers',
              ],
              cons: [
                'The user only sees it when opening the app',
                'Requires WebSocket or polling for real-time',
                'Requires your own notification center',
              ],
              bestWhen: 'Notifications are not time-critical and the user is frequently in the app',
              impact: { latency: 0, scalability: 2, consistency: 1, complexity: 0, cost: 2 },
            },
          ],
        },
        {
          id: 'ns-priority',
          category: 'Prioritization',
          question: 'Is notification prioritization needed?',
          options: [
            {
              id: 'single-queue',
              label: 'Single queue (FIFO)',
              description:
                'All notifications are processed in arrival order with no separation by priority.',
              pros: [
                'Simplest possible implementation',
                'Predictable processing order',
                'Easy to debug and monitor',
              ],
              cons: [
                'Critical notifications (OTP) wait in the shared queue',
                'A spike of marketing blasts blocks urgent messages',
                'No SLA control per notification type',
              ],
              bestWhen: 'Low notification volume, all messages of equal importance',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: 2, cost: 1 },
            },
            {
              id: 'priority-levels',
              label: 'Priority levels (critical/high/normal/low)',
              description:
                'Each notification is assigned a priority. Workers process high-priority messages first.',
              pros: [
                'OTP and security alerts are delivered first',
                'Flexible SLA control by message class',
                'Scales to business requirements',
              ],
              cons: [
                'More complex routing logic',
                'Possible starvation of low-priority messages',
                'Requires priority-assignment logic',
              ],
              bestWhen: 'Different notification types with different SLAs — the standard for production systems',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'separate-queues',
              label: 'Separate queue per channel',
              description:
                'Each channel (push, email, SMS) has its own queue. No prioritization is done within a channel.',
              pros: [
                'Failure isolation: an email problem does not affect push',
                'Independent scaling of channels',
                'Simple consumer model',
              ],
              cons: [
                'No prioritization within a channel',
                'More queues to manage',
                'Does not solve the urgent-message blocking problem',
              ],
              bestWhen: 'Channels have very different throughput characteristics',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: -1, cost: -1 },
            },
          ],
        },
      ],
      tip: 'In production systems (Airbnb, Uber) prioritization is critical: OTP codes and security alerts must not wait behind marketing blasts.',
    },

    // ── Step 2: API Design ────────────────────────────────────────────
    {
      id: 'ns-api',
      title: 'API and templates',
      description:
        'Define the interface for accepting send requests and the strategy for managing notification templates.',
      decisions: [
        {
          id: 'ns-api-style',
          category: 'API style',
          question: 'How should requests to send notifications be accepted?',
          options: [
            {
              id: 'sync-rest',
              label: 'Synchronous REST API',
              description:
                'The client sends a POST request and waits for a send confirmation. Simple request-response.',
              pros: [
                'Simple integration for clients',
                'Instant feedback on validation errors',
                'Easy to test and debug',
              ],
              cons: [
                'The client is blocked during processing',
                'Peak load presses directly on the service',
                'Hard to guarantee delivery',
              ],
              bestWhen: 'Small notification volume, integration simplicity is required',
              impact: { latency: -1, scalability: -2, consistency: 0, complexity: 2, cost: 1 },
            },
            {
              id: 'async-queue',
              label: 'Asynchronous message queue',
              description:
                'The client places a request into a queue and immediately receives an acknowledgement. Processing happens asynchronously.',
              pros: [
                'Smooths out load peaks',
                'Delivery guarantee (at-least-once)',
                'Independent scaling of producer and consumer',
              ],
              cons: [
                'No instant feedback on the result',
                'Harder to debug (asynchronous flow)',
                'Requires queue infrastructure',
              ],
              bestWhen: 'High notification volume — the industry standard (LinkedIn, Uber)',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'event-driven',
              label: 'Event-driven (pub/sub)',
              description:
                'Notifications are generated from domain events (OrderCompleted, PaymentFailed). The notification service subscribes to events.',
              pros: [
                'Loose coupling: services are unaware of the notification service',
                'Easy to add new notification triggers',
                'A single source of events for auditing',
              ],
              cons: [
                'Complex routing of events to notifications',
                'Requires an "event → notification template" mapping',
                'Harder to control duplication',
              ],
              bestWhen: 'Microservice architecture, notifications tied to business events',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: -2, cost: -1 },
            },
          ],
        },
        {
          id: 'ns-template',
          category: 'Templates',
          question: 'How should notification templates be managed?',
          options: [
            {
              id: 'hardcoded',
              label: 'Hardcoded in the code',
              description:
                'Notification text is baked into the service code. Changing the text requires a new deploy.',
              pros: [
                'Zero additional complexity',
                'Templates live in the same repository as the logic',
                'Type-safe variable substitution',
              ],
              cons: [
                'Changing text = a new deploy',
                'Marketing cannot edit without developers',
                'Hard to maintain localization',
              ],
              bestWhen: 'Small team, infrequent template changes',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 2, cost: 2 },
            },
            {
              id: 'template-engine',
              label: 'Template engine (Handlebars/Jinja)',
              description:
                'Templates are stored separately from the code and rendered through an engine with variables.',
              pros: [
                'Separation of content from logic',
                'Reusable blocks and layouts',
                'Update templates without deploying the service',
              ],
              cons: [
                'Requires validation of template variables',
                'Runtime errors when variables mismatch',
                'Requires a template versioning system',
              ],
              bestWhen: 'Medium template volume, flexibility needed without excess complexity',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 0, cost: 1 },
            },
            {
              id: 'cms-editor',
              label: 'CMS with a visual editor',
              description:
                'A visual editor for marketing and product teams. Drag-and-drop, preview, A/B testing.',
              pros: [
                'Marketing edits without developers',
                'Preview notifications before sending',
                'Support for content A/B testing',
              ],
              cons: [
                'Significant cost to build/buy a CMS',
                'Complex integration with the notification pipeline',
                'Risk of "broken" templates from non-technical users',
              ],
              bestWhen: 'Large product team, frequent changes to notification content',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: -2, cost: -2 },
            },
          ],
        },
      ],
      tip: 'LinkedIn uses an asynchronous API + template engine to send billions of notifications per day. A synchronous API is acceptable only as a facade in front of a queue.',
    },

    // ── Step 3: Data Model & Storage ──────────────────────────────────
    {
      id: 'ns-storage',
      title: 'Data storage',
      description:
        'Decide where to store the notification history (write-heavy load) and user preferences (opt-in/out).',
      decisions: [
        {
          id: 'ns-db',
          category: 'Notification history',
          question: 'Where should the notification history be stored?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL',
              description:
                'A relational database with ACID transactions. Suitable for structured data and complex queries.',
              pros: [
                'Powerful SQL queries and JOINs',
                'ACID guarantees for critical data',
                'Mature ecosystem and tooling',
              ],
              cons: [
                'Scales poorly horizontally for write-heavy load',
                'Degrades at billions of records without partitioning',
                'Vertical scaling is expensive',
              ],
              bestWhen: 'Low notification volume (<1M/day), complex queries needed',
              impact: { latency: 0, scalability: -1, consistency: 2, complexity: 1, cost: 0 },
            },
            {
              id: 'mongodb',
              label: 'MongoDB',
              description:
                'A document database. Flexible schema, horizontal scaling via sharding.',
              pros: [
                'Flexible schema for different notification types',
                'Built-in sharding out of the box',
                'Good write performance',
              ],
              cons: [
                'Weak consistency guarantees by default',
                'Complex analytical queries are inefficient',
                'Consumes more memory than relational databases',
              ],
              bestWhen: 'Heterogeneous notification types, medium volume, schema flexibility needed',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 0, cost: 0 },
            },
            {
              id: 'cassandra',
              label: 'Cassandra',
              description:
                'A distributed wide-column database optimized for write-heavy load. Linear horizontal scaling.',
              pros: [
                'Excellent write performance at any scale',
                'Linear horizontal scaling',
                'No single point of failure',
              ],
              cons: [
                'Limited query model (must design for the query pattern)',
                'Eventual consistency by default',
                'High barrier to entry for operational support',
              ],
              bestWhen: 'Write-heavy load, millions of notifications per day — the choice of Uber and Netflix',
              impact: { latency: 1, scalability: 2, consistency: -1, complexity: -1, cost: -1 },
            },
            {
              id: 'clickhouse',
              label: 'ClickHouse (for analytics)',
              description:
                'A columnar OLAP database for analytical queries. Lightning-fast aggregation over large volumes.',
              pros: [
                'Instant analytical queries (delivery rate, bounce rate)',
                'Excellent data compression',
                'Supports a SQL-like query language',
              ],
              cons: [
                'Not suited for OLTP (point updates, deletes)',
                'No full-fledged transactions',
                'Requires a separate database for operational data',
              ],
              bestWhen: 'Notification analytics and reporting as a complement to the primary database',
              impact: { latency: 0, scalability: 1, consistency: -2, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'ns-preferences',
          category: 'User preferences',
          question: 'Where should user preferences (opt-in/out) be stored?',
          options: [
            {
              id: 'main-db',
              label: 'In the primary database (PostgreSQL)',
              description:
                'Notification preferences are stored in a user_preferences table alongside the user profile.',
              pros: [
                'A single source of truth for user data',
                'ACID guarantees when updating preferences',
                'No additional infrastructure needed',
              ],
              cons: [
                'Additional load on the primary database on every send',
                'Latency when reading preferences from an OLTP database',
                'Hard to cache when changes are frequent',
              ],
              bestWhen: 'Small scale, preferences change rarely',
              impact: { latency: -1, scalability: -1, consistency: 2, complexity: 1, cost: 1 },
            },
            {
              id: 'redis-source',
              label: 'Redis (cache + source of truth)',
              description:
                'Preferences are stored in Redis. Fast access, but a risk of data loss on failure.',
              pros: [
                'Sub-millisecond access to preferences',
                'Minimal load on the notification pipeline',
                'Simple data model (hash per user)',
              ],
              cons: [
                'Risk of data loss on failure (even with AOF)',
                'RAM-only — expensive with a large number of users',
                'Not suitable for auditing preference changes',
              ],
              bestWhen: 'Maximum speed needed, data can be restored from other sources',
              impact: { latency: 2, scalability: 0, consistency: -2, complexity: 0, cost: -1 },
            },
            {
              id: 'preference-service',
              label: 'A separate preference service',
              description:
                'A microservice with its own database for user notification preferences. API for read/write, with an internal cache.',
              pros: [
                'Isolation from the notification pipeline',
                'Its own cache and scaling',
                'Clear API contracts, reusable by other services',
              ],
              cons: [
                'An additional service to maintain',
                'A network call on every send',
                'Requires a cache-invalidation strategy',
              ],
              bestWhen: 'Microservice architecture, preferences used by several services',
              impact: { latency: 0, scalability: 2, consistency: 1, complexity: -1, cost: -1 },
            },
          ],
        },
      ],
      tip: 'Under write-heavy load (millions of notifications/day), relational databases become a bottleneck. Cassandra is the choice of Uber, Apple, and Netflix for such tasks.',
    },

    // ── Step 4: Architecture ──────────────────────────────────────────
    {
      id: 'ns-architecture',
      title: 'Architecture',
      description:
        'Choose a message broker and a delivery-guarantee strategy. This is the core of the notification pipeline.',
      decisions: [
        {
          id: 'ns-queue',
          category: 'Message broker',
          question: 'Which message broker should be used?',
          options: [
            {
              id: 'rabbitmq',
              label: 'RabbitMQ',
              description:
                'A classic message broker with flexible routing (exchanges, bindings). Supports priority queues.',
              pros: [
                'Flexible routing (topic, fanout, headers)',
                'Built-in support for priority queues',
                'Delivery acknowledgement (ack/nack)',
              ],
              cons: [
                'Hard to scale horizontally',
                'Degrades with millions of messages in a queue',
                'No built-in message replay',
              ],
              bestWhen: 'Medium volume, complex routing by notification type needed',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
              capacityImpact: [
                {
                  label: 'Queue throughput',
                  value: '~17K msgs/sec (single cluster limit ~50K)',
                  formula: 'RabbitMQ: ~50K msgs/sec per cluster; 17K/sec = 34% capacity, limited horizontal scaling',
                },
                {
                  label: 'Storage (30 days history)',
                  value: '~15 TB (no built-in retention)',
                  formula: 'RabbitMQ is not designed for message storage; need separate DB for history',
                },
              ],
            },
            {
              id: 'kafka',
              label: 'Apache Kafka',
              description:
                'A distributed log-based broker. High throughput, retention, replay. The standard for high-throughput systems.',
              pros: [
                'Millions of messages per second',
                'Replay: re-reading messages for debugging',
                'Horizontal scaling via partitions',
              ],
              cons: [
                'No native support for priority queues',
                'High operational overhead (ZooKeeper/KRaft)',
                'Higher latency than RabbitMQ for individual messages',
              ],
              bestWhen: 'High-throughput, replay and auditing needed — the choice of LinkedIn and Uber',
              impact: { latency: 0, scalability: 2, consistency: 1, complexity: -1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Queue throughput',
                  value: '17K msgs/sec (1% of Kafka capacity)',
                  formula: 'Kafka: ~2M msgs/sec per cluster; 17K/sec = trivial load, room for 100× growth',
                },
                {
                  label: 'Storage (30 days history)',
                  value: '~45 TB (with Kafka retention)',
                  formula: '500M/day × 30 days × 1 KB + 2× replication factor = ~30 TB data + Kafka overhead ≈ 45 TB (built-in retention & replay)',
                },
              ],
            },
            {
              id: 'sqs',
              label: 'Amazon SQS',
              description:
                'A managed queue from AWS. Zero ops, automatic scaling, built-in DLQs.',
              pros: [
                'Fully managed — zero ops',
                'Automatic scaling',
                'Built-in dead letter queues',
              ],
              cons: [
                'Vendor lock-in to AWS',
                'Limited throughput on FIFO queues',
                'No message replay',
              ],
              bestWhen: 'AWS infrastructure, simplicity needed without operational overhead',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 2, cost: 0 },
            },
            {
              id: 'redis-streams',
              label: 'Redis Streams',
              description:
                'A log-based data structure in Redis. Consumer groups, automatic acknowledgement.',
              pros: [
                'Minimal latency (in-memory)',
                'Simple setup when Redis is already present',
                'Consumer groups out of the box',
              ],
              cons: [
                'Limited by the server\'s RAM',
                'Weaker persistence guarantees than Kafka',
                'Not suitable for long-term message storage',
              ],
              bestWhen: 'Small scale, Redis already in the stack, minimal latency needed',
              impact: { latency: 2, scalability: -1, consistency: -1, complexity: 1, cost: 1 },
            },
          ],
        },
        {
          id: 'ns-delivery',
          category: 'Delivery guarantee',
          question: 'What is the message delivery strategy?',
          options: [
            {
              id: 'fire-and-forget',
              label: 'Fire and forget',
              description:
                'The message is sent to the provider without delivery confirmation. Maximum speed, minimal reliability.',
              pros: [
                'Maximum throughput',
                'Minimal complexity',
                'Lowest latency',
              ],
              cons: [
                'Loss of notifications on failure',
                'No delivery guarantee',
                'Impossible to track status',
              ],
              bestWhen: 'Non-critical notifications where loss is acceptable',
              impact: { latency: 2, scalability: 1, consistency: -2, complexity: 2, cost: 1 },
            },
            {
              id: 'at-least-once',
              label: 'At-least-once with idempotency',
              description:
                'The message is reprocessed on failure. An idempotency key prevents duplicate notifications.',
              pros: [
                'Guarantee that every notification is processed',
                'Idempotency prevents spamming the user',
                'A balance of reliability and complexity',
              ],
              cons: [
                'Requires implementing an idempotency key',
                'Additional load for duplicate checking',
                'Possible latency on retry',
              ],
              bestWhen: 'The industry standard for notification systems — Airbnb, LinkedIn',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'exactly-once',
              label: 'Exactly-once (transactional outbox)',
              description:
                'Writing to the database and sending to the queue in a single transaction via the outbox pattern. A guarantee of exactly one processing.',
              pros: [
                'Strong guarantee of exactly one processing',
                'No loss or duplication of notifications',
                'An audit trail in the outbox table',
              ],
              cons: [
                'Significant implementation complexity',
                'Additional load on the database (outbox polling/CDC)',
                'Reduced throughput',
              ],
              bestWhen: 'Financial notifications where duplication is critical (payment confirmations)',
              impact: { latency: -1, scalability: -1, consistency: 2, complexity: -2, cost: -1 },
            },
          ],
        },
      ],
      tip: 'At-least-once + idempotency key is the practical standard. Exactly-once via the outbox adds reliability but significantly complicates the system.',
    },

    // ── Step 5: Scaling ───────────────────────────────────────────────
    {
      id: 'ns-scaling',
      title: 'Scaling',
      description:
        'Define the strategy for controlling the send rate and batching notifications to optimize load.',
      decisions: [
        {
          id: 'ns-rate-control',
          category: 'Rate limiting',
          question: 'How should the send rate be controlled?',
          options: [
            {
              id: 'no-rate-limit',
              label: 'No rate limiting',
              description:
                'Notifications are sent at maximum speed without restrictions.',
              pros: [
                'Maximum throughput',
                'Implementation simplicity',
                'Minimal delivery latency',
              ],
              cons: [
                'Providers block you when limits are exceeded',
                'The user may receive a barrage of notifications',
                'No protection against accidental flooding',
              ],
              bestWhen: 'Only in the early stages, when volume is small',
              impact: { latency: 1, scalability: -2, consistency: -1, complexity: 2, cost: 0 },
            },
            {
              id: 'per-channel-limits',
              label: 'Rate limits per channel',
              description:
                'Limiting the send rate for each channel (email: 1000/sec, SMS: 100/sec).',
              pros: [
                'Protection against provider blocking',
                'Predictable load on each channel',
                'Simple implementation via token bucket',
              ],
              cons: [
                'Does not protect the user from spam',
                'Fixed limits do not adapt to load',
                'Requires tuning limits per provider',
              ],
              bestWhen: 'Basic protection against provider overload is needed',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'per-user-limits',
              label: 'Rate limits per user (anti-spam)',
              description:
                'Limiting the number of notifications per user per time unit (max 5 push per hour).',
              pros: [
                'Protects the user from notification overload',
                'Lowers opt-out and unsubscribe rate',
                'Improves the user experience',
              ],
              cons: [
                'Complex per-user counting logic',
                'Requires storing counters (Redis)',
                'Potential loss of important notifications',
              ],
              bestWhen: 'Many notification triggers, protection against spamming the user needed',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: -1 },
            },
            {
              id: 'provider-rate-limit',
              label: 'Provider rate limit compliance',
              description:
                'Adaptive rate limiting that accounts for provider limits (SMTP throttling, FCM quota, Twilio rate limits).',
              pros: [
                'Automatic adaptation to provider limits',
                'Prevents account blocking',
                'Maximum utilization of the allowed throughput',
              ],
              cons: [
                'Complex implementation of the adaptive algorithm',
                'Requires monitoring provider responses (429, rate limit headers)',
                'Different APIs across different providers',
              ],
              bestWhen: 'A production system with several providers — the standard for mature systems',
              impact: { latency: 0, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'ns-batch',
          category: 'Batching',
          question: 'Is notification batching needed?',
          options: [
            {
              id: 'no-batching',
              label: 'No batching (real-time)',
              description:
                'Each notification is sent immediately as it arrives.',
              pros: [
                'Minimal delivery latency',
                'Simple pipeline implementation',
                'The user receives the notification right away',
              ],
              cons: [
                'The user may receive dozens of notifications in a row',
                'High load during peaks',
                'No cost optimization (each SMS sent separately)',
              ],
              bestWhen: 'All notifications require instant delivery',
              impact: { latency: 2, scalability: -1, consistency: 0, complexity: 1, cost: -1 },
            },
            {
              id: 'digest-batching',
              label: 'Digest batching (grouping by interval)',
              description:
                'Notifications of the same type are grouped per user over an interval (5 min, 1 hour) into a single digest.',
              pros: [
                'Reduces the number of sends (saving on SMS/email)',
                'Improves UX: "3 new comments" instead of 3 separate ones',
                'Lowers opt-out rate',
              ],
              cons: [
                'Delivery delayed by the interval length',
                'Requires grouping logic and storage of pending notifications',
                'Not suitable for urgent notifications',
              ],
              bestWhen: 'Many similar notifications (likes, comments) — LinkedIn\'s approach',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: -1, cost: 1 },
              capacityImpact: [
                {
                  label: 'Peak send rate',
                  value: '~3.4K/sec',
                  formula: 'Digest reduces sends by ~5× (avg 5 notifications per digest) → 17K/5 ≈ 3.4K/sec actual sends',
                },
                {
                  label: 'Email/SMS costs',
                  value: '~$2K/day',
                  formula: 'Digest batching: 500M/5 = 100M actual sends × 20% email × $0.0001 = $2K/day (5× cheaper)',
                },
                {
                  label: 'Storage (30 days history)',
                  value: '~18 TB',
                  formula: '15 TB notification records + 3 TB pending digest buffer (5 min windows × concurrent digests)',
                },
              ],
            },
            {
              id: 'smart-batching',
              label: 'Smart batching (ML-based timing)',
              description:
                'An ML model determines the optimal delivery time for each user based on their activity.',
              pros: [
                'Maximum engagement — the notification arrives at the "right" time',
                'Adapts to the user\'s time zone and habits',
                'A competitive advantage',
              ],
              cons: [
                'Significant ML-infrastructure complexity',
                'Requires user activity data',
                'Long time-to-market',
              ],
              bestWhen: 'A large platform with an ML team, the goal is to maximize engagement',
              impact: { latency: -2, scalability: 0, consistency: 0, complexity: -2, cost: -2 },
            },
          ],
        },
      ],
      tip: 'Uber uses adaptive rate limiting that accounts for provider limits. LinkedIn applies digest batching to group notifications about social interactions.',
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'ns-reliability',
      title: 'Reliability',
      description:
        'Define the retry strategy for errors and the key metrics for monitoring.',
      decisions: [
        {
          id: 'ns-retry',
          category: 'Retry strategy',
          question: 'What is the retry strategy for delivery errors?',
          options: [
            {
              id: 'no-retry',
              label: 'No retries',
              description:
                'On a delivery error the notification is marked as failed. No re-send is performed.',
              pros: [
                'Zero additional complexity',
                'No notification duplication',
                'Predictable load',
              ],
              cons: [
                'Loss of notifications on transient provider failures',
                'Low delivery rate',
                'Unacceptable for critical notifications',
              ],
              bestWhen: 'Non-critical notifications where loss is acceptable (marketing)',
              impact: { latency: 1, scalability: 1, consistency: -2, complexity: 2, cost: 1 },
            },
            {
              id: 'fixed-retry',
              label: 'Retry with a fixed interval',
              description:
                'A retry after a fixed time (30 sec, 30 sec, 30 sec). Maximum of 3 attempts.',
              pros: [
                'Simple implementation',
                'Predictable time between attempts',
                'Better than no retry at all',
              ],
              cons: [
                'Thundering herd during a mass provider failure',
                'Does not adapt to the nature of the error',
                'Load on the provider does not decrease between attempts',
              ],
              bestWhen: 'Simple scenarios with rare failures',
              impact: { latency: 0, scalability: -1, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'exponential-backoff',
              label: 'Exponential backoff',
              description:
                'The interval between attempts grows exponentially (1s, 2s, 4s, 8s...) with jitter to prevent a thundering herd.',
              pros: [
                'Gives the provider time to recover',
                'Jitter prevents simultaneous retries',
                'A standard approach in distributed systems',
              ],
              cons: [
                'Delivery latency grows with each attempt',
                'Problematic messages occupy worker resources',
                'No isolation of "poison" messages',
              ],
              bestWhen: 'A good baseline approach, but insufficient for production scale',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'exponential-backoff-dlq',
              label: 'Exponential backoff + Dead Letter Queue',
              description:
                'Exponential backoff with jitter. After attempts are exhausted — the message goes to a DLQ for manual investigation.',
              pros: [
                'Automatic handling of transient failures',
                'Isolation of "poison" messages in the DLQ',
                'Ability to manually replay from the DLQ',
              ],
              cons: [
                'Requires a system to monitor and process the DLQ',
                'Messages in the DLQ require manual attention',
                'Harder to test the retry logic',
              ],
              bestWhen: 'The industry standard for production systems — Airbnb, Uber, LinkedIn',
              impact: { latency: 0, scalability: 1, consistency: 2, complexity: -1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Storage (30 days history)',
                  value: '~16.5 TB',
                  formula: '15 TB base + ~1.5 TB DLQ storage (assuming 1% failure rate × 5 retry copies × 1 KB = ~750 GB + metadata)',
                },
                {
                  label: 'Peak send rate',
                  value: '~20K/sec (with retry overhead)',
                  formula: '17K/sec base + ~3K/sec retries (1% fail × 5 retries spread over backoff window) = ~20K/sec peak worker load',
                },
              ],
            },
          ],
        },
        {
          id: 'ns-monitoring',
          category: 'Monitoring',
          question: 'Which metrics should be monitored?',
          multiSelect: true,
          options: [
            {
              id: 'delivery-rate',
              label: 'Delivery rate by channel',
              description:
                'The percentage of successfully delivered notifications for each channel (push: 95%, email: 98%, SMS: 99%).',
              pros: [
                'The primary health metric of a notification system',
                'Allows comparing channel effectiveness',
                'Fast detection of provider degradation',
              ],
              cons: [
                'Not all providers give an accurate delivery status',
                'Push delivery confirmation is unreliable',
                'Requires a feedback loop with providers',
              ],
              bestWhen: 'A baseline metric — mandatory for any notification system',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'bounce-rate',
              label: 'Bounce/failure rate',
              description:
                'The percentage of failures: email bounces, invalid device tokens, SMS delivery failures.',
              pros: [
                'An indicator of data quality (stale tokens, invalid emails)',
                'Prevents getting onto blocklists (email)',
                'Cost optimization (do not send to invalid addresses)',
              ],
              cons: [
                'Requires handling webhooks from providers',
                'Different bounce-report formats across providers',
                'Delay in receiving bounce information (email: up to 72h)',
              ],
              bestWhen: 'Mandatory for the email channel — otherwise you will land on spam lists',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 1 },
            },
            {
              id: 'e2e-latency',
              label: 'E2E latency (send → delivery)',
              description:
                'The time from the send request to actual delivery to the user. P50, P95, P99 by channel.',
              pros: [
                'Tracking SLA by priority (OTP < 5 sec)',
                'Detecting bottlenecks in the pipeline',
                'A basis for capacity planning',
              ],
              cons: [
                'Hard to measure the exact delivery time (push, email)',
                'Requires distributed tracing',
                'Batching distorts the metric for digest notifications',
              ],
              bestWhen: 'Critical for time-sensitive notifications (OTP, security alerts)',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'queue-depth',
              label: 'Queue depth / consumer lag',
              description:
                'The number of unprocessed messages in the queue and the lag of consumers behind producers.',
              pros: [
                'An early warning of system overload',
                'A basis for auto-scaling workers',
                'Detection of stalled consumers',
              ],
              cons: [
                'Requires access to broker metrics',
                'Interpretation depends on the broker type',
                'Alerts require tuning threshold values',
              ],
              bestWhen: 'Mandatory for queue-based systems — the foundation of auto-scaling',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 0, cost: 0 },
            },
          ],
        },
      ],
      tip: 'Airbnb monitors all four metrics. Queue depth is used for auto-scaling workers, and delivery rate as an SLO for on-call engineers.',
    },
  ],

  referenceSolution: {
    decisions: {
      'ns-channels': ['push', 'email', 'sms'],
      'ns-priority': ['priority-levels'],
      'ns-api-style': ['async-queue'],
      'ns-template': ['template-engine'],
      'ns-db': ['cassandra'],
      'ns-preferences': ['preference-service'],
      'ns-queue': ['kafka'],
      'ns-delivery': ['at-least-once'],
      'ns-rate-control': ['provider-rate-limit'],
      'ns-batch': ['digest-batching'],
      'ns-retry': ['exponential-backoff-dlq'],
      'ns-monitoring': ['delivery-rate', 'bounce-rate', 'e2e-latency', 'queue-depth'],
    },
    explanation:
      'The reference architecture is based on the practices of Airbnb, LinkedIn, and Uber.\n\n' +
      '**Channels and prioritization:** Push, Email, and SMS cover the main scenarios. Prioritization via levels ' +
      '(critical/high/normal/low) guarantees that OTP codes and security alerts are delivered first, ' +
      'without being blocked by marketing blasts.\n\n' +
      '**API and templates:** Asynchronous ingestion via Kafka provides peak smoothing and an at-least-once guarantee. ' +
      'A template engine (Handlebars) separates content from logic, allowing templates to be updated without a deploy.\n\n' +
      '**Storage:** Cassandra is optimal for write-heavy load (millions of records/day) with linear scaling. ' +
      'A separate preference service isolates user preferences and allows them to be cached independently.\n\n' +
      '**Message broker:** Kafka provides high throughput, replay for debugging, and horizontal scaling ' +
      'via partitions. Prioritization is implemented through separate topics per priority.\n\n' +
      '**Rate limiting and batching:** Provider rate limit compliance adapts the send rate to each provider\'s limits ' +
      '(FCM, SES, Twilio). Digest batching groups similar notifications, reducing cost and improving UX.\n\n' +
      '**Reliability:** Exponential backoff with jitter and a DLQ is the industry standard. The DLQ isolates problematic messages, ' +
      'allowing the main flow to run without delays. Monitoring all four key metrics provides full ' +
      'system observability.',
    diagram:
      '```\n' +
      '                    ┌─────────────────────────────────────┐\n' +
      '                    │           API Gateway               │\n' +
      '                    │      (rate limit, auth)             │\n' +
      '                    └──────────────┬──────────────────────┘\n' +
      '                                   │\n' +
      '                                   ▼\n' +
      '                    ┌─────────────────────────────────────┐\n' +
      '                    │      Notification Service           │\n' +
      '                    │  (validate, enrich, template)       │\n' +
      '                    └──────────────┬──────────────────────┘\n' +
      '                                   │\n' +
      '                                   ▼\n' +
      '              ┌────────────────────────────────────────────┐\n' +
      '              │              Apache Kafka                  │\n' +
      '              │  ┌──────────┬──────────┬──────────┐       │\n' +
      '              │  │ critical │   high   │  normal  │ low   │\n' +
      '              │  │  topic   │  topic   │  topic   │ topic │\n' +
      '              │  └──────────┴──────────┴──────────┘       │\n' +
      '              └───────────────────┬────────────────────────┘\n' +
      '                                  │\n' +
      '                                  ▼\n' +
      '                    ┌─────────────────────────────┐\n' +
      '                    │      Priority Router        │\n' +
      '                    │  (channel + priority logic) │\n' +
      '                    └──┬──────────┬───────────┬───┘\n' +
      '                       │          │           │\n' +
      '              ┌────────▼──┐ ┌─────▼─────┐ ┌──▼────────┐\n' +
      '              │   Push    │ │   Email   │ │    SMS    │\n' +
      '              │  Workers  │ │  Workers  │ │  Workers  │\n' +
      '              │(rate ctrl)│ │(rate ctrl)│ │(rate ctrl)│\n' +
      '              └────┬──┬──┘ └───┬───┬───┘ └──┬────┬───┘\n' +
      '                   │  │        │   │        │    │\n' +
      '              ┌────▼┐ │   ┌────▼┐  │   ┌───▼─┐  │\n' +
      '              │ FCM │ │   │ SES │  │   │Twil.│  │\n' +
      '              │APNs │ │   │     │  │   │     │  │\n' +
      '              └─────┘ │   └─────┘  │   └─────┘  │\n' +
      '                      │            │            │\n' +
      '                      ▼            ▼            ▼\n' +
      '              ┌───────────────────────────────────────┐\n' +
      '              │          Dead Letter Queue            │\n' +
      '              │   (failed after max retries)          │\n' +
      '              └───────────────────┬───────────────────┘\n' +
      '                                  │\n' +
      '     ┌────────────────────────────┼────────────────────────┐\n' +
      '     │                            │                        │\n' +
      '     ▼                            ▼                        ▼\n' +
      '┌──────────┐          ┌───────────────────┐    ┌───────────────┐\n' +
      '│Cassandra │          │Preference Service │    │  Monitoring   │\n' +
      '│(history) │          │  (user opt-in/    │    │ (delivery %,  │\n' +
      '│          │          │   out settings)   │    │  bounce rate, │\n' +
      '└──────────┘          └───────────────────┘    │  latency,     │\n' +
      '                                               │  queue depth) │\n' +
      '                                               └───────────────┘\n' +
      '```',
  },
  capacityEstimates: {
    default: [
      {
        label: 'Daily notifications',
        value: '500M/day',
        formula:
          '100M users × avg 5 notifications/day = 500M/day',
      },
      {
        label: 'Peak send rate',
        value: '~17K/sec',
        formula:
          '500M / 86 400 ≈ 5 787/sec × 3× peak factor ≈ 17K/sec',
      },
      {
        label: 'Storage (30 days history)',
        value: '~15 TB',
        formula:
          '500M/day × 30 days × 1 KB per notification = 15 TB',
      },
      {
        label: 'Queue throughput',
        value: '17K msgs/sec',
        formula: '17K msgs/sec across all channels (push + email + SMS)',
      },
      {
        label: 'Push payload bandwidth',
        value: '~68 MB/s',
        formula: '17K/sec × 4 KB avg payload = ~68 MB/s',
      },
      {
        label: 'Email/SMS costs',
        value: '~$10K/day',
        formula:
          '500M × 20% email × $0.0001/email = $10 000/day',
      },
    ],
  },
};
