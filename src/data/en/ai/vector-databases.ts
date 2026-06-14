import type { Question } from '@/data/types';

export const vectorDatabasesQuestions: Question[] = [
  {
    id: 'ai-vector-databases-001',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Vector Databases',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is a vector database?',
    options: [
      'A database that stores data as tables and columns',
      'A specialized store for numerical vectors (embeddings) with fast nearest-neighbor search',
      'A graph database for storing relationships between objects',
      'A distributed file system for storing ML models',
    ],
    correctIndex: 1,
    explanation:
      'A vector database stores high-dimensional vectors (embeddings) and provides efficient similarity search — finding the k nearest vectors to a given one (k-NN). It is a key component of RAG, recommendation systems, and image search. Examples: Pinecone (managed), Weaviate (open-source), Qdrant (open-source), Chroma (lightweight), Milvus (enterprise). Vector search is also available in classic databases: pgvector (PostgreSQL), Elasticsearch, Redis.',
  },
  {
    id: 'ai-vector-databases-002',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Vector Databases',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Which distance metric is most commonly used for comparing text embeddings?',
    options: [
      'Euclidean distance (L2)',
      'Cosine similarity',
      'Manhattan distance (L1)',
      'Hamming distance',
    ],
    correctIndex: 1,
    explanation:
      'Cosine similarity = cos(θ) = (A·B) / (|A|·|B|). It measures the angle between vectors, ignoring their magnitude. The value ranges from -1 to 1, where 1 means identical direction. For normalized vectors, cosine similarity is equivalent to the dot product. Why for text: embedding models usually normalize vectors, and semantic closeness is better captured by the angle than by distance. Euclidean distance is used for images and some specific tasks. Dot product is used for models where vector magnitude carries information (relevance).',
  },
  {
    id: 'ai-vector-databases-003',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Vector Databases',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Why is ANN (Approximate Nearest Neighbors) used instead of exact search when searching millions of vectors?',
    options: [
      'Exact search produces incorrect results on large data',
      'Exact search (brute-force) has O(n) complexity and is too slow for millions of vectors; ANN finds "close enough" neighbors in O(log n)',
      'ANN works only on GPU, while exact search works only on CPU',
      'Exact search requires more disk space',
    ],
    correctIndex: 1,
    explanation:
      'Brute-force k-NN: compare the query against ALL n vectors — O(n·d), where d is the dimensionality. For 10M vectors × 1536 dim = billions of operations per query. ANN algorithms trade accuracy (recall 95-99%) for speed: search in O(log n) or O(√n). Recall@k: what fraction of the true k nearest neighbors was found. ANN with 99% recall is sufficient for most applications. Popular algorithms: HNSW, IVF, ScaNN, Annoy.',
  },
  {
    id: 'ai-vector-databases-004',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Vector Databases',
    difficulty: 'middle',
    type: 'quiz',
    question: 'How does the HNSW (Hierarchical Navigable Small World) algorithm work?',
    options: [
      'It partitions the space into equal cells (a grid) and searches neighboring cells',
      'It builds a multi-layer graph: upper layers are "highways" for fast navigation, lower layers hold detailed connections; search starts at the top and descends to the exact neighborhood',
      'It uses hash functions to group similar vectors into the same buckets',
      'It builds a binary tree over the vector components',
    ],
    correctIndex: 1,
    explanation:
      'HNSW (Malkov & Yashunin, 2018) is the most popular ANN algorithm. The idea: a multi-layer graph similar to a skip list. Top layer: few nodes, long links (fast navigation). Bottom layer: all nodes, short links (precise search). Search: start at the top layer, greedily descend toward the nearest neighbor, move down a layer, repeat. Parameters: M (number of links), ef_construction (accuracy during build), ef_search (accuracy during search). Trade-off: higher M/ef = higher recall, but more memory and slower. Used in: Qdrant, Weaviate, pgvector, Elasticsearch.',
  },
  {
    id: 'ai-vector-databases-005',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Vector Databases',
    difficulty: 'middle',
    type: 'open',
    question: 'Compare vector search approaches: HNSW vs IVF. When is each better to use?',
    sampleAnswer:
      'HNSW (Hierarchical Navigable Small World): graph-based. Pros: high recall, fast search (O(log n)), good for real-time queries. Cons: high memory consumption (entire index in RAM), long index build time, complex updates (adding/removing elements). IVF (Inverted File Index): partitions the space into clusters (Voronoi cells) via k-means. During search: identify the nearest clusters, search only within them. Pros: less memory (can be stored on disk), fast build, easy to update. Cons: lower recall when few clusters are probed (nprobe), performance depends on data distribution. Recommendations: HNSW — for real-time search when data fits in RAM (<10M vectors). IVF — for large datasets (>100M) where memory savings matter, often combined with PQ (Product Quantization).',
    explanation:
      'In practice, IVF+PQ+HNSW combinations are often used. FAISS (Meta) supports many configurations. For most RAG applications (<5M documents), HNSW is the optimal choice. For search-engine scale (billions) — IVF+PQ or ScaNN.',
  },
  {
    id: 'ai-vector-databases-006',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Vector Databases',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is metadata filtering in the context of vector search?',
    options: [
      'Removing duplicates from search results',
      'Filtering vector search results by additional attributes (date, category, author) before or after the ANN search',
      'Automatic extraction of metadata from documents',
      'Cleaning data before building the index',
    ],
    correctIndex: 1,
    explanation:
      'Metadata filtering: each vector is stored with metadata (JSON). During search you can specify filters: "find similar documents, BUT only from 2024 AND category=finance". Two approaches: (1) Pre-filtering: filter by metadata first, then run ANN among the filtered set. Exact filter, but can be slow with restrictive filters. (2) Post-filtering: ANN top-k first, then filter. Faster, but may return fewer than k results. Hybrid: filtered ANN — both conditions simultaneously. Critical for production RAG: without filters you cannot separate data by user (multi-tenancy), apply access control, or restrict by date.',
  },
  {
    id: 'ai-vector-databases-007',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Vector Databases',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you choose between a specialized vector DB (Pinecone, Qdrant, Weaviate) and a vector extension in an existing database (pgvector, Elasticsearch)?',
    sampleAnswer:
      'Specialized vector DBs: Pros: optimized for vector operations, better ANN performance, advanced features (multi-tenancy, hybrid search, quantization). Cons: another service in the infrastructure, additional cost, data in two places (sync). When: vector search is core functionality, millions+ of vectors, high latency requirements. pgvector / Elasticsearch: Pros: reuse existing infrastructure, data in one place (joins, transactions), simpler operationally. Cons: less optimized for vector ops, limited ANN algorithms, pgvector did not support HNSW until recently. When: vector search is an additional feature, <1M vectors, you already have PostgreSQL/ES, data consistency matters. Recommendation: start with pgvector, migrate to a specialized DB once you hit performance or functionality limits.',
    explanation:
      'The vector DB market is evolving rapidly. pgvector has improved significantly (HNSW support), and it is sufficient for many RAG applications. Qdrant and Weaviate are open-source leaders. Pinecone is a managed option. The takeaway: do not over-engineer — start simple and scale as needed.',
  },
  {
    id: 'ai-vector-databases-008',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Vector Databases',
    difficulty: 'senior',
    type: 'open',
    question: 'What is Product Quantization (PQ) and how does it enable storing billions of vectors?',
    sampleAnswer:
      'Product Quantization is a vector compression method for saving memory. Algorithm: (1) A d-dimensional vector is split into m sub-vectors (d/m each). (2) For each subspace a codebook of k centroids is built (via k-means). (3) Each sub-vector is replaced by the ID of the nearest centroid (1 byte when k=256). (4) A 1536-dim vector × 4 bytes = 6KB → compressed to m bytes (e.g., 64 bytes when m=64). Compression ~100x. The distance between the query and a compressed vector is computed via ADC (Asymmetric Distance Computation): the query is not compressed, and distance is computed via lookup tables. Quality: recall drops by 2-5%, but data volume shrinks by 1-2 orders of magnitude. Combinations: IVF+PQ — the standard for large datasets in FAISS. OPQ (Optimized PQ): rotation before quantization for better quality.',
    explanation:
      'PQ is a key technique for scaling vector search to billions. Meta uses FAISS with IVF+PQ to search among trillions of embeddings. Binary Quantization (1-bit) is even more aggressive compression (32x), but with greater quality loss. Scalar Quantization (SQ) is a compromise between PQ and full precision.',
  },
  {
    id: 'ai-vector-databases-009',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Vector Databases',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is the main challenge of multi-tenancy in vector databases, and how is it solved?',
    options: [
      'Multi-tenancy is impossible in vector databases',
      'Data isolation between users: approaches include a namespace/collection per tenant, metadata filtering, and hybrid strategies with different trade-offs in performance, cost, and isolation',
      'Multi-tenancy is solved only by data encryption',
      'Each user is assigned a separate server',
    ],
    correctIndex: 1,
    explanation:
      'Multi-tenancy is critical for SaaS: one user\'s data must not be accessible to another. Approaches: (1) Collection per tenant: full isolation, but overhead (a separate index per tenant). Good with <1000 tenants holding large data. (2) Metadata filtering: a single index, tenant_id in metadata, filter on every query. More resource-efficient, but requires reliable filtering. (3) Namespace (Pinecone): logical separation within an index. (4) Hybrid: sharding by large tenants + metadata filtering for small ones. Risks: metadata filter bypass → data leak. Recommendation: collection per tenant for enterprise (compliance), metadata filtering for consumer apps.',
  },
];
