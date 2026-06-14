import type { Scenario } from '@/data/constructor/types';

export const chatMessengerScenario: Scenario = {
  id: 'chat-messenger',
  title: 'Chat Messenger',
  difficulty: 'senior',
  description:
    'Design a real-time chat messenger at the scale of WhatsApp/Telegram for 500M+ users. The system must support instant message delivery, group chats, media files, and end-to-end encryption with guaranteed delivery and message ordering.',

  steps: [
    // ── Step 1: Requirements ────────────────────────────────────────────
    {
      id: 'chat-requirements',
      title: 'Requirements',
      description:
        'Define the chat types and message features the messenger must support.',
      tip: 'WhatsApp limits groups to 256 members for a reason — it is the threshold at which fanout on write remains efficient. Telegram separates groups and channels architecturally.',
      decisions: [
        {
          id: 'chat-type',
          category: 'Chat types',
          question: 'Which chat types should be supported?',
          multiSelect: true,
          options: [
            {
              id: 'one-on-one',
              label: 'Direct chats (1-on-1)',
              description:
                'Private dialogues between two users — the foundation of any messenger.',
              pros: [
                'Simple delivery model — exactly one recipient',
                'Easy to implement E2E encryption (one key per pair)',
                'Minimal fanout load',
              ],
              cons: [
                'A separate inbox must be stored for each user',
                'Synchronization between a single user\'s devices complicates the model',
              ],
              bestWhen: 'Always — the basic chat type for any messenger',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'group-chats',
              label: 'Group chats (up to 256 members)',
              description:
                'Chats with multiple participants. WhatsApp limits to 256, Telegram to 200,000 (but architecturally that is closer to channels).',
              pros: [
                'Covers most group-communication scenarios',
                'With a group-size limit, fanout stays manageable',
                'Can store one copy of a message + a recipient list',
              ],
              cons: [
                'Fanout to N participants on every message',
                'E2E encryption becomes more complex (Sender Keys / group of keys)',
                'Managing group membership is a separate subsystem',
              ],
              bestWhen:
                'You need to support team and family communication with a manageable delivery load',
              impact: { latency: -1, scalability: -1, consistency: -1, complexity: 1, cost: 1 },
            },
            {
              id: 'channels',
              label: 'Channels (broadcast, no subscriber limit)',
              description:
                'One-way broadcast from authors to subscribers. Telegram channels can have millions of subscribers.',
              pros: [
                'Excellent for content distribution',
                'Fanout on read offloads the sender',
                'Subscribers read from a shared feed — one copy of the message',
              ],
              cons: [
                'Requires a separate delivery strategy (fanout on read)',
                'Push notifications to millions of subscribers are a separate infrastructure challenge',
                'Not suitable for two-way communication',
              ],
              bestWhen:
                'You need to support media/news channels with a large audience',
              impact: { latency: 0, scalability: -1, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'threads',
              label: 'Threads (replies within a chat)',
              description:
                'Nested discussions within a main chat. Used in Slack, Telegram (reply threads), Discord.',
              pros: [
                'Structures discussions in large groups',
                'Reduces noise in the main message stream',
                'Allows subscribing only to the threads of interest',
              ],
              cons: [
                'Complicates the data model (parent_message_id, thread counters)',
                'Thread notifications are separate logic',
                'UI/UX becomes more complex',
              ],
              bestWhen: 'The messenger targets work teams or large communities',
              impact: { latency: 0, scalability: 0, consistency: -1, complexity: 1, cost: 0 },
            },
          ],
        },
        {
          id: 'chat-features',
          category: 'Message features',
          question: 'Which message features should be supported?',
          multiSelect: true,
          options: [
            {
              id: 'text',
              label: 'Text only',
              description: 'Basic text messages — the foundation of a messenger.',
              pros: [
                'Minimal message size (a few KB)',
                'Simple serialization and storage',
                'Instant delivery even on slow connections',
              ],
              cons: [
                'Limited expressiveness',
                'Users expect multimedia in a modern messenger',
              ],
              bestWhen: 'MVP or a messenger for weak network connections',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'media',
              label: 'Media (photos, video, files)',
              description:
                'Support for sending photos, videos, documents, and voice messages.',
              pros: [
                'A full-featured user experience',
                'Monetization opportunity (expanded storage)',
                'Competitiveness with existing messengers',
              ],
              cons: [
                'Requires separate storage for media (object storage)',
                'Video transcoding / image compression is computationally expensive',
                'Significantly increases traffic and storage cost',
              ],
              bestWhen: 'The messenger must be a full replacement for WhatsApp/Telegram',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: 1, cost: 2 },
            },
            {
              id: 'read-receipts',
              label: 'Delivery and read receipts',
              description:
                'Sent / Delivered / Read checkmarks, as in WhatsApp (one grey, two grey, two blue).',
              pros: [
                'Users understand the state of their messages',
                'Increases trust in the platform',
                'An industry standard for messengers',
              ],
              cons: [
                'Additional ACK-message traffic (2 ACKs per message)',
                'In groups — N ACKs per message, quadratic load',
                'Privacy: not everyone wants to reveal when they read a message',
              ],
              bestWhen:
                'The messenger is oriented toward personal communication where feedback matters',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'e2e-encryption',
              label: 'End-to-end encryption',
              description:
                'Client-side encryption. The server cannot read messages. The Signal Protocol is used in WhatsApp and Signal.',
              pros: [
                'Maximum user privacy',
                'The server is not a point of data compromise',
                'A competitive advantage in the privacy-first era',
              ],
              cons: [
                'Server-side message search is impossible',
                'Complicates multi-device sync (a protocol like Signal Sesame is needed)',
                'Group encryption is more complex (Sender Keys, MLS)',
              ],
              bestWhen:
                'Privacy is a key product requirement (personal messengers)',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: 2, cost: 0 },
            },
            {
              id: 'edit-delete',
              label: 'Editing and deleting messages',
              description:
                'The ability to edit or delete a sent message. Telegram allows editing without limits, WhatsApp allows "delete for everyone".',
              pros: [
                'Users can fix mistakes',
                'Delete-for-everyone improves privacy control',
                'A standard feature of modern messengers',
              ],
              cons: [
                'Changes must be propagated to all recipients (another fanout)',
                'Conflict with E2E encryption — how do you confirm a deletion?',
                'Storing edit history increases data volume',
              ],
              bestWhen: 'A full-featured editing UX, as in Telegram, is important',
              impact: { latency: 0, scalability: -1, consistency: -1, complexity: 1, cost: 0 },
            },
          ],
        },
      ],
    },

    // ── Step 2: Realtime Communication ──────────────────────────────────
    {
      id: 'chat-realtime',
      title: 'Real-time communication',
      description:
        'Choose the protocol and connection architecture to ensure instant message delivery.',
      tip: 'WhatsApp uses a custom binary protocol over TCP on Erlang/BEAM. Telegram uses MTProto (its own binary protocol). For most new systems WebSocket is the optimal balance between performance and simplicity.',
      decisions: [
        {
          id: 'chat-protocol',
          category: 'Transport protocol',
          question: 'Which protocol should be used for real-time communication?',
          options: [
            {
              id: 'websocket',
              label: 'WebSocket',
              description:
                'A full-duplex TCP connection via the standard WebSocket API. Supported by all browsers and mobile platforms.',
              pros: [
                'Bidirectional communication with minimal overhead (2-14 bytes per frame)',
                'Native support in browsers and mobile SDKs',
                'Works over standard ports 80/443, passes through most firewalls',
              ],
              cons: [
                'A stateful connection complicates load balancing (needs sticky sessions or an L4 LB)',
                'Reconnection on network change (Wi-Fi → LTE) is handled client-side',
                'Does not support stream multiplexing (unlike HTTP/2)',
              ],
              bestWhen:
                'The standard choice for web + mobile messengers with reasonable complexity',
              impact: { latency: 2, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
              capacityImpact: [
                {
                  label: 'Concurrent connections',
                  value: '50M (~500 GB RAM)',
                  formula:
                    '50M WebSocket connections × ~10 KB memory per connection (buffers + TLS state) = ~500 GB RAM across gateway fleet',
                },
                {
                  label: 'Gateway fleet size',
                  value: '~200 servers',
                  formula:
                    '50M connections / 250K connections per server (64 GB RAM, tuned kernel) = 200 gateway servers',
                },
                {
                  label: 'Bandwidth (messages only)',
                  value: '~155 MB/s',
                  formula:
                    '700K msgs/sec × (100 bytes payload + 14 bytes WS frame + ~8 bytes TCP) × 2 (send+recv) ≈ 155 MB/s',
                },
              ],
            },
            {
              id: 'long-polling',
              label: 'Long Polling',
              description:
                'The client holds an HTTP request open; the server responds when new data appears. A fallback for environments without WebSocket.',
              pros: [
                'Works everywhere, including corporate proxies',
                'Stateless — easy to load balance',
                'Simple server-side implementation',
              ],
              cons: [
                'Up to a second of latency to reopen the connection after each response',
                'High HTTP-header overhead on each request',
                'Not suitable for high-frequency updates (typing indicators)',
              ],
              bestWhen:
                'A fallback for environments with limited WebSocket support or as a temporary solution',
              impact: { latency: -1, scalability: 1, consistency: 0, complexity: -1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Concurrent connections',
                  value: '50M (~750 GB RAM)',
                  formula:
                    '50M users polling; each poll = new HTTP connection with ~15 KB overhead (headers + TLS handshake) = ~750 GB RAM peak',
                },
                {
                  label: 'Gateway fleet size',
                  value: '~350 servers',
                  formula:
                    'Each poll reconnects every ~30s; 50M / 30 ≈ 1.7M new connections/sec; need ~350 servers to handle TLS handshake overhead',
                },
                {
                  label: 'Bandwidth (messages only)',
                  value: '~1.7 GB/s',
                  formula:
                    '1.7M polls/sec × ~1 KB HTTP headers per request/response = ~1.7 GB/s overhead; 10× more than WebSocket',
                },
              ],
            },
            {
              id: 'sse',
              label: 'Server-Sent Events (SSE)',
              description:
                'A one-way stream from server to client over HTTP. Sending messages uses ordinary HTTP POSTs.',
              pros: [
                'Automatic reconnection is built into the API',
                'Works over HTTP/2 with multiplexing',
                'Simpler server implementation than WebSocket',
              ],
              cons: [
                'One-way — a separate channel is needed for sending',
                'A limit on the number of connections per browser (6 per domain in HTTP/1.1)',
                'Not suitable for binary data',
              ],
              bestWhen:
                'A system dominated by server-side updates (feeds, notifications), not a chat',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'xmpp',
              label: 'XMPP (Extensible Messaging and Presence Protocol)',
              description:
                'An open standard for messaging. Originally used in Google Talk, early versions of WhatsApp, and Facebook Messenger.',
              pros: [
                'A mature standard with support for presence, groups, and federation',
                'A large ecosystem of servers (ejabberd, Prosody)',
                'Support for server-to-server federation out of the box',
              ],
              cons: [
                'XML format — significant traffic overhead',
                'A complex standard with many XEP extensions',
                'WhatsApp and Facebook moved away from XMPP to custom protocols due to overhead',
              ],
              bestWhen:
                'You need server-to-server federation or compatibility with existing XMPP infrastructure',
              impact: { latency: -1, scalability: -1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'custom-binary',
              label: 'Custom binary protocol',
              description:
                'A proprietary protocol over TCP/TLS. WhatsApp uses a custom protocol on Erlang, Telegram uses MTProto.',
              pros: [
                'Minimal overhead — every byte is under control',
                'Can be optimized for specific scenarios (batching, compression)',
                'Maximum performance on mobile networks',
              ],
              cons: [
                'Huge development and maintenance costs',
                'No standard debugging tools (you need your own tooling)',
                'Requires client libraries for every platform',
              ],
              bestWhen:
                'WhatsApp/Telegram scale, where every saved byte matters across billions of messages',
              impact: { latency: 2, scalability: 1, consistency: 0, complexity: 2, cost: 1 },
              capacityImpact: [
                {
                  label: 'Concurrent connections',
                  value: '50M (~250 GB RAM)',
                  formula:
                    '50M connections × ~5 KB per connection (no HTTP overhead, minimal framing, compact TLS state) = ~250 GB RAM',
                },
                {
                  label: 'Gateway fleet size',
                  value: '~100 servers',
                  formula:
                    '50M / 500K connections per server (Erlang/BEAM-style lightweight processes, 64 GB RAM) = 100 servers',
                },
                {
                  label: 'Bandwidth (messages only)',
                  value: '~84 MB/s',
                  formula:
                    '700K msgs/sec × 60 bytes avg (binary encoding, ~40% smaller than JSON+WS) × 2 = ~84 MB/s; ~40% bandwidth savings vs WebSocket',
                },
              ],
            },
          ],
        },
        {
          id: 'chat-connection',
          category: 'Connection management',
          question: 'How should user connections be managed?',
          options: [
            {
              id: 'stateful-gateway',
              label: 'Stateful gateway servers',
              description:
                'Dedicated servers that hold WebSocket/TCP connections. Each gateway knows its connected users. WhatsApp uses stateful Erlang nodes, each holding ~2M connections.',
              pros: [
                'Instant delivery — the gateway knows which socket belongs to which user',
                'Erlang/BEAM can hold millions of lightweight processes on one server',
                'Minimal latency — no intermediate lookup when sending',
              ],
              cons: [
                'If a gateway crashes, all connections are lost (a graceful reconnect is needed)',
                'Rebalancing when adding/removing nodes is non-trivial',
                'Service discovery is needed to route messages between gateways',
              ],
              bestWhen:
                'The priority is minimal delivery latency and high connection density',
              impact: { latency: 2, scalability: 0, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'connection-broker',
              label: 'Connection broker + stateless workers',
              description:
                'A separate broker tracks where each user is connected. Stateless worker servers handle the business logic.',
              pros: [
                'Worker servers are easy to scale horizontally',
                'A worker crash does not lose connections',
                'Clear separation of responsibilities',
              ],
              cons: [
                'An additional hop through the broker on each message',
                'The broker is a potential point of failure and bottleneck',
                'Routing complexity: broker → lookup → gateway → user',
              ],
              bestWhen:
                'The team prefers a stateless architecture and is willing to pay with extra latency',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 1, cost: 1 },
            },
            {
              id: 'edge-servers',
              label: 'Edge servers (CDN-like architecture)',
              description:
                'Geographically distributed servers closest to users. Like a CDN, but for WebSocket connections.',
              pros: [
                'Minimal RTT for users worldwide',
                'Resilience to regional failures',
                'Can cache media at the edge',
              ],
              cons: [
                'Messages between users on different edges require an additional hop',
                'Complex state synchronization between edge nodes',
                'High infrastructure cost across dozens of regions',
              ],
              bestWhen:
                'A global messenger with users on all continents and strict latency requirements',
              impact: { latency: 2, scalability: 1, consistency: -1, complexity: 2, cost: 2 },
            },
          ],
        },
      ],
    },

    // ── Step 3: Data Model & Storage ────────────────────────────────────
    {
      id: 'chat-storage',
      title: 'Data model and storage',
      description:
        'Choose the databases for storing messages and media content.',
      tip: 'Discord initially used Cassandra but migrated to ScyllaDB due to GC-pause problems with large partitions. WhatsApp stores messages in Mnesia (Erlang), but that is a unique case. For most systems — ScyllaDB or Cassandra.',
      decisions: [
        {
          id: 'chat-message-db',
          category: 'Message storage',
          question: 'Where should messages be stored?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL (with time-based partitioning)',
              description:
                'A relational database with table partitioning by time ranges. Used in small and medium systems.',
              pros: [
                'Rich query capabilities (JOIN, full-text search)',
                'ACID transactions — strong consistency',
                'A mature ecosystem, widely known to developers',
              ],
              cons: [
                'Vertical scaling is limited (even with Citus — harder than native sharding)',
                'Lower write throughput than LSM-tree databases under high write load',
                'Partitioning + sharding require manual setup',
              ],
              bestWhen:
                'A messenger up to ~10M users or as an initial option with a migration plan',
              impact: { latency: 0, scalability: -2, consistency: 2, complexity: -1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~50K/sec (single node limit)',
                  formula:
                    'Single PostgreSQL node tops out at ~50K writes/sec with B-tree indexes; need partitioning beyond that',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~1.5 PB (with MVCC overhead)',
                  formula:
                    '730 TB raw × ~2× MVCC bloat (dead tuples, TOAST) = ~1.5 PB; requires aggressive VACUUM',
                },
                {
                  label: 'Partitioning overhead',
                  value: '~14 600 partitions/year',
                  formula:
                    '1 partition per day × 365 days = 365 time partitions; with 40 shards (Citus) = 14 600 partitions',
                },
                {
                  label: 'Cluster size (messages)',
                  value: '~40 Citus shards',
                  formula:
                    '700K writes/sec ÷ ~18K writes/sec per shard ≈ 40 shards needed; each shard = separate PG instance',
                },
              ],
            },
            {
              id: 'cassandra',
              label: 'Apache Cassandra',
              description:
                'A wide-column NoSQL database. Discord used Cassandra to store trillions of messages. Eventual consistency, excellent writes.',
              pros: [
                'Linear horizontal scaling',
                'Optimized for write-heavy load (LSM-tree)',
                'No single point of failure (masterless architecture)',
              ],
              cons: [
                'JVM GC pauses with large partitions (Discord\'s problem)',
                'Eventual consistency — read anomalies are possible',
                'Limited query model (you must design for query patterns)',
              ],
              bestWhen:
                'A write-heavy chat with linear scaling, if the team is ready for JVM tuning',
              impact: { latency: 0, scalability: 2, consistency: -1, complexity: 1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~700K/sec (with GC tuning)',
                  formula:
                    'Cassandra handles 700K writes/sec across ~40 nodes; GC pauses (100-500ms) can spike p99 latency',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~2.2 PB (with RF=3)',
                  formula:
                    '730 TB raw × RF=3 replication = ~2.2 PB; plus ~30% LSM compaction headroom = ~2.9 PB total disk',
                },
                {
                  label: 'Write throughput',
                  value: '~700K writes/sec',
                  formula:
                    'LSM-tree write path; but JVM GC pauses at large partition sizes (Discord hit this at >100MB partitions)',
                },
                {
                  label: 'Cluster size (messages)',
                  value: '~40 nodes',
                  formula:
                    '2.9 PB (with compaction headroom) / 72 TB per node ≈ 40 nodes; masterless ring topology',
                },
              ],
            },
            {
              id: 'scylladb',
              label: 'ScyllaDB',
              description:
                'A Cassandra-compatible database in C++. Discord migrated from Cassandra to ScyllaDB. No GC pauses, predictable latency.',
              pros: [
                'Compatible with the Cassandra API — easy migration',
                'No GC pauses (C++ instead of JVM)',
                'Predictable p99 latency even under high load',
              ],
              cons: [
                'Smaller community than Cassandra',
                'Operational complexity at a cluster of dozens of nodes',
                'Eventual consistency — the same data-model constraints as Cassandra',
              ],
              bestWhen:
                'A write-heavy chat at the scale of 100M+ users with a requirement for predictable latency',
              impact: { latency: 1, scalability: 2, consistency: -1, complexity: 1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~700K/sec (handled)',
                  formula:
                    'ScyllaDB handles 700K writes/sec across ~35 nodes (each node ~20K writes/sec sustained)',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~2.2 PB (with RF=3)',
                  formula:
                    '730 TB raw × RF=3 replication = ~2.2 PB total disk; ~35 nodes × 64 TB NVMe each',
                },
                {
                  label: 'Write throughput',
                  value: '~700K writes/sec',
                  formula:
                    'LSM-tree optimized for writes; no GC pauses (C++); p99 latency < 10ms even at peak',
                },
                {
                  label: 'Cluster size (messages)',
                  value: '~35 nodes',
                  formula:
                    '2.2 PB / 64 TB per node ≈ 35 nodes; 3 replicas ensure availability if 1 node fails',
                },
              ],
            },
            {
              id: 'hbase',
              label: 'HBase',
              description:
                'A wide-column store on top of HDFS. Used in Facebook Messenger to store messages.',
              pros: [
                'Proven at Facebook scale',
                'Strong read consistency (unlike Cassandra)',
                'Integrates well with the Hadoop ecosystem for analytics',
              ],
              cons: [
                'Requires HDFS + ZooKeeper + a complex ops stack',
                'High barrier to entry for the team',
                'Higher latency than ScyllaDB/Cassandra for point queries',
              ],
              bestWhen:
                'You already have Hadoop infrastructure and need strong consistency for messages',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 2, cost: 1 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~500K/sec',
                  formula:
                    'HBase write throughput limited by WAL + HDFS pipeline; ~500K writes/sec across ~50 region servers',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~4.4 PB (HDFS RF=3 + overhead)',
                  formula:
                    '730 TB raw × RF=3 (HDFS default) = 2.2 PB + ~100% HDFS block overhead (128MB blocks, WAL) ≈ 4.4 PB',
                },
                {
                  label: 'Minimum cluster size',
                  value: '~60 nodes',
                  formula:
                    '50 RegionServers + 3 HDFS NameNodes (HA) + 3 ZooKeeper nodes + 3 HBase Masters ≈ 60 nodes minimum',
                },
                {
                  label: 'Cluster size (messages)',
                  value: '~50 RegionServers',
                  formula:
                    '4.4 PB / 96 TB per node ≈ 46 nodes; round up to 50 for headroom and region balancing',
                },
              ],
            },
          ],
        },
        {
          id: 'chat-media-storage',
          category: 'Media storage',
          question: 'Where should media files (photos, videos, documents) be stored?',
          options: [
            {
              id: 'object-storage-cdn',
              label: 'Object Storage (S3/GCS) + CDN',
              description:
                'Media is stored in S3/GCS and served via a CDN. The industry standard for media content.',
              pros: [
                'Practically unlimited capacity',
                'A CDN ensures fast delivery worldwide',
                '11 nines durability (S3) — data is not lost',
              ],
              cons: [
                'Cost of CDN egress traffic at high volumes',
                'Latency on the first request (CDN cache miss)',
                'Requires logic to generate pre-signed URLs for private content',
              ],
              bestWhen: 'The standard solution for any messenger with media content',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: 0, cost: 1 },
              capacityImpact: [
                {
                  label: 'Media storage (1 year)',
                  value: '~73 PB ($1.7M/mo)',
                  formula:
                    '73 PB on S3 Standard ≈ $0.023/GB × 73 000 TB = ~$1.7M/month; lifecycle policy to S3 IA after 90 days saves ~40%',
                },
                {
                  label: 'CDN egress bandwidth',
                  value: '~120 Gbps',
                  formula:
                    '500M users × 5% view media/hour × 200KB avg / 3600 = ~120 Gbps sustained; CDN absorbs ~95% of reads',
                },
                {
                  label: 'CDN cost (monthly)',
                  value: '~$3.5M/mo',
                  formula:
                    '120 Gbps × 2.6M sec/month ≈ 39 EB transferred; at $0.085/GB for first 10PB tier → ~$3.5M/month',
                },
              ],
            },
            {
              id: 'distributed-fs',
              label: 'Distributed file system (HDFS)',
              description:
                'Storing files in a distributed file system. Facebook used its own Haystack, then f4.',
              pros: [
                'Full control over storage and replication',
                'Can be optimized for a specific access pattern',
                'No dependency on a cloud provider',
              ],
              cons: [
                'Huge ops and infrastructure costs',
                'You must build the CDN layer yourself',
                'Justified only at Facebook scale',
              ],
              bestWhen:
                'On-premise infrastructure at Facebook scale with a dedicated storage team',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 2, cost: 2 },
            },
            {
              id: 'cdn-origin',
              label: 'CDN + Origin Storage (multi-tier)',
              description:
                'Hot files on the CDN, warm files on fast origin storage, cold files on cheap archival storage (S3 Glacier).',
              pros: [
                'Optimal cost — hot/cold separation',
                'Fast access to recent media',
                'Savings on storing old content',
              ],
              cons: [
                'Complex tiering and migration logic between levels',
                'Latency when accessing cold files',
                'More moving parts in the infrastructure',
              ],
              bestWhen:
                'Cost optimization with a large media volume and a clear hot/cold pattern',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Media storage (1 year)',
                  value: '~73 PB ($0.9M/mo avg)',
                  formula:
                    'Hot tier (30 days): ~6 PB on S3 Standard; Warm (90 days): ~12 PB on S3 IA; Cold: ~55 PB on Glacier ≈ $0.9M/mo blended',
                },
                {
                  label: 'CDN egress bandwidth',
                  value: '~120 Gbps',
                  formula:
                    'Same total reads as S3+CDN, but edge cache hit rate ~98% (vs ~95%) due to tiered warm cache; reduces origin egress by ~60%',
                },
                {
                  label: 'Edge cache size',
                  value: '~50 TB across PoPs',
                  formula:
                    'Top 0.07% of media (hot set) cached at CDN edge; 73 PB × 0.07% ≈ 50 TB distributed across ~200 PoPs ≈ 250 GB/PoP',
                },
              ],
            },
          ],
        },
      ],
    },

    // ── Step 4: Message Delivery ────────────────────────────────────────
    {
      id: 'chat-delivery',
      title: 'Message delivery',
      description:
        'Define the strategy for delivering messages to groups and the mechanism for handling offline users.',
      tip: 'WhatsApp uses fanout on write for groups up to 256 members — this lets each user have a single inbox with all messages. For channels with millions of subscribers, fanout on read is mandatory.',
      decisions: [
        {
          id: 'chat-fanout',
          category: 'Fanout strategy',
          question: 'Which strategy should be used for delivering messages to groups?',
          options: [
            {
              id: 'fanout-write',
              label: 'Fanout on write (write to each recipient\'s inbox)',
              description:
                'When a message is sent, it is written to the inbox of every group member. A user reads only their own inbox.',
              pros: [
                'Reading is as fast as possible — one query to your own inbox',
                'Offline-message delivery is trivial — they are already in the inbox',
                'A simple sync model on reconnect',
              ],
              cons: [
                'Write amplification: 1 message → N writes (per number of members)',
                'Does not scale for channels with millions of subscribers',
                'Expensive in storage — N copies of each message',
              ],
              bestWhen: 'Groups are limited (up to 256 as in WhatsApp), the priority is fast reads',
              impact: { latency: 1, scalability: -1, consistency: 1, complexity: 0, cost: 1 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~18M writes/sec (after fanout)',
                  formula:
                    '700K original msgs/sec × avg 25 recipients (mix of 1:1 and groups) = ~18M inbox writes/sec',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~18 PB (inbox copies)',
                  formula:
                    '730 TB × 25× avg fanout = ~18 PB of inbox entries (pointers + metadata, not full message copies)',
                },
                {
                  label: 'Write amplification',
                  value: '25×',
                  formula:
                    'Avg group size ~50 × 40% group msgs + 1× for 60% 1:1 msgs ≈ 50×0.4 + 1×0.6 = 20.6 ≈ 25× with overhead',
                },
              ],
            },
            {
              id: 'fanout-read',
              label: 'Fanout on read (recipients read from the group)',
              description:
                'The message is written once to the group/channel feed. Each recipient reads from this shared feed.',
              pros: [
                'One write per message — minimal write amplification',
                'Ideal for channels with millions of subscribers',
                'Storage savings — one copy of the message',
              ],
              cons: [
                'Reading is slower — you must merge feeds from all of the user\'s chats',
                'Offline-message sync — you must check all chats for new messages',
                'Timeline merge on the client or server — additional complexity',
              ],
              bestWhen:
                'Channels/groups with thousands and millions of subscribers, where write amplification is critical',
              impact: { latency: -1, scalability: 2, consistency: 0, complexity: 1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~700K writes/sec (no amplification)',
                  formula:
                    '700K original msgs/sec; each written once to conversation log. No fanout writes at all',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~730 TB (single copy)',
                  formula:
                    'Exactly 1 copy per message; 20B/day × 365 × 100 bytes = ~730 TB. No inbox duplication',
                },
                {
                  label: 'Read amplification',
                  value: '~50 reads/user open',
                  formula:
                    'User in avg 50 chats → opening app requires querying 50 conversation logs to build unified inbox',
                },
                {
                  label: 'Compute at read time',
                  value: '~2.5B merge ops/sec',
                  formula:
                    '50M online users × avg 1 inbox refresh/sec × 50 conversations = 2.5B timeline merge operations/sec',
                },
              ],
            },
            {
              id: 'hybrid-fanout',
              label: 'Hybrid: fanout on write for small groups, on read for channels',
              description:
                'Small groups (up to 256) — fanout on write into the inbox. Channels with thousands of subscribers — fanout on read. This is exactly how WhatsApp works.',
              pros: [
                'Optimal balance: fast reads for groups, savings for channels',
                'Scales from direct chats to channels with millions of subscribers',
                'A proven approach in production (WhatsApp, Telegram)',
              ],
              cons: [
                'Two delivery models — harder to develop and maintain',
                'The switchover threshold (256? 1000?) is an additional parameter',
                'The client must support both modes',
              ],
              bestWhen:
                'The messenger supports both groups and channels at the scale of 100M+ users',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: 1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~5M writes/sec (blended)',
                  formula:
                    'Groups ≤256: fanout-on-write ~4.5M writes/sec (90% of msgs × 7× avg fanout); channels: 700K × 10% = 70K writes/sec (single copy)',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~5.1 PB (blended)',
                  formula:
                    'Inbox copies for groups: 730 TB × 90% × 7× = 4.6 PB; channel messages: 730 TB × 10% × 1× = 73 TB; total ≈ 5.1 PB',
                },
                {
                  label: 'Write amplification',
                  value: '~7× (groups only)',
                  formula:
                    'Groups ≤256 avg fanout = 7× (weighted by group size distribution); channels = 1×; blended ≈ 7× for 90% of messages',
                },
              ],
            },
          ],
        },
        {
          id: 'chat-offline',
          category: 'Offline delivery',
          question: 'How should messages be delivered to offline users?',
          options: [
            {
              id: 'store-and-forward',
              label: 'Store and forward (per-user queue)',
              description:
                'Messages for an offline user accumulate in a queue. On connection, the client fetches all unread messages.',
              pros: [
                'Delivery guarantee — messages are not lost',
                'Simple sync: the client requests everything after last_seen_id',
                'Works well with fanout on write (the inbox is the queue)',
              ],
              cons: [
                'A queue must be stored for each user',
                'After a long absence — a large sync volume on connection',
                'A TTL on queued messages must be thought through',
              ],
              bestWhen: 'Guaranteed delivery matters more than first-sync latency',
              impact: { latency: 0, scalability: 0, consistency: 2, complexity: 0, cost: 0 },
            },
            {
              id: 'push-lazy-sync',
              label: 'Push notification + lazy sync',
              description:
                'A push notification is sent. When the app is opened, the client loads messages lazily (per chat).',
              pros: [
                'The push notification arrives instantly even without a connection',
                'Traffic savings — only opened chats are loaded',
                'Reduces server load during mass reconnects',
              ],
              cons: [
                'Push is not guaranteed (iOS/Android may drop it)',
                'Latency when opening a chat — messages must be loaded',
                'Dependency on APNs/FCM — third-party services',
              ],
              bestWhen:
                'A messenger where lazy loading is acceptable and not all chats are equally important',
              impact: { latency: -1, scalability: 1, consistency: -1, complexity: 0, cost: -1 },
            },
            {
              id: 'persistent-queue',
              label: 'Persistent queue (Kafka per user/group)',
              description:
                'A Kafka topic per group or user. Messages are stored in the log; the client reads from an offset.',
              pros: [
                'A log-based architecture — ideal for replay and sync',
                'The consumer offset gives precise control: "read up to message X"',
                'Kafka provides durability and high throughput',
              ],
              cons: [
                'Millions of topics (one per user) — a problem for Kafka',
                'Operational complexity of a Kafka cluster',
                'Overhead for simple 1-on-1 chats',
              ],
              bestWhen:
                'A system with a log-based architecture and a need for precise history replay',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 2, cost: 1 },
            },
          ],
        },
      ],
    },

    // ── Step 5: Scaling ─────────────────────────────────────────────────
    {
      id: 'chat-scaling',
      title: 'Scaling',
      description:
        'Define strategies for online status and data partitioning at the scale of 500M+ users.',
      tip: 'WhatsApp served 2 billion users with a team of ~50 engineers thanks to Erlang/BEAM. The secret is architectural minimalism and stateful servers. Telegram does not show exact online status to save resources.',
      decisions: [
        {
          id: 'chat-presence',
          category: 'Presence (online status)',
          question: 'How should online status (presence) be implemented?',
          options: [
            {
              id: 'heartbeat-redis',
              label: 'Heartbeat + centralized store (Redis)',
              description:
                'The client sends a heartbeat every 10-30 seconds. Status is stored in Redis with a TTL. A presence query is a lookup in Redis.',
              pros: [
                'A simple and predictable model',
                'Redis provides fast lookup by user ID',
                'TTL automatically clears status on disconnect',
              ],
              cons: [
                'Redis is a potential bottleneck at 500M users',
                'Heartbeat traffic: 500M users × 1 req/30s = ~17M req/s',
                'Requires a Redis Cluster with sharding',
              ],
              bestWhen:
                'You need accurate real-time presence with an acceptable load (up to ~100M online)',
              impact: { latency: 1, scalability: -1, consistency: 1, complexity: 0, cost: 1 },
              capacityImpact: [
                {
                  label: 'Redis memory (presence)',
                  value: '~50 GB',
                  formula:
                    '500M users × 100 bytes (user_id + status + last_seen + TTL metadata) = ~50 GB; fits in Redis Cluster with 10 shards',
                },
                {
                  label: 'Heartbeat RPS',
                  value: '~17M req/sec',
                  formula:
                    '500M users × 10% online × heartbeat every 30s = 50M / 30 ≈ 1.7M/sec; plus presence lookups ≈ 17M/sec total',
                },
                {
                  label: 'Redis cluster size',
                  value: '10 shards (20 nodes with replicas)',
                  formula:
                    '50 GB / 5 GB per shard = 10 shards; × 2 (1 replica each) = 20 Redis nodes; ~1.7M ops/sec per shard',
                },
              ],
            },
            {
              id: 'gossip-protocol',
              label: 'Gossip protocol between gateway servers',
              description:
                'Gateway servers exchange information about connected users via gossip. There is no centralized store.',
              pros: [
                'No single point of failure',
                'Scales without a centralized bottleneck',
                'The gateway already knows its connections — zero heartbeat overhead',
              ],
              cons: [
                'Eventual consistency — status may lag by seconds',
                'Gossip traffic grows with the number of nodes (O(N) per update)',
                'Complex debugging of inconsistent state',
              ],
              bestWhen:
                'A decentralized architecture without dependence on an external store for presence',
              impact: { latency: 0, scalability: 1, consistency: -1, complexity: 1, cost: -1 },
            },
            {
              id: 'lazy-presence',
              label: 'Lazy presence (update only on send)',
              description:
                'Status is updated only when a message is sent or a chat is opened. No continuous heartbeat.',
              pros: [
                'Minimal server load — no heartbeat traffic',
                'Sufficient for most user scenarios',
                'Significant bandwidth savings on mobile networks',
              ],
              cons: [
                'Inaccurate status — a user may be online but the status is not updated',
                '"Last seen" instead of a real-time indicator',
                'Not suitable for messengers where presence is a key feature',
              ],
              bestWhen:
                'Resource savings matter more than presence accuracy (Telegram\'s approach for privacy)',
              impact: { latency: 0, scalability: 2, consistency: -2, complexity: -1, cost: -1 },
            },
            {
              id: 'no-presence',
              label: 'No presence',
              description:
                'Completely dropping online-status display. Telegram lets users hide presence entirely.',
              pros: [
                'Zero load on presence infrastructure',
                'Maximum user privacy',
                'Simpler architecture — fewer moving parts',
              ],
              cons: [
                'Users do not see whether the other party is available',
                'Reduces engagement — no incentive to write "right now"',
                'May be perceived as a missing feature',
              ],
              bestWhen:
                'A privacy-first messenger or a channel model where presence does not matter',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: -2, cost: -2 },
              capacityImpact: [
                {
                  label: 'Redis memory (presence)',
                  value: '0 GB',
                  formula:
                    'No presence system needed; zero Redis memory, zero heartbeat traffic, zero infrastructure cost',
                },
                {
                  label: 'Heartbeat RPS',
                  value: '0 req/sec',
                  formula:
                    'No heartbeats; connection state tracked only at gateway level for message delivery',
                },
              ],
            },
          ],
        },
        {
          id: 'chat-partition',
          category: 'Data partitioning',
          question: 'Which data-partitioning strategy should be used?',
          options: [
            {
              id: 'by-user-id',
              label: 'By user ID (consistent hashing)',
              description:
                'All of a user\'s data (inbox, settings, contacts) on one shard. Consistent hashing for distribution.',
              pros: [
                'All of a user\'s data on one shard — fast sync',
                'Consistent hashing minimizes rebalancing',
                'A simple routing model',
              ],
              cons: [
                'Group chats are scattered across the members\' shards',
                'Hot spots — active users create uneven load',
                'Moving a user between shards is a heavy operation',
              ],
              bestWhen:
                'Direct chats dominate and fast access to all of a user\'s data matters',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'by-conversation-id',
              label: 'By conversation ID',
              description:
                'All messages of one chat are stored on a single shard. The shard is determined by the conversation ID.',
              pros: [
                'All chat messages on one shard — fast access to history',
                'Sequence numbers within a shard — an ordering guarantee',
                'Good for group chats',
              ],
              cons: [
                'A user\'s inbox (all their chats) is scattered across shards',
                'Sync on connection — you must query all shards',
                'Popular groups — hot partitions',
              ],
              bestWhen:
                'Group chats dominate and fast access to a specific chat\'s history matters',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'geographic',
              label: 'Geographic partitioning',
              description:
                'A user\'s data is stored in the nearest data center. Cross-region messages use cross-region replication.',
              pros: [
                'Minimal latency for local chats',
                'Compliance with data residency requirements (GDPR)',
                'Local failures do not affect other regions',
              ],
              cons: [
                'Cross-region chats — additional latency',
                'Cross-region replication — complexity and cost',
                'Migrating a user on relocation is non-trivial',
              ],
              bestWhen:
                'Regulatory data-localization requirements or a distributed user base',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 2, cost: 2 },
            },
            {
              id: 'hybrid-partition',
              label: 'Hybrid: user ID for inbox, conversation ID for messages',
              description:
                'A user\'s inbox (chat list, statuses) is sharded by user ID. Messages — by conversation ID. Two layers of sharding.',
              pros: [
                'Fast inbox sync (one shard for the user\'s chat list)',
                'Fast access to chat history (one shard for messages)',
                'An optimal balance for both access patterns',
              ],
              cons: [
                'Two levels of sharding — operational complexity',
                'Writing a message hits two shards (recipient\'s inbox + conversation)',
                'Coordination between layers is needed',
              ],
              bestWhen:
                'A messenger with diverse access patterns: direct chats, groups, and channels',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: 1, cost: 1 },
            },
          ],
        },
      ],
    },

    // ── Step 6: Reliability ─────────────────────────────────────────────
    {
      id: 'chat-reliability',
      title: 'Reliability and security',
      description:
        'Ensure message ordering and choose an encryption strategy.',
      tip: 'Message ordering is one of the most underrated problems in messengers. With concurrent sends to a group, messages may arrive in different orders on different devices. A sequence number per conversation is the simplest and most reliable solution.',
      decisions: [
        {
          id: 'chat-ordering',
          category: 'Message ordering',
          question: 'How should correct message ordering be guaranteed?',
          options: [
            {
              id: 'sequence-numbers',
              label: 'Sequence numbers per conversation',
              description:
                'Each message in a chat is assigned a monotonically increasing number. The server is the single source of truth for ordering within a given chat.',
              pros: [
                'A simple and reliable model — ordering is always deterministic',
                'Easy to detect gaps (gap detection) for sync',
                'The client knows if it missed a message (seq 5 → seq 7)',
              ],
              cons: [
                'The server assigning sequences is a potential bottleneck for hot groups',
                'Requires an atomic increment per conversation (Redis INCR or DB sequence)',
                'On a split-brain, duplicate sequence numbers are possible',
              ],
              bestWhen:
                'The standard choice for most messengers — simplicity and reliability',
              impact: { latency: 0, scalability: 0, consistency: 2, complexity: -1, cost: 0 },
            },
            {
              id: 'lamport-timestamps',
              label: 'Lamport timestamps',
              description:
                'Logical clocks: each node increments a counter and exchanges values. Provides causal ordering.',
              pros: [
                'Does not require a centralized coordinator',
                'Guarantees the happens-before relation',
                'Works in a distributed system without clock synchronization',
              ],
              cons: [
                'Does not distinguish concurrent events — a tiebreaker is needed',
                'Harder to understand and debug than simple sequence numbers',
                'Clients must implement Lamport clock logic',
              ],
              bestWhen:
                'A decentralized system without a single point for assigning ordering',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'vector-clocks',
              label: 'Vector clocks',
              description:
                'An extension of Lamport timestamps: a vector of counters for each participant. Allows detecting concurrent events.',
              pros: [
                'Precise determination of causal ordering and concurrency',
                'Can detect conflicts (concurrent edits)',
                'Theoretically an ideal model for distributed systems',
              ],
              cons: [
                'The vector size grows with the number of participants (O(N) for a group of N)',
                'For a 256-member group — 256 counters per message',
                'Excessive complexity for a chat scenario',
              ],
              bestWhen:
                'Collaborative editing or a CRDT system, not an ordinary messenger',
              impact: { latency: -1, scalability: -1, consistency: 2, complexity: 2, cost: 0 },
            },
            {
              id: 'server-timestamp',
              label: 'Server timestamp ordering',
              description:
                'Ordering is determined by server time (wall clock). The simplest approach.',
              pros: [
                'The simplest possible implementation',
                'No additional counter or coordination needed',
                'Easy to understand and debug',
              ],
              cons: [
                'Clock skew between servers — messages may not be in send order',
                'NTP drift: 10-100ms divergence is typical',
                'Two messages in the same millisecond — undefined ordering',
              ],
              bestWhen: 'A prototype or a system where ordering is not critical (feeds, comments)',
              impact: { latency: 1, scalability: 1, consistency: -2, complexity: -2, cost: 0 },
            },
          ],
        },
        {
          id: 'chat-encryption',
          category: 'Encryption',
          question: 'Which encryption strategy should be used?',
          options: [
            {
              id: 'tls-only',
              label: 'TLS only (encryption in transit)',
              description:
                'Messages are encrypted in transit (TLS) but stored on the server in plaintext. The server can read the content.',
              pros: [
                'The simplest implementation — TLS out of the box',
                'Server-side message search, content moderation',
                'Backups and account recovery are trivial',
              ],
              cons: [
                'The server is a point of compromise (a server breach = a leak of all messages)',
                'Government requests for access to correspondence',
                'Users increasingly distrust such a model',
              ],
              bestWhen:
                'A corporate messenger with compliance and content-audit requirements',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: -2, cost: -1 },
            },
            {
              id: 'e2e-signal',
              label: 'E2E encryption (Signal Protocol)',
              description:
                'The Signal Protocol (Double Ratchet + X3DH) is the de facto standard. Used in WhatsApp, Signal, Facebook Messenger (Secret Conversations).',
              pros: [
                'The server cannot read messages — maximum privacy',
                'Forward secrecy — a key compromise does not reveal old messages',
                'A proven and audited protocol',
              ],
              cons: [
                'Multi-device: a key-synchronization protocol is needed (Signal Sesame)',
                'Group encryption: Sender Keys increase complexity',
                'Server-side search and content moderation are impossible',
              ],
              bestWhen:
                'A privacy-first messenger for personal communication (the WhatsApp, Signal model)',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'e2e-plus-server',
              label: 'E2E + server-side encryption at rest',
              description:
                'E2E for message content + server-side encryption of metadata and stored data (encryption at rest in the database).',
              pros: [
                'A double layer of protection — content and metadata',
                'Even with physical access to the disks, data is encrypted',
                'Compliance with the strictest security standards',
              ],
              cons: [
                'Maximum implementation complexity and key management',
                'Performance: two layers of encryption/decryption',
                'Key rotation and management — a separate infrastructure (KMS)',
              ],
              bestWhen:
                'A messenger for sensitive communications (healthcare, finance, government)',
              impact: { latency: -2, scalability: -1, consistency: 0, complexity: 2, cost: 1 },
            },
          ],
        },
      ],
    },
  ],

  // ── Reference Solution ──────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'chat-type': ['one-on-one', 'group-chats'],
      'chat-features': ['text', 'media', 'read-receipts', 'e2e-encryption'],
      'chat-protocol': ['websocket'],
      'chat-connection': ['stateful-gateway'],
      'chat-message-db': ['scylladb'],
      'chat-media-storage': ['object-storage-cdn'],
      'chat-fanout': ['hybrid-fanout'],
      'chat-offline': ['store-and-forward'],
      'chat-presence': ['heartbeat-redis'],
      'chat-partition': ['hybrid-partition'],
      'chat-ordering': ['sequence-numbers'],
      'chat-encryption': ['e2e-signal'],
    },
    explanation:
      'This architecture is designed to serve 500M+ users with real-time message delivery.\n\n' +
      '**Chat types and features:** Direct chats and groups up to 256 members cover 95% of usage scenarios. ' +
      'Text + media + read receipts + E2E encryption — the standard for a WhatsApp-grade messenger.\n\n' +
      '**Real-time communication:** WebSocket provides bidirectional communication with minimal overhead. ' +
      'Stateful gateway servers (modeled on WhatsApp\'s Erlang nodes) hold millions of connections per server, ' +
      'providing instant routing of messages to the right socket.\n\n' +
      '**Storage:** ScyllaDB (Cassandra-compatible, C++) — write-heavy chat load with predictable p99 latency, ' +
      'without GC pauses. Media — S3 + CDN: infinite capacity with fast global delivery.\n\n' +
      '**Delivery:** Hybrid fanout: on write for groups ≤256 (fast inbox reads), on read for channels. ' +
      'Store-and-forward for offline: messages wait in the inbox until the user connects.\n\n' +
      '**Scaling:** A Redis Cluster for presence (heartbeat with TTL). ' +
      'Hybrid partitioning: inbox by user ID, messages by conversation ID — optimal access for both patterns.\n\n' +
      '**Reliability:** Sequence numbers per conversation — a simple ordering guarantee with gap detection. ' +
      'The Signal Protocol for E2E encryption — forward secrecy, a proven industry standard.',
    diagram:
      '```\n' +
      '┌──────────┐     WebSocket      ┌─────────────────┐\n' +
      '│  Client  │◄──────────────────►│  WS Gateway     │\n' +
      '│(iOS/And/ │                    │  (stateful,     │\n' +
      '│ Web)     │                    │   ~2M conn/node)│\n' +
      '└──────────┘                    └────────┬────────┘\n' +
      '                                         │\n' +
      '                                         ▼\n' +
      '                               ┌─────────────────┐\n' +
      '                               │ Message Service  │\n' +
      '                               │ (routing,        │\n' +
      '                               │  validation,     │\n' +
      '                               │  seq numbers)    │\n' +
      '                               └────────┬────────┘\n' +
      '                                        │\n' +
      '                          ┌─────────────┼─────────────┐\n' +
      '                          ▼             ▼             ▼\n' +
      '                   ┌───────────┐ ┌───────────┐ ┌───────────┐\n' +
      '                   │   Kafka   │ │   Kafka   │ │   Kafka   │\n' +
      '                   │ (fanout)  │ │ (push)    │ │ (events)  │\n' +
      '                   └─────┬─────┘ └─────┬─────┘ └─────┬─────┘\n' +
      '                         │             │             │\n' +
      '                         ▼             ▼             ▼\n' +
      '                   ┌───────────┐ ┌───────────┐ ┌───────────┐\n' +
      '                   │  Fanout   │ │   Push    │ │  Presence │\n' +
      '                   │  Service  │ │  Service  │ │  Service  │\n' +
      '                   │(write/read│ │(APNs/FCM) │ │(heartbeat)│\n' +
      '                   │ hybrid)   │ │           │ │           │\n' +
      '                   └───────────┘ └───────────┘ └─────┬─────┘\n' +
      '                                                     │\n' +
      '         ┌───────────────────┬───────────────────┐   │\n' +
      '         ▼                   ▼                   ▼   ▼\n' +
      '  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐\n' +
      '  │  ScyllaDB   │   │  S3 + CDN    │   │    Redis     │\n' +
      '  │ (messages,  │   │ (media:      │   │  Cluster     │\n' +
      '  │  inbox,     │   │  photos,     │   │ (presence,   │\n' +
      '  │  metadata)  │   │  video,      │   │  sessions,   │\n' +
      '  │             │   │  files)      │   │  online TTL) │\n' +
      '  └─────────────┘   └──────────────┘   └──────────────┘\n' +
      '```',
  },
  capacityEstimates: {
    default: [
      {
        label: 'Concurrent connections',
        value: '50M',
        formula:
          '500M users × 10% online at any time = 50M WebSocket connections',
      },
      {
        label: 'Messages per day',
        value: '20B',
        formula: '500M users × avg 40 msgs/day = 20B messages/day',
      },
      {
        label: 'Peak messages/sec',
        value: '~700K/sec',
        formula:
          '20B / 86 400 ≈ 231K/sec × 3× peak factor ≈ 700K msgs/sec',
      },
      {
        label: 'Message storage (1 year)',
        value: '~730 TB',
        formula:
          '20B/day × 365 days × 100 bytes avg = ~730 TB/year',
      },
      {
        label: 'Media storage (1 year)',
        value: '~73 PB',
        formula:
          '20B msgs/day × 5% have media × 200 KB avg = ~73 PB/year',
      },
      {
        label: 'Bandwidth (messages only)',
        value: '~140 MB/s',
        formula:
          '700K/sec × 100 bytes × 2 (send + receive) = ~140 MB/s',
      },
    ],
  },
};
