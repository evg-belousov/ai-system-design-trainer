import type { Question } from '@/data/types';

export const promptEngineeringQuestions: Question[] = [
  {
    id: 'ai-prompt-engineering-001',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Prompt Engineering',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is few-shot prompting?',
    options: [
      'Training a model on a small amount of data (fine-tuning)',
      'Adding several "input → output" examples to the prompt so the model understands the format and the task without training',
      'Generating several response variants to pick the best one',
      'Using a short prompt to save tokens',
    ],
    correctIndex: 1,
    explanation:
      'Few-shot prompting is an in-context learning technique: 2-5 examples of inputs and desired outputs are added to the prompt. The model "learns" the format and the task from the examples without updating its weights. Variants: zero-shot (no examples, just an instruction), one-shot (one example), few-shot (2-5 examples). Quality depends heavily on the choice of examples: diverse, representative examples work better. The order of examples also matters (recency bias).',
  },
  {
    id: 'ai-prompt-engineering-002',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Prompt Engineering',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is Chain-of-Thought (CoT) prompting?',
    options: [
      'A chain of sequential calls to several LLMs',
      'A technique in which the model is encouraged to reason step by step before producing the final answer',
      'A method of combining several prompts into one',
      'A way of generating text along a chain of keywords',
    ],
    correctIndex: 1,
    explanation:
      'Chain-of-Thought (Wei et al., 2022): adding the phrase "Let\'s think step by step" or examples with step-by-step reasoning prompts the model to show its intermediate reasoning steps. The result: a significant improvement on tasks requiring reasoning (math, logic, code). Variants: zero-shot CoT ("let\'s think step by step"), few-shot CoT (examples with reasoning), Auto-CoT (automatic generation of the chain-of-thought). CoT is especially effective for large models (>10B parameters).',
  },
  {
    id: 'ai-prompt-engineering-003',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Prompt Engineering',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What role does the system prompt play?',
    options: [
      'It contains training data for fine-tuning the model',
      'It defines the role, behavior, constraints, and context for the model throughout the entire conversation',
      'It defines the maximum length of the model\'s response',
      'It encrypts the communication between the client and the API',
    ],
    correctIndex: 1,
    explanation:
      'The system prompt is a special message at the start of the conversation that defines the model\'s "personality" and rules. It contains: a role (you are an expert in X), formatting instructions (respond in JSON), constraints (do not discuss topic Y), and context (date, available tools). It is processed by the model with higher "priority" than user messages. A good system prompt: specific, structured, with examples. Anti-pattern: an overly long system prompt, contradictory instructions.',
  },
  {
    id: 'ai-prompt-engineering-004',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Prompt Engineering',
    difficulty: 'middle',
    type: 'open',
    question: 'Describe the Structured Output technique. How do you guarantee that an LLM returns a response in the required format (JSON, XML)?',
    sampleAnswer:
      'Approaches to structured output: (1) Prompt-based: describe the format in the prompt, provide JSON examples. Unreliable — the model may add text outside the JSON. (2) JSON mode (OpenAI, Anthropic): an API parameter that guarantees valid JSON. But it does not guarantee conformance to a specific schema. (3) Structured Outputs / JSON Schema: passing a JSON Schema to the API, and the model generates strictly according to the schema. OpenAI Structured Outputs, Anthropic tool_use. Guarantees types, required fields, enums. (4) Constrained decoding: at the inference-engine level (Outlines, guidance, lm-format-enforcer) — constraining the vocabulary at each generation step so the output conforms to a grammar/schema. A 100% format guarantee. (5) Post-processing: parsing + retry on error. Unreliable but simple. Recommendation: JSON Schema via the API (if supported) > constrained decoding > prompt + retry.',
    explanation:
      'Structured output is critical for agents (tool calling), data extraction, and integrations. OpenAI Structured Outputs and Anthropic tool_use solve the problem at the API level. For open-source models: Outlines (Python) and llama.cpp grammar are the standard tools for constrained decoding.',
  },
  {
    id: 'ai-prompt-engineering-005',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Prompt Engineering',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is prompt chaining and when should it be used?',
    options: [
      'Connecting several LLMs into a chain, where each specializes in one task',
      'Breaking a complex task into a sequence of simpler prompts, where the output of the previous one becomes the input of the next',
      'Adding several system prompts to a single request',
      'Repeatedly calling one prompt until a correct response is obtained',
    ],
    correctIndex: 1,
    explanation:
      'Prompt chaining: a complex task is broken into a chain of simple steps. Example for summarizing a document: (1) Extract the key facts → (2) Group them by topic → (3) Write a summary. Benefits: each step is simpler (fewer errors), intermediate results can be validated, and it is easier to debug. Drawbacks: more API calls, higher latency, loss of context between steps. When to use: the task decomposes naturally, validation of intermediate steps is needed, or a single prompt gives unstable results.',
  },
  {
    id: 'ai-prompt-engineering-006',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Prompt Engineering',
    difficulty: 'middle',
    type: 'open',
    question: 'What best practices for writing system prompts do you know? Give examples of good and bad practices.',
    sampleAnswer:
      'Best practices: (1) Be specific: not "be helpful," but "you are a senior Python developer who writes PEP8-compliant code with type hints." (2) Structure it: sections (Role, Instructions, Format, Constraints) with markdown headings. (3) Examples: include 1-2 examples of the desired input/output. (4) Negative instructions: "do not use the word X," "do not generate code without an explanation." (5) Output format: explicitly describe the format (JSON schema, markdown, bullet points). (6) Conciseness: remove duplication, every sentence should carry information. Bad practices: contradictory instructions ("be brief" + "explain in detail"), overly abstract roles ("be smart"), instruction overload (>2000 words without structure), attempts to "hide" the system prompt via instructions (does not work reliably).',
    explanation:
      'Prompt engineering is an empirical discipline: what works depends on the model, the task, and the data. A systematic approach: (1) start with a simple prompt, (2) add instructions to fix errors, (3) test on an eval set, (4) iterate. Anthropic and OpenAI publish detailed prompt engineering guides.',
  },
  {
    id: 'ai-prompt-engineering-007',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Prompt Engineering',
    difficulty: 'senior',
    type: 'open',
    question: 'What is Constitutional AI (CAI) and how is it related to prompt engineering?',
    sampleAnswer:
      'Constitutional AI (Anthropic, 2022) is an approach to LLM alignment through a set of principles (a constitution). The process: (1) Red-teaming: harmful requests are generated. (2) Self-critique: the model evaluates its own responses against the principles of the constitution ("Is the response harmful?"). (3) Self-revision: the model revises the response in line with the principles. (4) RLAIF: a model trained this way is used to generate preference data without humans. Relation to prompt engineering: the principles of the constitution are essentially prompts for self-evaluation. Practical applications: (1) system prompts with explicit rules of behavior, (2) self-checking chains (the model checks its response before sending it), (3) guardrails — external checks of responses against policies.',
    explanation:
      'CAI is the foundation of Anthropic\'s safety approach. In practice, elements of CAI are used in system prompts: explicit rules + self-reflection. Prompt engineering and alignment are closely connected: a good system prompt is a "micro-constitution" for a specific application.',
  },
  {
    id: 'ai-prompt-engineering-008',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Prompt Engineering',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is Tree-of-Thoughts (ToT) and how does it differ from Chain-of-Thought?',
    options: [
      'ToT is a visualization of CoT as a decision tree',
      'ToT lets the model explore several reasoning paths in parallel, evaluate them, and choose the most promising one, unlike the linear CoT',
      'ToT uses several models to generate a single answer',
      'ToT is CoT with automatic selection of the number of steps',
    ],
    correctIndex: 1,
    explanation:
      'Tree-of-Thoughts (Yao et al., 2023): (1) At each step, several alternative "thoughts" (branches) are generated. (2) Each is evaluated (self-evaluation or a heuristic). (3) Promising branches are expanded, unpromising ones are pruned (BFS/DFS). (4) The best path is chosen. CoT: a linear chain A → B → C. ToT: a tree with branching and backtracking. ToT is significantly better on tasks requiring planning and search (Game of 24, crosswords). Downsides: significantly more expensive (many LLM calls), harder to implement.',
  },
  {
    id: 'ai-prompt-engineering-009',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Prompt Engineering',
    difficulty: 'senior',
    type: 'open',
    question: 'How would you build a system for automatic prompt optimization? What approaches exist?',
    sampleAnswer:
      'Approaches: (1) DSPy (Khattab et al.): a programmatic framework where prompts are optimizable modules. A compiler automatically selects few-shot examples and instructions based on eval metrics. (2) APE (Automatic Prompt Engineer): an LLM generates candidate prompts, evaluates them on an eval set, and picks the best. (3) OPRO (Optimization by PROmpting): an LLM iteratively improves the prompt using feedback about quality. (4) PromptBreeder: an evolutionary algorithm — mutations and crossover of prompts. (5) Manual + eval: a human writes variants, and an automatic eval on a test set picks the best. A practical system: (1) Define an eval dataset + metrics. (2) A baseline prompt. (3) Variants (manually or via an LLM). (4) A/B testing on the eval set. (5) Iteration. DSPy is the most mature framework for production.',
    explanation:
      'Prompt optimization is the shift from "prompt engineering as art" to "prompt engineering as science." DSPy popularized the idea that prompts are not written by hand but optimized programmatically. The key element is a high-quality eval set. Without an eval set, automatic optimization is impossible.',
  },
];
