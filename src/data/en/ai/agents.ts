import type { Question } from '@/data/types';

export const agentsQuestions: Question[] = [
  {
    id: 'ai-agents-001',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI Agents',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is an AI agent in the context of LLMs?',
    options: [
      'An LLM trained on data from the internet',
      'A system in which an LLM autonomously plans actions, uses tools, and iteratively solves tasks',
      'A chatbot with predefined responses',
      'An API wrapper around a language model',
    ],
    correctIndex: 1,
    explanation:
      'An AI agent is a system in which the LLM acts as the "brain" driving a loop: Observe → Think → Act → Observe... Key differences from a simple LLM call: (1) tool use — search, code, APIs, (2) autonomous planning — breaking the task into steps, (3) iteration — the agent works in a loop, adjusting its actions based on the results. Examples: coding agents (Cursor, Claude Code), research agents, customer support agents.',
  },
  {
    id: 'ai-agents-002',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI Agents',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is Function Calling (Tool Use) in LLMs?',
    options: [
      'Calling functions inside the neural network during the forward pass',
      'The ability of an LLM to generate structured calls to external functions/APIs based on a description of their interface',
      'A callback mechanism triggered on a generation error',
      'Running Python code inside the LLM',
    ],
    correctIndex: 1,
    explanation:
      'Function Calling / Tool Use: the LLM receives descriptions of the available functions (name, parameters, description) in the system prompt. When needed, the model generates a structured JSON function call instead of a text response. The runtime calls the function, and the result is returned to the model. Example: the user asks "What is the weather in Moscow?" → the LLM generates {tool: "get_weather", args: {city: "Moscow"}} → the runtime calls the API → the result is passed back to the LLM → the LLM formulates the answer. Supported by: OpenAI, Anthropic, Google, open-source models.',
  },
  {
    id: 'ai-agents-003',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI Agents',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is the ReAct pattern in AI agents?',
    options: [
      'Using the React.js library to build AI interfaces',
      'Alternating Reasoning and Acting steps: the agent first thinks, then acts, then observes the result',
      'A reactive architecture in which the agent instantly responds to events',
      'A method of training an agent through reward and punishment',
    ],
    correctIndex: 1,
    explanation:
      'ReAct (Yao et al., 2023) is a pattern of alternating reasoning and actions: Thought → Action → Observation → Thought → ... Thought: the agent reasons about what to do. Action: it calls a tool (search, calculator, API). Observation: it receives the result. The loop repeats until the task is solved. Benefits: transparency (the logic can be traced), fewer hallucinations (actions are verifiable), and the ability to self-correct. ReAct became the foundation for most agent frameworks (LangChain, LlamaIndex).',
  },
  {
    id: 'ai-agents-004',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI Agents',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is MCP (Model Context Protocol) and what problem does it solve?',
    options: [
      'A protocol for encrypting data between the LLM and the client',
      'A standardized protocol for connecting LLMs to external data sources and tools, providing a universal integration interface',
      'A method of compressing context to reduce the number of tokens',
      'A messaging protocol between multiple LLMs',
    ],
    correctIndex: 1,
    explanation:
      'MCP (Anthropic, 2024) is an open protocol that standardizes connecting LLMs to external systems. Analogy: USB for AI — a single interface instead of custom integrations for each tool. Architecture: MCP Host (an application with an LLM) → MCP Client → MCP Server (which provides tools/resources). The server declares its capabilities (tools, resources, prompts), and the client calls them. Benefits: reusable servers, a standard protocol, and security (controlled access). Supported by: Claude Desktop, Cursor, and a growing ecosystem of servers.',
  },
  {
    id: 'ai-agents-005',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI Agents',
    difficulty: 'middle',
    type: 'open',
    question: 'What types of memory are used in AI agents? Why is long-term memory needed?',
    sampleAnswer:
      'Types of memory: (1) Working memory: the current LLM context (system prompt + history). Limited by the context window. Lost between sessions. (2) Short-term: the history of the current session, intermediate results. Implementation: a conversation buffer, a sliding window. (3) Long-term: knowledge and experience that persists between sessions. Implementation: a vector store of previous interactions, summary memories, entity memory. (4) Episodic: specific "memories" of past tasks. (5) Semantic: generalized knowledge and facts. Why long-term memory: personalization (remembers user preferences), learning from experience (remembers successful strategies), and context across sessions (no need to repeat information).',
    explanation:
      'Memory is one of the key unsolved problems for AI agents. Current approaches (RAG over past interactions, summary memory) are compromises. Active research: MemGPT (virtual memory like in an OS), reflexion (self-reflection for improvement), generative agents (Park et al., 2023 — agents with long-term memory in a simulation).',
  },
  {
    id: 'ai-agents-006',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI Agents',
    difficulty: 'middle',
    type: 'open',
    question: 'Compare single-agent and multi-agent architectures. When is using multiple agents justified?',
    sampleAnswer:
      'Single-agent: one LLM with a set of tools solves the task. Pros: simplicity, lower latency, easier debugging. Cons: all roles in one context (it can get confused), a limited set of competencies. Multi-agent: several specialized agents interact. Patterns: (1) Supervisor — one coordinator agent distributes tasks among specialists. (2) Debate/Discussion — agents discuss and reach a consensus. (3) Pipeline — agents work sequentially (researcher → writer → reviewer). (4) Hierarchical — a tree of agents with delegation. Justified when: different roles require different system prompts / tools, the task naturally decomposes into independent sub-tasks, or verification is needed (one creates, another reviews).',
    explanation:
      'Multi-agent is an active area: CrewAI, AutoGen, LangGraph. The key trade-off: quality vs complexity and cost. In practice, a single agent with a good set of tools is often sufficient. Multi-agent is justified for complex workflows (software development, research) where decomposition by roles is natural.',
  },
  {
    id: 'ai-agents-007',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI Agents',
    difficulty: 'senior',
    type: 'open',
    question: 'What are the main reliability problems of AI agents and how do you address them?',
    sampleAnswer:
      'Problems: (1) Error propagation: an error in an early step cascades. Solution: self-verification, checkpoints, rollback. (2) Infinite loops: the agent repeats unsuccessful actions. Solution: a step limit, repeat detection, fallback strategies. (3) Tool misuse: wrong arguments or choice of tool. Solution: input validation, structured output (JSON schema), few-shot examples in tool descriptions. (4) Context window overflow: long chains of actions overflow the context. Solution: summarizing intermediate steps, a sliding window with key facts. (5) Planning failures: incorrect task decomposition. Solution: the plan-and-execute pattern (plan first, then execute), human-in-the-loop for critical decisions. (6) Hallucinated tool calls: calling functions that do not exist. Solution: strict mode, a validation layer. General approach: defense in depth — several layers of checks and constraints.',
    explanation:
      'Reliability is the main barrier to the production deployment of agents. The current approach: limit autonomy (human-in-the-loop for risky actions), monitoring and observability (traces, logs), graceful degradation. Frameworks: LangSmith (observability), Guardrails AI (validation).',
  },
  {
    id: 'ai-agents-008',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI Agents',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is the "Plan-and-Execute" pattern in AI agents and how does it differ from ReAct?',
    options: [
      'Plan-and-Execute is another name for ReAct',
      'In Plan-and-Execute the agent first creates a complete action plan, then executes the steps of the plan, replanning when necessary; ReAct alternates thinking and acting at each step without a prior plan',
      'Plan-and-Execute does not use tools, only reasoning',
      'ReAct works with only one tool, while Plan-and-Execute works with several',
    ],
    correctIndex: 1,
    explanation:
      'ReAct: Think → Act → Observe → Think → Act → ... (incremental, one step at a time). Good for simple tasks, but it can "get lost" on complex ones. Plan-and-Execute: (1) a planner creates a complete plan (a list of steps), (2) an executor performs each step, (3) on failure — replanning. Advantages of P&E: better for complex multi-step tasks, more predictable, and the plan can be shown to the user for approval. Disadvantages: planning overhead, and the plan may be suboptimal for unpredictable tasks. In practice a hybrid is often used: a high-level plan + ReAct for individual steps.',
  },
  {
    id: 'ai-agents-009',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI Agents',
    difficulty: 'senior',
    type: 'open',
    question: 'How would you design an authentication and authorization system for an AI agent that interacts with external APIs and databases?',
    sampleAnswer:
      'Principles: (1) Least privilege: the agent gets the minimum necessary permissions. Separate API keys with limited scope, read-only access where possible. (2) Sandboxing: code execution in an isolated environment (Docker, Firecracker). Restricting network access (allow-list). (3) Human-in-the-loop: confirmation for dangerous operations (DELETE, financial transactions, sending emails). (4) Audit trail: logging all tool calls with their parameters and results. Immutable logs. (5) Rate limiting: limiting the frequency and number of calls per tool. (6) Token-based auth: short-lived tokens for each agent session, not long-lived API keys. (7) Scope escalation prevention: the agent cannot request more permissions than it was granted. (8) Input validation: sanitizing all tool arguments, preventing injection through tool arguments.',
    explanation:
      'Agent security is a critical topic, especially with the rise of "agentic AI" in the enterprise. OWASP released a Top 10 for LLM Applications. Key risks: prompt injection via tool outputs, indirect prompt injection via retrieved documents, and excessive agency (the agent does more than it should). Defense in depth is the only reliable approach.',
  },
];
