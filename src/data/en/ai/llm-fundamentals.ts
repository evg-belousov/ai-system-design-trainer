import type { Question } from '@/data/types';

export const llmFundamentalsQuestions: Question[] = [
  {
    id: 'ai-llm-fundamentals-001',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'LLM Fundamentals',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What does an LLM (Large Language Model) do at a basic level?',
    options: [
      'Looks up answers in a knowledge database',
      'Predicts the most likely next token based on the preceding context',
      'Performs symbolic computations over grammatical rules',
      'Translates the user query into SQL queries against a database',
    ],
    correctIndex: 1,
    explanation:
      'An LLM is an autoregressive model trained to predict the next token (next token prediction). Given a sequence of tokens [t1, t2, ..., tn], the model predicts the probability distribution P(t_{n+1} | t1, ..., tn). Generation: sample a token from the distribution, append it to the context, and repeat. Despite the simplicity of the training objective, models with >10B parameters exhibit emergent abilities: reasoning, code generation, translation.',
  },
  {
    id: 'ai-llm-fundamentals-002',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'LLM Fundamentals',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is tokenization in the context of LLMs?',
    options: [
      'Encrypting text for secure transmission',
      'Splitting text into minimal units (tokens) that the model processes: subwords, words, or characters',
      'Converting text into an audio signal',
      'Assigning class labels to words in a text',
    ],
    correctIndex: 1,
    explanation:
      'Tokenization is the first stage of text processing in an LLM. The text is split into tokens (subwords), and each is assigned a numerical ID from a vocabulary. Popular algorithms: BPE (Byte Pair Encoding) — GPT, LLaMA; WordPiece — BERT; SentencePiece — T5, LLaMA. A typical vocabulary size: 32K–128K tokens. One token ≈ 3–4 characters in English, and usually fewer in Russian. Tokenization affects cost (billing per token), context length, and quality across different languages.',
  },
  {
    id: 'ai-llm-fundamentals-003',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'LLM Fundamentals',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is temperature in LLM text generation?',
    options: [
      'The physical temperature of the GPU during inference',
      'A parameter that controls the "randomness" of generation: a low temperature produces more deterministic output, a high one more diverse output',
      'The model learning rate',
      'The maximum length of the generated response',
    ],
    correctIndex: 1,
    explanation:
      'Temperature (T) scales the logits before softmax: P(token) = softmax(logits / T). T → 0: the distribution approaches a delta function (greedy), always choosing the most likely token. Deterministic but boring. T = 1: the original learned distribution. T > 1: a flatter distribution, more randomness. It is used together with top-k (choosing from the k most likely tokens) and top-p / nucleus sampling (choosing from tokens whose cumulative probability ≥ p).',
  },
  {
    id: 'ai-llm-fundamentals-004',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'LLM Fundamentals',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What training stages does a modern LLM go through, from "scratch" to a finished assistant?',
    options: [
      'Pretraining → Deployment',
      'Pretraining → Supervised Fine-tuning (SFT) → Alignment (RLHF/DPO) → Deployment',
      'Data Collection → Rule-based Programming → Testing',
      'Transfer Learning → Zero-shot Evaluation → Release',
    ],
    correctIndex: 1,
    explanation:
      'Three main stages: (1) Pretraining: training on a huge corpus of text (trillions of tokens) on the next token prediction task. The result is a base model that continues text well but does not follow instructions. (2) SFT (Supervised Fine-tuning): fine-tuning on labeled "instruction → response" examples. The model learns the dialogue format. (3) Alignment (RLHF or DPO): aligning with human preferences. RLHF: train a reward model → optimize via PPO. DPO: direct optimization without a reward model. The result is a helpful, harmless, honest assistant.',
  },
  {
    id: 'ai-llm-fundamentals-005',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'LLM Fundamentals',
    difficulty: 'middle',
    type: 'open',
    question: 'Explain the difference between RLHF and DPO for LLM alignment. What are the advantages and disadvantages of each approach?',
    sampleAnswer:
      'RLHF (Reinforcement Learning from Human Feedback): (1) Pairs of responses with human ratings are collected. (2) A reward model is trained to predict response quality. (3) The LLM is optimized via PPO (Proximal Policy Optimization) to maximize the reward. Pros: a powerful, proven approach (ChatGPT, Claude). Cons: a complex pipeline (3 models), PPO instability, expensive. DPO (Direct Preference Optimization): frames alignment as a classification task on preference pairs without an explicit reward model. It optimizes the LLM directly on "response A is better than response B" data. Pros: a simple pipeline, more stable training, cheaper. Cons: less flexible, quality depends on the preference data, and it can be less robust under overfitting.',
    explanation:
      'DPO (Rafailov et al., 2023) showed that one can achieve alignment quality comparable to RLHF without a complex RL pipeline. It became popular for open-source models (Zephyr, LLaMA-based). In practice, large labs often use a combination: SFT → DPO → RLHF for the final polish.',
  },
  {
    id: 'ai-llm-fundamentals-006',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'LLM Fundamentals',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What do the Kaplan/Chinchilla Scaling Laws describe?',
    options: [
      'The dependence of inference speed on model size',
      'The predictable relationship between model quality (loss) and the number of parameters, the amount of data, and the compute budget',
      'The maximum context window size for different architectures',
      'The optimal number of layers depending on the task',
    ],
    correctIndex: 1,
    explanation:
      'Scaling Laws (Kaplan et al., 2020): a model\'s loss decreases predictably as a power law of N (parameters), D (data), and C (compute). Chinchilla (Hoffmann et al., 2022) refined this: optimally, N and D should grow proportionally. The Chinchilla rule: about 20 tokens of training data per parameter. Implications: (1) quality can be predicted before training, (2) many early LLMs were "undertrained" (too little data for the model size), (3) LLaMA 7B with enough data can outperform GPT-3 175B. Modern models (LLaMA 3) are trained "over Chinchilla" — more data than the optimum — for better inference.',
  },
  {
    id: 'ai-llm-fundamentals-007',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'LLM Fundamentals',
    difficulty: 'senior',
    type: 'open',
    question: 'What are emergent abilities of LLMs? Give examples and explain the debate around this concept.',
    sampleAnswer:
      'Emergent abilities are capabilities that are absent in small models but suddenly appear at a certain scale. Examples: chain-of-thought reasoning, in-context learning from a few examples, code generation, mathematical reasoning. The debate: Wei et al. (2022) showed "phase transitions" — the abrupt appearance of abilities as the model grows. Schaeffer et al. (2023) countered that this "abruptness" is an artifact of the chosen metrics: with continuous metrics (instead of exact match), the improvement is smooth. The consensus: the abilities are real, but their "abruptness" depends on how we measure them. In practice: scaling laws predict loss but do not precisely predict at what scale a specific ability will appear.',
    explanation:
      'Emergent abilities are one of the reasons why companies invest in ever-larger models. But the debate about "true emergence" vs. "smooth improvement" matters for R&D planning and for managing expectations about future models.',
  },
  {
    id: 'ai-llm-fundamentals-008',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'LLM Fundamentals',
    difficulty: 'senior',
    type: 'open',
    question: 'Compare approaches to fine-tuning LLMs: Full Fine-tuning, LoRA, QLoRA. When should each be applied?',
    sampleAnswer:
      'Full Fine-tuning: all model parameters are updated. Best quality, but it requires GPU memory for all parameters + the optimizer (for a 7B model: ~28GB in fp16 + ~56GB for Adam states). LoRA (Low-Rank Adaptation): freezes the original weights and trains low-rank adapter matrices (A×B, rank r=8-64) for the attention projections. It trains <1% of the parameters, with quality close to full fine-tuning. QLoRA: LoRA on top of a quantized model (4-bit NormalFloat). A 7B model fits in ~6GB of GPU for training. Recommendations: Full FT — when there are enough resources and maximum quality is needed (rarely for >70B models). LoRA — the standard choice for most tasks. QLoRA — when GPU is limited (consumer hardware, single GPU). In practice, the difference between LoRA and Full FT is often minimal for instruction following and domain adaptation tasks.',
    explanation:
      'LoRA (Hu et al., 2021) revolutionized fine-tuning by making LLM adaptation accessible. QLoRA (Dettmers et al., 2023) went further — fine-tuning a 65B model on a single 48GB GPU. Modern tools: PEFT, Hugging Face TRL, Axolotl. Variations: DoRA (Weight-Decomposed LoRA), LoRA+ (different LRs for A and B).',
  },
  {
    id: 'ai-llm-fundamentals-009',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'LLM Fundamentals',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What are LLM "hallucinations", and what is their main cause?',
    options: [
      'Errors caused by bugs in the framework code (PyTorch, TensorFlow)',
      'The generation of plausible but factually incorrect text, caused by the model being optimized for likelihood rather than factual correctness',
      'The result of deliberate "creativity" of the model, built into training',
      'A consequence of too low a temperature during generation',
    ],
    correctIndex: 1,
    explanation:
      'Hallucinations are a fundamental problem of LLMs. The cause: the model is trained to maximize P(next token | context), not P(factually correct token). It models the distribution of language, rather than "knowing facts". Types: (1) factual errors (nonexistent citations), (2) logical contradictions, (3) inconsistency with the context. Mitigation methods: RAG (retrieval-augmented generation), grounding, chain-of-thought, constitutional AI, fine-tuning on factual data, citation/attribution. It cannot be fully eliminated — it is a property of generative models.',
  },
];
