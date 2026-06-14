import type { Scenario } from '@/data/constructor/types';

export const rideSharingScenario: Scenario = {
  id: 'ride-sharing',
  title: 'Ride Sharing (Yandex Taxi)',
  description:
    'Design a taxi/ride-sharing ordering platform at the level of Yandex Taxi or Uber: millions of rides per day, real-time matching of drivers and passengers, dynamic pricing, and fault tolerance.',
  difficulty: 'senior',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'rs-requirements',
      title: 'Platform Requirements',
      description:
        'Define the ride types and the service\'s operating geography. These decisions affect regulatory requirements, payment systems, and map providers.',
      decisions: [
        {
          id: 'rs-ride-types',
          category: 'Functionality',
          question: 'Which ride types should the platform support?',
          multiSelect: true,
          options: [
            {
              id: 'standard',
              label: 'Standard taxi',
              description:
                'A classic taxi order from point A to point B with a single passenger.',
              pros: [
                'Simple matching and routing logic',
                'A clear pricing model',
                'Minimal MVP complexity',
              ],
              cons: [
                'Limited average order value',
                'Does not optimize fleet utilization',
                'No differentiation from competitors',
              ],
              bestWhen: 'Launching an MVP or operating in a city with low demand',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'premium',
              label: 'Premium / Business class',
              description:
                'A higher class of service: better cars, stricter driver selection.',
              pros: [
                'High average order value and margin',
                'Attracts a higher-spending audience',
                'Differentiation from budget competitors',
              ],
              cons: [
                'A smaller pool of available drivers',
                'Additional car classification logic',
                'Longer wait time for pickup',
              ],
              bestWhen: 'A market with high-spending demand, availability of drivers with a suitable fleet',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'shared',
              label: 'Shared rides (pooling)',
              description:
                'Several passengers with similar routes share one car, reducing the cost.',
              pros: [
                'Low price attracts a mass audience',
                'Optimal fleet utilization',
                'Eco-friendly — fewer cars on the road',
              ],
              cons: [
                'Complex algorithm for routing and matching several passengers',
                'Increased travel time due to detours',
                'Complex pricing with cost splitting',
              ],
              bestWhen: 'High order density in one direction, a price-sensitive audience',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 2, cost: -1 },
            },
            {
              id: 'delivery',
              label: 'Delivery (food/parcels)',
              description:
                'Using the same fleet to deliver food and parcels (like Uber Eats).',
              pros: [
                'An additional revenue source',
                'Keeps drivers busy during low ride-demand hours',
                'Scaling the platform ecosystem',
              ],
              cons: [
                'Different matching logic (multi-stop routes)',
                'Integration with restaurants and stores',
                'A separate order-tracking system',
              ],
              bestWhen: 'A mature platform with a sufficient fleet, a super-app strategy',
              impact: { latency: 0, scalability: 1, consistency: -1, complexity: 2, cost: 1 },
            },
          ],
        },
        {
          id: 'rs-geography',
          category: 'Geography',
          question: 'What is the platform\'s geographic coverage?',
          options: [
            {
              id: 'single-city',
              label: 'Single city',
              description:
                'Launch and operation in one city. All data and infrastructure are concentrated locally.',
              pros: [
                'Infrastructure simplicity — a single region',
                'A single regulatory environment',
                'Fast launch and iteration',
              ],
              cons: [
                'A limited growth ceiling',
                'Dependence on a single market',
                'No intercity rides',
              ],
              bestWhen: 'A startup at the product-validation stage',
              impact: { latency: -1, scalability: -2, consistency: 1, complexity: -2, cost: -2 },
            },
            {
              id: 'multi-city',
              label: 'Multiple cities (one country)',
              description:
                'Operation in several cities of one country with a unified payment and regulatory system.',
              pros: [
                'Scaling without currency/regulatory complications',
                'A single payments stack',
                'Sharing the driver base between nearby cities',
              ],
              cons: [
                'A multi-regional infrastructure is needed',
                'Different tariffs and demand across cities',
                'Managing local teams',
              ],
              bestWhen: 'Scaling within a single country, sufficient demand density',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'international',
              label: 'International (several countries)',
              description:
                'Operation in different countries: different currencies, regulators, map and payment providers.',
              pros: [
                'Maximum TAM (Total Addressable Market)',
                'Diversification of regulatory risks',
                'A global brand',
              ],
              cons: [
                'Many payment systems and currencies',
                'Different legislation by country (licenses, labor law)',
                'Different map providers (Google Maps, HERE, local ones)',
              ],
              bestWhen: 'An Uber/DiDi-level company with resources for localization and compliance',
              impact: { latency: 1, scalability: 2, consistency: -1, complexity: 2, cost: 2 },
            },
          ],
        },
      ],
      tip: 'Uber started as a black-car service in one city (San Francisco). Yandex Taxi was Moscow-only. Both scaled iteratively.',
    },

    // ── Step 2: Location & Matching ───────────────────────────────────
    {
      id: 'rs-matching',
      title: 'Geo-index and Matching',
      description:
        'A key stage: how to find the nearest drivers and assign them to orders optimally. The accuracy and speed of search depend on the choice of geo-index.',
      decisions: [
        {
          id: 'rs-geo-index',
          category: 'Geo-index',
          question: 'Which geospatial index should be used to search for the nearest drivers?',
          options: [
            {
              id: 'postgis',
              label: 'PostGIS (PostgreSQL extension)',
              description:
                'A geospatial extension for PostgreSQL with support for ST_DWithin, KNN search, and geometric operations.',
              pros: [
                'A mature technology with a rich API',
                'Support for complex geometric queries',
                'Integration with existing PostgreSQL infrastructure',
              ],
              cons: [
                'Does not scale horizontally without sharding',
                'High latency with millions of records and frequent updates',
                'Not suitable for in-memory real-time scenarios',
              ],
              bestWhen: 'Small scale, < 10K concurrent drivers, PostgreSQL is already in use',
              impact: { latency: 1, scalability: -2, consistency: 2, complexity: -1, cost: -1 },
            },
            {
              id: 'geohash-redis',
              label: 'Geohash + Redis',
              description:
                'Encoding coordinates into geohash strings, storing them in Redis GEOADD/GEORADIUS for fast radius search.',
              pros: [
                'Very fast search (Redis in-memory)',
                'Simple implementation via GEOADD/GEOSEARCH',
                'Scales well with Redis Cluster',
              ],
              cons: [
                'Problems at geohash cell boundaries (edge effects)',
                'Does not account for the real road network',
                'Uneven cell sizes at different latitudes',
              ],
              bestWhen: 'Medium scale, a fast prototype is needed, edge effects are acceptable',
              impact: { latency: -1, scalability: 1, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'h3-grid',
              label: 'H3 hexagonal grid (Uber)',
              description:
                'A hierarchical hexagonal grid, H3, developed by Uber. Uniform cells, 16 resolution levels, efficient neighbor search.',
              pros: [
                'The same cell size across the entire planet (unlike geohash)',
                'No edge effects — hexagons have equidistant neighbors',
                'A resolution hierarchy for different scales (city → district → block)',
              ],
              cons: [
                'An additional library and team learning curve',
                'No native support in standard databases',
                'You need your own storage and search implementation',
              ],
              bestWhen: 'High load, global scale, you need accuracy and cell uniformity',
              impact: { latency: -1, scalability: 2, consistency: 1, complexity: 1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Matching computations/sec',
                  value: '~28 match/sec (O(1) cell lookup)',
                  formula: 'H3 resolution 9 (~0.1 km²): lookup 7 neighbors = O(1); 28 matches/sec × 7 cells = 196 lookups/sec',
                },
                {
                  label: 'Location data storage/day',
                  value: '~4.7 TB/day',
                  formula: '500K updates/sec × 86 400 sec × 108 bytes (100 + 8 bytes H3 index) = ~4.7 TB/day',
                },
              ],
            },
            {
              id: 's2-geometry',
              label: 'S2 Geometry (Google)',
              description:
                'Google\'s S2 library: a projection of the sphere onto a cube, 30 levels of cell hierarchy. Used in Google Maps.',
              pros: [
                'High accuracy on the sphere (no projection distortion)',
                'Efficient coverage of arbitrary regions',
                'Battle-tested in Google Maps and other Google services',
              ],
              cons: [
                'Harder to understand and debug than H3',
                'Square cells (not all neighbors are equidistant)',
                'Less popular in the ride-sharing industry',
              ],
              bestWhen: 'Geo-services with arbitrary regions, the Google stack is already in use',
              impact: { latency: -1, scalability: 2, consistency: 1, complexity: 2, cost: 0 },
            },
            {
              id: 'quadtree',
              label: 'QuadTree (in-memory)',
              description:
                'A quadrant tree in RAM: recursive division of 2D space into four quadrants.',
              pros: [
                'Maximum speed — pure in-memory',
                'Adaptive partitioning (dense areas get smaller cells)',
                'Simple to implement from scratch',
              ],
              cons: [
                'No horizontal scaling without replication',
                'Data loss on process crash',
                'Tree rebalancing is needed under uneven distribution',
              ],
              bestWhen: 'A single city, a high update rate, minimal latency is needed',
              impact: { latency: -2, scalability: -1, consistency: -1, complexity: 1, cost: -1 },
            },
          ],
        },
        {
          id: 'rs-matching-algo',
          category: 'Matching',
          question: 'Which driver-passenger matching algorithm should be used?',
          options: [
            {
              id: 'nearest-driver',
              label: 'Nearest driver (greedy algorithm)',
              description:
                'Immediately assign the nearest available driver to each order.',
              pros: [
                'Minimal latency from order to assignment',
                'Simple implementation and clear logic',
                'Works well under low load',
              ],
              cons: [
                'Globally suboptimal assignments (one order "steals" a driver from a closer one)',
                'Does not account for the driver\'s direction of travel',
                'Works poorly under high demand',
              ],
              bestWhen: 'MVP, low order density, a simple solution at the start',
              impact: { latency: -2, scalability: -1, consistency: -1, complexity: -2, cost: -1 },
              capacityImpact: [
                {
                  label: 'Matching computations/sec',
                  value: '~28 match/sec (O(n) scan)',
                  formula: '28 requests/sec × scan ~50 nearby drivers each = 1 400 distance calculations/sec, O(n) per request',
                },
                {
                  label: 'ETA calculations/sec',
                  value: '~28 routing queries/sec',
                  formula: 'Greedy: 1 ETA per match (nearest only) = 28 routing queries/sec',
                },
              ],
            },
            {
              id: 'batched-matching',
              label: 'Batched matching (Hungarian algorithm)',
              description:
                'Accumulate orders over a window of N seconds (2-5 sec) and optimize globally. Minimization of total ETA via the Hungarian algorithm or similar.',
              pros: [
                'Globally optimal assignments — minimum total pickup time',
                'Distributes orders among drivers more fairly',
                'Scales: handles hundreds of orders per batch',
              ],
              cons: [
                'A 2-5 second delay to accumulate the batch',
                'Complex implementation (an optimization problem, O(n³))',
                'Fine-tuning of the window size to order density is needed',
              ],
              bestWhen: 'High order density, you need global optimality, Uber/Lyft scale',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: 2, cost: 0 },
              capacityImpact: [
                {
                  label: 'Matching computations/sec',
                  value: '~6 batch/sec (O(n³) per batch)',
                  formula: '28 requests/sec batched into 5-sec windows = ~6 batches/sec × Hungarian algorithm O(n³) on ~140 requests × 50 drivers',
                },
                {
                  label: 'ETA calculations/sec',
                  value: '~1 400 routing queries/sec',
                  formula: 'Batch: 28 requests/sec × 50 candidate drivers each = 1 400 ETA queries/sec (50× more than greedy)',
                },
              ],
            },
            {
              id: 'ml-matching',
              label: 'ML-based matching',
              description:
                'An ML model predicts the probability of a driver accepting an order, the real ETA accounting for traffic, and optimizes assignments.',
              pros: [
                'Accounts for driver preferences and historical patterns',
                'More accurate ETA prediction',
                'Adaptability to changes in supply and demand',
              ],
              cons: [
                'A training set is needed (cold start)',
                'Complexity of ML infrastructure (training, deployment, monitoring)',
                'Risk of model degradation when patterns change',
              ],
              bestWhen: 'A mature platform with a sufficient volume of data, an ML team is available',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 2, cost: 2 },
            },
            {
              id: 'auction-based',
              label: 'Auction (drivers place bids)',
              description:
                'An order is published to the nearest drivers, who place bids. The passenger or the system chooses the best offer.',
              pros: [
                'Market-based pricing — a balance of supply and demand',
                'Drivers decide for themselves which orders to take',
                'Works well for non-standard routes',
              ],
              cons: [
                'Long wait — time is needed for bids',
                'Unpredictable price for the passenger',
                'Difficulty preventing driver collusion',
              ],
              bestWhen: 'Markets with independent drivers, non-standard orders (freight)',
              impact: { latency: 2, scalability: 0, consistency: -2, complexity: 1, cost: -1 },
            },
          ],
        },
      ],
      tip: 'Uber uses the H3 grid + batched matching. Lyft also switched to a batched approach. The greedy algorithm loses 10-20% on total ETA under high load.',
    },

    // ── Step 3: Real-time Tracking ────────────────────────────────────
    {
      id: 'rs-tracking',
      title: 'Real-time Tracking',
      description:
        'How to receive and store the coordinates of hundreds of thousands of drivers simultaneously. Update frequency: every 1-4 seconds.',
      decisions: [
        {
          id: 'rs-location-update',
          category: 'Update protocol',
          question: 'How should driver location be updated in real time?',
          options: [
            {
              id: 'http-polling',
              label: 'HTTP polling (every N seconds)',
              description:
                'The client (driver app) sends an HTTP request with coordinates at regular intervals.',
              pros: [
                'Simple implementation without stateful connections',
                'Works through any proxies and firewalls',
                'Easy to scale a stateless backend',
              ],
              cons: [
                'High overhead: HTTP headers, TLS handshake on each request',
                'Latency of up to N seconds (not real-time)',
                'High battery drain on mobile devices',
              ],
              bestWhen: 'A prototype, low update frequency, no real-time requirements',
              impact: { latency: 2, scalability: -1, consistency: 0, complexity: -2, cost: -1 },
              capacityImpact: [
                {
                  label: 'Driver location updates/sec',
                  value: '200K updates/sec',
                  formula: '2M drivers × 1 poll every 10 sec = 200K HTTP req/sec (vs 500K for persistent conn)',
                },
                {
                  label: 'Location data storage/day',
                  value: '~5.2 TB/day',
                  formula: '200K updates/sec × 86 400 sec × 300 bytes (HTTP overhead: headers, TLS) = ~5.2 TB/day',
                },
              ],
            },
            {
              id: 'websocket',
              label: 'WebSocket (persistent connection)',
              description:
                'A persistent bidirectional TCP connection between the driver app and the server.',
              pros: [
                'Low latency — data is sent instantly',
                'A bidirectional channel: the server can push assignments',
                'Minimal overhead after the connection is established',
              ],
              cons: [
                'Stateful connections — complicate scaling',
                'A sticky session or connection registry is needed',
                'Resource consumption to maintain thousands of open connections',
              ],
              bestWhen: 'You need real-time for tracking and notifications, the standard choice',
              impact: { latency: -1, scalability: 0, consistency: 1, complexity: 1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Driver location updates/sec',
                  value: '500K updates/sec',
                  formula: '2M drivers × persistent WebSocket × 1 update every 4 sec = 500K updates/sec',
                },
                {
                  label: 'Location data storage/day',
                  value: '~4.3 TB/day',
                  formula: '500K updates/sec × 86 400 sec × 100 bytes (compact binary frame, no HTTP overhead) = ~4.3 TB/day',
                },
              ],
            },
            {
              id: 'mqtt',
              label: 'MQTT (lightweight IoT protocol)',
              description:
                'A pub/sub protocol designed for resource-constrained devices. QoS 0/1/2.',
              pros: [
                'Minimal battery drain — designed for IoT',
                'Built-in delivery guarantee levels (QoS)',
                'Efficient over an unstable mobile connection',
              ],
              cons: [
                'An MQTT broker is needed (Mosquitto, EMQX, VerneMQ)',
                'Less familiar to web developers',
                'A limited ecosystem compared to WebSocket',
              ],
              bestWhen: 'Priority on energy efficiency, operation in regions with weak connectivity',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'grpc-streaming',
              label: 'gRPC streaming',
              description:
                'Bidirectional streaming over gRPC (HTTP/2). Strong typing via protobuf, multiplexing.',
              pros: [
                'A compact binary format (protobuf) — less traffic',
                'Multiplexing of streams over a single connection',
                'Strong typing — contracts between services',
              ],
              cons: [
                'Harder to debug a binary protocol',
                'Limited support in mobile SDKs',
                'HTTP/2 can be blocked by some proxies',
              ],
              bestWhen: 'Internal services (server-to-server communication), you need typing and compactness',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 2, cost: 0 },
            },
          ],
        },
        {
          id: 'rs-location-store',
          category: 'Location storage',
          question: 'Where should the current driver locations be stored?',
          options: [
            {
              id: 'redis',
              label: 'Redis (in-memory)',
              description:
                'Redis with GEOADD/GEOSEARCH for storing current coordinates. Fast writes and reads.',
              pros: [
                'Ultra-fast writes and reads (microseconds)',
                'Built-in geo commands (GEOADD, GEOSEARCH)',
                'Simple scaling via Redis Cluster',
              ],
              cons: [
                'Data loss on restart (if there is no AOF/RDB)',
                'A RAM limit — all data is in memory',
                'No movement history — only the current state',
              ],
              bestWhen: 'Only the current state is needed, < 1M drivers, no track analytics',
              impact: { latency: -2, scalability: 1, consistency: -1, complexity: -1, cost: 0 },
            },
            {
              id: 'kafka',
              label: 'Apache Kafka (event stream)',
              description:
                'Each location update is an event in Kafka. Consumers read the stream for various tasks.',
              pros: [
                'Complete movement history — replay is possible',
                'Multiple consumers: tracking, analytics, ETA',
                'High throughput (millions of events/sec)',
              ],
              cons: [
                'Latency on reading the current state (a materialized view is needed)',
                'Harder to get "where is the driver now" without an additional layer',
                'Storing a large volume of data',
              ],
              bestWhen: 'You need complete history + analytics, there are event consumers',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: 1, cost: 1 },
            },
            {
              id: 'redis-kafka',
              label: 'Redis + Kafka (combination)',
              description:
                'Redis for the current state ("where is the driver now"), Kafka for the event stream (history, analytics).',
              pros: [
                'Fast access to the current state (Redis)',
                'Complete history and event-driven architecture (Kafka)',
                'Separation of the hot path (Redis) and cold path (Kafka)',
              ],
              cons: [
                'Two components instead of one — more infrastructure',
                'Synchronization between Redis and Kafka is needed',
                'Complicates monitoring and deployment',
              ],
              bestWhen: 'Production scale: you need both real-time and analytics. The Uber approach.',
              impact: { latency: -1, scalability: 2, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'in-memory-grid',
              label: 'In-memory data grid (Hazelcast/Ignite)',
              description:
                'A distributed in-memory cache with near-cache, partitioning, and SQL queries.',
              pros: [
                'Distributed in-memory — horizontal scaling',
                'Support for predicate queries and indexes',
                'Automatic replication and balancing',
              ],
              cons: [
                'Complexity of cluster setup and operation',
                'Less widespread — fewer specialists',
                'Potential split-brain problems',
              ],
              bestWhen: 'You need a distributed cache with rich queries, a team with IMDG experience',
              impact: { latency: -1, scalability: 1, consistency: 0, complexity: 2, cost: 1 },
            },
          ],
        },
      ],
      tip: 'Uber stores current locations in Redis for fast matching, and writes the stream of updates to Kafka for analytics, ETA, and surge pricing.',
    },

    // ── Step 4: Pricing & ETA ─────────────────────────────────────────
    {
      id: 'rs-pricing',
      title: 'Pricing and ETA',
      description:
        'How to calculate the ride cost and the driver\'s arrival time. Pricing directly affects the balance of supply and demand.',
      decisions: [
        {
          id: 'rs-pricing-model',
          category: 'Pricing',
          question: 'Which pricing model should be used?',
          options: [
            {
              id: 'fixed-zone',
              label: 'Fixed price (by zones)',
              description:
                'The city is divided into zones, with a fixed price between each pair of zones. Independent of demand.',
              pros: [
                'A predictable price for the passenger',
                'Simple implementation — a tariff table',
                'No negativity from "surge demand"',
              ],
              cons: [
                'Does not balance supply and demand',
                'A shortage of drivers at peak hours (no incentive to go out)',
                'Does not account for real road conditions',
              ],
              bestWhen: 'A regulated market (fixed tariffs), low demand variability',
              impact: { latency: -1, scalability: 0, consistency: 2, complexity: -2, cost: -1 },
            },
            {
              id: 'dynamic-surge',
              label: 'Dynamic pricing (surge)',
              description:
                'The price multiplier depends on the supply-demand ratio in a zone. Uber Surge Pricing.',
              pros: [
                'Automatic balancing of supply and demand',
                'Incentivizes drivers to go out at peak hours',
                'Demand rationing during shortages',
              ],
              cons: [
                'Negative passenger reaction to high multipliers',
                'Difficulty explaining the price to the user',
                'Regulatory restrictions in some jurisdictions',
              ],
              bestWhen: 'A mature market with peak loads, demand self-regulation is needed',
              impact: { latency: 0, scalability: 1, consistency: -1, complexity: 1, cost: 0 },
            },
            {
              id: 'upfront-surge',
              label: 'Upfront price with surge multiplier',
              description:
                'The passenger sees the final price BEFORE confirming the order. The price includes base + route + surge + time of day.',
              pros: [
                'Transparency for the passenger — knows the price in advance',
                'Reduces cancellations (no surprises on arrival)',
                'Balances demand through the surge component',
              ],
              cons: [
                'An accurate route and ETA calculation is needed before confirmation',
                'Risk of losses with an inaccurate forecast (traffic, detour)',
                'A complex price calculation model',
              ],
              bestWhen: 'Industry standard — Uber, Lyft, Yandex Taxi use this approach',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'ml-pricing',
              label: 'ML-based pricing',
              description:
                'An ML model accounts for dozens of factors: time of day, weather, events, user history, predicted demand.',
              pros: [
                'Maximum optimization of revenue and conversion',
                'Accounts for non-obvious factors (weather, concerts, holidays)',
                'Personalization for user segments',
              ],
              cons: [
                'Risk of perceived "unfairness" (different prices for different people)',
                'Difficulty explaining the price to regulators',
                'Cold start — data is needed for training',
              ],
              bestWhen: 'A mature platform with ML infrastructure and a large volume of data',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 2, cost: 2 },
            },
          ],
        },
        {
          id: 'rs-eta',
          category: 'ETA',
          question: 'How should ETA (the driver\'s arrival time) be calculated?',
          options: [
            {
              id: 'simple-distance',
              label: 'Simple distance/speed calculation',
              description:
                'Straight-line distance (Haversine) or Manhattan distance, divided by average speed.',
              pros: [
                'Instant calculation, no external dependencies',
                'Works offline',
                'Suitable for a rough estimate',
              ],
              cons: [
                'Does not account for the road network and traffic',
                'The error can reach 50-100%',
                'Loss of passenger trust due to inaccurate estimates',
              ],
              bestWhen: 'A fast prototype, a fallback when the routing service is unavailable',
              impact: { latency: -2, scalability: 0, consistency: -2, complexity: -2, cost: -2 },
            },
            {
              id: 'routing-engine-historical',
              label: 'Routing engine + historical data',
              description:
                'OSRM, Valhalla, or GraphHopper with speed profiles based on historical traffic data by time of day.',
              pros: [
                'An accurate route along the road network',
                'Accounts for typical traffic by time of day and day of week',
                'Works without real-time traffic data',
              ],
              cons: [
                'Does not account for anomalous traffic (accidents, events)',
                'Speed profiles need to be updated',
                'Resource-intensive — a powerful server is needed for the road graph',
              ],
              bestWhen: 'The standard choice for production. Uber builds its own routing engine.',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'ml-eta',
              label: 'ML model for ETA',
              description:
                'An ML model predicts ETA based on time of day, weather, events, and real-time road-segment speeds.',
              pros: [
                'Accounts for non-standard factors (weather, events)',
                'Can be more accurate than classic routing on familiar routes',
                'Adapts to infrastructure changes',
              ],
              cons: [
                'Cold start — training data is needed',
                'Complex training and inference infrastructure',
                'Unpredictable errors on new routes',
              ],
              bestWhen: 'A complement to a routing engine, a large volume of historical data',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: 2, cost: 2 },
            },
            {
              id: 'third-party-maps',
              label: 'Third-party service (Google Maps Directions)',
              description:
                'Using Google Maps, HERE, Mapbox to calculate the route and ETA accounting for real-time traffic.',
              pros: [
                'High accuracy — real-time traffic data',
                'No need to stand up and maintain your own routing',
                'Fast launch — an API call',
              ],
              cons: [
                'Cost: $5-10 per 1000 requests (with millions of rides — millions of $)',
                'Dependence on an external service (latency, availability)',
                'Limits on the number of requests',
              ],
              bestWhen: 'An early-stage startup, no resources for own routing, < 100K rides/day',
              impact: { latency: 1, scalability: -1, consistency: 1, complexity: -2, cost: 2 },
            },
          ],
        },
      ],
      tip: 'Uber calculates the upfront price before order confirmation. ETA errors lead to losses: if the real time is longer than forecast — the passenger is unhappy, if shorter — the platform loses money under upfront pricing.',
    },

    // ── Step 5: Scaling ───────────────────────────────────────────────
    {
      id: 'rs-scaling',
      title: 'Scaling and Storage',
      description:
        'Choosing the main data store and event processing to support millions of rides per day and real-time analytics.',
      decisions: [
        {
          id: 'rs-data-store',
          category: 'Data store',
          question: 'Which main data store should be used?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL',
              description:
                'A classic relational DBMS with ACID transactions, rich SQL, and extensions.',
              pros: [
                'ACID transactions for financial data',
                'A rich ecosystem and mature tooling',
                'Support for JSON, arrays, FTS — versatility',
              ],
              cons: [
                'Vertical scaling — a write ceiling',
                'Difficulty sharding without Citus/pg_partman',
                'Bloat problems under a high update rate',
              ],
              bestWhen: 'Medium scale, < 100K rides/day, you need complex JOINs',
              impact: { latency: 0, scalability: -1, consistency: 2, complexity: -1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Daily rides',
                  value: '15M rides/day (single master bottleneck)',
                  formula: '15M rides × avg 5 writes per ride = 75M writes/day ≈ 870 writes/sec; PostgreSQL limit ~5-10K writes/sec but needs sharding at this scale',
                },
                {
                  label: 'Payment transactions/day',
                  value: '~$225M daily GMV (ACID guaranteed)',
                  formula: 'Full ACID for financial data; single-node storage ~5 TB for 1 year of ride history',
                },
              ],
            },
            {
              id: 'cassandra',
              label: 'Apache Cassandra',
              description:
                'A distributed NoSQL database, linear write scaling, tunable consistency.',
              pros: [
                'Linear scaling — add nodes, get throughput',
                'High availability — no single point of failure',
                'Optimized for writes (LSM-tree)',
              ],
              cons: [
                'No JOINs, limited queries (you must know the partition key)',
                'Eventual consistency by default',
                'Query-driven data modeling — denormalization',
              ],
              bestWhen: 'High write load (ride history, events), > 1M rides/day',
              impact: { latency: 0, scalability: 2, consistency: -1, complexity: 1, cost: 1 },
              capacityImpact: [
                {
                  label: 'Daily rides',
                  value: '15M rides/day (linear write scaling)',
                  formula: '75M writes/day across N Cassandra nodes; 6-node cluster → 12.5M writes/node/day ≈ 145 writes/sec/node (well within capacity)',
                },
                {
                  label: 'Location data storage/day',
                  value: '~8.6 TB/day',
                  formula: '4.3 TB raw + 2× replication factor (RF=3 standard) = ~8.6 TB with compaction overhead',
                },
              ],
            },
            {
              id: 'mysql-schemaless',
              label: 'MySQL + Schemaless (the Uber approach)',
              description:
                'MySQL as the storage engine + a custom Schemaless layer on top: sharding, schema evolution, immutable rows.',
              pros: [
                'Proven by Uber at the scale of trillions of rows',
                'Append-only — no problems with UPDATE locks',
                'Flexible schema evolution without migrations',
              ],
              cons: [
                'You need to implement the Schemaless layer yourself',
                'High operational complexity',
                'A specific approach — little documentation outside Uber',
              ],
              bestWhen: 'Uber scale: trillions of rows, a team able to maintain custom storage',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: 2, cost: 2 },
            },
            {
              id: 'citus-postgresql',
              label: 'Sharded PostgreSQL (Citus)',
              description:
                'PostgreSQL with the Citus extension for horizontal sharding. Familiar SQL with distributed tables.',
              pros: [
                'Familiar PostgreSQL SQL — a minimal entry barrier',
                'Horizontal scaling by shard key',
                'ACID transactions within a single shard',
              ],
              cons: [
                'Cross-shard queries are slow',
                'You must choose the shard key wisely (tenant_id, city_id)',
                'Complexity of shard rebalancing',
              ],
              bestWhen: 'You need SQL + horizontal scaling, > 100K rides/day',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 1, cost: 1 },
            },
          ],
        },
        {
          id: 'rs-event-processing',
          category: 'Event processing',
          question: 'How should events be processed in real time?',
          options: [
            {
              id: 'kafka-flink',
              label: 'Kafka + Apache Flink',
              description:
                'Kafka as the event bus, Flink for stream processing: aggregations, windowing, complex event processing.',
              pros: [
                'Powerful stream processing with exactly-once semantics',
                'Windowed aggregations for real-time surge pricing',
                'Checkpoint/savepoint for fault tolerance',
              ],
              cons: [
                'High complexity — two large components',
                'JVM expertise is needed for Flink',
                'Resource-intensive clusters (Kafka + Flink)',
              ],
              bestWhen: 'Complex real-time analytics, surge pricing, fraud detection',
              impact: { latency: 0, scalability: 2, consistency: 1, complexity: 2, cost: 2 },
            },
            {
              id: 'kafka-consumers',
              label: 'Kafka + custom consumers',
              description:
                'Kafka as the event bus, custom consumer services process the events. Without a stream-processing framework.',
              pros: [
                'Full control over the processing logic',
                'Simpler than Flink — ordinary microservices',
                'Scaling via partition assignment',
              ],
              cons: [
                'No built-in windowing or exactly-once',
                'You must implement state management yourself',
                'Logic duplication between consumers',
              ],
              bestWhen: 'Simple event processing (logging, notifications), a team without Flink experience',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 0, cost: 1 },
            },
            {
              id: 'kinesis-lambda',
              label: 'AWS Kinesis + Lambda',
              description:
                'Managed streaming (Kinesis) + serverless compute (Lambda). Fully AWS-managed.',
              pros: [
                'No infrastructure management — serverless',
                'Automatic scaling',
                'Fast launch — minimal code',
              ],
              cons: [
                'Vendor lock-in (AWS)',
                'Lambda cold starts — latency',
                'Limits: 5 consumers per shard, 1MB/sec per shard',
              ],
              bestWhen: 'AWS-only infrastructure, < 500K events/sec, no DevOps team',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'redis-streams',
              label: 'Redis Streams',
              description:
                'Lightweight event streaming built into Redis. Consumer groups, acknowledgment, persistence.',
              pros: [
                'Redis is already there — no separate component needed',
                'Very low latency',
                'A simple API — XADD/XREAD/XACK',
              ],
              cons: [
                'Limits on throughput and retention (RAM)',
                'No distributed stream processing',
                'Not suitable for complex aggregations',
              ],
              bestWhen: 'Small scale, Redis is already in use, simple event processing',
              impact: { latency: -1, scalability: -1, consistency: -1, complexity: -1, cost: -1 },
            },
          ],
        },
      ],
      tip: 'Uber processes trillions of events in Kafka. Flink is used for real-time surge pricing, fraud detection, and analytics. Uber also built Schemaless — its own storage on top of MySQL.',
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'rs-reliability',
      title: 'Reliability and Payments',
      description:
        'Processing payments and fault tolerance under loss of connectivity. In a taxi, you cannot "lose" an active ride — the passenger and driver are already in the car.',
      decisions: [
        {
          id: 'rs-payment',
          category: 'Payments',
          question: 'How should payment for a ride be processed?',
          options: [
            {
              id: 'sync-payment',
              label: 'Synchronous payment (charge immediately)',
              description:
                'Charging the passenger\'s card at the moment of ordering. The ride starts only after a successful payment.',
              pros: [
                'Payment guarantee — no debts',
                'Simple accounting — a single transaction',
                'No risk of non-payment',
              ],
              cons: [
                'The final amount is unknown (the route may change)',
                'UX blocking — waiting for payment confirmation',
                'Difficulty with refunds when the price changes',
              ],
              bestWhen: 'Fixed prices, small amounts, prepaid tariffs',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'async-payment',
              label: 'Asynchronous payment (after the ride)',
              description:
                'Charging after the ride is complete, when the exact amount is known.',
              pros: [
                'The exact amount accounting for the real route',
                'A fast ride start — no waiting for payment',
                'Simple logic — a single charge after the fact',
              ],
              cons: [
                'Risk of non-payment (card declined post-factum)',
                'A debt-collection system is needed',
                'No solvency guarantee before the ride',
              ],
              bestWhen: 'Trusted users with a history, corporate accounts',
              impact: { latency: -1, scalability: 0, consistency: -1, complexity: 0, cost: -1 },
            },
            {
              id: 'two-phase-payment',
              label: 'Two-phase: authorization + capture',
              description:
                'Authorization (hold) for a preliminary amount before the ride, final capture after with the exact amount.',
              pros: [
                'A solvency guarantee before the ride starts',
                'The exact final amount — the real price is charged',
                'Industry standard — Uber, Yandex Taxi, Lyft',
              ],
              cons: [
                'Two requests to the payment system (authorize + capture)',
                'The hold may not work (authorization expiry, usually 7 days)',
                'Harder error handling (partial capture, void)',
              ],
              bestWhen: 'The standard choice for ride-sharing — a balance of guarantees and flexibility',
              impact: { latency: 0, scalability: 1, consistency: 2, complexity: 1, cost: 0 },
            },
            {
              id: 'wallet-system',
              label: 'Wallet / balance',
              description:
                'The passenger tops up an internal balance, rides are charged instantly from the wallet.',
              pros: [
                'Instant charging — no calls to the payment system',
                'The user controls spending',
                'Reduction of payment-system fees',
              ],
              cons: [
                'You need to incentivize top-ups (friction)',
                'Regulatory requirements for electronic wallets',
                'Managing refunds and withdrawals',
              ],
              bestWhen: 'Markets with low card penetration (Southeast Asia), super-apps',
              impact: { latency: -2, scalability: 1, consistency: 1, complexity: 1, cost: -1 },
            },
          ],
        },
        {
          id: 'rs-fault-tolerance',
          category: 'Fault tolerance',
          question: 'How should fault tolerance be ensured under loss of connectivity?',
          options: [
            {
              id: 'retry-local-queue',
              label: 'Retry + local queue (client)',
              description:
                'The client stores unsent data locally and retries sending when connectivity is restored.',
              pros: [
                'Simple client-side implementation',
                'Works during brief failures',
                'Does not require changes to the server architecture',
              ],
              cons: [
                'Data loss on app reinstall/crash',
                'No server guarantee — the server does not know about the ride on connectivity loss',
                'Conflicts on simultaneous retries from several clients',
              ],
              bestWhen: 'An additional mechanism to a server-side solution, not the primary one',
              impact: { latency: 0, scalability: 0, consistency: -2, complexity: -1, cost: -1 },
            },
            {
              id: 'server-state-machine',
              label: 'Server-side ride state machine',
              description:
                'The server holds a finite state machine of the ride (requested → matched → in_progress → completed). The ride continues independently of the client.',
              pros: [
                'The ride is not lost when connectivity drops',
                'Clear transitions between states — easy to debug',
                'A server-side source of truth — clients restore state on reconnect',
              ],
              cons: [
                'A complex state machine with many transitions and edge cases',
                'Timeouts and handling of "stuck" rides are needed',
                'Storing state requires reliable storage',
              ],
              bestWhen: 'A production solution — Uber, Yandex Taxi. A ride = a server object with a lifecycle.',
              impact: { latency: 0, scalability: 1, consistency: 2, complexity: 1, cost: 0 },
            },
            {
              id: 'optimistic-offline',
              label: 'Optimistic offline mode',
              description:
                'The client continues navigation and tracking offline, synchronizing everything when connectivity is restored.',
              pros: [
                'The user does not notice the loss of connectivity',
                'The driver continues navigation (offline maps)',
                'Data is not lost — it is buffered locally',
              ],
              cons: [
                'Complex synchronization and conflict resolution',
                'No ability to change the route via the server',
                'Offline maps and navigation on the client are needed',
              ],
              bestWhen: 'Regions with poor connectivity coverage, long routes (intercity)',
              impact: { latency: -1, scalability: 0, consistency: -1, complexity: 2, cost: 1 },
            },
            {
              id: 'multi-channel-fallback',
              label: 'Multi-channel fallback (WebSocket → HTTP → SMS)',
              description:
                'Several communication channels with automatic switching: WebSocket (primary), HTTP (fallback), SMS (emergency).',
              pros: [
                'Maximum reliability of message delivery',
                'SMS works even without internet',
                'Graceful degradation — each channel is less functional but works',
              ],
              cons: [
                'The cost of SMS under mass usage',
                'Complexity of synchronization between channels',
                'Latency when switching channels',
              ],
              bestWhen: 'Critical notifications (driver assignment, ride completion), regions with weak internet',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: 2, cost: 2 },
            },
          ],
        },
      ],
      tip: 'At Uber, each ride is a server object with a state machine. Even if both clients lose connectivity, the ride continues. Payment: authorize on order, capture after completion.',
    },
  ],

  // ── Reference Solution ────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'rs-ride-types': ['standard', 'premium', 'shared'],
      'rs-geography': ['multi-city'],
      'rs-geo-index': ['h3-grid'],
      'rs-matching-algo': ['batched-matching'],
      'rs-location-update': ['websocket'],
      'rs-location-store': ['redis-kafka'],
      'rs-pricing-model': ['upfront-surge'],
      'rs-eta': ['routing-engine-historical'],
      'rs-data-store': ['cassandra'],
      'rs-event-processing': ['kafka-flink'],
      'rs-payment': ['two-phase-payment'],
      'rs-fault-tolerance': ['server-state-machine'],
    },
    explanation:
      'The reference architecture is based on the approaches of Uber, Lyft, and Yandex Taxi.\n\n' +
      '**The H3 hexagonal grid** is Uber\'s choice for geo-indexing. Unlike geohash, hexagons have equidistant neighbors and the same cell size across the entire planet, which eliminates edge effects when searching for the nearest drivers.\n\n' +
      '**Batched matching** — every 2-5 seconds the system collects all new orders and available drivers in a zone and solves the optimal assignment problem (the Hungarian algorithm). This gives a 10-20% better total ETA compared to the greedy algorithm.\n\n' +
      '**WebSocket** — the standard choice for real-time tracking. A bidirectional channel: the driver sends coordinates, the server pushes assignments. MQTT is an alternative for saving battery.\n\n' +
      '**Redis + Kafka** — Redis stores the current locations (hot path, microsecond access for matching), Kafka — the stream of all events for analytics, surge pricing, and ML models.\n\n' +
      '**Upfront pricing with surge** — the passenger sees the price before confirming the order. The surge multiplier balances supply and demand in real time. It is calculated based on the ratio of orders to available drivers in an H3 cell.\n\n' +
      '**Routing engine + historical data** — OSRM/Valhalla with speed profiles by time of day. More accurate than the Google Maps API and without dependence on an external provider.\n\n' +
      '**Cassandra** — linear scaling for ride history (billions of records). Uber uses MySQL + Schemaless, but Cassandra is a more accessible alternative with similar properties.\n\n' +
      '**Kafka + Flink** — stream processing for surge pricing (counting orders in a window), fraud detection, real-time analytics.\n\n' +
      '**Two-phase payment** — authorize on order (solvency guarantee), capture after the ride (exact amount). Industry standard.\n\n' +
      '**A server-side state machine** — a ride exists as a server object with clear state transitions. Clients are merely representations. Even on a complete loss of connectivity, the ride is not lost.',
    diagram:
      '┌─────────────┐         ┌──────────────────┐         ┌─────────────┐\n' +
      '│  Rider App  │◄──────►│   API Gateway     │◄──────►│ Driver App  │\n' +
      '└──────┬──────┘        └────────┬─────────┘         └──────┬──────┘\n' +
      '       │                        │                          │\n' +
      '       │ HTTP/REST              │                          │ WebSocket\n' +
      '       │                        │                          │\n' +
      '       │         ┌──────────────┼──────────────┐           │\n' +
      '       │         │              │              │           │\n' +
      '       │         ▼              ▼              ▼           │\n' +
      '       │  ┌─────────────┐ ┌──────────┐ ┌──────────┐       │\n' +
      '       │  │  Matching   │ │ Pricing  │ │   ETA    │       │\n' +
      '       │  │  Service    │ │ Service  │ │ Service  │       │\n' +
      '       │  │  (H3 index) │ │ (surge)  │ │(routing) │       │\n' +
      '       │  └──────┬──────┘ └──────────┘ └──────────┘       │\n' +
      '       │         │                                         │\n' +
      '       │         ▼                          ┌──────────────┘\n' +
      '       │  ┌──────────────┐                  │\n' +
      '       │  │Driver Location│◄─────────────────┘\n' +
      '       │  │   (Redis)    │    Location updates\n' +
      '       │  └──────┬───────┘\n' +
      '       │         │\n' +
      '       │         ▼\n' +
      '       │  ┌──────────────┐    ┌──────────────┐\n' +
      '       │  │    Kafka     │───►│    Flink     │\n' +
      '       │  │(event stream)│    │ (analytics,  │\n' +
      '       │  └──────────────┘    │  surge calc) │\n' +
      '       │                      └──────────────┘\n' +
      '       │\n' +
      '       ▼\n' +
      '┌─────────────┐    ┌──────────────┐    ┌──────────────┐\n' +
      '│Ride Service  │───►│   Ride DB    │    │   Payment    │\n' +
      '│(state machine│    │ (Cassandra)  │    │   Service    │\n' +
      '│)             │    └──────────────┘    │(authorize +  │\n' +
      '└─────────────┘                         │  capture)    │\n' +
      '                                        └──────────────┘',
  },

  capacityEstimates: {
    default: [
      {
        label: 'Daily rides',
        value: '15M rides/day',
        formula: 'Major ride-sharing platform scale (Uber reports ~20M rides/day globally)',
      },
      {
        label: 'Concurrent active rides',
        value: '~312K',
        formula: '15M rides/day / 24 hours × avg 0.5 h ride duration = ~312K concurrent rides',
      },
      {
        label: 'Driver location updates/sec',
        value: '500K updates/sec',
        formula: '2M active drivers × 1 update every 4 sec = 500K location updates/sec',
      },
      {
        label: 'Location data storage/day',
        value: '~4.3 TB/day',
        formula: '500K updates/sec × 86 400 sec/day × 100 bytes per update = ~4.3 TB/day',
      },
      {
        label: 'Matching computations/sec',
        value: '~28 match/sec',
        formula: '~100K ride requests/hour at peak / 3 600 sec = ~28 match computations/sec, each scanning ~50 nearby drivers',
      },
      {
        label: 'ETA calculations/sec',
        value: '~280 routing queries/sec',
        formula: 'Each ride request triggers ~10 ETA calculations for candidate drivers = 28 × 10 = ~280 routing queries/sec',
      },
      {
        label: 'Payment transactions/day',
        value: '~$225M daily GMV',
        formula: '15M rides/day × avg $15 per ride = ~$225M daily gross merchandise value',
      },
    ],
  },
};
