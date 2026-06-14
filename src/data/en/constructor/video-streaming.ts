import type { Scenario } from '@/data/constructor/types';

export const videoStreamingScenario: Scenario = {
  id: 'video-streaming',
  title: 'Video Streaming (YouTube)',
  difficulty: 'senior',
  description:
    'Design a YouTube-scale video streaming platform: 2B+ active users, 500+ hours of video uploaded every minute, millions of concurrent views. The system must provide upload, transcoding, storage, delivery and recommendations for video content with minimal buffering time worldwide.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'vs-requirements',
      title: 'Platform Requirements',
      description:
        'Define the content type and playback quality requirements. These decisions fundamentally affect the architecture of transcoding, storage and delivery.',
      tip: 'YouTube supports VOD, live streaming and Shorts — each type requires its own optimizations in the processing pipeline.',
      decisions: [
        {
          id: 'vs-type',
          category: 'Content',
          question: 'Type of video content?',
          multiSelect: true,
          options: [
            {
              id: 'vod',
              label: 'VOD (Video on Demand)',
              description:
                'Pre-recorded content uploaded by creators. The primary format for YouTube, Vimeo.',
              pros: [
                'Can be transcoded ahead of time into all the needed qualities',
                'Efficient caching — the content does not change',
                'A simple CDN strategy',
              ],
              cons: [
                'A high cost of storing all quality versions',
                'Time from upload to publish (transcoding delay)',
                'A need to support a huge catalog',
              ],
              bestWhen: 'The primary use case is watching pre-recorded content (YouTube, Netflix)',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 0, cost: -1 },
            },
            {
              id: 'live',
              label: 'Live Streaming',
              description:
                'Real-time live broadcasts. Requires a low-latency pipeline: ingest → transcode → deliver within seconds.',
              pros: [
                'High audience engagement (chat, reactions)',
                'Monetization through super chats and donations',
                'A trending format for gaming and events',
              ],
              cons: [
                'Requires real-time transcoding',
                'Complex infrastructure for low-latency delivery (<5s)',
                'High egress traffic cost at peak load',
              ],
              bestWhen: 'You need live broadcasts (Twitch, YouTube Live)',
              impact: { latency: -2, scalability: -1, consistency: -1, complexity: -2, cost: -2 },
            },
            {
              id: 'short-form',
              label: 'Short-form Video (Shorts/Reels)',
              description:
                'Short vertical videos up to 60s. Aggressive preloading, an infinite feed.',
              pros: [
                'Small file size — fast processing',
                'High engagement through infinite scroll',
                'Easier to cache — popular content takes little space',
              ],
              cons: [
                'A huge upload volume (a low barrier to entry for creators)',
                'Requires aggressive preloading of the next videos',
                'A complex recommendation system — the key to retention',
              ],
              bestWhen: 'You need a short-video format for mobile users (TikTok, YouTube Shorts)',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'vs-quality',
          category: 'Quality',
          question: 'Video quality support?',
          options: [
            {
              id: 'single-quality',
              label: 'Single Quality (480p)',
              description:
                'A single quality for all users. Minimal transcoding and storage cost.',
              pros: [
                'Minimal storage and transcoding cost',
                'The simplest architecture',
                'Fast processing time',
              ],
              cons: [
                'Poor UX on large screens',
                "Cannot adapt to the user's network speed",
                'Not competitive in the market',
              ],
              bestWhen: 'An MVP or an internal service with limited resources',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 2, cost: 2 },
              capacityImpact: [
                {
                  label: 'Transcoded storage/day',
                  value: '~120 TB/day',
                  formula: '360 TB raw × 0.33 (single 480p rendition, ~3× compression) = ~120 TB/day',
                },
                {
                  label: 'CDN bandwidth (peak)',
                  value: '~23 Gbps',
                  formula: '46K concurrent streams × avg 0.5 Mbps (480p) = ~23 Gbps',
                },
                {
                  label: 'Transcoding compute',
                  value: '2.4M compute-min/day',
                  formula: '720K videos × avg 3.3 min (single quality encode) = 2.4M compute-minutes/day',
                },
              ],
            },
            {
              id: 'multi-quality',
              label: 'Multiple Qualities (360p-1080p)',
              description:
                'A fixed set of qualities. The user selects manually.',
              pros: [
                'Support for different devices and networks',
                'A relatively simple implementation',
                'The user controls the quality',
              ],
              cons: [
                'Manual quality switching — poor UX',
                'Buffering on quality change',
                'Does not adapt to network fluctuations in real time',
              ],
              bestWhen: 'A mid-sized platform without resources for ABR',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'adaptive-bitrate',
              label: 'Adaptive Bitrate Streaming (ABR, 144p-4K)',
              description:
                'Automatic quality switching based on network bandwidth. The industry standard (HLS/DASH).',
              pros: [
                'Optimal UX — automatic adaptation to the network',
                'Minimal buffering even on unstable networks',
                'The industry standard, supported by all players',
              ],
              cons: [
                'Each video is transcoded into 6-10+ quality variants',
                'Multiplies the storage volume (5-10x)',
                'Complex bitrate-switching logic in the player',
              ],
              bestWhen: 'A production platform with a global audience (YouTube, Netflix, Twitch)',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: -2 },
              capacityImpact: [
                {
                  label: 'Transcoded storage/day',
                  value: '~2.5 PB/day',
                  formula: '360 TB raw × 7 renditions (144p–4K) × avg 1× combined = ~2.5 PB/day',
                },
                {
                  label: 'CDN bandwidth (peak)',
                  value: '~230 Gbps',
                  formula: '46K concurrent streams × avg 5 Mbps (adaptive, mix of qualities) = ~230 Gbps',
                },
                {
                  label: 'Transcoding compute',
                  value: '50M compute-min/day',
                  formula: '720K videos × 7 renditions × avg 10 min per rendition = 50.4M compute-minutes/day',
                },
              ],
            },
          ],
        },
      ],
    },

    // ── Step 2: Upload & Processing Pipeline ──────────────────────────
    {
      id: 'vs-upload',
      title: 'Video Upload and Processing',
      description:
        'The architecture of the upload and transcoding pipeline. Video files are huge (GBs), processing is resource-intensive — you need a reliable and scalable pipeline.',
      tip: 'YouTube uses a resumable upload protocol and parallelizes transcoding: a video is split into segments, each of which is encoded in parallel on thousands of workers.',
      decisions: [
        {
          id: 'vs-upload-method',
          category: 'Upload',
          question: 'How to upload video?',
          options: [
            {
              id: 'direct-upload',
              label: 'Direct upload to the app server',
              description:
                'The client uploads the file directly to the application server, which then saves it to storage.',
              pros: [
                'A simple implementation',
                'Full control over the upload process',
                'Can validate on the fly',
              ],
              cons: [
                'The app server becomes a bottleneck (I/O bound)',
                'No resumability — on a disconnect you must start over',
                'Does not scale for large files (GBs)',
              ],
              bestWhen: 'Small files, low load, an MVP',
              impact: { latency: -1, scalability: -2, consistency: 0, complexity: 2, cost: 1 },
            },
            {
              id: 'resumable-upload',
              label: 'Resumable upload to object storage (pre-signed URLs)',
              description:
                'The client gets a pre-signed URL and uploads directly to S3/GCS with resume support.',
              pros: [
                'The app server is not loaded with I/O — metadata only',
                'Resume on a network disconnect',
                'Native scalability of object storage',
              ],
              cons: [
                'More complex client logic (progress tracking)',
                'A need to handle multipart upload callbacks',
                'Pre-signed URLs require TTL and security management',
              ],
              bestWhen: 'A production platform with large files (YouTube, Vimeo)',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'chunked-upload',
              label: 'Chunked upload with client-side splitting',
              description:
                'The client splits the file into chunks (5-25 MB), uploads them in parallel, and the server reassembles them.',
              pros: [
                'Parallel chunk upload speeds up the upload',
                'The ability to retry individual chunks',
                'A progress bar at the chunk level',
              ],
              cons: [
                'Complex client- and server-side assembly logic',
                'A need for a mechanism to track and reassemble chunks',
                'Problems with ordering and deduplication',
              ],
              bestWhen: 'Very large files (10+ GB), an unstable network',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -2, cost: 0 },
            },
          ],
        },
        {
          id: 'vs-transcoding',
          category: 'Transcoding',
          question: 'Transcoding architecture?',
          options: [
            {
              id: 'single-ffmpeg',
              label: 'Single server FFmpeg',
              description:
                'A single server performs the full transcoding of each video sequentially.',
              pros: [
                'The simplest architecture — a single FFmpeg process',
                'No coordination overhead',
                'Easy to debug',
              ],
              cons: [
                'Processing time for 1 hour of video = 2-4 hours (depends on hardware)',
                'Does not scale — one server = one file',
                'A single point of failure',
              ],
              bestWhen: 'An MVP, a small upload volume (<100 videos/day)',
              impact: { latency: -2, scalability: -2, consistency: 1, complexity: 2, cost: 1 },
              capacityImpact: [
                {
                  label: 'Transcoding compute',
                  value: '~1.4M compute-hrs/day',
                  formula: '720K videos × avg 2.5 min video × 2–4× real-time encoding ≈ 1.4M compute-hours/day on single machines',
                },
              ],
            },
            {
              id: 'distributed-transcoding',
              label: 'Distributed transcoding (split + parallel encode + merge)',
              description:
                'The video is split into segments at GOP boundaries, each is encoded in parallel on separate workers, then the segments are merged.',
              pros: [
                'Linear speedup: 100 workers = ~100x faster',
                'Fault tolerance — retry of individual segments',
                'Used by YouTube, Netflix in production',
              ],
              cons: [
                'Complex coordination (split, schedule, merge)',
                'Artifacts at segment joins without proper GOP splitting',
                'A need for an orchestration system (Temporal, Airflow)',
              ],
              bestWhen: 'A YouTube-scale platform (500+ hours of video/minute)',
              impact: { latency: 2, scalability: 2, consistency: 0, complexity: -2, cost: -1 },
              capacityImpact: [
                {
                  label: 'Transcoding compute',
                  value: '7.2M compute-min/day',
                  formula: '720K videos × 10 min avg, but parallelized across 100s of workers → wall-clock time ~6 sec per video; total compute stays 7.2M min',
                },
              ],
            },
            {
              id: 'serverless-transcoding',
              label: 'Serverless (AWS Lambda / MediaConvert)',
              description:
                'A managed transcoding service. Auto-scaling out of the box, pay per-minute.',
              pros: [
                'Zero infrastructure management',
                'Automatic scaling',
                'Pay-per-use — no idle cost',
              ],
              cons: [
                'High cost at large volumes ($0.024/min HD)',
                'Limited control over the pipeline',
                'Vendor lock-in',
              ],
              bestWhen: 'Moderate load, no team for your own infrastructure',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 1, cost: -1 },
            },
            {
              id: 'cloud-managed',
              label: 'Cloud Managed (AWS Elemental, GCP Transcoder)',
              description:
                'A fully managed cloud transcoding service with an API for configuring the pipeline.',
              pros: [
                'High encoding quality (optimized codecs)',
                'Integration with the cloud ecosystem',
                'An SLA from the cloud provider',
              ],
              cons: [
                'Significant vendor lock-in',
                'Cost grows linearly with volume',
                'Limited pipeline customization',
              ],
              bestWhen: 'The company is already in the cloud and needs fast time-to-market',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 1, cost: -2 },
            },
          ],
        },
      ],
    },

    // ── Step 3: Storage ───────────────────────────────────────────────
    {
      id: 'vs-storage',
      title: 'Data Storage',
      description:
        'Choosing storage for video files (petabytes) and metadata (billions of records). Different access patterns require different solutions.',
      tip: 'YouTube stores exabytes of video in its own storage (Colossus) and uses Vitess to shard MySQL — Vitess was created by the YouTube team.',
      decisions: [
        {
          id: 'vs-video-storage',
          category: 'Video files',
          question: 'Where to store video files?',
          options: [
            {
              id: 'single-object-storage',
              label: 'Single object storage (S3)',
              description:
                'All videos in a single S3/GCS bucket. Simple and reliable (11 nines durability).',
              pros: [
                'The simplest storage architecture',
                '99.999999999% durability (S3)',
                'Unlimited capacity',
              ],
              cons: [
                'The same cost for hot and cold content',
                'Egress costs under high traffic',
                'Latency depends on the bucket region',
              ],
              bestWhen: 'The early stage, when all content is roughly equally popular',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 2, cost: 0 },
            },
            {
              id: 'tiered-storage',
              label: 'Tiered storage (hot/warm/cold)',
              description:
                'Hot storage (SSD/S3 Standard) for popular content, warm (S3-IA) for medium, cold (Glacier) for the archive.',
              pros: [
                'Optimal cost: 80% of content in a cheap tier',
                'Hot content on fast storage',
                'Lifecycle policies automate migration',
              ],
              cons: [
                'Complexity of managing tier transitions',
                'Latency when accessing cold content (minutes for Glacier)',
                "A need for analytics to determine the content's tier",
              ],
              bestWhen: 'A production platform with a power-law popularity distribution (YouTube, Netflix)',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: 2 },
              capacityImpact: [
                {
                  label: 'Raw upload storage/day',
                  value: '~360 TB/day (hot: 36 TB, warm: 108 TB, cold: 216 TB)',
                  formula: '10% content hot (S3 Standard $0.023/GB), 30% warm (S3-IA $0.0125/GB), 60% cold (Glacier $0.004/GB) → ~60% cost savings vs single tier',
                },
              ],
            },
            {
              id: 'custom-blob-storage',
              label: 'Custom blob storage (Google Colossus)',
              description:
                'A custom distributed file system optimized for the video workload.',
              pros: [
                'Full control over performance and cost',
                'Optimization for a specific workload',
                'No vendor lock-in',
              ],
              cons: [
                'Requires a huge infrastructure team (50+ engineers)',
                'Years of development to reach a production-ready state',
                'You must ensure durability yourself',
              ],
              bestWhen: 'Google/Facebook scale, where the savings justify the investment',
              impact: { latency: 2, scalability: 2, consistency: 0, complexity: -2, cost: 1 },
            },
            {
              id: 'hdfs',
              label: 'HDFS cluster',
              description:
                'Hadoop Distributed File System. Suited for batch processing and analytics.',
              pros: [
                'Integrates well with the Hadoop/Spark ecosystem',
                'High throughput for batch reads',
                'Built-in replication (3x by default)',
              ],
              cons: [
                'Poorly suited for random access and streaming',
                'The NameNode is a single point of failure (without HA)',
                'High storage cost (3x replication)',
              ],
              bestWhen: 'An analytics pipeline, batch video processing, but not for serving',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: -1, cost: -1 },
            },
          ],
        },
        {
          id: 'vs-metadata-db',
          category: 'Metadata',
          question: 'Where to store video metadata?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL',
              description:
                'A powerful relational database with rich query capabilities. A single instance or replicas.',
              pros: [
                'Rich SQL and data types (JSONB, full-text search)',
                'ACID transactions',
                'A mature ecosystem and tooling',
              ],
              cons: [
                'Hard to shard natively',
                'A limit of ~1-5 TB of data per server effectively',
                'Limited vertical scaling',
              ],
              bestWhen: 'Up to ~100M videos, the team knows PostgreSQL',
              impact: { latency: 0, scalability: -1, consistency: 2, complexity: 1, cost: 1 },
            },
            {
              id: 'mysql-sharded',
              label: 'MySQL (manually sharded)',
              description:
                'MySQL with manual sharding by video_id or user_id. Application-level routing.',
              pros: [
                'A well-understood technology',
                'Predictable performance',
                'Can start small and grow',
              ],
              cons: [
                'Manual shard management — operational complexity',
                'Cross-shard queries are very expensive',
                'Resharding on growth — a painful procedure',
              ],
              bestWhen: 'Medium scale, a team experienced with MySQL sharding',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'vitess',
              label: 'Vitess (MySQL sharding layer)',
              description:
                'Transparent sharding on top of MySQL. Created by the YouTube team, used in production.',
              pros: [
                'Automatic sharding and resharding',
                'Compatible with the MySQL protocol',
                'Battle-tested at YouTube (trillions of rows)',
              ],
              cons: [
                'Operational complexity of deployment and monitoring',
                'Not all MySQL features are supported (some JOINs)',
                'Requires expertise in Vitess-specific configuration',
              ],
              bestWhen: 'YouTube scale — billions of videos, trillions of metadata rows',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'dynamodb-bigtable',
              label: 'DynamoDB / Bigtable',
              description:
                'A NoSQL wide-column store. Excellent for key-value access by video_id.',
              pros: [
                'Automatic scaling to any volume',
                'Predictable low latency (<10ms) on key lookups',
                'Managed — no operational burden',
              ],
              cons: [
                'Limited query capabilities (no JOINs, complex WHERE)',
                'Expensive for scan-heavy workloads',
                'Vendor lock-in (DynamoDB = AWS, Bigtable = GCP)',
              ],
              bestWhen: 'A simple access pattern (get by ID), a cloud-native architecture',
              impact: { latency: 2, scalability: 2, consistency: -1, complexity: 0, cost: -1 },
            },
          ],
        },
      ],
    },

    // ── Step 4: Content Delivery ──────────────────────────────────────
    {
      id: 'vs-delivery',
      title: 'Content Delivery',
      description:
        'The CDN and streaming protocol determine viewing quality. With 2B+ users across 190+ countries, content delivery is a key element of the architecture.',
      tip: 'Netflix deployed Open Connect — its own CDN with servers in ~6000 ISP locations. YouTube uses Google Global Cache. HLS covers ~80% of internet video.',
      decisions: [
        {
          id: 'vs-cdn',
          category: 'CDN',
          question: 'Content delivery strategy?',
          options: [
            {
              id: 'third-party-cdn',
              label: 'Third-party CDN (CloudFront / Akamai)',
              description:
                'Using a commercial CDN provider. A fast start, global coverage.',
              pros: [
                'Global coverage out of the box (300+ PoP)',
                'No investment in infrastructure',
                'Managed DDoS protection and SSL',
              ],
              cons: [
                'High egress cost at YouTube scale ($0.02-0.08/GB)',
                'Limited control over caching and routing',
                'Dependence on the provider',
              ],
              bestWhen: 'A startup, up to ~100 Tbps of traffic',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 2, cost: -1 },
              capacityImpact: [
                {
                  label: 'CDN bandwidth (peak)',
                  value: '~230 Gbps @ $0.02–0.08/GB',
                  formula: '230 Gbps = ~2.5 PB/day egress × $0.04 avg/GB ≈ $100K/day CDN cost',
                },
              ],
            },
            {
              id: 'own-cdn',
              label: 'Own CDN (Netflix Open Connect / Google Edge)',
              description:
                'Own servers at ISP and IX points. Full control, minimal delivery cost at scale.',
              pros: [
                'Minimal delivery cost at scale (<$0.01/GB)',
                'Full control over latency and routing',
                'Servers inside ISPs — a minimal hop count',
              ],
              cons: [
                'Huge upfront investment ($100M+)',
                'A need for a team to manage hardware worldwide',
                'Complex contracts with ISPs',
              ],
              bestWhen: 'Netflix/YouTube scale (>30% of internet traffic)',
              impact: { latency: 2, scalability: 2, consistency: 1, complexity: -2, cost: 2 },
              capacityImpact: [
                {
                  label: 'CDN bandwidth (peak)',
                  value: '~230 Gbps @ <$0.01/GB',
                  formula: '230 Gbps own edge servers in ISPs → ~2.5 PB/day × $0.005/GB ≈ $12.5K/day (8× cheaper than third-party)',
                },
              ],
            },
            {
              id: 'hybrid-cdn',
              label: 'Hybrid (own edge + third-party for the long tail)',
              description:
                'Own edge servers in key regions + a third-party CDN for the rest.',
              pros: [
                'A balance of cost and coverage',
                'Own edge for 80% of traffic (popular regions)',
                'Fallback to a commercial CDN for edge cases',
              ],
              cons: [
                'Complexity of managing two CDN strategies',
                'A need for smart routing logic (GeoDNS + Anycast)',
                'Cache consistency between CDNs',
              ],
              bestWhen: 'A large platform growing toward YouTube scale',
              impact: { latency: 2, scalability: 2, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'p2p-delivery',
              label: 'P2P delivery',
              description:
                'Viewers distribute content to each other (WebRTC-based). Reduces server load.',
              pros: [
                'A significant reduction in server traffic (up to 70%)',
                'Scales on its own as the audience grows',
                'Cheaper for live events with a large audience',
              ],
              cons: [
                "Dependence on viewers' upload speed",
                'Complex NAT traversal (STUN/TURN)',
                'Unstable quality — viewers leave unpredictably',
              ],
              bestWhen: 'Live broadcasts with a huge concurrent audience, a supplement to a CDN',
              impact: { latency: 0, scalability: 1, consistency: -2, complexity: -2, cost: 2 },
            },
          ],
        },
        {
          id: 'vs-streaming-protocol',
          category: 'Protocol',
          question: 'Streaming protocol?',
          options: [
            {
              id: 'hls',
              label: 'HLS (HTTP Live Streaming, Apple)',
              description:
                'The most widespread protocol. ~80% of internet video. Native support on all Apple devices.',
              pros: [
                'The dominant standard (~80% of the market)',
                'Native support on iOS/macOS/Safari',
                'Excellent CDN compatibility (plain HTTP)',
              ],
              cons: [
                'High latency for live (10-30s by default)',
                'Less flexible than DASH (fixed segments)',
                'An Apple-controlled standard',
              ],
              bestWhen: 'VOD content, broad device compatibility',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'dash',
              label: 'DASH (Dynamic Adaptive Streaming over HTTP)',
              description:
                'The open MPEG-DASH standard. More flexible than HLS. The main competitor.',
              pros: [
                'An open standard (ISO/IEC 23009)',
                'Flexible configuration (segment length, codec switching)',
                'Better DRM support via EME',
              ],
              cons: [
                'No native support in Safari/iOS (an MSE fallback is needed)',
                'A smaller player ecosystem',
                'A more complex server-side implementation',
              ],
              bestWhen: 'Android/Web platforms, you need flexibility in ABR configuration',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'hls-dash',
              label: 'HLS + DASH (both protocols)',
              description:
                'Support for both protocols. The same content is available in HLS and DASH formats.',
              pros: [
                'Maximum compatibility (all devices and browsers)',
                'Can choose the optimal protocol for each client',
                'Industry practice (YouTube, Netflix)',
              ],
              cons: [
                'A double set of manifest files (m3u8 + mpd)',
                'More complex testing and support',
                'Slightly more storage for the manifests',
              ],
              bestWhen: 'A global platform with heterogeneous clients (YouTube)',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'rtmp',
              label: 'RTMP (Real-Time Messaging Protocol)',
              description:
                'A legacy protocol for live ingest. Low-latency, but requires special servers.',
              pros: [
                'Low latency for live streaming (1-3s)',
                'A mature protocol with broad encoder support (OBS)',
                'Well suited for ingest (streamer → server)',
              ],
              cons: [
                'Not suited for playback (Flash deprecated)',
                'Does not work through standard CDNs (not HTTP)',
                'Does not support client-side ABR',
              ],
              bestWhen: 'Only for live ingest (from streamer to server), not for delivery to viewers',
              impact: { latency: 2, scalability: -1, consistency: 0, complexity: 0, cost: 0 },
            },
          ],
        },
      ],
    },

    // ── Step 5: Scaling ───────────────────────────────────────────────
    {
      id: 'vs-scaling',
      title: 'Scaling',
      description:
        'Caching and recommendation strategies for serving millions of concurrent views with minimal buffering.',
      tip: 'Video popularity follows the Pareto principle: ~10% of videos generate ~90% of views. Multi-tier caching with an origin shield is the industry standard.',
      decisions: [
        {
          id: 'vs-cache-strategy',
          category: 'Caching',
          question: 'Video caching?',
          options: [
            {
              id: 'cdn-edge-only',
              label: 'CDN edge cache only',
              description:
                'Caching only on CDN edge servers. A cache miss goes straight to origin storage.',
              pros: [
                'A simple architecture — everything on the CDN side',
                'No additional infrastructure',
                'Works well for hot content',
              ],
              cons: [
                'Cache miss → a direct request to origin (high latency)',
                'Thundering herd on a cache miss of a popular video',
                'No protection of origin from peak loads',
              ],
              bestWhen: 'A small platform, content fits in the edge cache',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 2, cost: 1 },
            },
            {
              id: 'cdn-origin-shield',
              label: 'CDN + origin shield',
              description:
                'An intermediate cache layer (origin shield) between edge and origin. Protects origin from cache stampede.',
              pros: [
                'The origin shield absorbs cache misses from many edge PoPs',
                'Protects origin from thundering herd',
                'Reduces egress from origin storage by 80-90%',
              ],
              cons: [
                'An additional hop on a cache miss (edge → shield → origin)',
                'The cost of origin shield infrastructure',
                'A need to properly configure the TTL at each level',
              ],
              bestWhen: 'A mid-sized platform with a pronounced hot/cold distribution',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'multi-tier-cache',
              label: 'CDN + regional mid-tier cache + origin',
              description:
                'Three-level caching: edge → regional mid-tier → origin shield → storage. The industry standard for video.',
              pros: [
                'Minimal load on origin (99%+ cache hit ratio)',
                'A regional cache reduces inter-region traffic',
                'Predictable latency for users',
              ],
              cons: [
                'Complex cache invalidation across all levels',
                'High operational complexity (monitoring each tier)',
                'Significant infrastructure investment',
              ],
              bestWhen: 'A global platform at YouTube/Netflix scale',
              impact: { latency: 2, scalability: 2, consistency: 0, complexity: -2, cost: -1 },
            },
            {
              id: 'predictive-precache',
              label: 'Predictive pre-caching (popular content)',
              description:
                'An ML model predicts future popularity and proactively caches content at the edge before it is requested.',
              pros: [
                'The cache is already warm for viral content',
                'Minimal latency for trending videos',
                'Edge storage optimization — caching only what is needed',
              ],
              cons: [
                'A need for ML infrastructure for predictions',
                'Wasted bandwidth pre-caching prediction misses',
                'The difficulty of training the model on viral-content patterns',
              ],
              bestWhen: 'A supplement to multi-tier caching for viral content',
              impact: { latency: 2, scalability: 1, consistency: 0, complexity: -2, cost: -1 },
            },
          ],
        },
        {
          id: 'vs-recommendations',
          category: 'Recommendations',
          question: 'Recommendation system?',
          options: [
            {
              id: 'search-only',
              label: 'No recommendations (search only)',
              description:
                'Users find content only through search and subscriptions.',
              pros: [
                'No ML infrastructure — resource savings',
                'Transparency for users',
                'Simple implementation',
              ],
              cons: [
                'Low engagement and watch time',
                'Users do not discover new content',
                'Not competitive in the market',
              ],
              bestWhen: 'A niche platform with a targeted audience (corporate video)',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 2, cost: 2 },
            },
            {
              id: 'collaborative-filtering',
              label: 'Collaborative filtering',
              description:
                'Recommendations based on the behavior of similar users (item-based and user-based CF).',
              pros: [
                'A proven approach, works well for mature catalogs',
                'Does not require understanding the content',
                'A relatively simple implementation (ALS, SVD)',
              ],
              cons: [
                'A cold start problem for new videos and users',
                'Does not account for context (time of day, device)',
                'Scaling the user-item matrix with billions of users',
              ],
              bestWhen: 'A mid-sized platform with an established catalog',
              impact: { latency: 0, scalability: -1, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'deep-learning',
              label: 'Deep Learning (two-tower model, YouTube DNN 2016)',
              description:
                'A neural network for recommendations: candidate generation (two-tower) + a ranking model. The architecture of the YouTube DNN 2016 paper.',
              pros: [
                'The best recommendation quality in the industry',
                'Accounts for hundreds of features (context, history, content)',
                'Solves cold start through content features',
              ],
              cons: [
                'Huge infrastructure: GPU/TPU clusters for training and serving',
                'The complexity of the feature engineering pipeline',
                'High inference latency (an embeddings cache is needed)',
              ],
              bestWhen: 'YouTube scale, with an ML team and GPU infrastructure',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: -2, cost: -2 },
            },
            {
              id: 'hybrid-ml',
              label: 'Hybrid (collaborative + content-based + deep learning)',
              description:
                'A combination of approaches: CF for cold-start fallback, content-based for new items, DL for the main ranking.',
              pros: [
                "Robustness: each approach compensates for the others' weaknesses",
                'Better cold start: content-based for new videos',
                'Graceful degradation on an ML pipeline failure',
              ],
              cons: [
                'Maximum infrastructure complexity',
                'A need to orchestrate several ML models',
                'The complexity of A/B testing and debugging',
              ],
              bestWhen: 'A production platform striving for the best engagement (Netflix, YouTube)',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: -2, cost: -2 },
            },
          ],
        },
      ],
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'vs-reliability',
      title: 'Reliability and Monitoring',
      description:
        'The fault-tolerance strategy and quality metrics for a platform serving billions of views per day.',
      tip: 'Netflix uses multi-CDN fallback + multi-region active-active. The key metric is rebuffer ratio: every 1% increase in rebuffering reduces engagement by 3%.',
      decisions: [
        {
          id: 'vs-redundancy',
          category: 'Fault tolerance',
          question: 'Fault-tolerance strategy?',
          options: [
            {
              id: 'multi-az',
              label: 'Multi-AZ deployment',
              description:
                'Deployment across multiple Availability Zones within a single region.',
              pros: [
                'Protection against the failure of a single data center',
                'Low latency between AZs (<2ms)',
                'A simple implementation (a cloud standard)',
              ],
              cons: [
                'Does not protect against a regional failure',
                'Does not help with a CDN outage',
                'Limited geographical redundancy',
              ],
              bestWhen: 'A baseline level of reliability, a single-region deployment',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: -1 },
            },
            {
              id: 'multi-region',
              label: 'Multi-region active-active',
              description:
                'Fully active deployments in multiple regions. Each region can serve all traffic.',
              pros: [
                'Protection against a regional failure',
                'Users are routed to the nearest region',
                'No single point of failure at the region level',
              ],
              cons: [
                'Complex data synchronization between regions',
                'High cost (2-3x infrastructure)',
                'Conflicts on concurrent writes in different regions',
              ],
              bestWhen: 'A global platform with a 99.99%+ SLA',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: -2, cost: -2 },
            },
            {
              id: 'multi-cdn-fallback',
              label: 'Multi-CDN fallback',
              description:
                'Using multiple CDN providers with automatic failover on an outage.',
              pros: [
                'Protection against a CDN outage (even CloudFront has them)',
                'Can choose the best CDN for each region',
                'Leverage CDN competition for better prices',
              ],
              cons: [
                'Complex DNS failover logic',
                'A need to monitor the health of each CDN',
                'Cache is not shared between CDNs — cold start on failover',
              ],
              bestWhen: 'Critical video delivery, an SLA on watch time',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'multi-region-multi-cdn',
              label: 'All of the above (multi-AZ + multi-region + multi-CDN)',
              description:
                'Maximum fault tolerance: multi-AZ within each region, multi-region active-active, multi-CDN fallback.',
              pros: [
                'Maximum availability (99.999%)',
                'Protection against any level of failure',
                'Netflix and YouTube use this approach',
              ],
              cons: [
                'Maximum operational complexity',
                'Requires a dedicated SRE team',
                'A cost 3-5x that of a single-region deployment',
              ],
              bestWhen: 'YouTube/Netflix scale — a video platform as critical infrastructure',
              impact: { latency: 2, scalability: 2, consistency: -1, complexity: -2, cost: -2 },
            },
          ],
        },
        {
          id: 'vs-monitoring',
          category: 'Monitoring',
          question: 'Key metrics?',
          multiSelect: true,
          options: [
            {
              id: 'video-start-time',
              label: 'Video Start Time (Time to First Byte)',
              description:
                'Time from the Play click to the first frame. A critical UX metric: >2s — users leave.',
              pros: [
                'Directly affects bounce rate (53% leave at >3s)',
                'Easy to measure on the client side',
                'Correlates well with user satisfaction',
              ],
              cons: [
                'Depends on many factors (CDN, ISP, device)',
                'Hard to isolate the problem (server vs client vs network)',
                'A different norm for different devices and regions',
              ],
              bestWhen: 'Always — a baseline metric for any video platform',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'rebuffer-ratio',
              label: 'Rebuffer Ratio',
              description:
                'The percentage of watch time spent buffering. The main QoE metric: a 1% rise in rebuffering = a 3% drop in engagement.',
              pros: [
                'The strongest correlation with engagement',
                'An objective delivery-quality metric',
                'Can be tracked in real time',
              ],
              cons: [
                'Requires a client-side SDK for accurate measurement',
                "Depends on the player's ABR algorithm",
                'Hard to compare across different content types',
              ],
              bestWhen: 'Always — a key metric for optimizing the CDN and ABR',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'bitrate-quality',
              label: 'Bitrate Quality Score',
              description:
                'Average playback bitrate relative to the available maximum. Shows whether users get the best quality.',
              pros: [
                'Shows the real quality of experience',
                'Lets you assess ABR effectiveness',
                'Can be segmented by region and ISP',
              ],
              cons: [
                'Does not always correlate with subjective quality',
                'Depends on the available transcoding variants',
                'Needs context (mobile vs TV — different expectations)',
              ],
              bestWhen: 'A platform with ABR — to optimize the quality-selection algorithm',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'upload-success-rate',
              label: 'Upload Success Rate',
              description:
                'The percentage of successfully completed uploads. Critical for the creator experience: a failed upload = lost content.',
              pros: [
                'Directly affects content-creator retention',
                'Easy to measure and track',
                'Lets you quickly detect upload pipeline problems',
              ],
              cons: [
                'Does not reflect processing quality (transcoding failures)',
                'Depends on the client network (not always a server problem)',
                'A need to distinguish user-cancelled vs system-failed',
              ],
              bestWhen: 'A UGC platform — upload pipeline health is critical for the supply side',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
            },
          ],
        },
      ],
    },
  ],

  referenceSolution: {
    decisions: {
      'vs-type': ['vod', 'short-form'],
      'vs-quality': ['adaptive-bitrate'],
      'vs-upload-method': ['resumable-upload'],
      'vs-transcoding': ['distributed-transcoding'],
      'vs-video-storage': ['tiered-storage'],
      'vs-metadata-db': ['vitess'],
      'vs-cdn': ['hybrid-cdn'],
      'vs-streaming-protocol': ['hls-dash'],
      'vs-cache-strategy': ['multi-tier-cache'],
      'vs-recommendations': ['hybrid-ml'],
      'vs-redundancy': ['multi-region-multi-cdn'],
      'vs-monitoring': ['video-start-time', 'rebuffer-ratio', 'bitrate-quality', 'upload-success-rate'],
    },
    explanation:
      'A YouTube-scale architecture is built around several key principles:\n\n' +
      '1. **Distributed Transcoding** — a video is split into segments at GOP boundaries and encoded in parallel on thousands of workers. This cuts the processing time of an hour-long video from 4 hours to minutes. YouTube processes 500+ hours of video per minute exactly this way.\n\n' +
      '2. **Tiered Storage** — the Pareto principle in action: 10% of videos generate 90% of views. Hot content on SSD/S3 Standard, warm on S3-IA, archive on Glacier. Up to 60% savings on storing petabytes of data.\n\n' +
      '3. **Multi-tier CDN with Origin Shield** — three-level caching (edge → regional mid-tier → origin shield) provides a 99%+ cache hit ratio. A hybrid CDN (own edge + third-party) optimizes cost and coverage.\n\n' +
      '4. **Adaptive Bitrate Streaming (HLS + DASH)** — the client automatically switches between qualities (144p-4K) based on bandwidth. HLS covers Apple devices, DASH the rest.\n\n' +
      '5. **Vitess for metadata** — created by the YouTube team to shard MySQL. Automatic resharding, MySQL protocol compatibility, battle-tested on trillions of rows.\n\n' +
      '6. **Hybrid recommendations** — a combination of collaborative filtering (for mature content), content-based (for cold start of new videos) and deep learning (a two-tower model for the main ranking) provides maximum engagement.\n\n' +
      '7. **Multi-region + Multi-CDN** — full fault tolerance at all levels: multi-AZ within a region, active-active between regions, multi-CDN fallback on a provider failure.',
    diagram:
      '┌─────────────────────────────────────────────────────────────────────────────┐\n' +
      '│                        VIDEO STREAMING PLATFORM                            │\n' +
      '├─────────────────────────────────────────────────────────────────────────────┤\n' +
      '│                                                                             │\n' +
      '│  UPLOAD PIPELINE:                                                           │\n' +
      '│  ┌────────┐   Resumable    ┌──────────────┐   Event    ┌────────────────┐  │\n' +
      '│  │ Client ├───Upload──────►│Object Storage├──────────►│ Transcoding    │  │\n' +
      '│  │(Creator)│  (pre-signed) │  (Raw video)  │  (S3/SQS) │ Pipeline       │  │\n' +
      '│  └────────┘               └──────────────┘           │                │  │\n' +
      '│                                                        │ ┌────────────┐│  │\n' +
      '│                                                        │ │   Split    ││  │\n' +
      '│                                                        │ │ (by GOP)   ││  │\n' +
      '│                                                        │ └─────┬──────┘│  │\n' +
      '│                                                        │       │       │  │\n' +
      '│                                                        │ ┌─────▼──────┐│  │\n' +
      '│                                                        │ │  Parallel  ││  │\n' +
      '│                                                        │ │  FFmpeg    ││  │\n' +
      '│                                                        │ │  Workers   ││  │\n' +
      '│                                                        │ │ (1000s)    ││  │\n' +
      '│                                                        │ └─────┬──────┘│  │\n' +
      '│                                                        │       │       │  │\n' +
      '│                                                        │ ┌─────▼──────┐│  │\n' +
      '│                                                        │ │   Merge    ││  │\n' +
      '│                                                        │ │ (per qual) ││  │\n' +
      '│                                                        │ └─────┬──────┘│  │\n' +
      '│                                                        └───────┼───────┘  │\n' +
      '│                                                                │          │\n' +
      '│                                                        ┌───────▼────────┐ │\n' +
      '│                                                        │ Tiered Storage │ │\n' +
      '│                                                        │ Hot:  SSD/S3   │ │\n' +
      '│                                                        │ Warm: S3-IA    │ │\n' +
      '│                                                        │ Cold: Glacier  │ │\n' +
      '│                                                        └───────┬────────┘ │\n' +
      '│                                                                │          │\n' +
      '│  PLAYBACK:                                                     │          │\n' +
      '│  ┌────────┐  ┌───────────┐  ┌──────────────┐  ┌──────────┐    │          │\n' +
      '│  │ Client ├─►│ CDN Edge  ├─►│ Origin Shield├─►│ Storage  │◄───┘          │\n' +
      '│  │(Viewer)│  │  (PoP)    │  │ (Mid-tier)   │  │ (Tiered) │               │\n' +
      '│  └────────┘  └───────────┘  └──────────────┘  └──────────┘               │\n' +
      '│       │       HLS/DASH        Cache 99%+                                  │\n' +
      '│       │       ABR 144p-4K     hit ratio                                   │\n' +
      '│       │                                                                    │\n' +
      '│  METADATA & RECOMMENDATIONS:                                              │\n' +
      '│  ┌────┴───┐  ┌────────────┐  ┌────────────────────────────────┐           │\n' +
      '│  │  App   ├─►│   Vitess   │  │      ML Pipeline               │           │\n' +
      '│  │ Server │  │(MySQL shards│  │ User Activity ──► Training     │           │\n' +
      '│  │        │◄─┤ auto-split) │  │ ──► Two-Tower Model           │           │\n' +
      '│  │        │  └────────────┘  │ ──► Candidate Gen + Ranking    │           │\n' +
      '│  │        │◄─────────────────┤ ──► Rec Service (cached)       │           │\n' +
      '│  └────────┘                  └────────────────────────────────┘           │\n' +
      '│                                                                             │\n' +
      '└─────────────────────────────────────────────────────────────────────────────┘',
  },

  capacityEstimates: {
    default: [
      {
        label: 'DAU',
        value: '800M',
        formula: '2B registered users × ~40% daily active = 800M DAU',
      },
      {
        label: 'Video watches/sec',
        value: '~46K RPS',
        formula: '800M DAU × 5 videos/day / 86 400 sec ≈ 46 296 ≈ ~46K RPS',
      },
      {
        label: 'Video uploads/day',
        value: '~720K videos/day',
        formula: '500 hours of video uploaded per minute × 60 min = 30K hours/day ≈ ~720K videos/day (avg ~2.5 min each)',
      },
      {
        label: 'Raw upload storage/day',
        value: '~360 TB/day',
        formula: '720K videos × avg 500 MB raw = ~360 TB/day',
      },
      {
        label: 'Transcoded storage/day',
        value: '~1 PB/day',
        formula: '360 TB raw × 3× (multiple quality renditions: 144p–4K) = ~1 PB/day',
      },
      {
        label: 'CDN bandwidth (peak)',
        value: '~230 Gbps',
        formula: '46K concurrent streams × avg 5 Mbps adaptive bitrate = ~230 Gbps',
      },
      {
        label: 'Transcoding compute',
        value: '7.2M compute-min/day',
        formula: '720K videos × avg 10 min to transcode = 7.2M compute-minutes/day',
      },
    ],
  },
};
