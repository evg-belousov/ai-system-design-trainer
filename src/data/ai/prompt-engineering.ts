import type { Question } from '../types';

export const promptEngineeringQuestions: Question[] = [
  {
    id: 'ai-prompt-engineering-001',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Промпт-инжиниринг',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое few-shot prompting?',
    options: [
      'Обучение модели на малом количестве данных (fine-tuning)',
      'Добавление нескольких примеров «вход → выход» в промпт, чтобы модель поняла формат и задачу без обучения',
      'Генерация нескольких вариантов ответа для выбора лучшего',
      'Использование короткого промпта для экономии токенов',
    ],
    correctIndex: 1,
    explanation:
      'Few-shot prompting — техника in-context learning: в промпт добавляются 2-5 примеров входов и желаемых выходов. Модель «учится» формату и задаче из примеров без обновления весов. Варианты: zero-shot (без примеров, только инструкция), one-shot (один пример), few-shot (2-5 примеров). Качество сильно зависит от выбора примеров: разнообразные, репрезентативные примеры работают лучше. Порядок примеров тоже влияет (recency bias).',
  },
  {
    id: 'ai-prompt-engineering-002',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Промпт-инжиниринг',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое Chain-of-Thought (CoT) prompting?',
    options: [
      'Цепочка последовательных вызовов нескольких LLM',
      'Техника, при которой модель поощряется рассуждать пошагово перед выдачей финального ответа',
      'Метод объединения нескольких промптов в один',
      'Способ генерации текста по цепочке ключевых слов',
    ],
    correctIndex: 1,
    explanation:
      'Chain-of-Thought (Wei et al., 2022): добавление фразы «Let\'s think step by step» или примеров с пошаговым рассуждением побуждает модель показывать промежуточные шаги мышления. Результат: значительное улучшение на задачах, требующих reasoning (математика, логика, code). Варианты: zero-shot CoT («давай подумаем пошагово»), few-shot CoT (примеры с рассуждениями), Auto-CoT (автоматическая генерация chain-of-thought). CoT особенно эффективен для больших моделей (>10B параметров).',
  },
  {
    id: 'ai-prompt-engineering-003',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Промпт-инжиниринг',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Какую роль выполняет system prompt?',
    options: [
      'Содержит обучающие данные для fine-tuning модели',
      'Задаёт роль, поведение, ограничения и контекст для модели на протяжении всего диалога',
      'Определяет максимальную длину ответа модели',
      'Шифрует коммуникацию между клиентом и API',
    ],
    correctIndex: 1,
    explanation:
      'System prompt — специальное сообщение в начале диалога, определяющее «личность» и правила модели. Содержит: роль (ты — эксперт по X), инструкции по формату (отвечай JSON), ограничения (не обсуждай тему Y), контекст (дата, доступные инструменты). Обрабатывается моделью с повышенным «приоритетом» по сравнению с user-сообщениями. Хороший system prompt: конкретный, структурированный, с примерами. Антипаттерн: слишком длинный system prompt, противоречивые инструкции.',
  },
  {
    id: 'ai-prompt-engineering-004',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Промпт-инжиниринг',
    difficulty: 'middle',
    type: 'open',
    question: 'Опишите технику Structured Output. Как гарантировать, что LLM вернёт ответ в нужном формате (JSON, XML)?',
    sampleAnswer:
      'Подходы к structured output: (1) Prompt-based: описать формат в промпте, привести примеры JSON. Ненадёжно — модель может добавить текст вне JSON. (2) JSON mode (OpenAI, Anthropic): API-параметр, гарантирующий валидный JSON. Но не гарантирует соответствие конкретной schema. (3) Structured Outputs / JSON Schema: передача JSON Schema в API, модель генерирует строго по schema. OpenAI Structured Outputs, Anthropic tool_use. Гарантирует типы, обязательные поля, enum. (4) Constrained decoding: на уровне inference engine (Outlines, guidance, lm-format-enforcer) — ограничение vocabulary на каждом шаге генерации, чтобы выход соответствовал грамматике/schema. 100% гарантия формата. (5) Post-processing: парсинг + retry при ошибке. Ненадёжно, но просто. Рекомендация: JSON Schema через API (если поддерживается) > constrained decoding > prompt + retry.',
    explanation:
      'Structured output критичен для агентов (tool calling), data extraction, и интеграций. OpenAI Structured Outputs и Anthropic tool_use решают проблему на уровне API. Для open-source моделей: Outlines (Python) и llama.cpp grammar — стандартные инструменты constrained decoding.',
  },
  {
    id: 'ai-prompt-engineering-005',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Промпт-инжиниринг',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое prompt chaining и когда его использовать?',
    options: [
      'Соединение нескольких LLM в цепочку, где каждая специализируется на одной задаче',
      'Разбиение сложной задачи на последовательность более простых промптов, где выход предыдущего становится входом следующего',
      'Добавление нескольких системных промптов к одному запросу',
      'Повторный вызов одного промпта до получения корректного ответа',
    ],
    correctIndex: 1,
    explanation:
      'Prompt chaining: сложная задача разбивается на цепочку простых шагов. Пример для суммаризации документа: (1) Извлеки ключевые факты → (2) Сгруппируй по темам → (3) Напиши summary. Преимущества: каждый шаг проще (меньше ошибок), можно валидировать промежуточные результаты, легче отлаживать. Недостатки: больше API-вызовов, выше latency, потеря контекста между шагами. Когда использовать: задача естественно декомпозируется, нужна валидация промежуточных шагов, single prompt даёт нестабильные результаты.',
  },
  {
    id: 'ai-prompt-engineering-006',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Промпт-инжиниринг',
    difficulty: 'middle',
    type: 'open',
    question: 'Какие best practices написания system prompts вы знаете? Приведите примеры хороших и плохих практик.',
    sampleAnswer:
      'Best practices: (1) Be specific: не «будь полезным», а «ты — senior Python-разработчик, пишешь PEP8-compliant код с type hints». (2) Структурируй: секции (Role, Instructions, Format, Constraints) с markdown-заголовками. (3) Примеры: включи 1-2 примера желаемого input/output. (4) Негативные инструкции: «не используй слово X», «не генерируй код без объяснения». (5) Формат выхода: явно опиши формат (JSON schema, markdown, bullet points). (6) Краткость: удаляй дублирование, каждое предложение должно нести информацию. Плохие практики: противоречивые инструкции («будь краток» + «объясни подробно»), слишком абстрактные роли («будь умным»), перегрузка инструкциями (>2000 слов без структуры), попытки «спрятать» system prompt через инструкции (не работает надёжно).',
    explanation:
      'Промпт-инжиниринг — эмпирическая дисциплина: что работает, зависит от модели, задачи и данных. Систематический подход: (1) начни с простого промпта, (2) добавляй инструкции для исправления ошибок, (3) тестируй на eval-наборе, (4) итерируй. Anthropic и OpenAI публикуют подробные prompt engineering guides.',
  },
  {
    id: 'ai-prompt-engineering-007',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Промпт-инжиниринг',
    difficulty: 'senior',
    type: 'open',
    question: 'Что такое Constitutional AI (CAI) и как оно связано с промпт-инжинирингом?',
    sampleAnswer:
      'Constitutional AI (Anthropic, 2022) — подход к alignment LLM через набор принципов (конституцию). Процесс: (1) Red-teaming: генерируются вредные запросы. (2) Self-critique: модель оценивает свои ответы по принципам конституции («Является ли ответ вредным?»). (3) Self-revision: модель исправляет ответ в соответствии с принципами. (4) RLAIF: обученная таким образом модель используется для генерации preference data без людей. Связь с промпт-инжинирингом: принципы конституции — это по сути промпты для self-evaluation. Практическое применение: (1) системные промпты с explicit правилами поведения, (2) self-checking chains (модель проверяет свой ответ перед отправкой), (3) guardrails — внешние проверки ответов на соответствие политикам.',
    explanation:
      'CAI — foundation для safety-подхода Anthropic. На практике элементы CAI используются в system prompts: explicit правила + self-reflection. Промпт-инжиниринг и alignment тесно связаны: хороший system prompt — это «микро-конституция» для конкретного приложения.',
  },
  {
    id: 'ai-prompt-engineering-008',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Промпт-инжиниринг',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое Tree-of-Thoughts (ToT) и чем он отличается от Chain-of-Thought?',
    options: [
      'ToT — визуализация CoT в виде дерева решений',
      'ToT позволяет модели исследовать несколько путей рассуждения параллельно, оценивать их и выбирать наиболее перспективный, в отличие от линейного CoT',
      'ToT использует несколько моделей для генерации одного ответа',
      'ToT — это CoT с автоматическим выбором количества шагов',
    ],
    correctIndex: 1,
    explanation:
      'Tree-of-Thoughts (Yao et al., 2023): (1) На каждом шаге генерируется несколько альтернативных «мыслей» (branches). (2) Каждая оценивается (self-evaluation или эвристика). (3) Перспективные ветви расширяются, бесперспективные отбрасываются (BFS/DFS). (4) Выбирается лучший путь. CoT: линейная цепочка A → B → C. ToT: дерево с branching и backtracking. ToT значительно лучше на задачах, требующих планирования и поиска (Game of 24, crosswords). Минусы: значительно дороже (много LLM-вызовов), сложнее в реализации.',
  },
  {
    id: 'ai-prompt-engineering-009',
    block: 'ai',
    topic: 'prompt-engineering',
    topicLabel: 'Промпт-инжиниринг',
    difficulty: 'senior',
    type: 'open',
    question: 'Как построить систему автоматической оптимизации промптов (prompt optimization)? Какие подходы существуют?',
    sampleAnswer:
      'Подходы: (1) DSPy (Khattab et al.): программный фреймворк, где промпты — оптимизируемые модули. Компилятор автоматически подбирает few-shot примеры и инструкции на основе eval-метрик. (2) APE (Automatic Prompt Engineer): LLM генерирует кандидаты промптов, оценивает их на eval set, выбирает лучший. (3) OPRO (Optimization by PROmpting): LLM итеративно улучшает промпт, получая feedback о качестве. (4) PromptBreeder: эволюционный алгоритм — мутации и скрещивание промптов. (5) Manual + eval: человек пишет варианты, автоматический eval на test set выбирает лучший. Практическая система: (1) Определить eval dataset + метрики. (2) Baseline промпт. (3) Варианты (вручную или через LLM). (4) A/B тестирование на eval set. (5) Итерация. DSPy — наиболее зрелый фреймворк для production.',
    explanation:
      'Prompt optimization — переход от «prompt engineering as art» к «prompt engineering as science». DSPy популяризировал идею: промпты не пишут вручную, а оптимизируют программно. Ключевой элемент — качественный eval набор. Без eval автоматическая оптимизация невозможна.',
  },
];
