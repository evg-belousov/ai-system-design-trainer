import type { Question } from '@/data/types';

export const ragQuestions: Question[] = [
  {
    id: 'ai-rag-001',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is RAG (Retrieval-Augmented Generation)?',
    options: [
      'A method of training an LLM on labeled data',
      'A pattern in which an LLM is augmented with relevant documents from an external store before generating a response',
      'A neural network compression algorithm',
      'A training-data augmentation technique',
    ],
    correctIndex: 1,
    explanation:
      'RAG (Lewis et al., 2020) is an architectural pattern: (1) The user asks a question. (2) The retriever finds relevant documents from the knowledge base. (3) The found documents are added to the LLM prompt as context. (4) The LLM generates an answer based on both the question and the retrieved documents. Benefits: freshness (data is updated without retraining), reduced hallucinations (the answer is grounded in sources), and attribution (sources can be cited).',
  },
  {
    id: 'ai-rag-002',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What are embeddings in the context of RAG?',
    options: [
      'Compressed copies of documents to save memory',
      'Fixed-dimension numeric vectors representing the semantic meaning of text, where similar texts have nearby vectors',
      'Indexes of word positions within a document',
      'Encrypted representations of documents',
    ],
    correctIndex: 1,
    explanation:
      'Embeddings are dense vectors (typically 384–1536 dim) that encode the semantics of text. Models: OpenAI text-embedding-3-small/large, Cohere embed, open-source (BGE, E5, GTE). Property: semantically similar texts have nearby vectors (high cosine similarity). In RAG: documents are converted into embeddings and stored in a vector store. At query time, the query embedding is compared against the document embeddings to find relevant ones. Embedding quality directly affects retrieval quality.',
  },
  {
    id: 'ai-rag-003',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Why is chunking (splitting) of documents needed in a RAG pipeline?',
    options: [
      'To encrypt confidential data',
      'Because embedding models and LLMs have an input-length limit, and small fragments provide more precise retrieval',
      'For parallel loading of documents',
      'To remove duplicates within documents',
    ],
    correctIndex: 1,
    explanation:
      'Chunking splits large documents into fragments because: (1) Embedding models have a limit (512–8K tokens). (2) Small chunks give more precise (granular) retrieval — instead of a whole document, a specific paragraph is returned. (3) The LLM context window is limited — several chunks must fit. Strategies: fixed-size (512 tokens with overlap), semantic (by meaning, paragraphs), recursive (with a hierarchy of separators). Chunk size is a key hyperparameter: too small loses context, too large adds noise and lowers retrieval precision.',
  },
  {
    id: 'ai-rag-004',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is Hybrid Search in the context of RAG and why is it more effective than pure semantic search?',
    options: [
      'A combination of image search and text search',
      'Combining semantic (vector) search and lexical (keyword, BM25) search to improve recall and precision',
      'Searching across several LLMs simultaneously',
      'A combination of online and offline search',
    ],
    correctIndex: 1,
    explanation:
      'Hybrid Search combines: (1) Semantic search (dense retrieval): finds documents by meaning via embeddings. Good for paraphrases and synonyms. Bad for exact terms, abbreviations, and names. (2) Lexical search (sparse, BM25): finds documents by exact keyword matches. Good for specific terms. Bad for paraphrases. The results are merged via Reciprocal Rank Fusion (RRF) or other methods. On benchmarks, hybrid search consistently outperforms each approach on its own. Supported by: Weaviate, Qdrant, Elasticsearch, Pinecone.',
  },
  {
    id: 'ai-rag-005',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'middle',
    type: 'open',
    question: 'What is reranking in RAG? Why is it needed if you already have retrieval?',
    sampleAnswer:
      'Reranking is a second ranking stage after the initial retrieval. The pipeline: (1) The retriever (fast, a bi-encoder) returns the top-k (20-100) candidates. (2) The reranker (accurate, a cross-encoder) reorders the candidates by scoring the (query, document) pair jointly. (3) The top-n after reranking are passed to the LLM. Why: a bi-encoder (embedding search) encodes the query and document independently — fast but less accurate. A cross-encoder processes query+document together through attention — more accurate but slow (O(n×m) vs O(n+m)). The reranker "corrects" the retriever\'s mistakes. Models: Cohere Rerank, cross-encoder models (ms-marco), ColBERT (late interaction — a speed/quality compromise). In practice, reranking improves RAG quality by 5-15% on the metrics.',
    explanation:
      'Two-stage retrieval (retrieve + rerank) is a standard pattern in information retrieval, carried over into RAG. Analogy: Google first quickly finds candidates (inverted index), then ranks them (an ML model). In RAG: vector search → reranker → LLM.',
  },
  {
    id: 'ai-rag-006',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'middle',
    type: 'open',
    question: 'What chunking strategies exist? How do you choose the optimal chunk size?',
    sampleAnswer:
      'Strategies: (1) Fixed-size: a fixed number of tokens (256-1024) with overlap (10-20%). Simple, universal. (2) Recursive: a hierarchy of separators (\\n\\n → \\n → . → space). Preserves text structure. (3) Semantic: grouping sentences by semantic similarity (embedding similarity). The most accurate but complex. (4) Document-aware: accounts for structure (headers, sections for Markdown/HTML, slides for PDF). (5) Agentic chunking: an LLM determines chunk boundaries. Choosing the size: small chunks (256-512) for precise QA on specific facts. Large chunks (1024-2048) for summarization and complex questions. Overlap (10-20%) to preserve context at boundaries. Best approach: experiment on your own data, evaluating retrieval precision/recall.',
    explanation:
      'Chunking is one of the hyperparameters that most affects RAG quality. There is no universally best strategy: legal documents suit document-aware chunking (by sections), FAQs suit small chunks, and research suits semantic chunking. The "parent-child" approach: retrieve over small chunks, but pass the parent (larger) fragment into the LLM context.',
  },
  {
    id: 'ai-rag-007',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'senior',
    type: 'open',
    question: 'Describe the architecture of Advanced RAG: what improvements over naive RAG exist and when are they needed?',
    sampleAnswer:
      'Naive RAG: embed query → vector search → top-k into the prompt → LLM answer. Problems: poor retrieval, loss of context, hallucinations. Advanced RAG improvements: (1) Pre-retrieval: query rewriting (the LLM reformulates the query), HyDE (a hypothetical answer as the query), query decomposition (breaking a complex question into sub-questions). (2) Retrieval: hybrid search, multi-index (different indexes for different data types), metadata filtering. (3) Post-retrieval: reranking, context compression (summarizing chunks), lost-in-the-middle mitigation (important chunks at the beginning/end). (4) Generation: citation/attribution, self-RAG (the model decides whether retrieval is needed), CRAG (corrective RAG — checking the relevance of retrieved documents). (5) Evaluation: the RAGAS framework (faithfulness, answer relevancy, context precision/recall).',
    explanation:
      'Advanced RAG is a set of techniques, not a monolithic architecture. In practice you pick the 2-3 most relevant improvements. Self-RAG and CRAG are promising directions in which the model itself manages the retrieval process. Evaluation via RAGAS or DeepEval is a mandatory step for production RAG.',
  },
  {
    id: 'ai-rag-008',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'senior',
    type: 'open',
    question: 'Compare RAG and Long Context LLMs (128K+ tokens). When is RAG still preferable?',
    sampleAnswer:
      'Long Context: load all documents into the LLM context in full. Pros: simple architecture, no retrieval errors, the model sees everything. Cons: (1) cost — O(n²) attention, billing for all tokens, (2) "lost in the middle" — quality drops for information in the middle of the context, (3) latency grows with context length, (4) a hard limit on total data volume. RAG is preferable when: (1) the knowledge base is > 1M tokens (hundreds of documents), (2) data is updated frequently (reindexing vs re-feeding the context), (3) attribution is needed (links to sources), (4) you need to save on API calls, (5) precision on specific facts is required (focused retrieval > "find a needle in a haystack"). The optimal approach: RAG for retrieval + long context for reasoning over the retrieved documents.',
    explanation:
      'The RAG vs Long Context debate is one of the hot topics of 2024-2026. Studies (Lost in the Middle, Needle in a Haystack) show the limitations of long context. In practice a hybrid approach (RAG + a moderate context window) is often optimal in terms of cost/quality.',
  },
  {
    id: 'ai-rag-009',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is GraphRAG and what advantage does it give over classic vector-based RAG?',
    options: [
      'GraphRAG uses graphics processing units (GPUs) to speed up retrieval',
      'GraphRAG builds a knowledge graph from documents and uses the relationships between entities for more complete retrieval, especially for questions that require synthesizing information from several documents',
      'GraphRAG is RAG with result visualization in the form of charts',
      'GraphRAG stores embeddings in a graph database instead of a vector one',
    ],
    correctIndex: 1,
    explanation:
      'GraphRAG (Microsoft, 2024) extracts entities and their relationships from documents, building a knowledge graph. At query time it: (1) finds relevant entities, (2) traverses the graph to find related facts, (3) passes the subgraph + documents to the LLM. The advantage: for questions like "how is X related to Y?" or "summarize all facts about Z," vector search may miss documents that lack the exact keywords but are connected through a chain of entities. Limitations: the complexity of building the graph, cost (an LLM for extraction), and keeping it current as documents change.',
  },
];
