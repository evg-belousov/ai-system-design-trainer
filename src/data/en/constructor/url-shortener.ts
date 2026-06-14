import type { Scenario } from '@/data/constructor/types';

export const urlShortenerScenario: Scenario = {
  id: 'url-shortener',
  title: 'URL Shortener',
  description:
    'Design a link shortening service (similar to Bitly/TinyURL) for 100 million daily active users. The system must generate short unique links, redirect with minimal latency, and optionally collect click analytics.',
  difficulty: 'middle',
  steps: [
    // ────────────────────────────────────────────
    // Step 1: Requirements Clarification
    // ────────────────────────────────────────────
    {
      id: 'url-requirements',
      title: 'Requirements Clarification',
      description:
        'Define the scale of the system and the set of functional requirements. All subsequent architectural decisions depend on this.',
      decisions: [
        {
          id: 'url-scale',
          category: 'Scale',
          question: 'What is the scale of the system?',
          options: [
            {
              id: 'small-scale',
              label: 'Small (1M DAU)',
              description:
                'A small service: ~1 million daily active users, ~10 million links, ~100 redirects/sec at peak.',
              pros: [
                'Minimal infrastructure costs',
                'Simple architecture — a single server handles the load',
                'Fast launch and iterations',
              ],
              cons: [
                'Limited growth potential without re-architecting',
                'Not suitable for a global product',
                'Single server — a single point of failure',
              ],
              bestWhen:
                'An internal corporate tool or an MVP with a limited audience.',
              impact: {
                latency: 1,
                scalability: -2,
                consistency: 1,
                complexity: -2,
                cost: -2,
              },
              capacityImpact: [
                { label: 'DAU / MAU', value: '1M DAU', formula: 'Small scale: 1M DAU' },
                { label: 'Write RPS', value: '~1.2', formula: '1M × 0.1 / 86400 ≈ 1.2 RPS' },
                { label: 'Read RPS', value: '~120', formula: 'Read:Write = 100:1 → 1.2 × 100 = 120 RPS' },
                { label: 'Storage (1 year)', value: '~18 GB', formula: '1M × 0.1 × 365 = 36.5M URLs × 500 bytes ≈ 18 GB' },
                { label: 'Cache memory (20% hot URLs)', value: '~1 GB', formula: '36.5M × 20% × 500 bytes ≈ 3.6 GB, but only active subset ≈ 1 GB' },
                { label: 'Bandwidth (outbound)', value: '~60 KB/s', formula: '120 RPS × 500 bytes ≈ 60 KB/s' },
              ],
            },
            {
              id: 'medium-scale',
              label: 'Medium (100M DAU)',
              description:
                'A large service: ~100 million DAU, ~1 billion links, ~10,000 redirects/sec at peak. A typical Bitly scale.',
              pros: [
                'Covers most real-world business scenarios',
                'Requires well-thought-out caching and sharding',
                'Optimal balance of complexity and functionality',
              ],
              cons: [
                'Requires distributed infrastructure',
                'Requires caching and data partitioning',
                'Significant infrastructure costs',
              ],
              bestWhen:
                'A product service with a global audience, similar to Bitly or TinyURL.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'large-scale',
              label: 'Large (1B DAU)',
              description:
                'Hyperscale: ~1 billion DAU, ~10 billion links, ~100,000 redirects/sec. The level of a service built into a social network.',
              pros: [
                'The system withstands extreme loads',
                'Ready for viral content and DDoS',
                'Global coverage with minimal latency',
              ],
              cons: [
                'Very high design and operational complexity',
                'Significant costs for multi-region infrastructure',
                'Requires a large engineering team for support',
              ],
              bestWhen:
                'A service built into a major platform (Twitter, Facebook) or a global SaaS at the t.co level.',
              impact: {
                latency: -1,
                scalability: 2,
                consistency: -1,
                complexity: 2,
                cost: 2,
              },
              capacityImpact: [
                { label: 'DAU / MAU', value: '1B DAU', formula: 'Large scale: 1B DAU' },
                { label: 'Write RPS', value: '~1.2K', formula: '1B × 0.1 / 86400 ≈ 1,160 RPS' },
                { label: 'Read RPS', value: '~116K', formula: 'Read:Write = 100:1 → 1,160 × 100 ≈ 116K RPS' },
                { label: 'Storage (1 year)', value: '~18 TB', formula: '1B × 0.1 × 365 = 36.5B URLs × 500 bytes ≈ 18 TB' },
                { label: 'Cache memory (20% hot URLs)', value: '~1 TB', formula: '116K RPS × 86400 ≈ 10B reads/day, top 20% ≈ 2B URLs × 500 bytes ≈ 1 TB' },
                { label: 'Bandwidth (outbound)', value: '~58 MB/s', formula: '116K RPS × 500 bytes ≈ 58 MB/s' },
              ],
            },
          ],
        },
        {
          id: 'url-features',
          category: 'Functionality',
          question: 'Which additional features should be supported?',
          multiSelect: true,
          options: [
            {
              id: 'analytics',
              label: 'Click analytics',
              description:
                'Tracking click counts, geography, traffic sources, and devices (referrer, user-agent, IP geolocation).',
              pros: [
                'Key business value — users see statistics',
                'Monetization through paid plans with advanced analytics',
                'The data helps detect abuse',
              ],
              cons: [
                'An extra write on each redirect increases latency',
                'Analytics data volume grows linearly with traffic',
                'Requires a separate pipeline for aggregation (Kafka, ClickHouse)',
              ],
              bestWhen:
                'A commercial product where analytics is the core value for users.',
              impact: {
                latency: -1,
                scalability: -1,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'Analytics write RPS', value: '= Read RPS', formula: 'Each redirect = 1 analytics event. At 11.6K read RPS → 11.6K analytics writes/sec' },
                { label: 'Analytics storage (1 year)', value: '~36 TB', formula: '11.6K RPS × 86400 × 365 × 100 bytes (timestamp, short_url, IP, referrer, UA) ≈ 36 TB/year' },
                { label: 'Kafka throughput', value: '~1.2 MB/s', formula: '11.6K events/sec × 100 bytes ≈ 1.2 MB/s → 1 Kafka partition is enough' },
                { label: 'ClickHouse cluster', value: '3+ nodes', formula: '36 TB/year ÷ 12 TB per node (compression ~10×) ≈ 3 nodes with replication' },
              ],
            },
            {
              id: 'custom-aliases',
              label: 'Custom aliases',
              description:
                'Lets users set their own short keys (for example, bit.ly/my-brand).',
              pros: [
                'Branded links increase CTR',
                'Memorable URLs for marketing campaigns',
                'A competitive advantage for the product',
              ],
              cons: [
                'Requires a uniqueness check with race conditions',
                'Filtering of profanity and reserved words',
                'Increases the key space and complicates validation',
              ],
              bestWhen:
                'A product for marketers and brands, where custom links are a paid feature.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: -1,
                complexity: 1,
                cost: 0,
              },
              capacityImpact: [
                { label: 'Uniqueness check RPS', value: '~116 RPS', formula: 'Each write with a custom alias requires a lookup: equals Write RPS' },
                { label: 'Bloom filter memory', value: '~500 MB', formula: '3.65B URLs × 1 bit × 10 (FP rate 1%) ≈ 4.5 GB, or ~500 MB with a probabilistic structure' },
              ],
            },
            {
              id: 'link-expiration',
              label: 'Link expiration',
              description:
                'Automatic deletion or deactivation of links after a set time (TTL).',
              pros: [
                'Storage savings — old links are deleted automatically',
                'Improves security for temporary links',
                'Frees up short keys for reuse',
              ],
              cons: [
                'Requires a background cleanup process (cron / TTL in the DB)',
                'Users may lose links without warning',
                'The cache must account for link TTL',
              ],
              bestWhen:
                'A service with a limited key space or security requirements.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: -1,
              },
              capacityImpact: [
                { label: 'Storage savings', value: '~30-50%', formula: 'With avg TTL of 1 year: storage stabilizes at ~1.8 TB instead of infinite growth' },
                { label: 'Cleanup job', value: '~4.2K deletes/sec', formula: '3.65B URLs/year ÷ 365 ÷ 86400 ≈ 4.2K expired URLs/sec to delete' },
              ],
            },
            {
              id: 'qr-codes',
              label: 'QR codes',
              description:
                'Automatic generation of a QR code for each short link.',
              pros: [
                'In demand in offline marketing and retail',
                'Simple to implement using off-the-shelf libraries',
                'Extra value for users at low cost',
              ],
              cons: [
                'Image generation increases CPU load',
                'Requires image storage (S3/CDN)',
                'The QR must be invalidated when the link changes',
              ],
              bestWhen:
                'A product oriented toward offline marketing and physical media.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'QR image storage', value: '~73 GB/year', formula: '3.65B URLs × 20% use QR × 100 bytes (SVG) ≈ 73 GB' },
                { label: 'QR generation CPU', value: '~23 RPS', formula: '116 write RPS × 20% QR requests ≈ 23 QR generations/sec, ~50ms each' },
              ],
            },
          ],
        },
      ],
      tip: 'In an interview, always clarify the scale and features before you start designing. For a URL shortener, the key question is the read-to-write ratio (usually 100:1).',
    },

    // ────────────────────────────────────────────
    // Step 2: API Design
    // ────────────────────────────────────────────
    {
      id: 'url-api',
      title: 'API Design',
      description:
        'Define the interaction protocol and the semantics of HTTP redirects. The choice of redirect code is one of the key trade-offs in a URL shortener.',
      decisions: [
        {
          id: 'url-protocol',
          category: 'Protocol',
          question: 'Which protocol for the API?',
          options: [
            {
              id: 'rest',
              label: 'REST',
              description:
                'A classic REST API over HTTP/JSON: POST /api/urls to create, GET /{shortKey} to redirect.',
              pros: [
                'Standard and well understood — easy for any client to integrate',
                'Works great with CDN and caching',
                'The broadest ecosystem of tools and libraries',
              ],
              cons: [
                'Over-fetching / under-fetching of data',
                'No strict contract typing without additional tooling',
                'Complex analytics queries require many endpoints',
              ],
              bestWhen:
                'A public API for a URL shortener — the industry standard. Bitly, TinyURL, and Rebrandly use REST.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'grpc',
              label: 'gRPC',
              description:
                'A binary protocol based on Protocol Buffers and HTTP/2. Used for service-to-service communication.',
              pros: [
                'High performance thanks to binary serialization',
                'Strongly typed contracts via .proto files',
                'Support for streaming and bidirectional communication',
              ],
              cons: [
                'Does not work directly from the browser without a grpc-web proxy',
                'Harder to debug — the binary format is not human-readable',
                'Overkill for a simple CRUD service',
              ],
              bestWhen:
                'Internal service-to-service communication, or if the URL shortener is part of a large microservice platform with a gRPC stack.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 1,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'graphql',
              label: 'GraphQL',
              description:
                'A query language for APIs that lets the client request only the fields it needs.',
              pros: [
                'The client requests exactly the data it needs',
                'A single endpoint for all operations',
                'Convenient for complex analytics queries with nested data',
              ],
              cons: [
                'Excessive complexity for simple create/redirect operations',
                'Harder to cache at the HTTP level (one URL for all queries)',
                'The N+1 problem with careless resolver implementation',
              ],
              bestWhen:
                'If the URL shortener is part of a larger product with a single GraphQL gateway and a complex analytics dashboard.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 1,
                cost: 0,
              },
            },
          ],
        },
        {
          id: 'url-redirect',
          category: 'Redirect',
          question: 'Which HTTP code for the redirect?',
          options: [
            {
              id: '301-redirect',
              label: '301 Moved Permanently',
              description:
                'The browser caches the redirect forever. Subsequent requests never reach the server — the browser redirects locally.',
              pros: [
                'Minimal load on the server — the browser caches the redirect',
                'Instant repeat redirect for the user',
                'Suitable for permanent links that never change',
              ],
              cons: [
                'Impossible to track repeat clicks — they never reach the server',
                'Cannot change the destination URL after the user\'s first visit',
                'Analytics will be incomplete — only first visits',
              ],
              bestWhen:
                'A service without analytics, where the main goal is minimal latency and reduced load. Example: an internal corporate shortener.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: 0,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: '302-redirect',
              label: '302 Found (Temporary)',
              description:
                'The browser does not cache the redirect. Every click goes through the server, which allows collecting analytics.',
              pros: [
                'Every visit is recorded — full click analytics',
                'The destination URL can be changed at any time',
                'The standard approach of Bitly, TinyURL, and most shorteners',
              ],
              cons: [
                'Every click puts load on the server',
                'Slightly higher latency on repeat visits',
                'Requires scaling for the entire traffic volume',
              ],
              bestWhen:
                'A commercial URL shortener with analytics. This is Bitly\'s choice — analytics is the core product.',
              impact: {
                latency: -1,
                scalability: -1,
                consistency: 1,
                complexity: 0,
                cost: 1,
              },
            },
          ],
        },
      ],
      tip: 'The choice between 301 and 302 is a classic URL shortener interview question. Explain the trade-off: 301 reduces load but kills analytics. Bitly uses 301 for free links and 307 for paid links with analytics.',
    },

    // ────────────────────────────────────────────
    // Step 3: Data Model & Storage
    // ────────────────────────────────────────────
    {
      id: 'url-storage',
      title: 'Data Model & Storage',
      description:
        'Choose the database and the strategy for generating short keys. At 100M DAU and a 100:1 read-to-write ratio, storage should be optimized for reads.',
      decisions: [
        {
          id: 'url-db',
          category: 'Database',
          question: 'Which database to use?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL',
              description:
                'A relational DBMS with ACID transactions, powerful SQL, extensions, and an excellent ecosystem.',
              pros: [
                'Full ACID guarantee — key uniqueness without races',
                'Powerful SQL for analytical queries',
                'Mature ecosystem: pgBouncer, pg_partman, logical replication',
              ],
              cons: [
                'Horizontal sharding is harder than in NoSQL',
                'At a scale of 1B+ records, Citus or manual sharding is required',
                'Write amplification with a large number of indexes',
              ],
              bestWhen:
                'Scale up to ~100M links, where transactional consistency and SQL analytics are needed.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
              capacityImpact: [
                { label: 'DB Storage overhead', value: '+30-40%', formula: 'PostgreSQL: indexes + WAL + MVCC overhead ≈ 30-40% extra storage' },
                { label: 'Max single node', value: '~2-5 TB', formula: 'PostgreSQL single node comfortable limit before sharding needed' },
              ],
            },
            {
              id: 'mysql',
              label: 'MySQL',
              description:
                'A popular relational DBMS. Used by Twitter for t.co — one of the largest URL shorteners.',
              pros: [
                'Proven at the scale of Twitter (t.co) and Facebook',
                'Good read performance with the InnoDB Buffer Pool',
                'Simple master-slave replication for read replicas',
              ],
              cons: [
                'Less powerful SQL compared to PostgreSQL',
                'Sharding requires Vitess or ProxySQL',
                'Limited data types and extensions',
              ],
              bestWhen:
                'A team with MySQL experience and a ready sharding infrastructure (Vitess).',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'dynamodb',
              label: 'DynamoDB',
              description:
                'Managed NoSQL from AWS. A key-value store with automatic sharding and predictable latency.',
              pros: [
                'Automatic horizontal scaling — no need to manage shards',
                'Predictable latency < 10 ms at any load',
                'A managed service — no operational overhead for DB administration',
                'Built-in TTL for automatic deletion of expired links',
              ],
              cons: [
                'Eventual consistency by default (strong consistency costs 2x)',
                'Limited query capabilities — only by key and sort key',
                'Vendor lock-in to AWS',
                'Cost grows linearly with RCU/WCU during peaks',
              ],
              bestWhen:
                'A read-heavy workload on AWS. Ideal for a URL shortener: a simple key-value model, predictable latency, autoscaling.',
              impact: {
                latency: 1,
                scalability: 2,
                consistency: -1,
                complexity: -1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'DB Storage overhead', value: '+15-20%', formula: 'DynamoDB: GSI + metadata overhead ≈ 15-20%' },
                { label: 'DB Cost estimate', value: '~$1,500/mo', formula: '11.6K RPS reads ($0.25/M) + 116 RPS writes ($1.25/M) + 1.8 TB storage ($0.25/GB)' },
              ],
            },
            {
              id: 'cassandra',
              label: 'Apache Cassandra',
              description:
                'A distributed NoSQL database with linear scaling. Designed for write-heavy workloads, but also efficient for key-based reads.',
              pros: [
                'Linear horizontal scaling with no single point of failure',
                'High availability — the cluster keeps working when several nodes are lost',
                'Excellent read performance by partition key',
              ],
              cons: [
                'Operational complexity: compaction, repair, tuning the consistency level',
                'No ACID transactions — lightweight transactions are needed for uniqueness',
                'Inefficient for arbitrary queries — requires denormalization',
              ],
              bestWhen:
                'Scale of 1B+ links, multi-datacenter replication, a team with Cassandra experience.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: -1,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'DB Storage overhead', value: '+200-300%', formula: 'Cassandra: replication factor 3 = 3× data + compaction overhead' },
                { label: 'Min cluster size', value: '6+ nodes', formula: 'RF=3, 2 datacenters minimum = 6 nodes for production' },
              ],
            },
          ],
        },
        {
          id: 'url-keygen',
          category: 'Key generation',
          question: 'How to generate short keys?',
          options: [
            {
              id: 'base62-counter',
              label: 'Base62 from a counter',
              description:
                'An atomic incremental counter (in the DB or ZooKeeper) whose value is encoded in Base62 (a-z, A-Z, 0-9).',
              pros: [
                'Guaranteed uniqueness with no collisions',
                'Short keys — length grows logarithmically',
                'Simple and clear logic',
              ],
              cons: [
                'The counter is a single point of failure and requires coordination',
                'Predictable keys — all URLs can be enumerated (a security concern)',
                'Hard to scale across multiple instances without ranges',
              ],
              bestWhen:
                'Small scale or an architecture with a dedicated coordinator (ZooKeeper, Redis INCR).',
              impact: {
                latency: 0,
                scalability: -1,
                consistency: 2,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'hash-truncation',
              label: 'MD5/SHA256 + truncation',
              description:
                'Hash the original URL and take the first 6-8 characters of the Base62 representation of the hash.',
              pros: [
                'Requires no coordination — stateless generation',
                'The same URL always produces the same key (deduplication)',
                'Simple to implement in any language',
              ],
              cons: [
                'Collisions are inevitable with truncation — retry logic is needed',
                'One URL = one key — you cannot create several short links for one URL',
                'Key length is limited by collision probability (the birthday paradox)',
              ],
              bestWhen:
                'When deduplication is needed (one URL → one short link) and there are no custom alias requirements.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'kgs',
              label: 'Key Generation Service (KGS)',
              description:
                'A separate service pre-generates a pool of unique keys and hands them out to app servers in batches. The approach used in production at Bitly.',
              pros: [
                'No collisions — keys are unique by construction',
                'No coordination at request time — the key is taken from a local buffer',
                'Scales horizontally — each server gets its own pool',
                'Unpredictable keys — cannot be enumerated (security)',
              ],
              cons: [
                'An additional service to maintain and monitor',
                'Some keys may be lost if an app server crashes',
                'A separate DB is needed to store unused keys',
              ],
              bestWhen:
                'A production-grade URL shortener at a scale of 100M+ DAU. The standard approach of Bitly and similar services.',
              impact: {
                latency: 1,
                scalability: 2,
                consistency: 1,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'uuid-base62',
              label: 'UUID + Base62',
              description:
                'Generate a UUID v4 (128 bits) and encode it in Base62. The result is a 22-character string, which can be truncated.',
              pros: [
                'Fully decentralized generation with no coordination',
                'A standard library in any language',
                'Extremely low collision probability',
              ],
              cons: [
                'Long keys — 22 characters instead of 6-7, which contradicts the idea of a shortener',
                'Truncating to 7 characters reintroduces the collision problem',
                'No deduplication — one URL can get many keys',
              ],
              bestWhen:
                'A prototype or a service where key length is not critical (an internal tool).',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: -1,
                cost: -1,
              },
            },
          ],
        },
      ],
      tip: 'In an interview, be sure to mention the Key Generation Service — it shows knowledge of production approaches. Explain why Base62 (62^7 ≈ 3.5 trillion combinations) is enough for most scenarios.',
    },

    // ────────────────────────────────────────────
    // Step 4: High-Level Architecture
    // ────────────────────────────────────────────
    {
      id: 'url-architecture',
      title: 'High-Level Architecture',
      description:
        'Define the system components: the load balancer, the service architecture, and how they interact.',
      decisions: [
        {
          id: 'url-lb',
          category: 'Load balancing',
          question: 'Which load balancer?',
          options: [
            {
              id: 'nginx',
              label: 'Nginx (L7)',
              description:
                'An application-layer (L7) reverse proxy. It understands HTTP and can do SSL termination, URL-based routing, and rate limiting.',
              pros: [
                'Flexible routing by URL, headers, and cookies',
                'Built-in SSL termination and static content',
                'Can be used as a cache for redirects',
              ],
              cons: [
                'Lower throughput compared to L4 balancers',
                'Requires manual configuration and config updates',
                'A single instance caps out at ~50K RPS for L7',
              ],
              bestWhen:
                'Small-to-medium scale, where URL-based routing or a combination with caching is needed.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: -1,
              },
            },
            {
              id: 'haproxy',
              label: 'HAProxy (L4/L7)',
              description:
                'A high-performance load balancer. Supports L4 (TCP) and L7 (HTTP) modes.',
              pros: [
                'Very high performance — up to 1M+ concurrent connections',
                'Advanced health checks and circuit breaking',
                'A powerful ACL system for routing',
              ],
              cons: [
                'More complex configuration compared to Nginx',
                'No built-in serving of static content',
                'Requires separate infrastructure to manage',
              ],
              bestWhen:
                'A high-load system where maximum balancing performance is important.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'cloud-lb',
              label: 'Cloud LB (AWS ALB/NLB)',
              description:
                'A managed load balancer from a cloud provider. ALB for L7 (HTTP), NLB for L4 (TCP). Automatic scaling.',
              pros: [
                'Zero operational overhead — fully managed',
                'Automatic scaling under load',
                'Integration with auto-scaling groups, WAF, ACM (SSL)',
              ],
              cons: [
                'Vendor lock-in to the cloud provider',
                'Higher cost compared to self-hosted solutions',
                'Less control over fine-tuning',
              ],
              bestWhen:
                'Infrastructure in the cloud, where the team wants to minimize the operational burden. The standard for startups and mid-size businesses.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: 0,
                complexity: -2,
                cost: 1,
              },
            },
          ],
        },
        {
          id: 'url-service-arch',
          category: 'Service architecture',
          question: 'Service architecture?',
          options: [
            {
              id: 'monolith',
              label: 'Monolith',
              description:
                'A single application containing all the logic: link creation, redirect, analytics.',
              pros: [
                'Simple to develop and deploy — a single artifact',
                'No network calls between components — minimal latency',
                'Easier to test and debug',
                'Sufficient for a URL shortener — the business logic is simple',
              ],
              cons: [
                'Scales only as a whole — you cannot scale the read path separately',
                'A large codebase grows more complex over time',
                'The whole application is deployed on any change',
              ],
              bestWhen:
                'A URL shortener is a simple service. A monolith is optimal for scale up to 100M DAU with proper caching.',
              impact: {
                latency: 1,
                scalability: -1,
                consistency: 1,
                complexity: -2,
                cost: -1,
              },
            },
            {
              id: 'modular-monolith',
              label: 'Modular monolith',
              description:
                'A single application with clearly separated modules: a URL module, an Analytics module, an Auth module. A shared DB but isolated boundaries.',
              pros: [
                'Clear module boundaries with simple deployment',
                'Easy to extract a module into a microservice when needed',
                'No network overhead — calls go through in-memory interfaces',
              ],
              cons: [
                'Requires discipline to maintain module boundaries',
                'Still deployed as a single unit',
                'Independent scaling of modules is impossible',
              ],
              bestWhen:
                'A growing team that plans to add features (analytics, a partner API), but microservices are still overkill.',
              impact: {
                latency: 1,
                scalability: 0,
                consistency: 1,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'microservices',
              label: 'Microservices',
              description:
                'Separate services: URL Service (CRUD), Redirect Service (read + redirect), Analytics Service (collection and aggregation), KGS Service.',
              pros: [
                'Independent scaling — the redirect service can be scaled separately',
                'Isolated deployments — an analytics update does not affect redirects',
                'Different technologies for different tasks (Go for redirect, Python for analytics)',
              ],
              cons: [
                'Significant operational overhead: service mesh, tracing, monitoring',
                'Network calls between services increase latency',
                'Distributed system complexity: sagas, eventual consistency, debugging',
                'Overkill for the simple business logic of a URL shortener',
              ],
              bestWhen:
                'Scale of 1B+ DAU, a large team (10+ engineers), and different scaling requirements for the read and write paths.',
              impact: {
                latency: -1,
                scalability: 2,
                consistency: -1,
                complexity: 2,
                cost: 2,
              },
            },
          ],
        },
      ],
      tip: 'Don\'t overcomplicate the architecture of a URL shortener. It is a simple service with one main operation (key→URL lookup). A monolith + cache + sharded DB covers scale up to hundreds of millions of DAU.',
    },

    // ────────────────────────────────────────────
    // Step 5: Scaling & Performance
    // ────────────────────────────────────────────
    {
      id: 'url-scaling',
      title: 'Scaling & Performance',
      description:
        'A URL shortener is a read-heavy system (a 100:1 read-to-write ratio). Caching and partitioning are the key to performance.',
      decisions: [
        {
          id: 'url-cache',
          category: 'Caching',
          question: 'Caching strategy?',
          options: [
            {
              id: 'no-cache',
              label: 'No cache',
              description:
                'Every redirect request goes directly to the database.',
              pros: [
                'Maximum simplicity — no invalidation problems',
                'Data is always fresh — no stale cache',
                'No additional components in the architecture',
              ],
              cons: [
                'At 10K+ RPS the DB becomes a bottleneck',
                'High latency on every request (a network call to the DB)',
                'Not suitable for a production URL shortener at any significant scale',
              ],
              bestWhen:
                'A prototype or internal tool with minimal load (< 100 RPS).',
              impact: {
                latency: -2,
                scalability: -2,
                consistency: 2,
                complexity: -2,
                cost: -1,
              },
              capacityImpact: [
                { label: 'Cache memory', value: '0', formula: 'No caching — all reads hit database directly' },
                { label: 'DB read load', value: '100%', formula: 'Database handles all 11.6K RPS reads' },
              ],
            },
            {
              id: 'local-cache',
              label: 'Local in-memory cache',
              description:
                'A cache in the process memory (LRU cache, Caffeine, Guava Cache). Each application instance keeps its own cache.',
              pros: [
                'Minimal latency — data is in the process memory',
                'No network call to an external cache',
                'Simple implementation — a standard library',
              ],
              cons: [
                'Data is duplicated across instances — inefficient memory use',
                'Cache invalidation across instances is not synchronized',
                'The cache is lost on process restart (cold start)',
              ],
              bestWhen:
                'A complement to a Redis cache for hot keys, or the only cache layer at small scale.',
              impact: {
                latency: 2,
                scalability: 0,
                consistency: -1,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'redis-cache',
              label: 'Redis (distributed cache)',
              description:
                'A centralized Redis/ElastiCache cache shared by all app servers. Cache-aside pattern: check the cache → on a miss read from the DB → store in the cache.',
              pros: [
                'A shared cache for all instances — consistent data',
                'High performance: ~100K ops/sec per instance',
                'TTL support for automatic invalidation',
              ],
              cons: [
                'An extra network call (~0.5 ms) compared to a local cache',
                'Another component to monitor and maintain',
                'A Redis cluster adds operational complexity',
              ],
              bestWhen:
                'Medium scale (up to ~50K RPS), when a single cache layer is enough.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
              capacityImpact: [
                { label: 'Cache memory', value: '~100 GB', formula: 'Top 20% hot URLs cached: ~200M × 500 bytes ≈ 100 GB Redis' },
                { label: 'DB read load', value: '~20%', formula: 'Cache hit ratio ~80% → only ~2.3K RPS hit DB' },
                { label: 'Redis nodes', value: '3-5', formula: '100 GB / 25 GB per node = 4 nodes + 1 replica' },
              ],
            },
            {
              id: 'multi-layer-cache',
              label: 'Multi-layer cache (Local + Redis)',
              description:
                'A two-tier cache: L1 — a local in-memory LRU cache for hot keys, L2 — Redis for the full set of popular links. A request checks L1 → L2 → DB.',
              pros: [
                'Minimal latency for the most popular links (L1 hit)',
                'High overall cache hit ratio (L1 + L2)',
                'Reduced load on Redis thanks to L1',
              ],
              cons: [
                'Complex invalidation — both tiers must be invalidated',
                'Potentially stale data in L1 across instances',
                'More code and configuration to manage two tiers',
              ],
              bestWhen:
                'A production URL shortener at 100M+ DAU. The standard approach for read-heavy systems with a hot subset of data (the Pareto principle: 20% of links = 80% of traffic).',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -1,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'L1 cache (local)', value: '~2 GB/server', formula: 'In-process cache: top 1% URLs ≈ 2M × 500B × per app server' },
                { label: 'L2 cache (Redis)', value: '~100 GB', formula: 'Distributed Redis: top 20% ≈ 100 GB' },
                { label: 'DB read load', value: '~5%', formula: 'L1 hit ~60%, L2 hit ~35% → only ~5% reach DB ≈ 580 RPS' },
              ],
            },
          ],
        },
        {
          id: 'url-partitioning',
          category: 'Partitioning',
          question: 'Data partitioning strategy?',
          options: [
            {
              id: 'no-partitioning',
              label: 'No partitioning',
              description:
                'All data in a single DB with no splitting. Vertical scaling (a bigger server).',
              pros: [
                'Simple — no request routing',
                'ACID transactions without limitations',
                'No cross-shard query problems',
              ],
              cons: [
                'A scaling ceiling — a single server is limited by IOPS and storage',
                'A single point of failure (SPOF)',
                'At 1B+ records, performance degrades',
              ],
              bestWhen:
                'Scale up to ~10M links. A single PostgreSQL with read replicas can handle up to ~10K RPS.',
              impact: {
                latency: 0,
                scalability: -2,
                consistency: 2,
                complexity: -2,
                cost: -1,
              },
            },
            {
              id: 'hash-sharding',
              label: 'Hash-based sharding',
              description:
                'Data is distributed across shards based on a hash of the short key: shard = hash(shortKey) % N. Consistent hashing minimizes rebalancing.',
              pros: [
                'Even distribution of data and load',
                'Horizontal scaling — adding shards increases throughput',
                'Consistent hashing minimizes data movement when adding nodes',
              ],
              cons: [
                'Range queries are impossible (for example, all of a user\'s URLs)',
                'Adding shards requires rebalancing part of the data',
                'Request routing adds complexity',
              ],
              bestWhen:
                'A URL shortener with a key-based access pattern (point lookups). The standard choice for key-value workloads.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'range-sharding',
              label: 'Range-based sharding',
              description:
                'Data is distributed across key ranges: shard 1 = keys "a"-"f", shard 2 = "g"-"m", and so on.',
              pros: [
                'Range queries run efficiently within a shard',
                'Predictable data placement',
                'Useful if sorting by keys is needed',
              ],
              cons: [
                'Uneven distribution — hotspots with a skewed key distribution',
                'A single shard can receive a disproportionately large load',
                'Requires monitoring and manual rebalancing',
              ],
              bestWhen:
                'When range queries are needed (for example, all keys with a certain prefix). Usually not optimal for a URL shortener.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
            },
          ],
        },
      ],
      tip: 'For a URL shortener, caching matters more than partitioning. At a cache hit ratio of 90%+, only 10% of requests reach the DB. Start with the math: 10K RPS × 10% = 1K RPS to the DB — that is manageable for a single instance.',
    },

    // ────────────────────────────────────────────
    // Step 6: Reliability & Monitoring
    // ────────────────────────────────────────────
    {
      id: 'url-reliability',
      title: 'Reliability & Monitoring',
      description:
        'Ensure high availability of the service and set up monitoring of key metrics. A URL shortener is an infrastructure service; its unavailability blocks all links.',
      decisions: [
        {
          id: 'url-availability',
          category: 'Availability',
          question: 'Availability strategy?',
          options: [
            {
              id: 'single-region',
              label: 'Single region',
              description:
                'All infrastructure in a single data center/region. Redundancy at the AZ (Availability Zones) level.',
              pros: [
                'Minimal infrastructure cost',
                'Simple architecture with no cross-region replication',
                'No consistency problems between regions',
              ],
              cons: [
                'High latency for users from other regions',
                'A regional outage = full service unavailability',
                'Not suitable for a global product',
              ],
              bestWhen:
                'The audience is concentrated in a single region (for example, only Russia or only the US).',
              impact: {
                latency: -1,
                scalability: -1,
                consistency: 2,
                complexity: -2,
                cost: -2,
              },
            },
            {
              id: 'multi-region-active-passive',
              label: 'Multi-region Active-Passive',
              description:
                'The primary region handles all writes, the secondary is a hot standby. On a primary failure — failover to the secondary (DNS failover or Route53 health checks).',
              pros: [
                'Protection from a regional outage — RTO in minutes',
                'Reads can be routed to the nearest region via CDN',
                'Simpler than active-active — no write conflicts',
              ],
              cons: [
                'Double the infrastructure cost',
                'Failover is not instant — minutes to switch DNS',
                'Replication lag — recent writes may be lost on failover',
              ],
              bestWhen:
                'A global URL shortener with an SLA of 99.9%+. The optimal balance of availability and complexity.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'multi-region-active-active',
              label: 'Multi-region Active-Active',
              description:
                'Several regions handle both reads and writes simultaneously. Requires conflict resolution for concurrent writes.',
              pros: [
                'Minimal latency for users worldwide',
                'No downtime if any region fails',
                'Maximum throughput — load is distributed',
              ],
              cons: [
                'Write conflicts — two regions can create the same key',
                'Very high complexity: CRDTs, vector clocks, conflict resolution',
                'The most expensive configuration — full infrastructure in every region',
              ],
              bestWhen:
                'Scale of 1B+ DAU with strict worldwide latency requirements. The level of t.co / Bitly Enterprise.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -2,
                complexity: 2,
                cost: 2,
              },
            },
          ],
        },
        {
          id: 'url-monitoring',
          category: 'Monitoring',
          question: 'What to monitor?',
          multiSelect: true,
          options: [
            {
              id: 'redirect-latency',
              label: 'Redirect latency (p99)',
              description:
                'The time from receiving a request to sending the HTTP redirect response. p99 is a critical metric for the SLA.',
              pros: [
                'The primary user-experience metric',
                'Lets you track degradation before users notice it',
                'p99 shows the worst case for the majority of requests',
              ],
              cons: [
                'Requires collecting histograms, not just averages',
                'May fluctuate during GC pauses (Java) — needs interpretation',
                'Does not show the cause of degradation — additional metrics are needed',
              ],
              bestWhen:
                'Always. This is the number-one metric for any URL shortener.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'error-rate',
              label: 'Error rate (4xx/5xx)',
              description:
                'The share of requests that ended in an error. 4xx — client errors (nonexistent key), 5xx — server errors (DB/cache failure).',
              pros: [
                'Instant detection of component failures',
                'A rise in 404s may indicate a key-enumeration attack',
                'The basis for alerting and SLA metrics',
              ],
              cons: [
                'You must separate 4xx (normal) from 5xx (incidents)',
                'A percentage can mask absolute numbers at low traffic',
                'Does not show the specific source of the error',
              ],
              bestWhen:
                'Always. A basic health metric for any web service.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'cache-hit-ratio',
              label: 'Cache hit ratio',
              description:
                'The percentage of requests served from the cache without hitting the DB. For a URL shortener, the target value is 90%+.',
              pros: [
                'Shows the effectiveness of caching and the cache size',
                'A drop in hit ratio = a rise in DB load (an early problem indicator)',
                'Helps optimize TTL and the eviction policy',
              ],
              cons: [
                'Requires application-level instrumentation',
                'A low hit ratio can be normal during a cold start',
                'Does not account for differences in miss cost (a fast vs slow DB query)',
              ],
              bestWhen:
                'A system with caching. Critical for a read-heavy URL shortener.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'db-query-latency',
              label: 'DB query latency',
              description:
                'The execution time of database queries. Includes p50, p95, p99 for read and write operations separately.',
              pros: [
                'Early detection of DB problems before they affect users',
                'Helps plan scaling (when the DB approaches its limits)',
                'The read/write latency split shows the type of problem',
              ],
              cons: [
                'With a good cache hit ratio, few queries reach the DB — the statistics are noisy',
                'Requires instrumentation of every query',
                'DB latency may depend on infrastructure (the network) rather than the DB itself',
              ],
              bestWhen:
                'Always. Especially important with sharding — to detect hot shards.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
          ],
        },
      ],
      tip: 'In an interview, show that you think about monitoring and SLAs. For a URL shortener, the latency SLA is usually < 100 ms p99 for a redirect. Mention alerting on a rising error rate and a falling cache hit ratio.',
    },
  ],

  // ────────────────────────────────────────────
  // Reference Solution
  // ────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'url-scale': ['medium-scale'],
      'url-features': ['analytics', 'link-expiration'],
      'url-protocol': ['rest'],
      'url-redirect': ['302-redirect'],
      'url-db': ['dynamodb'],
      'url-keygen': ['kgs'],
      'url-lb': ['cloud-lb'],
      'url-service-arch': ['monolith'],
      'url-cache': ['multi-layer-cache'],
      'url-partitioning': ['hash-sharding'],
      'url-availability': ['multi-region-active-passive'],
      'url-monitoring': [
        'redirect-latency',
        'error-rate',
        'cache-hit-ratio',
        'db-query-latency',
      ],
    },
    explanation: `For a URL shortener at 100M DAU, the following architecture is optimal:

**Scale and features:** 100M DAU means ~10K redirects/sec at peak, with a 100:1 read-to-write ratio. Click analytics is the core business value (monetization through paid plans). Link expiration saves storage and frees up keys.

**REST + 302:** REST is the industry standard for public APIs. HTTP 302 (temporary redirect) is critically important: every click goes through our server, which allows collecting analytics. This is Bitly's approach — analytics is the core product.

**DynamoDB + KGS:** DynamoDB is ideal for a URL shortener: a simple key-value model (shortKey → originalURL), predictable latency < 10 ms, automatic sharding, built-in TTL for expiring links. The Key Generation Service (KGS) pre-generates a pool of unique keys and hands them out to app servers — no collisions, no coordination at request time, and the keys are unpredictable.

**Monolith + Cloud LB:** A URL shortener is a simple service. A monolith with horizontal scaling behind a Cloud Load Balancer is sufficient. Microservices would add complexity with no significant benefits. A Cloud LB (AWS ALB) scales automatically and requires no operational overhead.

**Multi-layer cache + Hash sharding:** L1 (local LRU) for hot keys + L2 (Redis) for popular links. At a cache hit ratio of 90%+, only ~1K RPS reach the DB — manageable even for a single DynamoDB instance. Hash-based sharding by the short key ensures even distribution.

**Multi-region active-passive:** The primary region handles all writes, the secondary is a hot standby. A CDN (CloudFront) caches the 302 redirects for a short time (30-60 sec), reducing load. DNS failover via Route53 on a primary failure.

**Monitoring:** All four metrics are critical. Redirect latency p99 < 100 ms is the primary SLA. Cache hit ratio > 90% is a cache health indicator. Error rate and DB latency are early problem indicators.`,
    diagram: `
┌─────────────────────────────────────────────────────────────────┐
│                    URL Shortener Architecture                    │
│                         (100M DAU)                               │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  Client  │
    │(Browser) │
    └────┬─────┘
         │
         ▼
    ┌──────────┐     Caches 302 for 30-60 sec
    │   CDN    │     (CloudFront / Fastly)
    │          │
    └────┬─────┘
         │
         ▼
    ┌──────────────┐  Auto-scaling, SSL termination
    │  Cloud LB    │  (AWS ALB)
    │              │
    └────┬─────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │         App Servers (Monolith)        │
    │  ┌────────────┐  ┌────────────────┐  │
    │  │ URL Service │  │ Analytics Sink │  │
    │  │  (CRUD +    │  │ (async write   │  │
    │  │  Redirect)  │  │  to Kafka)     │  │
    │  └──────┬─────┘  └───────┬────────┘  │
    │         │                │            │
    │  ┌──────┴──────┐         │            │
    │  │ L1 Cache    │         │            │
    │  │ (Local LRU) │         │            │
    │  └──────┬──────┘         │            │
    └─────────┼────────────────┼────────────┘
              │                │
         ┌────┴────┐     ┌────┴─────┐
         ▼         │     ▼          │
    ┌─────────┐    │  ┌───────┐    │
    │  Redis  │    │  │ Kafka │    │
    │L2 Cache │    │  │       │    │
    │(cluster)│    │  └───┬───┘    │
    └────┬────┘    │      │        │
         │         │      ▼        │
         │    ┌────┴──────────┐    │
         │    │   DynamoDB    │    │
         │    │  (shortKey →  │    │
         └───▶│  originalURL) │    │
              │  TTL enabled  │    │
              └───────────────┘    │
                                   │
    ┌──────────┐             ┌─────┴──────┐
    │   KGS    │             │ ClickHouse │
    │ (Key     │             │ (Analytics │
    │Generator)│             │  Storage)  │
    └──────────┘             └────────────┘

    Data flows:
    ─────────────
    Create:    Client → LB → App → KGS(get key) → DynamoDB(save)
    Redirect:  Client → CDN → LB → App → L1 → L2(Redis) → DynamoDB
    Analytics: App → Kafka → ClickHouse (async pipeline)
`,
  },
  capacityEstimates: {
    default: [
      {
        label: 'DAU / MAU',
        value: '100M DAU',
        formula: 'Given in requirements',
      },
      {
        label: 'Write RPS',
        value: '~116 RPS',
        formula:
          'Each user creates ~0.1 short URLs/day → 100M × 0.1 / 86 400 ≈ 116 RPS',
      },
      {
        label: 'Read RPS',
        value: '~11.6K RPS',
        formula: 'Read:write ratio 100:1 → 116 × 100 ≈ 11 600 RPS',
      },
      {
        label: 'Storage (1 year)',
        value: '~1.8 TB',
        formula:
          '100M × 0.1 × 365 = 3.65B URLs, each ~500 bytes → 3.65B × 500 B ≈ 1.8 TB/year',
      },
      {
        label: 'Cache memory (20% hot URLs)',
        value: '~100 GB',
        formula:
          '11.6K RPS × 86 400 ≈ 1B reads/day, cache top 20% → 200M URLs × 500 bytes ≈ 100 GB',
      },
      {
        label: 'Bandwidth (outbound)',
        value: '~5.8 MB/s',
        formula: '11.6K RPS × 500 bytes ≈ 5.8 MB/s',
      },
    ],
  },
};
