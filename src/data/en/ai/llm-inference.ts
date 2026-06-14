import type { Question } from '@/data/types';

export const llmInferenceQuestions: Question[] = [
  {
    id: 'ai-llm-inference-001',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'LLM Inference',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Which two phases make up text generation in an autoregressive LLM?',
    options: [
      'Encoding and Decoding',
      'Prefill (processing the prompt) and Decode (generating tokens one at a time)',
      'Training and Inference',
      'Tokenization and Detokenization',
    ],
    correctIndex: 1,
    explanation:
      'LLM inference consists of two phases: (1) Prefill: the entire input prompt is processed in parallel in a single forward pass. The KV cache is computed for all input tokens. This is compute-bound (limited by compute capacity). (2) Decode: tokens are generated one at a time, and each new token requires a forward pass with attention over all previous tokens. This is memory-bandwidth-bound (limited by the speed of reading weights and the KV cache). That is why "time to first token" (TTFT, prefill) and "time per output token" (TPOT, decode) are different metrics.',
  },
  {
    id: 'ai-llm-inference-002',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'LLM Inference',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is the KV cache and why is it needed during generation?',
    options: [
      'A cache for storing intermediate tokenization results',
      'A store of the Key and Value tensors from previous attention steps, so they are not recomputed when generating each new token',
      'An optimizer cache for speeding up fine-tuning',
      'A buffer for holding generated tokens before detokenization',
    ],
    correctIndex: 1,
    explanation:
      'In autoregressive generation, each new token requires attention over all previous tokens. Without the KV cache, you would have to recompute K and V for all previous tokens at every step — O(n²) compute. The KV cache stores the already-computed K and V: when generating token n+1, you only need to compute Q, K, V for the new token and reuse the cached K, V for the previous ones. This reduces compute to O(n) per step. The cost is memory. For LLaMA 70B the KV cache can take tens of GB at long sequence lengths.',
  },
  {
    id: 'ai-llm-inference-003',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'LLM Inference',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is model quantization?',
    options: [
      'Removing unused layers from the model',
      'Reducing the precision of model weights (for example, from float16 to int8/int4) to lower memory consumption and speed up inference',
      'Splitting the model into parts for parallel execution',
      'Encrypting model weights to protect intellectual property',
    ],
    correctIndex: 1,
    explanation:
      'Quantization is reducing the numeric precision of weights and/or activations. FP16 → INT8: ~2x memory savings, minimal quality loss. FP16 → INT4: ~4x savings, noticeable but acceptable loss. Popular formats: GPTQ (post-training, 4-bit), AWQ (Activation-aware Weight Quantization), GGUF (llama.cpp, CPU-friendly), bitsandbytes (dynamic quantization). It makes it possible to run a 7B model on a consumer GPU (6GB VRAM) or a 70B model on a single server instead of a cluster.',
  },
  {
    id: 'ai-llm-inference-004',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'LLM Inference',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is continuous batching and why is it more efficient than static batching for LLMs?',
    options: [
      'Continuous batching increases the batch size during training',
      'With continuous batching, new requests are added to the batch as soon as previous ones finish, without waiting for all requests in the batch to complete',
      'Continuous batching merges several models into one inference',
      'Continuous batching is a synonym for pipeline parallelism',
    ],
    correctIndex: 1,
    explanation:
      'Static batching: all requests in a batch start and finish together. If one request generates 10 tokens while another generates 500, the GPU sits idle waiting for the long request. Continuous batching (Orca, 2022): requests can leave the batch when they finish, and new ones are added in their place. The result: GPU utilization rises from ~30% to ~90%+, and throughput increases 2-5x. Implementations: vLLM, TensorRT-LLM, TGI (Text Generation Inference). This is the standard for production LLM serving.',
  },
  {
    id: 'ai-llm-inference-005',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'LLM Inference',
    difficulty: 'middle',
    type: 'open',
    question: 'Explain how PagedAttention (vLLM) works. What problem does it solve?',
    sampleAnswer:
      'The problem: the KV cache requires contiguous blocks of GPU memory for each request. With variable generation lengths, memory is allocated "with headroom" (for the maximum length), which leads to fragmentation and waste (up to 60-80% of memory is wasted). PagedAttention (Kwon et al., 2023) is inspired by OS virtual memory. The KV cache is split into fixed-size "pages" (blocks). A page table for each request points to where its blocks live in physical GPU memory. The blocks need not be contiguous. The result: near-zero memory waste, the ability to share pages between requests (for beam search, parallel sampling), and a 2-4x throughput increase by serving more concurrent requests.',
    explanation:
      'PagedAttention is one of the key innovations in LLM serving. vLLM is the open-source project that implements it, and it has become the standard for self-hosted LLMs. The "virtual memory for the KV cache" idea is elegant and shows how OS concepts apply to AI infra.',
  },
  {
    id: 'ai-llm-inference-006',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'LLM Inference',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Which metric best characterizes user experience when using an LLM in a chat application?',
    options: [
      'Tokens per second (TPS) — the total number of generated tokens per second on the GPU',
      'Time to First Token (TTFT) + Time Per Output Token (TPOT) — time until the first token and the speed of streaming generation',
      'Total generation time — the overall time to generate the response',
      'GPU utilization — the percentage of GPU load',
    ],
    correctIndex: 1,
    explanation:
      'For streaming applications (chat), two metrics matter: TTFT (Time to First Token) — how long you wait before the response begins. It depends on the prompt length (prefill). Target: <500ms. TPOT (Time Per Output Token) — the "typing" speed of the response. It determines the smoothness of streaming. Target: <50ms/token (~20 tokens/sec). For batch scenarios (API), throughput (tokens/sec/GPU) matters more. Different use cases call for different metrics. A generic "TPS" does not distinguish prefill from decode, masking the real bottlenecks.',
  },
  {
    id: 'ai-llm-inference-007',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'LLM Inference',
    difficulty: 'senior',
    type: 'open',
    question: 'What is Speculative Decoding? How does it speed up generation without losing quality?',
    sampleAnswer:
      'Speculative Decoding uses a small "draft" model to quickly generate k candidate tokens, which are then verified by the main model in a single forward pass. The algorithm: (1) The draft model generates k tokens (fast, because the model is small). (2) The target model processes all k tokens in a single forward pass (in parallel). (3) The probability of each token is checked: tokens where the draft and target "agree" are accepted. (4) The first "rejected" token is replaced with a sample from the target model. The result: if the draft model approximates the target well, most tokens are accepted, and in a single forward pass the target model produces k tokens instead of one. Speedup of 2-3x with no quality loss (the distribution is guaranteed to match the target). Requirements: the draft model must be significantly faster than the target and accurate enough.',
    explanation:
      'Speculative Decoding (Leviathan et al., 2023; Chen et al., 2023) is one of the few techniques that speed up generation with no quality trade-off. Variants: self-speculative decoding (drafting from earlier layers of the same model), Medusa (several prediction heads), EAGLE. It is especially effective for "predictable" text (code, structured output).',
  },
  {
    id: 'ai-llm-inference-008',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'LLM Inference',
    difficulty: 'senior',
    type: 'open',
    question: 'Compare parallelism strategies for LLM inference: Tensor Parallelism, Pipeline Parallelism, and Data Parallelism. When should each be used?',
    sampleAnswer:
      'Tensor Parallelism (TP): a single model layer is split across GPUs. Matrix multiplications run in parallel and the results are synchronized (all-reduce). Pros: reduces the latency of a single request and lets a model that does not fit on one GPU run. Cons: requires fast inter-GPU links (NVLink). Typically TP=2-8 within a single node. Pipeline Parallelism (PP): different layers on different GPUs. A request passes sequentially through "stages." Pros: works across nodes (a slow network is OK). Cons: bubble overhead, and it does not reduce single-request latency. Data Parallelism (DP): a full copy of the model on each GPU, with different requests processed in parallel. Pros: scales throughput linearly. Cons: each GPU must hold the entire model. A typical combination: TP within a node (4-8 GPUs) + PP across nodes + DP to scale throughput.',
    explanation:
      'For production LLM serving it is important to combine the strategies correctly. vLLM, TensorRT-LLM, and DeepSpeed-Inference support all three. For models up to 70B, TP on a single node (4-8 A100/H100) is usually enough. For 400B+ models a TP+PP combination is required.',
  },
  {
    id: 'ai-llm-inference-009',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'LLM Inference',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Why is the decode phase of LLM inference memory-bandwidth-bound rather than compute-bound?',
    options: [
      'Because quantization is used, which reduces compute',
      'Because generating a single token requires reading all of the model weights from GPU HBM, but there is little compute per weight (low arithmetic intensity)',
      'Because the decode phase does not use GPU cores',
      'Because the KV cache occupies all available compute capacity',
    ],
    correctIndex: 1,
    explanation:
      'When decoding a single token, you need to read ~all of the model weights (~14GB for a 7B fp16 model) from HBM for a single vector × matrix multiplication. Arithmetic intensity ≈ 1 FLOP/byte — extremely low. An A100 GPU has ~2TB/s of bandwidth and ~300 TFLOPS, but at 1 FLOP/byte the bandwidth caps throughput at ~2T token-ops/sec. By comparison, prefill with batch=32 has an intensity of ~32 FLOPs/byte — compute-bound. This is why batching is critical: combining requests increases arithmetic intensity and GPU compute utilization.',
  },
];
