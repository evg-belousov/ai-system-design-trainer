import type { Scenario } from '@/data/constructor/types';

export const newsFeedScenario: Scenario = {
  id: 'news-feed',
  title: 'News Feed (Instagram)',
  difficulty: 'senior',
  description:
    'Design a news feed system similar to Instagram for 1B+ users. ' +
    'The system must support publishing photos, videos, stories, building a personalized feed ' +
    'and delivering content with minimal latency worldwide.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'nf-requirements',
      title: 'System Requirements',
      description:
        'Define the content types and the feed ranking algorithm. ' +
        'These decisions determine the complexity of the entire rest of the architecture.',
      decisions: [
        {
          id: 'nf-content',
          category: 'Content',
          question: 'What content goes in the feed?',
          multiSelect: true,
          options: [
            {
              id: 'photos',
              label: 'Photos',
              description: 'Static images — the core Instagram format.',
              pros: [
                'Simple processing and storage',
                'Fast loading and rendering',
                'Caches well on a CDN',
              ],
              cons: [
                'Limited engagement compared to video',
                'Requires handling multiple resolutions and formats',
              ],
              bestWhen: 'The primary content format is static images',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'videos',
              label: 'Video (short-form, Reels)',
              description:
                'Short video clips (15-90 sec) — a key driver of engagement.',
              pros: [
                'High user engagement',
                'A major social media trend',
                'Monetization opportunity through ads',
              ],
              cons: [
                'Huge storage volumes',
                'Complex transcoding pipeline',
                'High CDN traffic cost',
              ],
              bestWhen: 'Engagement is critical and you compete with TikTok/YouTube Shorts',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: 2, cost: -2 },
              capacityImpact: [
                { label: 'Media storage (1 year)', value: '~15 PB/year', formula: 'Video: 10M posts/day × 30% video × 365 × avg 50MB = ~15 PB/year (on top of photo storage)' },
                { label: 'CDN bandwidth (peak)', value: '~145 GB/s', formula: '58K RPS × 30% video × avg 5MB stream chunk × 0.3 concurrency ≈ 145 GB/s peak' },
                { label: 'Transcode compute', value: '~35K jobs/hr', formula: '10M × 30% = 3M videos/day ÷ 24h ÷ 3.5 min avg encode ≈ 35K concurrent transcode jobs' },
              ],
            },
            {
              id: 'text-posts',
              label: 'Text posts',
              description: 'Text publications without mandatory media.',
              pros: [
                'Minimal storage load',
                'Simple indexing and search',
                'Fast delivery',
              ],
              cons: [
                'Low visual appeal',
                'Lower engagement on a visual social network',
              ],
              bestWhen: 'The platform is oriented toward text content (Twitter/Threads)',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'stories',
              label: 'Stories (ephemeral content, 24h)',
              description:
                'Temporary content that disappears after 24 hours. Displayed separately from the main feed.',
              pros: [
                'Encourages daily activity',
                'Automatic cleanup saves storage',
                'High engagement (FOMO effect)',
              ],
              cons: [
                'A separate storage pipeline and TTL logic',
                'Complex view-state synchronization',
                'Requires a separate UI flow',
              ],
              bestWhen: 'You need to drive daily user returns',
              impact: { latency: 0, scalability: -1, consistency: -1, complexity: 1, cost: -1 },
              capacityImpact: [
                { label: 'Stories storage (ephemeral)', value: '~200 TB live', formula: '500M DAU × 5% post stories × avg 3 stories × 1MB = 75 TB/day, 24h TTL ≈ ~200 TB peak' },
                { label: 'Stories read RPS', value: '~35K RPS', formula: '500M DAU × 6 story views/day / 86400 ≈ 35K additional read RPS' },
              ],
            },
          ],
        },
        {
          id: 'nf-ranking',
          category: 'Ranking',
          question: 'Feed ranking algorithm?',
          options: [
            {
              id: 'chronological',
              label: 'Chronological (reverse time)',
              description:
                'Posts are displayed in reverse chronological order. The simplest model.',
              pros: [
                'Simple implementation (ORDER BY created_at DESC)',
                'Predictability for the user',
                'No need for ML infrastructure',
              ],
              cons: [
                'The user misses important content',
                'Spam and low-quality content is not filtered out',
                'Declining engagement at scale',
              ],
              bestWhen: 'A small platform or an MVP without an ML team',
              impact: { latency: 2, scalability: 1, consistency: 1, complexity: -2, cost: 2 },
            },
            {
              id: 'ml-ranking',
              label: 'ML ranking (relevance)',
              description:
                'A machine learning model ranks content by predicted relevance. ' +
                'Instagram switched to ML ranking in 2016.',
              pros: [
                'Maximum user engagement',
                'Personalization to interests',
                'Filtering of low-quality content',
              ],
              cons: [
                'Complex ML infrastructure (training, inference)',
                'The "filter bubble" problem — information bubbles',
                'Unpredictable results for content creators',
              ],
              bestWhen: 'A large-scale platform with an ML team and training data',
              impact: { latency: -1, scalability: -1, consistency: -1, complexity: 2, cost: -2 },
            },
            {
              id: 'hybrid-ranking',
              label: 'Hybrid (ML + chronological toggle)',
              description:
                'ML ranking by default with the option to switch to a chronological feed. ' +
                "Instagram's actual approach since 2022.",
              pros: [
                'A balance of engagement and user control',
                'The ability to A/B test algorithms',
                'Reduces criticism of the "algorithmic feed"',
              ],
              cons: [
                'Double complexity: two feed modes',
                'Chronological mode can lower metrics',
                'More complex caching (different feeds)',
              ],
              bestWhen: 'A mature platform that wants to give the user a choice',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: 1, cost: -1 },
            },
          ],
        },
      ],
      tip:
        'Instagram supports photos, video (Reels) and Stories. ML ranking has been the industry standard since 2016, ' +
        'but after the 2022 criticism Instagram added a toggle to a chronological feed.',
    },

    // ── Step 2: Feed Generation ───────────────────────────────────────
    {
      id: 'nf-generation',
      title: 'Feed Generation',
      description:
        "The key architectural decision: when and how a user's feed is built. " +
        'The choice of fanout strategy determines the entire downstream architecture.',
      decisions: [
        {
          id: 'nf-fanout',
          category: 'Fanout strategy',
          question: 'Feed generation strategy?',
          options: [
            {
              id: 'fanout-on-write',
              label: 'Fanout on Write (push model)',
              description:
                "When a post is published, it is immediately written to the feeds of all the author's followers. " +
                'Pre-computed — reading the feed is instant.',
              pros: [
                'Instant feed reads (the data is already prepared)',
                'Simple client-side logic',
                'Predictable read latency',
              ],
              cons: [
                'The "celebrity problem": a post from an account with 100M followers = 100M writes',
                'High write and storage load',
                'Publishing delay for authors with a large number of followers',
              ],
              bestWhen: 'All users have roughly the same number of followers',
              impact: { latency: 2, scalability: -2, consistency: 1, complexity: 0, cost: -2 },
              capacityImpact: [
                { label: 'Fanout writes', value: '~2B/day', formula: '10M posts × avg 200 followers = 2B feed inserts/day' },
                { label: 'Feed write RPS', value: '~23K', formula: '2B / 86400 ≈ 23K writes/sec to feed cache' },
                { label: 'Feed cache (Redis)', value: '~4 TB', formula: '500M users × 500 post IDs × 8 bytes × 2 (sorted set overhead) ≈ 4 TB RAM' },
              ],
            },
            {
              id: 'fanout-on-read',
              label: 'Fanout on Read (pull model)',
              description:
                "The feed is built at request time: the system gathers the latest posts from all of the user's followees.",
              pros: [
                'No celebrity problem',
                'Saves on storage (no duplication)',
                'Instant publishing',
              ],
              cons: [
                'Slow feed reads (real-time aggregation)',
                'High database load on every request',
                'Hard to apply ML ranking in real time',
              ],
              bestWhen: 'A platform with a small number of users or no celebrities',
              impact: { latency: -2, scalability: 1, consistency: 1, complexity: 0, cost: 1 },
              capacityImpact: [
                { label: 'Fanout writes', value: '0', formula: 'No pre-computation — feed assembled at read time' },
                { label: 'Feed read compute', value: '~58K queries/sec', formula: 'Each feed open queries N followed users, merges + ranks' },
                { label: 'Feed cache (Redis)', value: '~0', formula: 'No pre-computed feed cache needed — saves RAM cost' },
              ],
            },
            {
              id: 'hybrid-fanout',
              label: 'Hybrid (push for regular users, pull for celebrities)',
              description:
                'A push model for users with <N followers, pull for celebrities. ' +
                'The actual approach of Facebook/Instagram. Solves the "Justin Bieber problem".',
              pros: [
                'Solves the celebrity problem',
                'Fast reads for the majority of users',
                'Scales to billions of users',
              ],
              cons: [
                'Complex logic: two feed-generation paths',
                'Defining the "celebrity" threshold requires tuning',
                'Merge on read to combine the push and pull parts',
              ],
              bestWhen: 'A large platform with an uneven follower distribution (Instagram, Facebook)',
              impact: { latency: 1, scalability: 2, consistency: 0, complexity: 1, cost: -1 },
              capacityImpact: [
                { label: 'Fanout writes', value: '~1.6B/day', formula: '~80% users have <10K followers → push path: 8M posts × 200 avg followers = 1.6B inserts/day' },
                { label: 'Feed write RPS', value: '~18.5K', formula: '1.6B / 86400 ≈ 18.5K writes/sec (20% less than pure push)' },
                { label: 'Feed read compute', value: '~5.8K queries/sec', formula: '~10% of feed reads need pull merge for celebrity posts: 58K × 10% ≈ 5.8K extra queries/sec' },
              ],
            },
          ],
        },
        {
          id: 'nf-feed-storage',
          category: 'Feed storage',
          question: 'Where to store the pre-computed feed?',
          options: [
            {
              id: 'redis-sorted-sets',
              label: 'Redis (Sorted Sets)',
              description:
                'A Sorted Set per user: score = timestamp, member = post_id. ' +
                'The standard Facebook approach for the feed timeline.',
              pros: [
                'Ultra-fast reads (O(log N) + O(K) for a range)',
                'Built-in sorting by timestamp',
                'Atomic add/remove operations',
              ],
              cons: [
                'In-RAM storage — expensive at scale',
                'Data loss on a crash without persistence',
                'A size limit per instance',
              ],
              bestWhen: 'You need minimal feed read latency and the budget allows in-memory storage',
              impact: { latency: 2, scalability: 0, consistency: -1, complexity: 0, cost: -2 },
              capacityImpact: [
                { label: 'Feed cache (Redis)', value: '~4 TB RAM', formula: '500M users × 500 post IDs × 8 bytes = 2 TB data + sorted set overhead ≈ 4 TB' },
                { label: 'Redis cluster nodes', value: '~130 nodes', formula: '4 TB / 32 GB per node ≈ 125 nodes + replicas' },
                { label: 'Redis cost estimate', value: '~$200K/mo', formula: '130 nodes × r6g.xlarge ($0.25/hr) × 730 hrs/mo ≈ $24K + replication ≈ $200K/mo for HA cluster' },
              ],
            },
            {
              id: 'cassandra-feed',
              label: 'Cassandra',
              description:
                'A wide-column store with partition key = user_id, clustering key = timestamp.',
              pros: [
                'Linear horizontal scaling',
                'High availability (multi-datacenter)',
                'More economical than RAM storage',
              ],
              cons: [
                'Higher latency than Redis (disk vs RAM)',
                'Complex operations (compaction, repair)',
                'Eventual consistency by default',
              ],
              bestWhen: 'Huge feed data volumes where Redis is too expensive',
              impact: { latency: 0, scalability: 2, consistency: -1, complexity: 1, cost: 0 },
              capacityImpact: [
                { label: 'Feed cache (Redis)', value: '~6 TB on disk', formula: '2 TB data × RF=3 = 6 TB with Cassandra replication' },
                { label: 'Cassandra nodes', value: '~30 nodes', formula: '6 TB / 200 GB per node ≈ 30 nodes (i3.xlarge with local SSD)' },
                { label: 'Feed read latency', value: '~5-10 ms', formula: 'SSD read vs Redis sub-ms — 10× slower but 5× cheaper per GB' },
              ],
            },
            {
              id: 'dynamodb-feed',
              label: 'DynamoDB',
              description:
                'Managed NoSQL from AWS with partition key = user_id and sort key = timestamp.',
              pros: [
                'Fully managed — minimal operations',
                'Automatic scaling',
                'DAX (in-memory cache) for acceleration',
              ],
              cons: [
                'Vendor lock-in (AWS)',
                'Cost grows unpredictably at scale',
                'Item size limit (400KB)',
              ],
              bestWhen: 'Infrastructure on AWS and the priority is minimal operations',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: -1 },
              capacityImpact: [
                { label: 'DynamoDB RCU', value: '~58K RCU', formula: '58K feed reads/sec × 1 RCU per 4KB eventually consistent read' },
                { label: 'DynamoDB cost', value: '~$150K/mo', formula: '58K RCU on-demand ($0.25/M reads) + 23K WCU ($1.25/M writes) + 2 TB storage ($0.25/GB)' },
              ],
            },
          ],
        },
      ],
      tip:
        'Hybrid fanout is the industry standard for Instagram-scale platforms. ' +
        'The "celebrity" threshold is usually set dynamically (for example, >10K followers). ' +
        'Redis sorted sets are the de facto standard for storing the pre-computed feed.',
    },

    // ── Step 3: Data Model & Storage ──────────────────────────────────
    {
      id: 'nf-storage',
      title: 'Data Model and Storage',
      description:
        'Decide where to store posts, metadata and media files. ' +
        'Separating "hot" metadata from "heavy" media is a key pattern.',
      decisions: [
        {
          id: 'nf-post-db',
          category: 'Posts database',
          question: 'Where to store posts/metadata?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL',
              description:
                'A powerful relational DBMS with support for JSON, full-text search and extensions.',
              pros: [
                'A rich set of data types and indexes',
                'ACID transactions for data integrity',
                'A strong ecosystem of extensions (PostGIS, pg_partman)',
              ],
              cons: [
                'Harder to shard natively than MySQL',
                'Vertical scaling has a limit',
                "Replication is less mature than MySQL's",
              ],
              bestWhen: 'You need complex queries and data types, scale up to millions of users',
              impact: { latency: 0, scalability: -1, consistency: 2, complexity: 0, cost: 0 },
            },
            {
              id: 'mysql-sharded',
              label: 'MySQL (sharded)',
              description:
                "Sharded MySQL — Facebook's historical choice. " +
                'Facebook built TAO — a cache layer on top of sharded MySQL.',
              pros: [
                'Proven at Facebook scale (billions of users)',
                'A mature sharding ecosystem (Vitess, ProxySQL)',
                'A simple and predictable data model',
              ],
              cons: [
                'Cross-shard queries are expensive',
                'A cache layer (TAO) is mandatory at scale',
                'Limited data types compared to PostgreSQL',
              ],
              bestWhen: 'Billions-of-users scale, readiness to invest in sharding infrastructure',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'cassandra-posts',
              label: 'Cassandra',
              description:
                'A distributed NoSQL store for write-heavy workloads.',
              pros: [
                'Linear write scaling',
                'High availability with no single point of failure',
                'Optimal for append-only data (posts)',
              ],
              cons: [
                'A limited query model (you must know the partition key)',
                'Eventual consistency complicates business logic',
                'No secondary indexes in the usual sense',
              ],
              bestWhen: 'A write-heavy workload and a simple key-based access model',
              impact: { latency: 0, scalability: 2, consistency: -2, complexity: 1, cost: 0 },
            },
            {
              id: 'dynamodb-posts',
              label: 'DynamoDB',
              description:
                'Managed NoSQL with predictable performance.',
              pros: [
                'Fully managed — zero operations',
                'Predictable latency at any scale',
                'Built-in backups and point-in-time recovery',
              ],
              cons: [
                'Vendor lock-in (AWS)',
                'A complex and expensive pricing model',
                'Limits on item size and queries',
              ],
              bestWhen: 'A team on AWS with no desire to manage a database',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: -1 },
            },
          ],
        },
        {
          id: 'nf-media',
          category: 'Media storage',
          question: 'Media storage and delivery?',
          options: [
            {
              id: 's3-cdn',
              label: 'S3 + CloudFront CDN',
              description:
                'Object storage (S3) for storage + a CDN for global delivery. The standard industry pattern.',
              pros: [
                'Practically unlimited storage',
                'Global delivery via a CDN with low latency',
                'High durability (11 nines)',
              ],
              cons: [
                'Egress traffic cost at scale',
                'Dependence on a single cloud provider',
                'CDN cache invalidation is not instant',
              ],
              bestWhen: 'The standard choice for most projects',
              impact: { latency: 1, scalability: 2, consistency: 0, complexity: -1, cost: -1 },
              capacityImpact: [
                { label: 'S3 storage cost', value: '~$170K/mo', formula: '7.3 PB × $0.023/GB = ~$170K/mo for S3 Standard' },
                { label: 'CDN egress cost', value: '~$2.2M/mo', formula: '29 GB/s × 86400 × 30 × $0.085/GB ≈ $2.2M/mo CloudFront egress' },
                { label: 'CDN bandwidth (peak)', value: '~29 GB/s', formula: '58K RPS × avg 500 KB media payload = ~29 GB/s peak' },
              ],
            },
            {
              id: 'custom-blob-cdn',
              label: 'Custom blob storage + CDN',
              description:
                "A custom large-object store (like Facebook's Haystack) + a custom CDN.",
              pros: [
                'Full control over cost and performance',
                'Optimization for specific access patterns',
                'No vendor lock-in',
              ],
              cons: [
                'Huge development and operational costs',
                'Requires an infrastructure team',
                'Risk of data loss from implementation bugs',
              ],
              bestWhen: 'Facebook/Google scale, where cloud cost is unacceptable',
              impact: { latency: 1, scalability: 2, consistency: 0, complexity: 2, cost: 1 },
            },
            {
              id: 'multi-tier-storage',
              label: 'Multi-tier storage (hot/warm/cold)',
              description:
                'Hot data on SSD/CDN, warm on standard S3, cold on Glacier/archival storage.',
              pros: [
                'Storage cost optimization',
                'Hot content is served quickly',
                'Automatic migration via lifecycle rules',
              ],
              cons: [
                'Complex tier-migration logic',
                'Latency when accessing cold data',
                'A need to monitor access patterns',
              ],
              bestWhen: 'A huge content archive with an uneven access pattern',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 1, cost: 1 },
              capacityImpact: [
                { label: 'S3 storage cost', value: '~$65K/mo', formula: 'Hot 10%: 730 TB × $0.023 = $17K; Warm 30%: 2.2 PB × $0.0125 = $28K; Cold 60%: 4.4 PB × $0.004 = $18K ≈ $65K/mo' },
                { label: 'Storage savings vs S3', value: '~60%', formula: '$65K vs $170K for flat S3 Standard = ~60% savings on storage costs' },
              ],
            },
          ],
        },
      ],
      tip:
        'Facebook historically uses sharded MySQL + TAO (a cache layer for the social graph). ' +
        'For media Facebook built Haystack (custom blob storage), but S3 + CDN is a sensible choice for most.',
    },

    // ── Step 4: Architecture ──────────────────────────────────────────
    {
      id: 'nf-architecture',
      title: 'Service Architecture',
      description:
        'Choose the architectural style and the way asynchronous tasks are handled. ' +
        'Proper service decomposition is the key to independent scaling.',
      decisions: [
        {
          id: 'nf-services',
          category: 'Architecture',
          question: 'Service architecture?',
          options: [
            {
              id: 'monolith',
              label: 'Monolith',
              description:
                'A single application with all the business logic. Instagram started as a Django monolith.',
              pros: [
                'A fast development start',
                'Simple deployment and debugging',
                'No network calls between components',
              ],
              cons: [
                'Impossible to scale components independently',
                'A single point of failure',
                'Complexity grows exponentially with team size',
              ],
              bestWhen: 'A startup / MVP with a team of up to 10 developers',
              impact: { latency: 1, scalability: -2, consistency: 1, complexity: -2, cost: 1 },
            },
            {
              id: 'microservices',
              label: 'Microservices (Post, Feed, User, Media)',
              description:
                'Decomposition into independent services: Post Service, Feed Service, User Service, Media Service. ' +
                'Each scales and deploys independently.',
              pros: [
                'Independent scaling of services',
                'Failure isolation (a Media failure does not affect Feed)',
                'Parallel development by teams',
              ],
              cons: [
                'Distributed-systems complexity (network, consistency)',
                'Overhead on inter-service calls',
                'Complex monitoring and debugging',
              ],
              bestWhen: 'A large team (50+ developers), different load patterns across components',
              impact: { latency: -1, scalability: 2, consistency: -1, complexity: 1, cost: -1 },
            },
            {
              id: 'service-mesh',
              label: 'Service Mesh + microservices',
              description:
                'Microservices with a service mesh (Istio, Envoy) for traffic management, security and observability.',
              pros: [
                'Centralized traffic management (retries, circuit breakers)',
                'mTLS between services out of the box',
                'Advanced observability (distributed tracing)',
              ],
              cons: [
                'Significant infrastructure overhead',
                'Additional latency from the sidecar proxy',
                'A steep learning curve',
              ],
              bestWhen: 'A mature platform with hundreds of microservices and a dedicated platform team',
              impact: { latency: -1, scalability: 2, consistency: 0, complexity: 2, cost: -2 },
            },
          ],
        },
        {
          id: 'nf-async',
          category: 'Asynchronous processing',
          question: 'Asynchronous task processing?',
          options: [
            {
              id: 'celery-sidekiq',
              label: 'Celery / Sidekiq (task queue)',
              description:
                'Task queues with workers. Instagram initially used Celery + RabbitMQ.',
              pros: [
                'A simple "task → worker" model',
                'Retry/backoff out of the box',
                'Mature libraries for Python/Ruby',
              ],
              cons: [
                'Limited throughput at scale',
                'No processing-order guarantee',
                'Hard to scale the task queue horizontally',
              ],
              bestWhen: 'Medium scale, a Python/Ruby stack, up to millions of tasks per day',
              impact: { latency: 0, scalability: -1, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'kafka',
              label: 'Kafka (event streaming)',
              description:
                'A distributed event streaming platform. ' +
                'Instagram migrated from Celery to Kafka for scaling.',
              pros: [
                'Huge throughput (millions of msg/sec)',
                'Ordering guarantee within a partition',
                'The ability to re-read (replay) events',
              ],
              cons: [
                'Complex operations (partition rebalancing, consumer groups)',
                'Higher latency than direct calls',
                'Eventual consistency — must be accounted for in design',
              ],
              bestWhen: 'Billions-of-events scale, an event-driven architecture',
              impact: { latency: 0, scalability: 2, consistency: -1, complexity: 1, cost: -1 },
            },
            {
              id: 'sqs-lambda',
              label: 'SQS + Lambda (serverless)',
              description:
                'A managed queue + serverless processing. Auto-scaling with no server management.',
              pros: [
                'Zero infrastructure operations',
                'Automatic scaling from zero',
                'Pay-per-use',
              ],
              cons: [
                'Cold start adds latency',
                'Vendor lock-in (AWS)',
                'Lambda limits (15min timeout, memory)',
              ],
              bestWhen: 'A team on AWS, sporadic load, the priority is minimal ops',
              impact: { latency: -1, scalability: 1, consistency: 0, complexity: -1, cost: 0 },
            },
          ],
        },
      ],
      tip:
        'Instagram started as a Django monolith, then moved to microservices. ' +
        'For asynchronous tasks (fanout, transcoding, notifications) Kafka is the standard at Instagram scale.',
    },

    // ── Step 5: Scaling & Performance ─────────────────────────────────
    {
      id: 'nf-scaling',
      title: 'Scaling and Performance',
      description:
        'Define the caching and database-scaling strategy. ' +
        'At 1B+ users, multi-tier caching is not an optimization but a necessity.',
      decisions: [
        {
          id: 'nf-cache',
          category: 'Caching',
          question: 'Caching strategy?',
          multiSelect: true,
          options: [
            {
              id: 'cdn-cache',
              label: 'CDN edge cache (media)',
              description:
                'Caching images and videos on CDN edge servers closer to the user.',
              pros: [
                'Minimal latency for media (the nearest PoP)',
                'Reduced load on the origin server',
                'Global availability',
              ],
              cons: [
                'CDN traffic cost at scale',
                'Complex invalidation when media is updated',
                'Cache miss on unpopular content',
              ],
              bestWhen: 'Any platform with media content — a mandatory layer',
              impact: { latency: 2, scalability: 2, consistency: -1, complexity: 0, cost: -1 },
            },
            {
              id: 'app-cache',
              label: 'Application cache (Redis/Memcached)',
              description:
                'Caching user profiles, post metadata and the social graph.',
              pros: [
                'Reduces database load by 10-100x',
                'Microsecond latency on cache hits',
                'Flexible invalidation strategies',
              ],
              cons: [
                'Additional infrastructure to manage',
                'The cache stampede problem on mass invalidation',
                'RAM cost at scale',
              ],
              bestWhen: 'Any at-scale platform — a mandatory layer',
              impact: { latency: 2, scalability: 1, consistency: -1, complexity: 0, cost: -1 },
            },
            {
              id: 'feed-cache',
              label: 'Feed cache (pre-computed feeds)',
              description:
                "Caching users' ready feeds (the result of fanout on write).",
              pros: [
                'Instant feed display',
                'Predictable latency regardless of the number of followees',
                'Offloads the feed-generation service',
              ],
              cons: [
                'A huge data volume (a feed per user)',
                'Complex synchronization on post deletion/editing',
                'Expensive RAM storage',
              ],
              bestWhen: 'Fanout on write or a hybrid strategy is used',
              impact: { latency: 2, scalability: 0, consistency: -1, complexity: 1, cost: -2 },
            },
            {
              id: 'db-query-cache',
              label: 'Database query cache',
              description:
                'Caching the results of frequent SQL queries at the database or ORM level.',
              pros: [
                'Transparent to the application',
                'Reduced database load',
                'Simple implementation',
              ],
              cons: [
                'Low hit rate for personalized queries',
                'Invalidation on data updates',
                'Does not replace the application cache at scale',
              ],
              bestWhen: 'An additional optimization on top of the main caching layers',
              impact: { latency: 1, scalability: 0, consistency: -1, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'nf-db-scaling',
          category: 'DB scaling',
          question: 'Database scaling?',
          options: [
            {
              id: 'read-replicas',
              label: 'Read replicas',
              description:
                'A master for writes, replicas for reads. The simplest way to scale a read-heavy workload.',
              pros: [
                'Simple setup and operations',
                'Linear read scaling',
                'Replicas as a hot standby for failover',
              ],
              cons: [
                'Does not solve write scaling',
                'Replication lag — stale data on reads',
                'A limit on the number of replicas (usually 5-15)',
              ],
              bestWhen: 'A read-heavy workload with a moderate write volume',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: -1, cost: -1 },
              capacityImpact: [
                { label: 'Read capacity', value: '×4-8', formula: '4-8 read replicas, each handles ~10K RPS → total ~40-80K read RPS' },
                { label: 'Replication lag', value: '~100-500 ms', formula: 'Async replication lag depends on write load; at ~10K writes/sec expect 100-500 ms' },
              ],
            },
            {
              id: 'sharding-by-user',
              label: 'Sharding by user ID',
              description:
                "A user's data is stored on a single shard, determined by a hash of user_id.",
              pros: [
                'Scaling of both reads and writes',
                "A user's data is local (one shard)",
                'Predictable latency',
              ],
              cons: [
                'Cross-shard queries (a feed of posts from different shards)',
                'Shard rebalancing when adding nodes',
                'Hot shards under an uneven distribution',
              ],
              bestWhen: 'Hundreds-of-millions-of-users scale, you need to scale writes',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: 1, cost: 0 },
              capacityImpact: [
                { label: 'Number of shards', value: '~64-256', formula: '1B users × 5KB avg row × 10 rows avg = 50 TB data ÷ 200-800 GB per shard ≈ 64-256 shards' },
                { label: 'Write RPS per shard', value: '~40-160', formula: '~10K total write RPS ÷ 64-256 shards ≈ 40-160 writes/sec per shard' },
              ],
            },
            {
              id: 'vitess',
              label: 'Vitess (MySQL sharding layer)',
              description:
                'A horizontal sharding layer for MySQL. Built by YouTube, used at Slack, GitHub.',
              pros: [
                'Transparent sharding for the application',
                'Automatic rebalancing',
                'Proven at YouTube scale',
              ],
              cons: [
                'Complex infrastructure (VTGate, VTTablet, topology)',
                'Restrictions on SQL query types',
                'A small community compared to native solutions',
              ],
              bestWhen: 'A MySQL stack, you need managed sharding without a full app rewrite',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'sharding-replicas',
              label: 'Sharding + read replicas',
              description:
                'A combination of sharding to scale writes and replicas to scale reads. ' +
                "Facebook's actual approach (sharded MySQL + replicas per shard).",
              pros: [
                'Scaling of both reads and writes',
                'Replicas for failover of each shard',
                'Proven at Facebook scale',
              ],
              cons: [
                'Maximum operational complexity',
                'A large number of database servers',
                'A complex topology to monitor',
              ],
              bestWhen: 'Billions-of-users scale (Facebook, Instagram)',
              impact: { latency: 1, scalability: 2, consistency: 0, complexity: 2, cost: -2 },
              capacityImpact: [
                { label: 'Total DB nodes', value: '~384-768', formula: '128 shards × 3-6 replicas per shard = 384-768 DB instances' },
                { label: 'Read capacity', value: '~500K+ RPS', formula: '128 shards × 4 replicas × 1K RPS each ≈ 512K total read RPS' },
                { label: 'Write capacity', value: '~128K RPS', formula: '128 shards × ~1K write RPS each = 128K total write RPS' },
              ],
            },
          ],
        },
      ],
      tip:
        'At Instagram scale, multi-tier caching is mandatory: a CDN for media, Redis/Memcached for metadata, ' +
        'pre-computed feeds in Redis. Facebook uses sharded MySQL with replicas and TAO as a cache layer.',
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'nf-reliability',
      title: 'Reliability and Fault Tolerance',
      description:
        'Define the consistency model and degradation strategy. ' +
        'At 1B+ user scale, failures are inevitable — the question is how the system survives them.',
      decisions: [
        {
          id: 'nf-consistency',
          category: 'Consistency',
          question: 'Feed consistency model?',
          options: [
            {
              id: 'strong-consistency',
              label: 'Strong consistency',
              description:
                'All users see the same feed state at any moment.',
              pros: [
                'Predictable behavior — a post is visible to everyone at once',
                'No "ghost" post problem',
                'A simple mental model for development',
              ],
              cons: [
                'Significantly reduces availability (the CAP theorem)',
                'High latency due to synchronous replication',
                'Does not scale to billions of users',
              ],
              bestWhen: 'Critical data integrity (finance), not a social network',
              impact: { latency: -2, scalability: -2, consistency: 2, complexity: 1, cost: -1 },
            },
            {
              id: 'eventual-consistency',
              label: 'Eventual consistency',
              description:
                'Data propagates asynchronously — all replicas converge "eventually".',
              pros: [
                'Maximum availability and speed',
                'Simple implementation with asynchronous replication',
                'Scales well',
              ],
              cons: [
                'A user may not see their own post immediately',
                'Conflicts possible with simultaneous updates',
                'Complex debugging of anomalies',
              ],
              bestWhen: 'Non-critical data where delay is acceptable (likes, counters)',
              impact: { latency: 2, scalability: 2, consistency: -2, complexity: -1, cost: 1 },
            },
            {
              id: 'read-your-writes',
              label: 'Read-your-writes consistency',
              description:
                'The user always sees their own actions (posts, likes), ' +
                'while the rest of the followers receive updates with a slight delay. ' +
                'The standard for social networks.',
              pros: [
                'The user sees their post instantly',
                'Followers see the post with an acceptable delay (seconds)',
                'A balance between UX and scaling',
              ],
              cons: [
                'Reads must be routed to the master for "own" data',
                'Sticky sessions or versioning are needed for correct behavior',
                'More complex than pure eventual consistency',
              ],
              bestWhen: 'Social networks, blogs, any UGC platform',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
          ],
        },
        {
          id: 'nf-degradation',
          category: 'Degradation',
          question: 'Degradation strategy under load?',
          options: [
            {
              id: 'show-cached-feed',
              label: 'Show a cached/stale feed',
              description:
                'Under overload, serve the last cached version of the feed even if it is not current.',
              pros: [
                'The user sees content (stale is better than an error)',
                'Minimal backend load',
                'Instant switchover with no extra logic',
              ],
              cons: [
                'The user may see already-deleted content',
                'Missing fresh posts',
                'Needs a mechanism to determine cache "freshness"',
              ],
              bestWhen: 'The first line of defense — always show at least something',
              impact: { latency: 2, scalability: 2, consistency: -2, complexity: -1, cost: 1 },
            },
            {
              id: 'reduce-ranking',
              label: 'Simplify ranking (chrono fallback)',
              description:
                'Switching from heavy ML ranking to simple chronological sorting.',
              pros: [
                'A significant reduction in ML-inference load',
                'The feed stays current',
                'The user may not notice the change',
              ],
              cons: [
                'Reduced feed relevance',
                'A drop in engagement metrics',
                'Need to implement two ranking pipelines',
              ],
              bestWhen: 'ML ranking is the main resource consumer',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: 0, cost: 1 },
            },
            {
              id: 'limit-feed-depth',
              label: 'Limit feed depth (top-N)',
              description:
                'Show only the N latest/best posts instead of the full feed.',
              pros: [
                'Predictable load for serving a request',
                'Reduced data volume in the response',
                'Users usually do not scroll past 50-100 posts',
              ],
              cons: [
                'The user cannot reach old content',
                'A problem for power users used to deep scrolling',
                'Need to notify the user of the limit',
              ],
              bestWhen: 'You need to limit load while keeping content current',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'circuit-breaker',
              label: 'Circuit breaker on non-critical features',
              description:
                'Disabling non-critical functions (recommendations, analytics, stories) to protect the core feed.',
              pros: [
                'Protects the core functionality (the feed)',
                'Frees up resources for the critical path',
                'Automatic recovery when load normalizes',
              ],
              cons: [
                'A need to prioritize all features (what to disable first)',
                'Loss of some functionality for the user',
                'Complex configuration of trigger thresholds',
              ],
              bestWhen: 'The system has a clear split into critical and non-critical components',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: 1, cost: 0 },
            },
          ],
        },
      ],
      tip:
        'Read-your-writes consistency is the standard for social networks: the user sees their post instantly, ' +
        'followers within a few seconds. For degradation, use a combination of approaches: ' +
        'cached feed → simplified ranking → circuit breaker.',
    },
  ],

  // ── Reference Solution ────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'nf-content': ['photos', 'videos', 'stories'],
      'nf-ranking': ['hybrid-ranking'],
      'nf-fanout': ['hybrid-fanout'],
      'nf-feed-storage': ['redis-sorted-sets'],
      'nf-post-db': ['mysql-sharded'],
      'nf-media': ['s3-cdn'],
      'nf-services': ['microservices'],
      'nf-async': ['kafka'],
      'nf-cache': ['cdn-cache', 'app-cache', 'feed-cache'],
      'nf-db-scaling': ['sharding-replicas'],
      'nf-consistency': ['read-your-writes'],
      'nf-degradation': ['show-cached-feed'],
    },
    explanation:
      'Hybrid fanout is the key decision for Instagram scale. Regular users (<10K followers) ' +
      'use the push model: on publish, a post is written to the Redis sorted sets of all followers. ' +
      'For celebrities (>10K followers) the pull model is used: their posts are pulled in when the feed is read ' +
      'and merged with the pre-computed part. This solves the "Justin Bieber problem" — a post from an account with 500M ' +
      'followers does not generate 500M writes.\n\n' +
      'Sharded MySQL with read replicas (like Facebook) provides metadata scaling. ' +
      'A TAO-like cache layer reduces database load. Media is stored in S3 and served via a CDN.\n\n' +
      'Kafka provides asynchronous processing: fanout, video transcoding, sending notifications. ' +
      'Multi-tier caching (CDN → Redis/Memcached → Feed cache) is mandatory at 1B+ users.\n\n' +
      'Read-your-writes consistency guarantees that the author sees their post instantly, ' +
      'while followers receive it with an acceptable delay of a few seconds.',
    diagram:
      '┌─────────┐     ┌─────────────┐     ┌──────┐     ┌──────────────┐\n' +
      '│  Client │────▶│ CDN (media) │     │  LB  │────▶│ Feed Service │\n' +
      '└─────────┘     └─────────────┘     └──────┘     └──────┬───────┘\n' +
      '                                                        │\n' +
      '                                       ┌────────────────┼────────────────┐\n' +
      '                                       ▼                ▼                ▼\n' +
      '                                ┌─────────────┐  ┌─────────────┐  ┌───────────┐\n' +
      '                                │ Feed Cache  │  │Post Service │  │User Service│\n' +
      '                                │   (Redis)   │  └──────┬──────┘  └───────────┘\n' +
      '                                └─────────────┘         │\n' +
      '                                                        ▼\n' +
      '                                                 ┌─────────────┐\n' +
      '                                                 │  Post DB    │\n' +
      '                                                 │(MySQL shards│\n' +
      '                                                 │+ replicas)  │\n' +
      '                                                 └─────────────┘\n' +
      '\n' +
      '── Publish Flow ──────────────────────────────────────────────\n' +
      '\n' +
      '┌───────────┐     ┌──────────────┐     ┌───────┐     ┌──────────────────┐\n' +
      '│ Publisher │────▶│ Post Service │────▶│ Kafka │────▶│ Fanout Service   │\n' +
      '└───────────┘     └──────┬───────┘     └───────┘     └────────┬─────────┘\n' +
      '                         │                                    │\n' +
      '                         ▼                          ┌─────────┴─────────┐\n' +
      '                  ┌─────────────┐                   ▼                   ▼\n' +
      '                  │Media Service│          ┌──────────────┐   ┌─────────────────┐\n' +
      '                  └──────┬──────┘          │ Feed Cache   │   │ Skip for celebs │\n' +
      '                         │                 │(Redis sorted │   │ (pull on read)  │\n' +
      '                         ▼                 │   sets)      │   └─────────────────┘\n' +
      '                  ┌─────────────┐          └──────────────┘\n' +
      '                  │  S3 → CDN   │\n' +
      '                  └─────────────┘',
  },

  capacityEstimates: {
    default: [
      {
        label: 'DAU',
        value: '500M',
        formula: '1B registered users × ~50% daily active = 500M DAU',
      },
      {
        label: 'Feed reads/sec',
        value: '~58K RPS',
        formula: '500M DAU × 10 feed opens/day / 86 400 sec ≈ 57 870 ≈ ~58K RPS',
      },
      {
        label: 'Posts per day',
        value: '10M posts/day',
        formula: '500M DAU × 2% post daily = 10M new posts/day',
      },
      {
        label: 'Fanout writes',
        value: '2B feed inserts/day',
        formula: '10M posts/day × avg 200 followers = 2B feed inserts/day',
      },
      {
        label: 'Media storage (1 year)',
        value: '~7.3 PB/year',
        formula: '10M posts/day × 365 days × avg 2 MB (compressed photo) = 7.3 PB/year',
      },
      {
        label: 'Feed cache (Redis)',
        value: '~2 TB',
        formula: '500M users × 500 post IDs × 8 bytes per ID = 2 TB',
      },
      {
        label: 'CDN bandwidth (peak)',
        value: '~29 GB/s',
        formula: '58K RPS × avg 500 KB media payload = ~29 GB/s peak',
      },
    ],
  },
};
