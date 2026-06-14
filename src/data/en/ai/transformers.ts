import type { Question } from '@/data/types';

export const transformersQuestions: Question[] = [
  {
    id: 'ai-transformers-001',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Transformers',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is the key mechanism in the Transformer architecture?',
    options: [
      'Recurrence',
      'Convolution',
      'The attention mechanism',
      'Residual connections',
    ],
    correctIndex: 2,
    explanation:
      'Self-attention is the key mechanism of the transformer, introduced in the paper "Attention Is All You Need" (Vaswani et al., 2017). It allows each token to "attend" to all other tokens in the sequence by computing attention weights. Unlike an RNN, it does not require sequential processing, which enables efficient parallelization. Residual connections are also used, but they are not unique to transformers.',
  },
  {
    id: 'ai-transformers-002',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Transformers',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Why is positional encoding used in a transformer?',
    options: [
      'To compress long sequences into a fixed-size vector',
      'To add information about token order, since attention by itself does not account for positions',
      'To convert tokens into numerical representations (embeddings)',
      'To speed up training by caching positions',
    ],
    correctIndex: 1,
    explanation:
      'Self-attention is a set operation: the result does not depend on the order of the input elements. But in language, word order is critical: "the cat ate the fish" ≠ "the fish ate the cat". Positional encoding adds to each token\'s embedding a vector that encodes its position. Variants: sinusoidal (the original Transformer), learned (BERT, GPT), relative (T5, ALiBi), RoPE (Rotary Position Embedding — LLaMA, GPT-NeoX).',
  },
  {
    id: 'ai-transformers-003',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Transformers',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What are the main components of a single transformer layer (block)?',
    options: [
      'Convolutional layer + pooling + fully connected layer',
      'Multi-Head Attention + Feed-Forward Network + Layer Normalization + Residual Connections',
      'RNN cell + attention + dropout',
      'Embedding + softmax + cross-entropy',
    ],
    correctIndex: 1,
    explanation:
      'Each transformer block contains: (1) Multi-Head Self-Attention — parallel attention heads, (2) a Feed-Forward Network (FFN) — two linear layers with a nonlinearity (usually GELU), (3) Layer Normalization — to stabilize activations, (4) Residual connections — around each sub-block (attention and FFN). Decoder blocks also include masked self-attention (so as not to "peek" at future tokens) and cross-attention (for encoder-decoder models).',
  },
  {
    id: 'ai-transformers-004',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Transformers',
    difficulty: 'middle',
    type: 'quiz',
    question: 'How is Scaled Dot-Product Attention computed?',
    options: [
      'Attention(Q,K,V) = softmax(QK^T / √d_k) × V — the dot product of queries and keys, scaled, then softmax, then multiplication by values',
      'Attention(Q,K,V) = sigmoid(Q + K) × V',
      'Attention(Q,K,V) = softmax(Q × V) × K',
      'Attention(Q,K,V) = ReLU(QK^T) × V / d_k',
    ],
    correctIndex: 0,
    explanation:
      'Scaled Dot-Product Attention: (1) compute the dot products of the query with each key: QK^T, (2) scale by √d_k (the key dimension) so that gradients do not vanish when d_k is large, (3) apply softmax to obtain attention weights (summing to 1), (4) multiply by the values V. Q, K, V are linear projections of the input. Scaling is critical: without it, for large d_k the softmax "saturates" and gradients vanish.',
  },
  {
    id: 'ai-transformers-005',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Transformers',
    difficulty: 'middle',
    type: 'open',
    question: 'What is Multi-Head Attention, and why do we need several "heads" instead of a single attention?',
    sampleAnswer:
      'Multi-Head Attention is the parallel execution of several attention operations with different linear projections. The input is projected into h sets of Q, K, V (one per head); each head computes attention independently; the results are concatenated and projected back. Why: each head can "specialize" in different types of dependencies — one tracks syntax, another semantics, a third positional relationships. A single attention head can focus on only one pattern at a time, whereas Multi-Head allows many dependencies to be captured in parallel. d_model is usually split evenly across the heads (d_k = d_model / h), so the computational cost is roughly equal to single-head attention at full dimensionality.',
    explanation:
      'Multi-Head Attention is one of the key ideas of the original Transformer. In practice, different heads do learn different patterns: positional heads, syntactic heads, rare-word heads. Studies (Clark et al., 2019) showed that some heads can be pruned without loss of quality — not all heads are equally useful.',
  },
  {
    id: 'ai-transformers-006',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Transformers',
    difficulty: 'middle',
    type: 'quiz',
    question: 'How do encoder-only, decoder-only, and encoder-decoder transformer architectures differ?',
    options: [
      'Encoder-only (BERT) — for text generation, decoder-only (GPT) — for understanding, encoder-decoder (T5) — for translation',
      'Encoder-only (BERT) — bidirectional context for understanding tasks, decoder-only (GPT) — autoregressive left-to-right generation, encoder-decoder (T5) — for seq2seq tasks (translation, summarization)',
      'There are no differences; these are marketing names for the same architecture',
      'Encoder-only does not use attention; decoder-only uses only cross-attention',
    ],
    correctIndex: 1,
    explanation:
      'Three families: (1) Encoder-only (BERT, RoBERTa): bidirectional self-attention, sees the entire context. Tasks: classification, NER, search. Pretraining: masked language modeling. (2) Decoder-only (GPT, LLaMA, Claude): causal (masked) self-attention, sees only the previous tokens. Tasks: generation, chat, reasoning. Pretraining: next token prediction. (3) Encoder-decoder (T5, BART): the encoder processes the input (bidirectionally), the decoder generates the output with cross-attention to the encoder. Tasks: translation, summarization. Today, decoder-only dominates among LLMs.',
  },
  {
    id: 'ai-transformers-007',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Transformers',
    difficulty: 'senior',
    type: 'open',
    question: 'Why does self-attention have quadratic complexity O(n²) in the sequence length? What approaches exist to reduce it?',
    sampleAnswer:
      'Self-attention computes pairwise dot products between all n tokens: the matrix QK^T has size n×n, which gives O(n²) in memory and compute. For long sequences (n > 8K) this becomes a bottleneck. Approaches to reduce it: (1) Sparse attention: each token attends only to a subset (local window + global tokens) — Longformer, BigBird. O(n√n) or O(n·w). (2) Linear attention: approximating softmax(QK^T)V via a kernel trick — Performer, FNet. O(n). (3) Flash Attention: does not reduce the theoretical complexity, but optimizes GPU memory access (tiling), reducing IO between SRAM and HBM. In practice a 2-4x speedup. (4) Multi-Query/Grouped-Query Attention: reduce the KV-cache size without changing the attention complexity, but lowering memory bandwidth. (5) Ring Attention: distributes long sequences across multiple GPUs. (6) Alternative architectures: Mamba (SSM), RWKV — O(n) by design.',
    explanation:
      'Quadratic complexity is the main limitation of transformers. Flash Attention became the de facto standard: it does not approximate but computes attention exactly with optimal use of GPU memory. Grouped-Query Attention (GQA) is used in LLaMA 2/3 and Mistral. Mamba and other SSM models are an active research area as a replacement for attention.',
  },
  {
    id: 'ai-transformers-008',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Transformers',
    difficulty: 'senior',
    type: 'open',
    question: 'Explain the difference between Multi-Head Attention (MHA), Multi-Query Attention (MQA), and Grouped-Query Attention (GQA). How does this affect inference?',
    sampleAnswer:
      'MHA: each head has its own Q, K, V projections. At inference, you must store a KV-cache for each head. For a model with 32 heads — 32 sets of K and V. MQA: all heads share a single K, V pair but have their own Q. The KV-cache shrinks by a factor of h (h = number of heads). Faster inference, but it can lose quality. GQA: a compromise — the heads are split into g groups, and each group shares K, V. At g=1 this is MQA, at g=h it is MHA. LLaMA 2 70B uses GQA with 8 KV-heads for 64 query-heads. Impact on inference: the KV-cache is the main consumer of memory when generating long sequences. MQA/GQA reduce the memory bandwidth requirement, which is critical for batch inference and long contexts.',
    explanation:
      'GQA became the standard in modern LLMs as the optimal balance of quality/efficiency. It is used in LLaMA 2/3, Mistral, and Gemma. At inference the bottleneck is often not compute but memory bandwidth — GQA directly addresses this problem.',
  },
  {
    id: 'ai-transformers-009',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Transformers',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is RoPE (Rotary Position Embedding), and why has this approach become the standard in modern LLMs?',
    options: [
      'RoPE encodes absolute positions via learned embeddings, limited by the maximum context length',
      'RoPE applies rotation matrices to Q and K, encoding relative positions through the rotation angle, which enables extrapolation to lengths greater than those seen in training',
      'RoPE replaces positional encoding with special attention masks',
      'RoPE uses hash functions to encode token positions',
    ],
    correctIndex: 1,
    explanation:
      'RoPE (Su et al., 2021) encodes position by rotating the query/key vector by an angle proportional to the position. The dot product of the rotated Q and K depends only on the relative distance between the tokens, not on the absolute positions. Advantages: (1) natural encoding of relative positions, (2) the ability to extrapolate to lengths greater than those seen in training (via NTK-aware scaling, YaRN), (3) an efficient implementation. It is used in LLaMA, Mistral, Qwen, and Gemma — effectively the standard for modern open-source LLMs.',
  },
];
