import type { Scenario } from '@/data/constructor/types';

export const collaborativeEditorScenario: Scenario = {
  id: 'collaborative-editor',
  title: 'Collaborative Editor (Google Docs)',
  difficulty: 'senior',
  description:
    'Design a real-time collaborative document editor, similar to Google Docs, that supports millions of simultaneously edited documents. The system must provide real-time co-editing, conflict resolution, versioning, and operation under an unstable connection.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'ce-requirements',
      title: 'Editor Requirements',
      description:
        'Define the content types and the collaboration model. These decisions affect the complexity of conflict algorithms and the storage architecture.',
      decisions: [
        {
          id: 'ce-doc-type',
          category: 'Content type',
          question: 'What type of documents should the editor support?',
          multiSelect: true,
          options: [
            {
              id: 'rich-text',
              label: 'Rich text (formatting)',
              description:
                'Text with formatting: bold, italic, headings, lists. The base type for documents.',
              pros: [
                'Covers the main document use case',
                'Well-studied OT/CRDT algorithms for text',
                'Relatively simple data model',
              ],
              cons: [
                'Formatting complicates operations (not just character insert/delete)',
                'Markup normalization is needed during merge',
              ],
              bestWhen: 'The primary scenario is text documents with formatting',
              impact: { latency: 0, scalability: 0, consistency: -1, complexity: 1, cost: 0 },
            },
            {
              id: 'tables',
              label: 'Tables / spreadsheets',
              description:
                'Tables with cells, formulas, and sorting. They require a separate conflict model for a two-dimensional structure.',
              pros: [
                'Extends functionality for business users',
                'A spreadsheet engine can be reused',
              ],
              cons: [
                'Substantially complicates the conflict model (rows, columns, cells)',
                'Formulas create dependencies between cells',
                'Increases operation size and the load on synchronization',
              ],
              bestWhen: 'Users need tables inside documents',
              impact: { latency: -1, scalability: -1, consistency: -1, complexity: -2, cost: -1 },
            },
            {
              id: 'media',
              label: 'Embedded media (images, drawings)',
              description:
                'Embedded images, drawings, and diagrams. Media is stored separately, with the document holding references.',
              pros: [
                'Makes documents more expressive',
                'Media can be stored in object storage (S3) separately from the text',
              ],
              cons: [
                'Increases document size and load time',
                'Requires a separate system for storing binary data',
                'Drawings (canvas) require their own CRDT/OT',
              ],
              bestWhen: 'Documents contain visual content and diagrams',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: -1, cost: -2 },
            },
            {
              id: 'comments',
              label: 'Comments / suggestions',
              description:
                'Comments anchored to fragments of text, and a suggestions mode (proposed edits).',
              pros: [
                'Critically important for teamwork and the review process',
                'Comments are easier to synchronize than the main text',
              ],
              cons: [
                'Anchoring to text positions becomes harder under concurrent edits',
                'Suggestions are essentially a second branch of the document',
                'A notification system is needed',
              ],
              bestWhen: 'The document is used in a review/approval workflow',
              impact: { latency: 0, scalability: 0, consistency: -1, complexity: -1, cost: -1 },
            },
          ],
        },
        {
          id: 'ce-collab-mode',
          category: 'Collaboration mode',
          question: 'What collaboration mode for working on documents?',
          options: [
            {
              id: 'real-time',
              label: 'Real-time co-editing (Google Docs)',
              description:
                "All users see each other's changes in real time. Other users' cursors and selections are displayed instantly.",
              pros: [
                'Best UX — users see each other in real time',
                'Industry standard (Google Docs, Notion, Figma)',
                'Minimizes conflicts through awareness',
              ],
              cons: [
                'Requires a persistent connection (WebSocket)',
                'Complex conflict-resolution algorithms (OT/CRDT)',
                'High server load with a large number of co-authors',
              ],
              bestWhen: 'The primary scenario is real-time team collaboration',
              impact: { latency: 2, scalability: -1, consistency: -1, complexity: -2, cost: -1 },
            },
            {
              id: 'turn-based',
              label: 'Turn-based locking (classic)',
              description:
                'The document or its section is locked while one user edits it. The classic SharePoint/Word approach.',
              pros: [
                'Simple to implement — no conflicts by definition',
                'Guaranteed consistency',
                'Minimal server load',
              ],
              cons: [
                'Poor UX — users wait for the lock to be released',
                'The "forgotten locks" problem (lock timeout)',
                'Does not scale for large teams',
              ],
              bestWhen: 'Documents are edited sequentially, collaboration is minimal',
              impact: { latency: 0, scalability: 1, consistency: 2, complexity: 2, cost: 1 },
            },
            {
              id: 'branching',
              label: 'Branching / merging (Git-like)',
              description:
                'Each user works in their own branch, then changes are merged. The Git/Notion approach for some scenarios.',
              pros: [
                'Full freedom — everyone works independently',
                'Works well for offline scenarios',
                'Complete change history',
              ],
              cons: [
                'Merge conflicts require manual resolution',
                'Complex UX for non-technical users',
                'No real-time awareness (you cannot see what others are doing)',
              ],
              bestWhen: 'Documents with long editing cycles, a technical audience',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
      ],
      tip: 'Google Docs uses real-time co-editing. Notion uses near-real-time with a block model. The choice of mode determines the entire downstream architecture.',
    },

    // ── Step 2: Conflict Resolution ───────────────────────────────────
    {
      id: 'ce-conflicts',
      title: 'Conflict Resolution',
      description:
        'A key architectural decision: how to resolve conflicts during simultaneous editing. OT and CRDT are two fundamentally different approaches.',
      decisions: [
        {
          id: 'ce-algorithm',
          category: 'Conflict algorithm',
          question: 'Which conflict-resolution algorithm should you use?',
          options: [
            {
              id: 'ot',
              label: 'Operational Transformation (OT)',
              description:
                'Each edit is an operation (insert/delete). The server transforms operations relative to one another. Used by Google Docs since 2006.',
              pros: [
                'Proven in production by Google Docs (billions of documents)',
                'Compact operations — low network overhead',
                'Guarantees convergence given a central server',
                'Works well with formatting (rich text OT)',
              ],
              cons: [
                'Requires a central server for coordination (single point)',
                'Complex transformation math, hard to implement correctly',
                'Does not work in P2P mode without additional protocols',
                'Operation order is critical — the server must serialize all edits',
              ],
              bestWhen: 'Server-based architecture, you need a proven technology for rich text',
              impact: { latency: 1, scalability: -1, consistency: 2, complexity: -2, cost: 0 },
              capacityImpact: [
                {
                  label: 'Operation log storage/day',
                  value: '~43 TB/day',
                  formula: '10M ops/sec × 86 400 sec × 50 bytes per OT op = ~43.2 TB/day (compact operations)',
                },
                {
                  label: 'Bandwidth',
                  value: '~1 GB/s',
                  formula: '10M ops/sec × 50 bytes × 2 (broadcast) = ~1 GB/s',
                },
              ],
            },
            {
              id: 'crdt',
              label: 'CRDT (Conflict-free Replicated Data Types)',
              description:
                'A data structure that guarantees convergence without a central server. Used by Figma, Yjs, Automerge.',
              pros: [
                'Works in P2P mode — no central server needed',
                'Native support for offline editing',
                'Mathematically proven convergence',
                'Excellent open-source libraries (Yjs, Automerge)',
              ],
              cons: [
                'Greater metadata overhead (vector clocks, tombstones)',
                'The document grows over time — garbage collection is needed',
                'Harder to implement undo/redo correctly',
                'Character order can be unintuitive under conflicts',
              ],
              bestWhen: 'You need offline-first, P2P, or you are using Yjs/Automerge',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -2, cost: 1 },
              capacityImpact: [
                {
                  label: 'Operation log storage/day',
                  value: '~172 TB/day',
                  formula: '10M ops/sec × 86 400 sec × 200 bytes per CRDT op (vector clocks + tombstones) = ~172.8 TB/day (4× OT)',
                },
                {
                  label: 'Bandwidth',
                  value: '~4 GB/s',
                  formula: '10M ops/sec × 200 bytes × 2 (broadcast) = ~4 GB/s',
                },
                {
                  label: 'Document storage',
                  value: '~25 TB',
                  formula: '50M docs × avg 500 KB (CRDT metadata: tombstones, vector clocks inflate doc 5×) = ~25 TB',
                },
              ],
            },
            {
              id: 'lww',
              label: 'Last-write-wins (LWW)',
              description:
                'The last write wins. The simplest approach — the winner is determined by timestamp.',
              pros: [
                'Trivial to implement',
                'Does not require complex algorithms',
                'Minimal network and storage overhead',
              ],
              cons: [
                "Loses data — one user's edits are simply overwritten",
                'Unpredictable result under concurrent edits',
                'Not suitable for genuine collaborative editing',
                'Depends on clock synchronization between clients',
              ],
              bestWhen: 'Simple forms or configurations where conflicts are rare',
              impact: { latency: 2, scalability: 2, consistency: -2, complexity: 2, cost: 2 },
            },
            {
              id: 'manual',
              label: 'Manual conflict resolution',
              description:
                'On a conflict, both versions are shown to the user for manual resolution (like Git merge conflicts).',
              pros: [
                'The user controls the result — no data loss',
                'Simple server-side implementation',
                'Suitable for complex structural conflicts',
              ],
              cons: [
                'Terrible UX — interrupts work to resolve conflicts',
                'Does not scale with frequent edits',
                'Requires understanding from the user (diff/merge)',
                'Does not work in a real-time scenario',
              ],
              bestWhen: 'Rare conflicts, a technical audience (Git-like workflow)',
              impact: { latency: -1, scalability: 0, consistency: 1, complexity: 1, cost: 1 },
            },
          ],
        },
        {
          id: 'ce-granularity',
          category: 'Operation granularity',
          question: 'At what level of granularity do operations work?',
          options: [
            {
              id: 'character-level',
              label: 'Character-level',
              description:
                'Each character is a separate insert/delete operation. Maximum precision, used in Google Docs.',
              pros: [
                'Maximum precision — characters are never lost',
                'Smooth rendering of other users typing',
                'Minimal conflicts (two people rarely edit the same character)',
              ],
              cons: [
                'A large number of operations (each letter = an operation)',
                'High network load during fast typing',
                'Optimization is needed: batching, operation compression',
              ],
              bestWhen: 'Real-time editing of rich text documents',
              impact: { latency: -1, scalability: -1, consistency: 2, complexity: -1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Operations per second',
                  value: '50M ops/sec',
                  formula: '5M active docs × avg 5 keystrokes/sec per active user × 2 users/doc = 50M ops/sec (5× base)',
                },
                {
                  label: 'Operation log storage/day',
                  value: '~216 TB/day',
                  formula: '50M ops/sec × 86 400 sec × 50 bytes = ~216 TB/day',
                },
                {
                  label: 'Bandwidth',
                  value: '~5 GB/s',
                  formula: '50M ops/sec × 50 bytes × 2 (broadcast) = ~5 GB/s',
                },
              ],
            },
            {
              id: 'word-level',
              label: 'Word-level',
              description:
                'Operations at the word level. A balance between precision and number of operations.',
              pros: [
                'Fewer operations than character-level',
                'Sufficient precision for most scenarios',
                'Easier to implement diff/merge',
              ],
              cons: [
                'Less smooth rendering (text appears word by word)',
                'Conflicts when the same word is edited simultaneously',
                'Requires a clear definition of word boundaries (spaces, punctuation)',
              ],
              bestWhen: 'Editing with moderate concurrency',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'block-level',
              label: 'Block-level (paragraphs)',
              description:
                'Operations at the level of paragraphs or blocks. The Notion approach — each block is edited independently.',
              pros: [
                'Minimal number of operations',
                'Maps well onto block editors (Notion, Confluence)',
                'Simple conflict model',
              ],
              cons: [
                'Two users cannot edit the same paragraph simultaneously',
                'Data loss under concurrent edits of the same block',
                "Less granular rendering of others' edits",
              ],
              bestWhen: 'Block editors like Notion, where each block is an independent unit',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 1, cost: 1 },
              capacityImpact: [
                {
                  label: 'Operations per second',
                  value: '1M ops/sec',
                  formula: '5M active docs × avg 0.1 block ops/sec per user × 2 users/doc = 1M ops/sec (10× fewer than character-level)',
                },
                {
                  label: 'Operation log storage/day',
                  value: '~17 TB/day',
                  formula: '1M ops/sec × 86 400 sec × 200 bytes per block op (includes block content) = ~17.3 TB/day',
                },
                {
                  label: 'Bandwidth',
                  value: '~400 MB/s',
                  formula: '1M ops/sec × 200 bytes × 2 (broadcast) = ~400 MB/s',
                },
              ],
            },
          ],
        },
      ],
      tip: 'This is the key decision of the whole project. Google Docs uses OT at the character level. Figma uses CRDT. Notion uses a block-based approach. OT requires a central server, CRDT allows P2P. If you are not writing your own library — consider Yjs (CRDT).',
    },

    // ── Step 3: Real-time Communication ───────────────────────────────
    {
      id: 'ce-realtime',
      title: 'Real-time Communication',
      description:
        'Choose the transport and synchronization model for delivering operations between clients. This determines latency, scalability, and the server architecture.',
      decisions: [
        {
          id: 'ce-transport',
          category: 'Transport',
          question: 'Which transport for real-time synchronization?',
          options: [
            {
              id: 'websocket',
              label: 'WebSocket',
              description:
                'A full-duplex connection over TCP. The standard for real-time applications: Google Docs, Slack, Figma.',
              pros: [
                'Low latency — full-duplex, no HTTP overhead',
                'Supported by all browsers and platforms',
                'Good ecosystem (Socket.IO, ws, uWebSockets)',
                'Support for binary frames for compact operations',
              ],
              cons: [
                'Stateful connections — complicates load balancing',
                'Requires handling reconnect, heartbeat, backpressure',
                'Sticky sessions or Redis pub/sub for horizontal scaling',
              ],
              bestWhen: 'Server-based architecture with real-time co-editing',
              impact: { latency: 2, scalability: -1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'webrtc',
              label: 'WebRTC (peer-to-peer)',
              description:
                'A direct P2P connection between browsers. Used in some CRDT implementations (Yjs WebRTC provider).',
              pros: [
                'Minimal latency (no intermediate server)',
                'Reduces server load',
                'Works without a backend (with a signaling server for the initial connection)',
              ],
              cons: [
                'NAT traversal — a P2P connection cannot always be established',
                'Does not scale to many participants (mesh topology)',
                'No central point for persistence and authorization',
                'Complex debugging of network problems',
              ],
              bestWhen: 'A CRDT-based editor with few participants, P2P-first',
              impact: { latency: 2, scalability: -2, consistency: -1, complexity: -2, cost: 2 },
            },
            {
              id: 'sse-rest',
              label: 'Server-Sent Events + REST',
              description:
                'SSE for push updates from the server, REST for sending operations. A unidirectional stream + requests.',
              pros: [
                'Simple to implement — HTTP-based, works through a CDN/proxy',
                'Automatic reconnect in SSE',
                'Compatible with existing HTTP infrastructure',
              ],
              cons: [
                'Half-duplex — each client operation = an HTTP request',
                'Higher latency due to HTTP overhead on sending',
                'A limit on the number of SSE connections in the browser (6 per domain)',
                'Not suitable for high-frequency operations (fast typing)',
              ],
              bestWhen: 'A simple editor with a moderate edit rate, no WebSocket infrastructure',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'grpc-streaming',
              label: 'gRPC streaming',
              description:
                'Bidirectional streaming over gRPC (HTTP/2). Suitable for server-to-server communication.',
              pros: [
                'Efficient serialization (Protobuf)',
                'Full-duplex streaming',
                'Strict contract typing',
                'Multiplexing over HTTP/2',
              ],
              cons: [
                'Limited browser support (a gRPC-Web proxy is needed)',
                'More complex infrastructure',
                'A less mature ecosystem for real-time in the browser',
                'An Envoy/grpc-web proxy adds a point of failure',
              ],
              bestWhen: 'Internal services, mobile clients with gRPC, server-to-server sync',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: -1, cost: -1 },
            },
          ],
        },
        {
          id: 'ce-sync-model',
          category: 'Synchronization model',
          question: 'Which synchronization model between clients?',
          options: [
            {
              id: 'client-server',
              label: 'Client-server (all operations through the server)',
              description:
                'All operations are sent to the server, which transforms/merges them and broadcasts the result. The Google Docs approach.',
              pros: [
                'The server is the single source of truth (consistency)',
                'Easy to implement authorization and auditing',
                'Easier to debug — all operations pass through one point',
                'Guaranteed persistence',
              ],
              cons: [
                'The server is a bottleneck and a single point of failure',
                'Latency is at minimum one RTT to the server',
                'You need to scale the server infrastructure',
              ],
              bestWhen: 'An OT-based editor, you need strict authorization and auditing',
              impact: { latency: 0, scalability: -1, consistency: 2, complexity: 0, cost: -1 },
            },
            {
              id: 'peer-to-peer',
              label: 'Peer-to-peer (direct synchronization)',
              description:
                'Clients synchronize directly, without a central server. Requires CRDT.',
              pros: [
                'Minimal latency (no server in the chain)',
                'No server costs for synchronization',
                'Works offline and on a local network',
              ],
              cons: [
                'No central persistence — data lives on the clients',
                'Complex authorization (no point of control)',
                'Scaling: a mesh of N clients = O(N^2) connections',
                'Data loss if all clients are offline simultaneously',
              ],
              bestWhen: 'Local tools, offline-first, small teams',
              impact: { latency: 2, scalability: -2, consistency: -1, complexity: -1, cost: 2 },
            },
            {
              id: 'hybrid',
              label: 'Hybrid (P2P + server for persistence)',
              description:
                'Clients synchronize P2P within a session, the server is responsible for persistence and long-term storage.',
              pros: [
                'Low latency within the session (P2P)',
                'Data is not lost (server for persistence)',
                'Works when the server is down (P2P continues)',
              ],
              cons: [
                'Double the complexity: both P2P and server synchronization',
                'You need to resolve conflicts on reconnect to the server',
                'Testing becomes significantly harder',
                'Two synchronization channels need to be coordinated',
              ],
              bestWhen: 'A CRDT editor, you need both low latency and persistence',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: -2, cost: 0 },
            },
          ],
        },
      ],
      tip: 'WebSocket + client-server is the standard, proven approach (Google Docs). WebRTC + P2P is good for CRDT, but complicates authorization and persistence. Yjs supports both options via providers.',
    },

    // ── Step 4: Storage & Persistence ─────────────────────────────────
    {
      id: 'ce-storage',
      title: 'Storage and Persistence',
      description:
        'How to store documents and their history. A balance between load speed, storage volume, and history completeness.',
      decisions: [
        {
          id: 'ce-doc-storage',
          category: 'Document storage',
          question: 'How should documents be stored?',
          options: [
            {
              id: 'full-snapshots',
              label: 'Full document snapshots (periodic)',
              description:
                'The document is saved in full on every change or periodically. A simple approach.',
              pros: [
                'Simple to implement — just save JSON/HTML',
                'Fast load — read the latest snapshot',
                'Easy to make backups',
              ],
              cons: [
                'Enormous storage volume (each version = a full copy)',
                'No granular change history',
                'Data loss between snapshots on failure',
                'Conflicts when a snapshot is written simultaneously',
              ],
              bestWhen: 'A simple editor without real-time, infrequent edits',
              impact: { latency: 1, scalability: -1, consistency: 0, complexity: 2, cost: -2 },
            },
            {
              id: 'oplog',
              label: 'Operation log (append-only)',
              description:
                'Only the operation log is stored. The document is reconstructed by replaying all operations from the beginning.',
              pros: [
                'Complete history: every edit is recorded',
                'Append-only — fast writes, no conflicts',
                'The document can be restored to any point in time',
                'A natural format for OT/CRDT operations',
              ],
              cons: [
                'Slow load — replay of all operations from the beginning',
                'The log grows indefinitely without compaction',
                'Restoring a long document can take seconds',
              ],
              bestWhen: 'You need complete history, a slow first load is acceptable',
              impact: { latency: -1, scalability: 0, consistency: 2, complexity: -1, cost: -1 },
            },
            {
              id: 'snapshot-plus-oplog',
              label: 'Snapshot + operation log (hybrid)',
              description:
                'Periodic snapshots + an operation log between them. On load: the latest snapshot + replay of recent operations. The Google Docs approach.',
              pros: [
                'Fast load (snapshot + a small oplog)',
                'Complete history (from the oplog)',
                'Bounded restore time',
                'Compaction by creating a new snapshot',
              ],
              cons: [
                'Harder to implement — two storage mechanisms',
                'A snapshot strategy is needed (by time, by number of operations)',
                'The snapshot and oplog must be kept consistent',
              ],
              bestWhen: 'A production system: a balance between speed and history completeness',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: -1 },
            },
            {
              id: 'crdt-state',
              label: 'CRDT state serialization',
              description:
                'Serialization of the full CRDT state (including metadata: vector clocks, tombstones). The Yjs/Automerge format.',
              pros: [
                'A native format for CRDT — load/save without conversion',
                'Includes all the metainformation for merge',
                'Supported out of the box in Yjs/Automerge',
              ],
              cons: [
                'Size: CRDT metadata can be larger than the document itself',
                'Coupling to a specific CRDT library',
                'Garbage collection for tombstones is needed',
                'Hard to migrate to another CRDT implementation',
              ],
              bestWhen: 'Yjs/Automerge is used, you need native merge support',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: -1 },
            },
          ],
        },
        {
          id: 'ce-versioning',
          category: 'Versioning',
          question: 'Which document versioning system?',
          options: [
            {
              id: 'no-versioning',
              label: 'No versioning (only the latest version)',
              description:
                'Only the current version of the document is stored. No change history.',
              pros: [
                'Minimal storage volume',
                'Simple to implement',
                'Fast read/write operations',
              ],
              cons: [
                'Impossible to roll back changes',
                'No audit — who changed what',
                'Data loss from erroneous edits is irreversible',
              ],
              bestWhen: 'Simple notes, drafts, where versioning is not needed',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 2, cost: 2 },
            },
            {
              id: 'auto-version-history',
              label: 'Automatic version history (Google Docs)',
              description:
                'The system automatically saves versions at a defined interval. The user can view and restore past versions.',
              pros: [
                'Transparent for the user — no need to think about saving',
                'Audit: you can see who, when, and what changed',
                'Ability to restore to any point in time',
                'Industry standard (Google Docs, Notion)',
              ],
              cons: [
                'Storage volume grows over time',
                'A retention policy is needed (how long to keep old versions)',
                'The UI for viewing history requires diff visualization',
              ],
              bestWhen: 'Production documents, you need auditing and rollback ability',
              impact: { latency: 0, scalability: -1, consistency: 1, complexity: -1, cost: -1 },
            },
            {
              id: 'named-versions',
              label: 'Named versions / checkpoints',
              description:
                'The user manually creates named versions (checkpoints). Like "Save As" in classic editors.',
              pros: [
                'The user controls which versions are important',
                'Fewer versions — less storage',
                'Clear navigation by named points',
              ],
              cons: [
                'No automatic history between checkpoints',
                'The user may forget to create a checkpoint',
                'Less familiar in the era of auto-save',
              ],
              bestWhen: 'Documents with clear milestones (releases, reviews)',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'git-like-branching',
              label: 'Git-like branching (full branching)',
              description:
                'A full branching and merging system, like in Git. Each user can create a branch.',
              pros: [
                'Maximum flexibility — parallel versions',
                'A familiar model for developers',
                'Support for complex workflows (review, approval)',
              ],
              cons: [
                'Very complex to implement for rich-text documents',
                'Merge conflicts require a UI for resolution',
                'Confusing for non-technical users',
                'Significant storage overhead',
              ],
              bestWhen: 'Technical documentation, legal documents with parallel edits',
              impact: { latency: 0, scalability: -1, consistency: 1, complexity: -2, cost: -2 },
            },
          ],
        },
      ],
      tip: 'Google Docs uses snapshot + operation log with automatic version history. Snapshots are created when an operation threshold is reached (usually several hundred). This gives both fast load and complete history.',
    },

    // ── Step 5: Scaling ───────────────────────────────────────────────
    {
      id: 'ce-scaling',
      title: 'Scaling',
      description:
        'How to scale the system to millions of documents and thousands of concurrent sessions. Managing stateful WebSocket connections is the key problem.',
      decisions: [
        {
          id: 'ce-session-mgmt',
          category: 'Session management',
          question: 'How should editing sessions be managed?',
          options: [
            {
              id: 'sticky-sessions',
              label: 'Sticky sessions (one server per document)',
              description:
                'All users editing one document connect to a single server. The server holds the OT/CRDT state in memory.',
              pros: [
                'All operations for a document on one server — fast transformations',
                'No distributed coordination needed for OT',
                'Simple model: one server = one source of truth for the document',
                'Low latency — no round-trip between servers',
              ],
              cons: [
                'Hot-spot: a popular document overloads a single server',
                'On server failure all sessions are lost (failover is needed)',
                'Consistent hashing is needed for routing',
                'Harder horizontal scaling',
              ],
              bestWhen: 'OT architecture, server-side state is mandatory',
              impact: { latency: 1, scalability: -1, consistency: 2, complexity: 0, cost: 0 },
            },
            {
              id: 'session-service',
              label: 'Session service with coordination',
              description:
                'A separate service manages sessions. Document state is stored in distributed storage (Redis). Any server can serve any document.',
              pros: [
                'Horizontal scaling — no binding to a server',
                'Failover: on server failure the client switches to another',
                'Even load distribution',
              ],
              cons: [
                'Latency: each operation = a round-trip to Redis/storage',
                'Distributed coordination — risk of split-brain',
                'Harder to guarantee operation order for OT',
                'Higher infrastructure cost (Redis cluster)',
              ],
              bestWhen: 'You need high availability and horizontal scaling',
              impact: { latency: -1, scalability: 2, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'serverless',
              label: 'Serverless (each operation is a function)',
              description:
                'Each operation is processed by an independent serverless function. Document state lives in a database.',
              pros: [
                'Automatic scaling to zero and back',
                'Pay only for actual operations',
                'No server management',
              ],
              cons: [
                'Cold start — unpredictable latency (tens to hundreds of ms)',
                'No long-lived connections (WebSocket requires a gateway)',
                'Stateless — no server-side OT state in memory',
                'Not suitable for real-time co-editing with OT',
              ],
              bestWhen: 'CRDT architecture, low traffic, cost-sensitive',
              impact: { latency: -2, scalability: 2, consistency: -1, complexity: 1, cost: 2 },
            },
          ],
        },
        {
          id: 'ce-large-docs',
          category: 'Large documents',
          question: 'How should large documents be handled?',
          options: [
            {
              id: 'full-load',
              label: 'Full document load',
              description:
                'The entire document is loaded into client memory on open. Simple, but does not scale.',
              pros: [
                'Simple to implement — one fetch, the whole document',
                'Instant scrolling and search (everything in memory)',
                'No complications with partial loading',
              ],
              cons: [
                'Slow initial load for large documents',
                'High memory consumption on the client',
                'Does not work for documents of hundreds of pages',
              ],
              bestWhen: 'Small documents (up to 10-20 pages)',
              impact: { latency: -1, scalability: -2, consistency: 1, complexity: 2, cost: 0 },
            },
            {
              id: 'lazy-loading',
              label: 'Lazy loading (viewport-based)',
              description:
                'Only the visible part of the document + a buffer is loaded. The rest loads on scroll. The Google Docs approach.',
              pros: [
                'Fast initial load — only the visible area',
                'Works with documents of any size',
                'Memory savings on the client',
              ],
              cons: [
                'Complex implementation: viewport tracking, prefetch',
                'Latency on fast scroll (loading)',
                'Search within the document requires a server-side index',
                'OT/CRDT operations need to be applied to unloaded parts too',
              ],
              bestWhen: 'A production system, documents of varying size',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'chunking',
              label: 'Document chunking / pagination',
              description:
                'The document is split into fixed chunks (by pages). Each chunk is an independent unit.',
              pros: [
                'Predictable load size (fixed chunks)',
                'Chunks can be cached independently',
                'Parallel loading of chunks',
              ],
              cons: [
                'Elements on chunk boundaries (tables, images)',
                'Less smooth UX than lazy loading',
                'Page numbering may not align with chunks',
              ],
              bestWhen: 'Structured documents with clear boundaries (pages)',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'virtualized',
              label: 'Virtualized rendering (VS Code-style)',
              description:
                'The entire document is in memory, but only the visible elements are rendered. The VS Code approach, used in Google Docs for long documents.',
              pros: [
                'Smooth scrolling — the DOM contains only visible elements',
                'Fast search — the whole document is in memory',
                'No lag on scroll (data is already loaded)',
              ],
              cons: [
                'Full document load — slow start',
                'High memory consumption (data in memory, but not in the DOM)',
                'Complex virtualization implementation for rich text',
                'Does not solve the initial load problem',
              ],
              bestWhen: 'Medium-length documents, you need fast scrolling and search',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
      ],
      tip: 'Google Docs uses sticky sessions for OT (one server coordinates all of a document\'s operations) and lazy loading + virtualized rendering for large documents. With a CRDT architecture, sticky sessions are less critical.',
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'ce-reliability',
      title: 'Reliability and Access Rights',
      description:
        'Ensuring operation under failures, offline support, and the access-control model. Critical for enterprise use.',
      decisions: [
        {
          id: 'ce-offline',
          category: 'Offline support',
          question: 'What level of offline editing support?',
          options: [
            {
              id: 'online-only',
              label: 'Online only (no offline)',
              description:
                'Editing only when there is a connection. On loss — the UI is blocked.',
              pros: [
                'Simple to implement — no synchronization problems',
                'The server always has the current state',
                'No conflicts on reconnect',
              ],
              cons: [
                'Poor UX with an unstable internet connection',
                'Loss of typed text when the connection drops',
                'Does not work on trips, planes, or the subway',
              ],
              bestWhen: 'An internal office tool with a stable internet connection',
              impact: { latency: 0, scalability: 1, consistency: 2, complexity: 2, cost: 1 },
            },
            {
              id: 'local-cache-sync',
              label: 'Local cache + sync on reconnect',
              description:
                'Operations are cached locally (IndexedDB/Service Worker) and synchronized when the connection is restored. The Google Docs Offline approach.',
              pros: [
                'The user keeps working through brief disconnects',
                'No data loss when the connection drops',
                'Automatic synchronization on reconnect',
                'A Service Worker caches the app for a fast start',
              ],
              cons: [
                'Conflicts are possible on reconnect (a merge is needed)',
                'Limited offline time (cache size)',
                'An offline-status indicator is needed for the user',
                'Testing offline scenarios is hard',
              ],
              bestWhen: 'A production system: covering brief failures, mobile users',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'full-offline-crdt',
              label: 'Full offline with CRDT merge',
              description:
                'Full-fledged offline editing. CRDT guarantees conflict-free merge regardless of offline duration.',
              pros: [
                'Full work without internet (days, weeks)',
                'Automatic conflict-free merge (a property of CRDT)',
                'Excellent UX — the user is unaware of online/offline',
              ],
              cons: [
                'Requires CRDT — does not work with an OT architecture',
                'The merge result can be unintuitive after a long offline period',
                'A large volume of data to synchronize after a long offline period',
                'An access-rights strategy is needed (what if rights changed while offline)',
              ],
              bestWhen: 'A CRDT architecture, users are often offline (mobile, field workers)',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: -2, cost: 0 },
              capacityImpact: [
                {
                  label: 'Document storage',
                  value: '~50 TB',
                  formula: '50M docs × avg 1 MB (full CRDT state with offline branches and tombstones, 10× base) = ~50 TB',
                },
                {
                  label: 'Snapshot storage',
                  value: '~600 TB',
                  formula: '50M docs × 24 snapshots × 500 KB (CRDT snapshots 5× larger) = ~600 TB',
                },
              ],
            },
            {
              id: 'offline-conflict-markers',
              label: 'Offline with conflict markers',
              description:
                'Working offline, but on reconnect conflicts are shown to the user for manual resolution (like Git conflict markers).',
              pros: [
                'The user controls the merge result',
                "No user's data is lost",
                'Works with any architecture (not only CRDT)',
              ],
              cons: [
                'Interrupts work to resolve conflicts',
                'Poor UX for non-technical users',
                'Complex UI for rich-text diff/merge',
                'There can be many conflicts after a long offline period',
              ],
              bestWhen: 'Critically important documents where automatic merge is unacceptable',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'ce-permissions',
          category: 'Access rights',
          question: 'Which document access-rights model?',
          options: [
            {
              id: 'simple',
              label: 'Simple (owner / editor / viewer)',
              description:
                'Three roles: owner (full control), editor (edits), viewer (read-only). The base model.',
              pros: [
                'Simple and clear for users',
                'Easy to implement and verify',
                'Sufficient for most scenarios',
              ],
              cons: [
                'No granularity — you cannot restrict access to a section',
                'No custom roles (commenter, suggester)',
                'Identical rights across the whole document',
              ],
              bestWhen: 'Simple documents with a small team',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'role-based',
              label: 'Role-based (custom roles)',
              description:
                "Configurable roles with an arbitrary set of permissions. An administrator creates roles to fit the organization's needs.",
              pros: [
                'Flexibility — roles for specific workflows',
                'A standard RBAC approach, familiar to administrators',
                'Scales to large organizations',
              ],
              cons: [
                'Harder to manage — an admin interface is needed',
                'Roles can proliferate and become unmanageable',
                'Overhead of rights checks on every operation',
              ],
              bestWhen: 'Enterprise with custom workflows and an organizational structure',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'fine-grained',
              label: 'Fine-grained (per-section / per-element)',
              description:
                'Rights at the level of sections, paragraphs, or individual document elements. Maximum granularity.',
              pros: [
                'Maximum control — different parts of the document for different people',
                'Suitable for confidential documents',
                'You can hide sensitive sections',
              ],
              cons: [
                'Very complex to implement — a rights check on every operation',
                'Binding rights to positions in the document (positions change)',
                'Complex UX — how to show the user what is and is not allowed',
                'High load on authorization checks',
              ],
              bestWhen: 'Legal documents, confidential sections',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: -2, cost: -1 },
            },
            {
              id: 'capability-based',
              label: 'Capability-based (share links)',
              description:
                'Access via links with embedded rights. Anyone with the link gets the specified access. The Google Docs share-link approach.',
              pros: [
                'Simple sharing — just send a link',
                'No registration needed to view/edit',
                'Flexibility: links with different rights (view/edit/comment)',
              ],
              cons: [
                'Security: a link can be forwarded to third parties',
                'Hard to revoke access (you need to change the link)',
                'No audit: who exactly is editing is unknown',
                'Not suitable for enterprise with strict requirements',
              ],
              bestWhen: 'Public or semi-public use, fast sharing',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 0, cost: 0 },
            },
          ],
        },
      ],
      tip: 'Google Docs combines simple roles (owner/editor/viewer/commenter) with capability-based share links. This covers both enterprise and casual use cases. Offline is implemented via Service Worker + local cache.',
    },
  ],

  // ── Reference Solution ────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'ce-doc-type': ['rich-text', 'tables', 'media', 'comments'],
      'ce-collab-mode': ['real-time'],
      'ce-algorithm': ['ot'],
      'ce-granularity': ['character-level'],
      'ce-transport': ['websocket'],
      'ce-sync-model': ['client-server'],
      'ce-doc-storage': ['snapshot-plus-oplog'],
      'ce-versioning': ['auto-version-history'],
      'ce-session-mgmt': ['sticky-sessions'],
      'ce-large-docs': ['lazy-loading'],
      'ce-offline': ['local-cache-sync'],
      'ce-permissions': ['simple', 'capability-based'],
    },
    explanation:
      'The reference solution mirrors the architecture of Google Docs — the most scalable collaborative editor in the world.\n\n' +
      '**Why OT and not CRDT?** Google Docs has used Operational Transformation since 2006. ' +
      'OT requires a central server, but that matches the client-server architecture you need for authorization, ' +
      'persistence, and auditing. The server serializes all operations, guaranteeing strict order and convergence. ' +
      'CRDT (Yjs, Automerge) is an excellent alternative for P2P and offline-first scenarios (Figma uses CRDT), ' +
      'but for a server-mediated architecture OT is simpler and more compact.\n\n' +
      '**Why WebSocket + client-server?** WebSocket provides full-duplex with minimal latency. ' +
      'The client-server model gives a single source of truth: the server accepts an operation, transforms it relative to ' +
      'concurrent ones, saves it to the operation log, and broadcasts it to the other clients. Latency is ~ 1 RTT.\n\n' +
      '**Why snapshot + oplog?** The operation log provides complete history and append-only writes (fast, reliable). ' +
      'Periodic snapshots (every ~500 operations) provide fast load: we load the latest snapshot, ' +
      'replay the recent operations. The same is used for version history.\n\n' +
      '**Sticky sessions** are a necessity for OT: all of a document\'s operations are processed by one server, ' +
      'which holds the OT state in memory. Consistent hashing by document ID routes clients. ' +
      'On server failure — failover to another, restore from snapshot + oplog.\n\n' +
      '**Lazy loading** solves the large-document problem: we load the visible part + a buffer, ' +
      'and load the rest on scroll. Combined with virtualized rendering — a smooth UX even for documents of hundreds of pages.\n\n' +
      '**Local cache + sync** covers brief connection drops. A Service Worker caches the app, ' +
      'IndexedDB holds pending operations. On reconnect, operations are sent to the server and transformed by the standard OT mechanism.\n\n' +
      '**Simple + capability permissions** — a combination that works for everyone: owner/editor/viewer/commenter for ' +
      'direct sharing, capability links for quick access without registration.',

    diagram:
      '┌─────────────────────────────────────────────────────────────────────┐\n' +
      '│                        COLLABORATIVE EDITOR                        │\n' +
      '├─────────────────────────────────────────────────────────────────────┤\n' +
      '│                                                                     │\n' +
      '│  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │\n' +
      '│  │ Client A │  │ Client B │  │ Client C │  (browsers)              │\n' +
      '│  │ Local OT │  │ Local OT │  │ Local OT │                          │\n' +
      '│  │ + Cache  │  │ + Cache  │  │ + Cache  │                          │\n' +
      '│  └────┬─────┘  └────┬─────┘  └────┬─────┘                          │\n' +
      '│       │ WS          │ WS          │ WS                             │\n' +
      '│       └─────────────┼─────────────┘                                │\n' +
      '│                     ▼                                               │\n' +
      '│  ┌──────────────────────────────────────┐                          │\n' +
      '│  │      Load Balancer (consistent       │                          │\n' +
      '│  │      hashing by document ID)         │                          │\n' +
      '│  └──────────────────┬───────────────────┘                          │\n' +
      '│                     │ sticky session                               │\n' +
      '│                     ▼                                               │\n' +
      '│  ┌──────────────────────────────────────┐                          │\n' +
      '│  │     Collaboration Server              │                          │\n' +
      '│  │  ┌─────────────────────────────────┐  │                          │\n' +
      '│  │  │  OT Engine (transform + apply)  │  │                          │\n' +
      '│  │  │  In-memory document state        │  │                          │\n' +
      '│  │  │  Connected clients registry      │  │                          │\n' +
      '│  │  └─────────────────────────────────┘  │                          │\n' +
      '│  └───────┬──────────┬───────────┬────────┘                          │\n' +
      '│          │          │           │                                    │\n' +
      '│          ▼          ▼           ▼                                    │\n' +
      '│  ┌────────────┐ ┌────────┐ ┌──────────────┐                        │\n' +
      '│  │ Operation  │ │Snapshot│ │  Permission   │                        │\n' +
      '│  │    Log     │ │ Store  │ │   Service     │                        │\n' +
      '│  │ (append-   │ │(~500   │ │ (owner/editor │                        │\n' +
      '│  │  only DB)  │ │ ops →  │ │  /viewer +    │                        │\n' +
      '│  │            │ │snapshot│ │  share links) │                        │\n' +
      '│  └────────────┘ └───┬────┘ └──────────────┘                        │\n' +
      '│                     │                                               │\n' +
      '│                     ▼                                               │\n' +
      '│           ┌──────────────────┐                                      │\n' +
      '│           │ Document Storage  │                                      │\n' +
      '│           │ + Version History │                                      │\n' +
      '│           │   (PostgreSQL /   │                                      │\n' +
      '│           │    S3 for media)  │                                      │\n' +
      '│           └──────────────────┘                                      │\n' +
      '│                                                                     │\n' +
      '│  Operation flow:                                                    │\n' +
      '│  Client A types → WS → Collab Server → OT transform →             │\n' +
      '│  → append to OpLog → broadcast to B, C → periodic snapshot          │\n' +
      '│                                                                     │\n' +
      '└─────────────────────────────────────────────────────────────────────┘',
  },

  capacityEstimates: {
    default: [
      {
        label: 'Concurrent open documents',
        value: '5M documents',
        formula: '50M DAU × 10% actively editing at any moment = 5M concurrent documents',
      },
      {
        label: 'Operations per second',
        value: '10M ops/sec',
        formula: '5M active docs × avg 2 ops/sec per document = 10M ops/sec',
      },
      {
        label: 'WebSocket connections',
        value: '10M connections',
        formula: '5M active docs × avg 2 collaborators per doc = 10M WebSocket connections',
      },
      {
        label: 'Operation log storage/day',
        value: '~43 TB/day',
        formula: '10M ops/sec × 86 400 sec/day × 50 bytes per op = ~43.2 TB/day',
      },
      {
        label: 'Document storage',
        value: '~5 TB',
        formula: '50M total documents × avg 100 KB per document = ~5 TB',
      },
      {
        label: 'Snapshot storage',
        value: '~120 TB',
        formula: '50M docs × 24 hourly snapshots × 100 KB = ~120 TB',
      },
      {
        label: 'Bandwidth',
        value: '~1 GB/s',
        formula: '10M ops/sec × 50 bytes × 2 (broadcast to collaborators) = ~1 GB/s',
      },
    ],
  },
};
