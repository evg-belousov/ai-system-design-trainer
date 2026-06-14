import type { Scenario } from '@/data/constructor/types';

export const rateLimiterScenario: Scenario = {
  id: 'rate-limiter',
  title: 'Rate Limiter',
  difficulty: 'middle',
  description:
    'Design a distributed rate limiter for an API gateway handling 10M+ requests per second. The system must precisely throttle traffic, scale horizontally, and not become a single point of failure.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'rl-requirements',
      title: 'Requirements',
      description:
        'Define the scope and the key by which requests will be throttled.',
      decisions: [
        {
          id: 'rl-scope',
          category: 'Scope',
          question: 'Where to apply rate limiting?',
          options: [
            {
              id: 'client-side',
              label: 'Client-side',
              description:
                'Throttling on the client side (SDK, mobile app).',
              pros: [
                'Reduces server load before the request is even sent',
                'Instant feedback to the user',
              ],
              cons: [
                'Easy to bypass — the client is controlled by the user',
                'Impossible to guarantee that limits are enforced',
                'Does not protect against malicious actors',
              ],
              bestWhen:
                'You need soft protection against accidental overages in your own client apps.',
              impact: {
                latency: 2,
                scalability: 0,
                consistency: -2,
                complexity: -1,
                cost: 2,
              },
            },
            {
              id: 'server-side',
              label: 'Server-side (API gateway)',
              description:
                'Throttling at the API gateway level (Kong, Envoy, NGINX).',
              pros: [
                'A single point of control for all clients',
                'Cannot be bypassed from the client side',
                'The standard approach — supported by all API gateways',
              ],
              cons: [
                'The API gateway becomes a bottleneck if poorly scaled',
                'Adds latency to every request',
              ],
              bestWhen:
                'The standard scenario — a public API with a predictable limit model.',
              impact: {
                latency: -1,
                scalability: 1,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'middleware-sidecar',
              label: 'Middleware (sidecar)',
              description:
                'A rate limiter as a sidecar container next to each service (Envoy in a service mesh).',
              pros: [
                'Granular control at the level of each service',
                'Decentralized architecture — no single point of failure',
                'Fits well into a service mesh (Istio, Linkerd)',
              ],
              cons: [
                'Complex coordination of limits across sidecar instances',
                'Consumes resources on every pod',
                'Harder to maintain a single limit policy',
              ],
              bestWhen:
                'A microservice architecture with a service mesh, where limits are needed at the level of individual services.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: -1,
                complexity: 1,
                cost: 1,
              },
            },
          ],
        },
        {
          id: 'rl-granularity',
          category: 'Limiting key',
          question: 'Which key to limit by?',
          options: [
            {
              id: 'by-ip',
              label: 'By IP address',
              description:
                'The limit is tied to the client\'s IP address.',
              pros: [
                'Requires no authentication',
                'Simple to implement',
                'Works for anonymous users',
              ],
              cons: [
                'NAT/proxy — thousands of users behind a single IP',
                'IPv6 makes it easy to change addresses',
                'Does not reflect the actual API consumer',
              ],
              bestWhen:
                'Basic DDoS protection for public endpoints without authentication.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: -1,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: 'by-user-id',
              label: 'By user ID',
              description:
                'The limit is tied to the identifier of the authenticated user.',
              pros: [
                'Precise throttling of a specific user',
                'Independent of IP or network',
                'Allows differentiating limits by plan',
              ],
              cons: [
                'Requires authentication before the limit check',
                'Does not protect against attacks on the login endpoint',
                'Complicates the flow — auth first, then rate limit',
              ],
              bestWhen:
                'An internal API with mandatory authentication and different access levels.',
              impact: {
                latency: -1,
                scalability: 0,
                consistency: 1,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'by-api-key',
              label: 'By API key',
              description:
                'The limit is tied to the API key issued to the consumer.',
              pros: [
                'The standard for B2B APIs (Stripe, Twilio, GitHub)',
                'The key is passed in a header — a fast check without full auth',
                'Flexible limits for each client/plan',
              ],
              cons: [
                'A key leak = a quota leak',
                'Requires key lifecycle management',
                'Not suitable for end users (B2C)',
              ],
              bestWhen:
                'A public B2B API with paid plans and individual limits for each consumer.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'combined',
              label: 'Combined',
              description:
                'Several layers of limits: by IP + by API key + by endpoint.',
              pros: [
                'Maximum flexibility and protection',
                'Different limits for different scenarios',
                'Protection against both DDoS and abuse by a specific client',
              ],
              cons: [
                'Complex configuration and debugging',
                'More calls to the counter store',
                'Harder to explain to clients which limit was triggered',
              ],
              bestWhen:
                'Large platforms with diverse clients and high security requirements.',
              impact: {
                latency: -1,
                scalability: -1,
                consistency: 2,
                complexity: 2,
                cost: 1,
              },
            },
          ],
        },
      ],
    },

    // ── Step 2: Algorithm Selection ───────────────────────────────────
    {
      id: 'rl-algorithm',
      title: 'Algorithm Selection',
      description:
        'Choose the rate limiting algorithm that determines exactly how requests are counted and throttled.',
      decisions: [
        {
          id: 'rl-algo',
          category: 'Algorithm',
          question: 'Which rate limiting algorithm to use?',
          options: [
            {
              id: 'token-bucket',
              label: 'Token Bucket',
              description:
                'A bucket of tokens: tokens are added at a fixed rate, and each request takes a token. Used at AWS and Stripe.',
              pros: [
                'Allows controlled traffic bursts',
                'Simple and efficient implementation',
                'Widely used in production (AWS, Stripe, NGINX)',
              ],
              cons: [
                'Two parameters to tune (rate + burst size)',
                'A burst can overload downstream services',
                'Requires an atomic "check and take" operation',
              ],
              bestWhen:
                'An API where short-term bursts are acceptable, but the average rate must be limited.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 0,
                complexity: -1,
                cost: 0,
              },
              capacityImpact: [
                {
                  label: 'Counter storage (Redis)',
                  value: '~20 MB',
                  formula: '1M unique API keys × 20 bytes (2 fields: tokens remaining + last refill timestamp) ≈ 20 MB',
                },
                {
                  label: 'Memory per node (10 nodes)',
                  value: '~10 MB',
                  formula: '20 MB total / 10 nodes = 2 MB + overhead ≈ 10 MB per node',
                },
              ],
            },
            {
              id: 'leaky-bucket',
              label: 'Leaky Bucket',
              description:
                'Requests enter a fixed-size queue and are processed at a constant rate. Used at Shopify.',
              pros: [
                'Smooths traffic — an even load on the backend',
                'Predictable processing rate',
                'Protects downstream from burst load',
              ],
              cons: [
                'Does not allow bursts — even legitimate spikes are delayed',
                'The queue consumes memory',
                'Old requests can crowd out new ones when the queue overflows',
              ],
              bestWhen:
                'A strictly even load on the backend is needed (financial transactions, external APIs with hard limits).',
              impact: {
                latency: -1,
                scalability: 0,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'fixed-window',
              label: 'Fixed Window Counter',
              description:
                'A counter of requests within a fixed time window (for example, 100 req/min). The simplest implementation.',
              pros: [
                'Minimal memory usage — one counter per window',
                'The easiest to implement and understand',
                'An atomic INCR in Redis — no race condition',
              ],
              cons: [
                'The window-boundary problem: a 2x burst at the seam of two windows',
                'Uneven distribution within a window',
                'Not suitable for precise limits',
              ],
              bestWhen:
                'You need a simple but not perfectly precise throttling system with minimal resource usage.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -2,
                complexity: -2,
                cost: -1,
              },
            },
            {
              id: 'sliding-window-log',
              label: 'Sliding Window Log',
              description:
                'A timestamp of each request is stored; the limit is checked against a sliding window. The most precise algorithm.',
              pros: [
                'Perfect precision — no window-boundary problem',
                'No burst at the seam of windows',
                'Guaranteed limit enforcement at any moment',
              ],
              cons: [
                'High memory usage: O(n) per client',
                'Expensive operations: a sorted set in Redis for each request',
                'Does not scale at high limits (10K+ req/min)',
              ],
              bestWhen:
                'Limit precision is critically important, and the number of clients and the per-client limit are small.',
              impact: {
                latency: -2,
                scalability: -2,
                consistency: 2,
                complexity: 1,
                cost: 2,
              },
              capacityImpact: [
                {
                  label: 'Counter storage (Redis)',
                  value: '~100 GB',
                  formula: '1M keys × 1000 requests/min window × 100 bytes per timestamp entry = ~100 GB (1000× more than token bucket)',
                },
                {
                  label: 'Memory per node (10 nodes)',
                  value: '~10 GB',
                  formula: '100 GB total / 10 nodes = 10 GB per node — requires significant RAM',
                },
                {
                  label: 'Rule evaluations/sec',
                  value: '10M/sec (with ZRANGEBYSCORE)',
                  formula: '10M RPS × O(log n) sorted set operation per check — Redis CPU-bound at ~500K ops/sec per core',
                },
              ],
            },
            {
              id: 'sliding-window-counter',
              label: 'Sliding Window Counter',
              description:
                'A combination of fixed window and sliding window: a weighted average of the current and previous windows. Used at Cloudflare and Kong.',
              pros: [
                'Smooths the window-boundary problem of fixed window',
                'O(1) memory per client — two counters',
                'A good balance of precision and performance',
              ],
              cons: [
                'Approximate counting — not 100% precise',
                'Assumes an even distribution in the previous window',
                'Slightly harder to implement than fixed window',
              ],
              bestWhen:
                'Production systems with high RPS, where a balance of precision, memory, and latency is needed.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 1,
                complexity: 0,
                cost: -1,
              },
            },
          ],
        },
      ],
    },

    // ── Step 3: Data Store ────────────────────────────────────────────
    {
      id: 'rl-storage',
      title: 'Data Store',
      description:
        'Define where to store request counters and how to synchronize state across multiple rate limiter instances.',
      decisions: [
        {
          id: 'rl-store',
          category: 'Counter store',
          question: 'Where to store the counters?',
          options: [
            {
              id: 'in-memory',
              label: 'In-memory (local)',
              description:
                'Counters are stored in the memory of each rate limiter instance.',
              pros: [
                'Minimal latency — no network calls',
                'No external dependencies',
                'The simplest implementation',
              ],
              cons: [
                'No coordination between instances — the limit is fragmented',
                'Data loss on restart',
                'Does not work for distributed rate limiting without sticky sessions',
              ],
              bestWhen:
                'A single instance, or sticky sessions, or when a limit that is N times imprecise is acceptable (N = number of instances).',
              impact: {
                latency: 2,
                scalability: -2,
                consistency: -2,
                complexity: -2,
                cost: -1,
              },
              capacityImpact: [
                {
                  label: 'Counter storage (Redis)',
                  value: '0 (no Redis needed)',
                  formula: 'All counters in process memory; no external store required',
                },
                {
                  label: 'Latency budget',
                  value: '<0.01 ms',
                  formula: 'In-process hash map lookup: ~10 μs, no network hop (100× faster than Redis)',
                },
                {
                  label: 'Memory per node (10 nodes)',
                  value: '~10 MB per node',
                  formula: '1M keys / 10 nodes = 100K keys × 100 bytes = ~10 MB (but each node sees only 1/N of keys)',
                },
              ],
            },
            {
              id: 'redis',
              label: 'Redis',
              description:
                'A centralized counter store in Redis. The industry standard for rate limiting.',
              pros: [
                'Atomic operations (INCR, EXPIRE, Lua scripts)',
                'TTL out of the box — automatic cleanup',
                'High performance: 100K+ ops/sec per instance',
                'Ecosystem: ready-made rate limiting libraries',
              ],
              cons: [
                'Additional network latency (~0.5-1ms)',
                'Another infrastructure component to maintain',
                'A single point of failure without clustering',
              ],
              bestWhen:
                'The standard choice for distributed rate limiting in production.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'memcached',
              label: 'Memcached',
              description:
                'A distributed cache with support for atomic increment.',
              pros: [
                'A simple protocol, high performance',
                'Built-in atomic increment',
                'Scales well horizontally',
              ],
              cons: [
                'No Lua scripts — limited atomicity of complex operations',
                'No built-in TTL for individual increment operations',
                'A smaller ecosystem for rate limiting than Redis',
              ],
              bestWhen:
                'Simple algorithms (fixed window with INCR) without complex logic.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 1,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: 'redis-cluster',
              label: 'Redis Cluster',
              description:
                'A Redis cluster with key-based sharding for maximum scaling.',
              pros: [
                'Horizontal scaling of reads and writes',
                'Built-in replication and failover',
                'The same API as standalone Redis',
              ],
              cons: [
                'Lua scripts work only within a single slot (hash tag)',
                'Complex operations and monitoring',
                'Resharding can cause brief outages',
              ],
              bestWhen:
                'A scale of 10M+ RPS, when a single Redis instance is not enough.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: 1,
                complexity: 2,
                cost: 2,
              },
              capacityImpact: [
                {
                  label: 'Counter storage (Redis)',
                  value: '~100 MB across cluster',
                  formula: '1M keys × 100 bytes sharded across 6+ Redis nodes (3 masters + 3 replicas)',
                },
                {
                  label: 'Latency budget',
                  value: '<1.5 ms',
                  formula: 'Redis Cluster adds ~0.5 ms for MOVED redirects + cross-slot overhead vs standalone Redis',
                },
                {
                  label: 'Network bandwidth',
                  value: '~4 GB/s',
                  formula: '10M RPS × 200 bytes + cluster gossip + replication overhead ≈ ~4 GB/s total cluster bandwidth',
                },
              ],
            },
          ],
        },
        {
          id: 'rl-sync',
          category: 'Synchronization',
          question: 'How to synchronize across nodes?',
          options: [
            {
              id: 'no-sync',
              label: 'No synchronization (sticky sessions)',
              description:
                'Each instance keeps its own counters; clients are pinned to a specific instance.',
              pros: [
                'No network overhead for synchronization',
                'Minimal latency',
                'Simple implementation',
              ],
              cons: [
                'Sticky sessions complicate load balancing',
                'Loss of counters on failover',
                'Uneven load distribution',
              ],
              bestWhen:
                'A small number of instances, and where limit imprecision is acceptable.',
              impact: {
                latency: 2,
                scalability: -2,
                consistency: -2,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'centralized-store',
              label: 'Centralized store (Redis)',
              description:
                'All instances access a single Redis — a single source of truth.',
              pros: [
                'Globally consistent limits',
                'A simple model: write and read from one place',
                'The standard industry approach',
              ],
              cons: [
                'A dependency on Redis availability',
                'Network latency on every request',
                'Redis becomes a bottleneck at extreme RPS',
              ],
              bestWhen:
                'The standard approach for most production systems.',
              impact: {
                latency: -1,
                scalability: 1,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'gossip-protocol',
              label: 'Gossip protocol',
              description:
                'Instances exchange counters via gossip (CRDT, SWIM).',
              pros: [
                'No central store — no SPOF',
                'Works during network partitions',
                'Scales without a bottleneck',
              ],
              cons: [
                'Eventual consistency — limits are imprecise at any given moment',
                'Complex implementation and debugging',
                'Slow convergence with a large number of nodes',
              ],
              bestWhen:
                'A geographically distributed system where a centralized store is unacceptable.',
              impact: {
                latency: 1,
                scalability: 2,
                consistency: -2,
                complexity: 2,
                cost: 0,
              },
            },
            {
              id: 'eventual-sync',
              label: 'Eventual sync with local fallback',
              description:
                'Local counters are synchronized with Redis asynchronously; if Redis is unavailable, a local limit takes over.',
              pros: [
                'Resilience to Redis failure',
                'Minimal latency in normal mode',
                'Graceful degradation instead of a full outage',
              ],
              cons: [
                'Temporary limit imprecision during sync lag',
                'Complex local/remote switching logic',
                'Possible overshoot at the moment of transition',
              ],
              bestWhen:
                'High availability requirements; better to let through an extra request than to block everything.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: -1,
                complexity: 1,
                cost: 0,
              },
            },
          ],
        },
      ],
    },

    // ── Step 4: Architecture ──────────────────────────────────────────
    {
      id: 'rl-architecture',
      title: 'Architecture',
      description:
        'Define where the rate limiter is placed and how to interact with the client when the limit is exceeded.',
      decisions: [
        {
          id: 'rl-placement',
          category: 'Placement',
          question: 'Where to place the rate limiter?',
          options: [
            {
              id: 'api-gateway',
              label: 'Built into the API Gateway (Kong, Envoy)',
              description:
                'The rate limiter runs as a plugin or filter in the API gateway.',
              pros: [
                'A single entry point — all requests pass through the gateway',
                'Ready-made plugins: Kong rate-limiting, Envoy ratelimit',
                'Centralized policy management',
              ],
              cons: [
                'A dependency on a specific gateway',
                'Plugin customization limitations',
                'The gateway must scale together with the load',
              ],
              bestWhen:
                'An API gateway is already in use; standard rate limiting requirements.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 1,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'separate-service',
              label: 'A separate service',
              description:
                'The rate limiter as a standalone microservice that other services call.',
              pros: [
                'Independent scaling and deployment',
                'A single rate limiter for different gateways/services',
                'Full control over the logic and storage',
              ],
              cons: [
                'An additional network hop on every request',
                'Another service to maintain and monitor',
                'Becomes a critical system component',
              ],
              bestWhen:
                'Complex limiting logic or multiple entry points into the system.',
              impact: {
                latency: -1,
                scalability: 2,
                consistency: 2,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                {
                  label: 'Latency budget',
                  value: '<3 ms',
                  formula: 'Extra network hop: ~1-2 ms (service call) + <1 ms (Redis check) = ~2-3 ms total (3× standalone gateway)',
                },
                {
                  label: 'Network bandwidth',
                  value: '~4 GB/s',
                  formula: '10M RPS × 200 bytes request + 200 bytes response to rate limiter service = ~4 GB/s inter-service traffic',
                },
              ],
            },
            {
              id: 'library',
              label: 'A library in each service',
              description:
                'Rate limiting implemented as an SDK/library embedded in each service.',
              pros: [
                'No additional network hop',
                'Code reuse via a package',
                'Each service can configure its own limits',
              ],
              cons: [
                'Logic duplication — must be updated in all services',
                'Coordination of limits via a shared store is still needed',
                'Different library versions in different services',
              ],
              bestWhen:
                'There is no API gateway; each service manages its own limits.',
              impact: {
                latency: 1,
                scalability: 0,
                consistency: -1,
                complexity: 1,
                cost: -1,
              },
            },
            {
              id: 'cdn-level',
              label: 'CDN-level (Cloudflare)',
              description:
                'Rate limiting at the CDN/edge level — before traffic reaches the origin.',
              pros: [
                'DDoS protection at the edge — traffic never reaches the servers',
                'A global network — minimal latency for clients',
                'No load on your own infrastructure',
              ],
              cons: [
                'Limited rule customization',
                'Vendor lock-in (Cloudflare, AWS WAF)',
                'Cost at high traffic',
                'Hard to implement business-logic limits',
              ],
              bestWhen:
                'DDoS protection and simple IP-based limits at the edge; business limits — separately.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: 0,
                complexity: -2,
                cost: 2,
              },
            },
          ],
        },
        {
          id: 'rl-response',
          category: 'Response when exceeded',
          question: 'How to respond when the limit is exceeded?',
          options: [
            {
              id: '429-retry-after',
              label: '429 + Retry-After header',
              description:
                'A standard HTTP 429 Too Many Requests with a Retry-After header.',
              pros: [
                'A standard HTTP approach (RFC 6585)',
                'The client knows when it can retry the request',
                'Simple implementation',
              ],
              cons: [
                'The client does not know its current request balance',
                'Retry-After is a coarse estimate (seconds)',
                'Not enough information for smart back-off',
              ],
              bestWhen:
                'A simple API without the need for detailed limit information.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: '429-with-headers',
              label: '429 + rate limit headers (X-RateLimit-*)',
              description:
                'HTTP 429 with X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset headers.',
              pros: [
                'The client sees the full picture: limit, remaining, reset time',
                'A de facto standard (GitHub, Stripe, Twitter API)',
                'Lets the client implement smart back-off',
              ],
              cons: [
                'Additional computation to build the headers',
                'The headers must be added to all responses, not just 429',
                'No single standard — different APIs use different names',
              ],
              bestWhen:
                'A public API with external consumers — the industry standard.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 1,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'throttle-queue',
              label: 'Throttle (queue + delay)',
              description:
                'Requests are not rejected but queued and executed with a delay.',
              pros: [
                'The client always gets a response — no errors',
                'Smooths load peaks',
                'Suitable for batch operations and webhooks',
              ],
              cons: [
                'Increases latency for the client',
                'The queue can grow indefinitely under overload',
                'Harder to implement — a queue mechanism is needed',
              ],
              bestWhen:
                'Asynchronous APIs or internal services where a delay is acceptable but a request loss is not.',
              impact: {
                latency: -2,
                scalability: -1,
                consistency: 1,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'silent-drop',
              label: 'Silent drop',
              description:
                'The request is silently dropped with no response (connection reset or timeout).',
              pros: [
                'Minimal load on the server — a response is not even built',
                'Makes life harder for bots — it is unclear what is happening',
                'Saves bandwidth during a DDoS',
              ],
              cons: [
                'Terrible UX for legitimate clients',
                'The client does not know the cause of the error and may retry indefinitely',
                'Violates REST principles',
                'Hard to debug problems',
              ],
              bestWhen:
                'Only for DDoS protection at the network level; never for an application API.',
              impact: {
                latency: 2,
                scalability: 1,
                consistency: -2,
                complexity: -1,
                cost: -1,
              },
            },
          ],
        },
      ],
    },

    // ── Step 5: Scaling ───────────────────────────────────────────────
    {
      id: 'rl-scaling',
      title: 'Scaling',
      description:
        'Define how to ensure performance at high RPS and how to manage rate limiting rules.',
      decisions: [
        {
          id: 'rl-perf',
          category: 'Performance',
          question: 'How to ensure performance?',
          multiSelect: true,
          options: [
            {
              id: 'lua-scripts',
              label: 'Lua scripts in Redis (atomicity)',
              description:
                'All the check-and-update logic for a counter runs in a single Lua script on the Redis side.',
              pros: [
                'Atomicity: check and increment in one operation',
                'No race condition between read and write',
                'One round-trip to Redis instead of several',
              ],
              cons: [
                'Blocks Redis for the duration of the script',
                'Limitations: the script must work with keys of a single slot in a cluster',
                'Harder to debug than ordinary commands',
              ],
              bestWhen:
                'Redis is in use and an atomic limit check without race conditions is needed.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 2,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'local-cache-async',
              label: 'Local cache + async sync',
              description:
                'Some checks run against a local cache, with synchronization to Redis done asynchronously.',
              pros: [
                'Reduces the load on Redis several-fold',
                'Minimal latency for most requests',
                'Resilience during brief Redis failures',
              ],
              cons: [
                'Limit imprecision within the synchronization window',
                'Complex logic for merging local and remote state',
                'Possible overshoot on a burst between sync intervals',
              ],
              bestWhen:
                'Extreme RPS, where a small limit overshoot is acceptable.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -1,
                complexity: 1,
                cost: -1,
              },
            },
            {
              id: 'pipelining',
              label: 'Pipelining Redis commands',
              description:
                'Grouping several Redis commands into a single batch to reduce network overhead.',
              pros: [
                'Reduces the number of round-trips to Redis',
                'Increases throughput in batch processing',
                'A simple optimization without changing the logic',
              ],
              cons: [
                'No atomicity between commands in a pipeline (unlike Lua)',
                'The effect is noticeable only when grouping several operations',
                'Does not help for single-request rate limiting',
              ],
              bestWhen:
                'You need to check several limits (IP + API key + endpoint) in a single call.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'race-tolerance',
              label: 'Race condition tolerance (allowing overshoot)',
              description:
                'A deliberate tolerance for a small limit overshoot for the sake of performance.',
              pros: [
                'Simplifies the implementation — no strict atomicity needed',
                'Maximum performance',
                'Sufficient for most business scenarios',
              ],
              cons: [
                'The limit may be exceeded by 1-5%',
                'Not suitable for financial or compliance scenarios',
                'Hard to explain to clients why the limit "drifts"',
              ],
              bestWhen:
                'The rate limit is advisory rather than strict; speed matters more than precision.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -2,
                complexity: -2,
                cost: -1,
              },
            },
          ],
        },
        {
          id: 'rl-rules',
          category: 'Rule management',
          question: 'How to manage rules?',
          options: [
            {
              id: 'hardcoded',
              label: 'Hardcoded config',
              description:
                'Limits are hardcoded in the code or configuration and deployed with the application.',
              pros: [
                'Simplicity: limits right in the code',
                'Versioning through git',
                'No additional dependencies',
              ],
              cons: [
                'Changing a limit requires a deploy',
                'Impossible to react quickly to an incident',
                'No UI for management',
              ],
              bestWhen:
                'Rarely changing limits in small projects.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 1,
                complexity: -2,
                cost: -1,
              },
            },
            {
              id: 'config-hot-reload',
              label: 'Config file (hot reload)',
              description:
                'Limits are stored in a configuration file (YAML/JSON) and reloaded without a restart.',
              pros: [
                'Changes without a full deploy',
                'Versioning through git (GitOps)',
                'A simple structure — easy to understand and audit',
              ],
              cons: [
                'No UI — file system or git access is needed',
                'A delay between the commit and its application',
                'Not suitable for per-client limits at the scale of thousands of clients',
              ],
              bestWhen:
                'Dozens of rules, a GitOps approach, predictable changes.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 1,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'database-admin-ui',
              label: 'Database + admin UI',
              description:
                'Rules are stored in a database; management is through an admin panel.',
              pros: [
                'A UI for managers and support',
                'Instant application of changes',
                'Per-client limits, A/B testing of rules',
              ],
              cons: [
                'Another system to develop and maintain',
                'A dependency on the database when loading rules',
                'A risk of accidental changes through the UI',
              ],
              bestWhen:
                'A large number of clients with individual limits; there is a support team.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 2,
                cost: 1,
              },
            },
            {
              id: 'feature-flags',
              label: 'Feature flags (LaunchDarkly-like)',
              description:
                'Rules are managed through a feature flag system with a UI and an API.',
              pros: [
                'Instant enabling/disabling of rules',
                'A/B testing of limits',
                'An audit log out of the box',
              ],
              cons: [
                'A dependency on an external SaaS or a self-hosted solution',
                'Additional cost (LaunchDarkly, Unleash)',
                'Overkill for simple rules',
              ],
              bestWhen:
                'A feature flag system is already in use; you need to experiment quickly with limits.',
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
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'rl-reliability',
      title: 'Reliability',
      description:
        'Define the behavior on failures and the monitoring strategy for the rate limiter.',
      decisions: [
        {
          id: 'rl-failure',
          category: 'Failure handling',
          question: 'What to do when the rate limiter fails?',
          options: [
            {
              id: 'fail-open',
              label: 'Fail open (let everything through)',
              description:
                'When the rate limiter fails, all requests are let through without limits.',
              pros: [
                'The service keeps working — no downtime',
                'The rate limiter does not become a SPOF',
                'The standard approach (Cloudflare, Stripe)',
              ],
              cons: [
                'Temporarily no protection against abuse',
                'The backend can be overloaded without limits',
                'Monitoring is needed to quickly detect the failure',
              ],
              bestWhen:
                'Service availability matters more than strict limit enforcement.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: -2,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: 'fail-closed',
              label: 'Fail closed (block everything)',
              description:
                'When the rate limiter fails, all requests are blocked.',
              pros: [
                'Guaranteed protection of the backend from overload',
                'Security: no risk of bypassing the limits',
                'Simple logic: no limiter = no access',
              ],
              cons: [
                'The rate limiter becomes a SPOF',
                'Full downtime on any rate limiter failure',
                'Unacceptable for most production systems',
              ],
              bestWhen:
                'Critical systems where backend overload is more dangerous than downtime (payment gateways).',
              impact: {
                latency: 0,
                scalability: -2,
                consistency: 2,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: 'local-fallback',
              label: 'Fallback to local limiter',
              description:
                'When the centralized store fails, switch to an in-memory rate limiter.',
              pros: [
                'Graceful degradation — limits keep working',
                'Neither availability nor protection is lost',
                'A balance between fail open and fail closed',
              ],
              cons: [
                'Limits are imprecise — each instance counts separately',
                'Complex switching logic',
                'Both modes must be tested',
              ],
              bestWhen:
                'A compromise is needed: preserve both availability and basic protection.',
              impact: {
                latency: 1,
                scalability: 0,
                consistency: -1,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'circuit-breaker',
              label: 'Circuit breaker',
              description:
                'A circuit breaker in front of Redis: after a series of errors, it switches to fallback mode.',
              pros: [
                'Automatic switching without manual intervention',
                'Protection against cascading failures',
                'Automatic recovery (half-open state)',
              ],
              cons: [
                'Additional complexity: parameters (threshold, timeout, half-open)',
                'May misfire during network flapping',
                'A fallback mode is needed in any case',
              ],
              bestWhen:
                'A mature system that needs automatic recovery after failures.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 0,
              },
            },
          ],
        },
        {
          id: 'rl-observability',
          category: 'Monitoring',
          question: 'What to monitor?',
          multiSelect: true,
          options: [
            {
              id: 'rate-429',
              label: 'Rate of 429 responses',
              description:
                'Tracking the count and percentage of 429 Too Many Requests responses.',
              pros: [
                'The primary metric of rate limiter effectiveness',
                'Lets you spot a rise in rejected requests',
                'Easy to collect via access logs or middleware',
              ],
              cons: [
                'Does not show the cause — a drill-down by key is needed',
                'A high 429 rate can be normal or a problem — context is needed',
                'A lag: the metric appears after the fact',
              ],
              bestWhen:
                'A basic metric — mandatory for any rate limiter.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'redis-latency',
              label: 'Redis latency',
              description:
                'Monitoring the latency of Redis calls for rate limiting.',
              pros: [
                'Early detection of Redis problems',
                'Helps plan Redis scaling',
                'Correlates with overall API latency',
              ],
              cons: [
                'Requires separate instrumentation (Redis SLOWLOG, client-side timing)',
                'Noise: brief latency spikes are normal',
                'Does not show the root cause (network vs Redis vs Lua script)',
              ],
              bestWhen:
                'Redis is used as the counter store — a mandatory metric.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'rules-distribution',
              label: 'Rules hit distribution',
              description:
                'The distribution of triggers across rules: which limits trigger more often.',
              pros: [
                'Detection of misconfigured limits',
                'Understanding of API usage patterns',
                'A basis for optimizing rules',
              ],
              cons: [
                'Requires structured logging with rule metadata',
                'A large data volume at high RPS',
                'An analytics system is needed for processing',
              ],
              bestWhen:
                'Many rules with different limits; the configuration needs optimization.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'false-positive-rate',
              label: 'False positive rate',
              description:
                'The percentage of legitimate requests mistakenly blocked by the rate limiter.',
              pros: [
                'A key business metric: lost revenue from blocked clients',
                'Helps fine-tune the limits',
                'Detection of problems with the limiting key (NAT/shared IP)',
              ],
              cons: [
                'Hard to determine what a "legitimate" request is',
                'Requires correlation with business metrics (conversion, revenue)',
                'May require A/B testing for an accurate estimate',
              ],
              bestWhen:
                'Business-critical APIs where blocking a legitimate client = lost revenue.',
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
      ],
    },
  ],

  // ── Reference Solution ────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'rl-scope': ['server-side'],
      'rl-granularity': ['by-api-key'],
      'rl-algo': ['sliding-window-counter'],
      'rl-store': ['redis'],
      'rl-sync': ['centralized-store'],
      'rl-placement': ['api-gateway'],
      'rl-response': ['429-with-headers'],
      'rl-perf': ['lua-scripts', 'local-cache-async'],
      'rl-rules': ['config-hot-reload'],
      'rl-failure': ['fail-open'],
      'rl-observability': ['rate-429', 'redis-latency', 'rules-distribution', 'false-positive-rate'],
    },
    explanation:
      'The reference solution reflects the industry standard used at Cloudflare, Stripe, and Kong.\n\n' +
      '**Sliding Window Counter** is the optimal balance between precision and performance. ' +
      'Unlike Fixed Window, it does not allow a 2x burst at the window boundary. ' +
      'Unlike Sliding Window Log, it requires O(1) memory per client.\n\n' +
      '**Redis** as the centralized store is the de facto standard. ' +
      'Atomic Lua scripts allow performing the check and increment in a single round-trip with no race conditions. ' +
      'TTL automatically cleans up stale counters.\n\n' +
      '**API Gateway** is the natural place for a rate limiter: all requests already pass through it, ' +
      'and ready-made plugins (Kong rate-limiting, Envoy ratelimit) reduce time-to-market.\n\n' +
      '**Fail open** is the industry standard. The rate limiter must not become a single point of failure: ' +
      'it is better to temporarily let through extra requests than to block all traffic.\n\n' +
      '**Local cache + async sync** complements the Lua scripts: it reduces the load on Redis at extreme RPS ' +
      'and provides graceful degradation during brief Redis failures.',
    diagram:
      '┌─────────┐       ┌──────────────────────────┐       ┌──────────────────┐\n' +
      '│  Client  │──────▶│     API Gateway           │──────▶│  Backend Services │\n' +
      '│         │       │  ┌──────────────────────┐ │       │                  │\n' +
      '│         │◀──────│  │   Rate Limiter        │ │       │  Service A       │\n' +
      '│         │  429  │  │  (Sliding Window)     │ │       │  Service B       │\n' +
      '└─────────┘       │  └──────────┬───────────┘ │       │  Service C       │\n' +
      '                  └─────────────┼─────────────┘       └──────────────────┘\n' +
      '                                │\n' +
      '                  ┌─────────────▼─────────────┐\n' +
      '                  │         Redis              │\n' +
      '                  │  ┌─────────┐ ┌──────────┐ │\n' +
      '                  │  │Counters │ │Lua Script│ │\n' +
      '                  │  │  (TTL)  │ │(atomic)  │ │\n' +
      '                  │  └─────────┘ └──────────┘ │\n' +
      '                  └─────────────▲─────────────┘\n' +
      '                                │\n' +
      '                  ┌─────────────┴─────────────┐\n' +
      '                  │     Rules Config           │\n' +
      '                  │  (YAML / hot reload)       │\n' +
      '                  └───────────────────────────┘',
  },
  capacityEstimates: {
    default: [
      {
        label: 'Peak RPS',
        value: '10M RPS',
        formula: 'Given: API gateway peak load',
      },
      {
        label: 'Counter storage (Redis)',
        value: '~100 MB',
        formula:
          '1M unique API keys × 100 bytes per counter ≈ 100 MB',
      },
      {
        label: 'Rule evaluations/sec',
        value: '10M/sec',
        formula: '10M RPS = 10M rule checks/sec (one evaluation per request)',
      },
      {
        label: 'Latency budget',
        value: '<1 ms',
        formula:
          'Rate limiter adds <1 ms; total API budget ~100 ms → <1% overhead',
      },
      {
        label: 'Network bandwidth',
        value: '~2 GB/s',
        formula:
          '10M RPS × ~200 bytes avg request header = ~2 GB/s inspection',
      },
      {
        label: 'Memory per node (10 nodes)',
        value: '~50 MB',
        formula:
          '100 MB total / 10 nodes = 10 MB per node + overhead ≈ 50 MB',
      },
    ],
  },
};
