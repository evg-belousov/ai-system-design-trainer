import type { Question } from '../types';

export const agentsQuestions: Question[] = [
  {
    id: 'ai-agents-001',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI-агенты',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое AI-агент в контексте LLM?',
    options: [
      'LLM, обученная на данных из интернета',
      'Система, где LLM автономно планирует действия, использует инструменты и итеративно решает задачи',
      'Чат-бот с предопределёнными ответами',
      'API-обёртка над языковой моделью',
    ],
    correctIndex: 1,
    explanation:
      'AI-агент — система, в которой LLM выступает «мозгом», управляющим циклом: Observe → Think → Act → Observe... Ключевые отличия от простого LLM-вызова: (1) использование инструментов (tools) — поиск, код, API, (2) автономное планирование — разбиение задачи на шаги, (3) итеративность — агент работает в цикле, корректируя свои действия на основе результатов. Примеры: coding agents (Cursor, Claude Code), research agents, customer support agents.',
  },
  {
    id: 'ai-agents-002',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI-агенты',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое Function Calling (Tool Use) в LLM?',
    options: [
      'Вызов функций внутри нейронной сети при forward pass',
      'Способность LLM генерировать структурированные вызовы внешних функций/API на основе описания их интерфейса',
      'Механизм обратного вызова при ошибке генерации',
      'Запуск Python-кода внутри LLM',
    ],
    correctIndex: 1,
    explanation:
      'Function Calling / Tool Use: LLM получает описания доступных функций (имя, параметры, описание) в system prompt. При необходимости модель генерирует структурированный JSON-вызов функции вместо текстового ответа. Среда выполнения (runtime) вызывает функцию, результат возвращается модели. Пример: пользователь спрашивает «Какая погода в Москве?» → LLM генерирует {tool: "get_weather", args: {city: "Moscow"}} → runtime вызывает API → результат передаётся LLM → LLM формулирует ответ. Поддерживается: OpenAI, Anthropic, Google, open-source модели.',
  },
  {
    id: 'ai-agents-003',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI-агенты',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое паттерн ReAct в AI-агентах?',
    options: [
      'Использование библиотеки React.js для создания интерфейсов AI',
      'Чередование шагов Reasoning (рассуждение) и Acting (действие): агент сначала думает, потом действует, потом наблюдает результат',
      'Реактивная архитектура, где агент мгновенно реагирует на события',
      'Метод обучения агента через reward и punishment',
    ],
    correctIndex: 1,
    explanation:
      'ReAct (Yao et al., 2023) — паттерн чередования рассуждений и действий: Thought → Action → Observation → Thought → ... Thought: агент рассуждает, что нужно сделать. Action: вызывает инструмент (поиск, калькулятор, API). Observation: получает результат. Цикл повторяется до решения задачи. Преимущества: прозрачность (можно отследить логику), меньше галлюцинаций (действия верифицируемы), способность к самокоррекции. ReAct стал основой для большинства агентных фреймворков (LangChain, LlamaIndex).',
  },
  {
    id: 'ai-agents-004',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI-агенты',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое MCP (Model Context Protocol) и какую проблему он решает?',
    options: [
      'Протокол шифрования данных между LLM и клиентом',
      'Стандартизированный протокол для подключения LLM к внешним источникам данных и инструментам, обеспечивающий универсальный интерфейс интеграции',
      'Метод сжатия контекста для уменьшения количества токенов',
      'Протокол обмена сообщениями между несколькими LLM',
    ],
    correctIndex: 1,
    explanation:
      'MCP (Anthropic, 2024) — открытый протокол, стандартизирующий подключение LLM к внешним системам. Аналогия: USB для AI — единый интерфейс вместо кастомных интеграций для каждого инструмента. Архитектура: MCP Host (приложение с LLM) → MCP Client → MCP Server (предоставляет tools/resources). Сервер объявляет capabilities (tools, resources, prompts), клиент вызывает их. Преимущества: переиспользуемость серверов, стандартный протокол, безопасность (контролируемый доступ). Поддерживается: Claude Desktop, Cursor, и растущая экосистема серверов.',
  },
  {
    id: 'ai-agents-005',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI-агенты',
    difficulty: 'middle',
    type: 'open',
    question: 'Какие типы памяти используются в AI-агентах? Зачем нужна долгосрочная память?',
    sampleAnswer:
      'Типы памяти: (1) Рабочая (working memory): текущий контекст LLM (system prompt + history). Ограничена контекстным окном. Теряется между сессиями. (2) Краткосрочная (short-term): история текущей сессии, промежуточные результаты. Реализация: conversation buffer, sliding window. (3) Долгосрочная (long-term): знания и опыт, сохраняющиеся между сессиями. Реализация: vector store с предыдущими взаимодействиями, summary memories, entity memory. (4) Эпизодическая: конкретные «воспоминания» о прошлых задачах. (5) Семантическая: обобщённые знания и факты. Зачем долгосрочная: персонализация (помнит предпочтения пользователя), обучение на опыте (помнит успешные стратегии), контекст между сессиями (не нужно повторять информацию).',
    explanation:
      'Память — одна из ключевых нерешённых проблем AI-агентов. Текущие подходы (RAG over past interactions, summary memory) — компромиссы. Активные исследования: MemGPT (виртуальная память как в ОС), reflexion (self-reflection для улучшения), generative agents (Park et al., 2023 — агенты с долгосрочной памятью в симуляции).',
  },
  {
    id: 'ai-agents-006',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI-агенты',
    difficulty: 'middle',
    type: 'open',
    question: 'Сравните single-agent и multi-agent архитектуры. Когда оправдано использование нескольких агентов?',
    sampleAnswer:
      'Single-agent: один LLM с набором инструментов решает задачу. Плюсы: простота, меньше latency, проще отладка. Минусы: все роли в одном контексте (может путаться), ограниченный набор компетенций. Multi-agent: несколько специализированных агентов взаимодействуют. Паттерны: (1) Supervisor — один агент-координатор распределяет задачи между специалистами. (2) Debate/Discussion — агенты обсуждают и приходят к консенсусу. (3) Pipeline — агенты работают последовательно (researcher → writer → reviewer). (4) Hierarchical — дерево агентов с делегированием. Оправдано когда: разные роли требуют разных system prompts / tools, задача естественно декомпозируется на независимые подзадачи, нужна проверка (один создаёт, другой ревьюит).',
    explanation:
      'Multi-agent — активная область: CrewAI, AutoGen, LangGraph. Ключевой trade-off: качество vs сложность и стоимость. На практике часто single-agent с хорошим набором tools достаточен. Multi-agent оправдан для сложных workflows (software development, research) где декомпозиция по ролям natural.',
  },
  {
    id: 'ai-agents-007',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI-агенты',
    difficulty: 'senior',
    type: 'open',
    question: 'Какие основные проблемы надёжности (reliability) AI-агентов и как их решать?',
    sampleAnswer:
      'Проблемы: (1) Error propagation: ошибка на раннем шаге каскадирует. Решение: self-verification, checkpoints, rollback. (2) Infinite loops: агент повторяет неуспешные действия. Решение: лимит шагов, detection повторов, fallback стратегии. (3) Tool misuse: неправильные аргументы или выбор инструмента. Решение: валидация входов, structured output (JSON schema), few-shot примеры в tool descriptions. (4) Context window overflow: длинные цепочки действий переполняют контекст. Решение: summarization промежуточных шагов, sliding window с ключевыми фактами. (5) Planning failures: неправильная декомпозиция задачи. Решение: plan-and-execute паттерн (сначала план, потом выполнение), human-in-the-loop для критичных решений. (6) Hallucinated tool calls: вызов несуществующих функций. Решение: strict mode, validation layer. Общий подход: defense in depth — несколько слоёв проверок и ограничений.',
    explanation:
      'Надёжность — главный барьер для production deployment агентов. Текущий подход: ограничить автономность (human-in-the-loop для рискованных действий), мониторинг и observability (traces, logs), graceful degradation. Frameworks: LangSmith (observability), Guardrails AI (validation).',
  },
  {
    id: 'ai-agents-008',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI-агенты',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое паттерн «Plan-and-Execute» в AI-агентах и чем он отличается от ReAct?',
    options: [
      'Plan-and-Execute — это другое название для ReAct',
      'В Plan-and-Execute агент сначала создаёт полный план действий, затем выполняет шаги по плану, при необходимости перепланируя; ReAct чередует мышление и действие на каждом шаге без предварительного плана',
      'Plan-and-Execute не использует инструменты, только рассуждения',
      'ReAct работает только с одним инструментом, Plan-and-Execute — с несколькими',
    ],
    correctIndex: 1,
    explanation:
      'ReAct: Think → Act → Observe → Think → Act → ... (incremental, один шаг за раз). Хорош для простых задач, но может «заблудиться» на сложных. Plan-and-Execute: (1) Planner создаёт полный план (список шагов), (2) Executor выполняет каждый шаг, (3) при неудаче — replanning. Преимущества P&E: лучше для сложных задач с многими шагами, более предсказуем, можно показать план пользователю для approval. Недостатки: overhead на планирование, план может быть неоптимальным для непредсказуемых задач. На практике часто используется гибрид: план высокого уровня + ReAct для отдельных шагов.',
  },
  {
    id: 'ai-agents-009',
    block: 'ai',
    topic: 'agents',
    topicLabel: 'AI-агенты',
    difficulty: 'senior',
    type: 'open',
    question: 'Как спроектировать систему аутентификации и авторизации для AI-агента, который взаимодействует с внешними API и базами данных?',
    sampleAnswer:
      'Принципы: (1) Least privilege: агент получает минимальные необходимые права. Отдельные API-ключи с ограниченным scope, read-only доступ где возможно. (2) Sandboxing: выполнение кода в изолированной среде (Docker, Firecracker). Ограничение сетевого доступа (allow-list). (3) Human-in-the-loop: подтверждение для опасных операций (DELETE, финансовые транзакции, отправка emails). (4) Audit trail: логирование всех tool calls с параметрами и результатами. Immutable logs. (5) Rate limiting: ограничение частоты и количества вызовов по каждому инструменту. (6) Token-based auth: short-lived tokens для каждой сессии агента, не long-lived API keys. (7) Scope escalation prevention: агент не может запросить больше прав, чем выделено. (8) Input validation: санитизация всех аргументов инструментов, предотвращение injection через tool arguments.',
    explanation:
      'Безопасность агентов — критическая тема, особенно с ростом «agentic AI» в enterprise. OWASP выпустил Top 10 для LLM Applications. Ключевые риски: prompt injection через tool outputs, indirect prompt injection через retrieved documents, excessive agency (агент делает больше, чем нужно). Defense in depth — единственный надёжный подход.',
  },
];
