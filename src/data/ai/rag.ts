import type { Question } from '../types';

export const ragQuestions: Question[] = [
  {
    id: 'ai-rag-001',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое RAG (Retrieval-Augmented Generation)?',
    options: [
      'Метод обучения LLM на размеченных данных',
      'Паттерн, при котором LLM дополняется релевантными документами из внешнего хранилища перед генерацией ответа',
      'Алгоритм сжатия нейронных сетей',
      'Техника аугментации обучающих данных',
    ],
    correctIndex: 1,
    explanation:
      'RAG (Lewis et al., 2020) — архитектурный паттерн: (1) Пользователь задаёт вопрос. (2) Retriever находит релевантные документы из базы знаний. (3) Найденные документы добавляются в промпт LLM как контекст. (4) LLM генерирует ответ на основе и вопроса, и найденных документов. Преимущества: актуальность (данные обновляются без переобучения), снижение галлюцинаций (ответ основан на источниках), attribution (можно указать источники).',
  },
  {
    id: 'ai-rag-002',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое эмбеддинги (embeddings) в контексте RAG?',
    options: [
      'Сжатые копии документов для экономии памяти',
      'Числовые векторы фиксированной размерности, представляющие семантический смысл текста, где похожие тексты имеют близкие векторы',
      'Индексы позиций слов в документе',
      'Зашифрованные представления документов',
    ],
    correctIndex: 1,
    explanation:
      'Embeddings — плотные вектора (обычно 384–1536 dim), кодирующие семантику текста. Модели: OpenAI text-embedding-3-small/large, Cohere embed, open-source (BGE, E5, GTE). Свойство: семантически близкие тексты имеют близкие вектора (высокий cosine similarity). В RAG: документы преобразуются в embeddings и сохраняются в vector store. При запросе: embedding запроса сравнивается с embeddings документов для нахождения релевантных. Качество embeddings напрямую влияет на качество retrieval.',
  },
  {
    id: 'ai-rag-003',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Зачем нужен chunking (разбиение) документов в RAG-пайплайне?',
    options: [
      'Для шифрования конфиденциальных данных',
      'Потому что embedding-модели и LLM имеют ограничение на длину входа, а мелкие фрагменты обеспечивают более точный retrieval',
      'Для параллельной загрузки документов',
      'Для удаления дубликатов в документах',
    ],
    correctIndex: 1,
    explanation:
      'Chunking разбивает большие документы на фрагменты для: (1) Embedding-модели имеют лимит (512–8K токенов). (2) Маленькие чанки дают более точный (granular) retrieval — вместо целого документа возвращается конкретный абзац. (3) Контекстное окно LLM ограничено — нужно уместить несколько чанков. Стратегии: fixed-size (по 512 токенов с overlap), semantic (по смыслу, абзацам), recursive (с иерархией разделителей). Размер чанка — ключевой гиперпараметр: слишком маленький — теряется контекст, слишком большой — шум и низкая точность retrieval.',
  },
  {
    id: 'ai-rag-004',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое Hybrid Search в контексте RAG и почему он эффективнее чисто семантического поиска?',
    options: [
      'Комбинация поиска по изображениям и тексту',
      'Объединение семантического (vector) поиска и лексического (keyword, BM25) поиска для повышения recall и точности',
      'Поиск одновременно в нескольких LLM',
      'Комбинация online и offline поиска',
    ],
    correctIndex: 1,
    explanation:
      'Hybrid Search комбинирует: (1) Семантический поиск (dense retrieval): находит документы по смыслу через embeddings. Хорош для парафразов, синонимов. Плох для точных терминов, аббревиатур, названий. (2) Лексический поиск (sparse, BM25): находит по точному совпадению ключевых слов. Хорош для специфических терминов. Плох для парафразов. Результаты объединяются через Reciprocal Rank Fusion (RRF) или другие методы. На бенчмарках hybrid search стабильно лучше каждого подхода в отдельности. Поддерживается: Weaviate, Qdrant, Elasticsearch, Pinecone.',
  },
  {
    id: 'ai-rag-005',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'middle',
    type: 'open',
    question: 'Что такое reranking в RAG? Зачем он нужен, если уже есть retrieval?',
    sampleAnswer:
      'Reranking — второй этап ранжирования после initial retrieval. Пайплайн: (1) Retriever (быстрый, bi-encoder) возвращает top-k (20-100) кандидатов. (2) Reranker (точный, cross-encoder) пересортирует кандидатов, оценивая пару (query, document) совместно. (3) Top-n после reranking передаются в LLM. Зачем: bi-encoder (embedding search) кодирует query и document независимо — быстро, но менее точно. Cross-encoder обрабатывает query+document вместе через attention — точнее, но медленно (O(n×m) vs O(n+m)). Reranker «исправляет» ошибки retriever. Модели: Cohere Rerank, cross-encoder models (ms-marco), ColBERT (late interaction — компромисс скорость/качество). На практике reranking улучшает качество RAG на 5-15% по метрикам.',
    explanation:
      'Двухэтапный retrieval (retrieve + rerank) — стандартный паттерн в information retrieval, перенесённый в RAG. Аналогия: Google сначала быстро находит кандидатов (inverted index), потом ранжирует их (ML-модель). В RAG: vector search → reranker → LLM.',
  },
  {
    id: 'ai-rag-006',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'middle',
    type: 'open',
    question: 'Какие стратегии chunking существуют? Как выбрать оптимальный размер чанка?',
    sampleAnswer:
      'Стратегии: (1) Fixed-size: фиксированное количество токенов (256-1024) с overlap (10-20%). Простой, универсальный. (2) Recursive: иерархия разделителей (\\n\\n → \\n → . → пробел). Сохраняет структуру текста. (3) Semantic: группировка предложений по семантической близости (embeddings similarity). Наиболее точный, но сложный. (4) Document-aware: учитывает структуру (headers, sections для Markdown/HTML, slides для PDF). (5) Agentic chunking: LLM определяет границы чанков. Выбор размера: маленькие чанки (256-512) — для точного QA на конкретные факты. Большие чанки (1024-2048) — для суммаризации, сложных вопросов. Overlap (10-20%) — для сохранения контекста на границах. Лучший подход: экспериментировать на своих данных, оценивая retrieval precision/recall.',
    explanation:
      'Chunking — один из самых влияющих на качество RAG гиперпараметров. Нет универсально лучшей стратегии: для юридических документов подходит document-aware (по секциям), для FAQ — маленькие чанки, для исследований — semantic chunking. «Parent-child» подход: retrieval по маленьким чанкам, но в контекст LLM передаётся родительский (больший) фрагмент.',
  },
  {
    id: 'ai-rag-007',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите архитектуру Advanced RAG: какие улучшения поверх наивного RAG существуют и когда они нужны?',
    sampleAnswer:
      'Наивный RAG: embed query → vector search → top-k в промпт → LLM ответ. Проблемы: плохой retrieval, потеря контекста, галлюцинации. Advanced RAG улучшения: (1) Pre-retrieval: query rewriting (LLM переформулирует запрос), HyDE (гипотетический ответ как query), query decomposition (разбиение сложного вопроса на подвопросы). (2) Retrieval: hybrid search, multi-index (разные индексы для разных типов данных), metadata filtering. (3) Post-retrieval: reranking, context compression (суммаризация чанков), lost-in-the-middle mitigation (важные чанки в начало/конец). (4) Generation: citation/attribution, self-RAG (модель решает, нужен ли retrieval), CRAG (corrective RAG — проверка релевантности retrieved документов). (5) Evaluation: RAGAS framework (faithfulness, answer relevancy, context precision/recall).',
    explanation:
      'Advanced RAG — это набор техник, а не монолитная архитектура. На практике выбирают 2-3 наиболее релевантных улучшения. Self-RAG и CRAG — перспективные направления, где модель сама управляет retrieval процессом. Evaluation через RAGAS или DeepEval — обязательный этап для production RAG.',
  },
  {
    id: 'ai-rag-008',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'senior',
    type: 'open',
    question: 'Сравните RAG и Long Context LLM (128K+ токенов). Когда RAG всё ещё предпочтительнее?',
    sampleAnswer:
      'Long Context: загрузить все документы в контекст LLM целиком. Плюсы: простая архитектура, нет retrieval ошибок, модель видит всё. Минусы: (1) стоимость — O(n²) attention, billing за все токены, (2) «lost in the middle» — качество падает для информации в середине контекста, (3) latency растёт с длиной контекста, (4) ограничение на общий объём данных. RAG предпочтительнее когда: (1) база знаний > 1M токенов (сотни документов), (2) данные часто обновляются (переиндексация vs переподача контекста), (3) нужна attribution (ссылки на источники), (4) нужна экономия на API-вызовах, (5) требуется точность для конкретных фактов (focused retrieval > «найди иголку в стоге»). Оптимальный подход: RAG для retrieval + long context для reasoning по найденным документам.',
    explanation:
      'Дискуссия RAG vs Long Context — одна из актуальных в 2024-2026. Исследования (Lost in the Middle, Needle in a Haystack) показывают ограничения long context. На практике hybrid подход (RAG + moderate context window) часто оптимален по соотношению цена/качество.',
  },
  {
    id: 'ai-rag-009',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое GraphRAG и какое преимущество он даёт над классическим vector-based RAG?',
    options: [
      'GraphRAG использует графические процессоры (GPU) для ускорения retrieval',
      'GraphRAG строит knowledge graph из документов и использует связи между сущностями для более полного retrieval, особенно для вопросов, требующих синтеза информации из нескольких документов',
      'GraphRAG — это RAG с визуализацией результатов в виде графиков',
      'GraphRAG хранит embeddings в графовой базе данных вместо векторной',
    ],
    correctIndex: 1,
    explanation:
      'GraphRAG (Microsoft, 2024) извлекает сущности и их связи из документов, строя knowledge graph. При запросе: (1) находит релевантные сущности, (2) обходит граф для нахождения связанных фактов, (3) передаёт subgraph + документы в LLM. Преимущество: для вопросов типа «как X связан с Y?» или «обобщи все факты о Z» — vector search может пропустить документы, не содержащие точных ключевых слов, но связанные через цепочку сущностей. Ограничения: сложность построения графа, стоимость (LLM для extraction), актуализация при обновлении документов.',
  },
];
