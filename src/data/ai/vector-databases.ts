import type { Question } from '../types';

export const vectorDatabasesQuestions: Question[] = [
  {
    id: 'ai-vector-databases-001',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Векторные БД',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое векторная база данных?',
    options: [
      'База данных, хранящая данные в виде таблиц и столбцов',
      'Специализированное хранилище для числовых векторов (embeddings) с возможностью быстрого поиска ближайших соседей',
      'Графовая база данных для хранения связей между объектами',
      'Распределённая файловая система для хранения ML-моделей',
    ],
    correctIndex: 1,
    explanation:
      'Векторная БД хранит высокоразмерные вектора (embeddings) и обеспечивает efficient similarity search — поиск k ближайших векторов к заданному (k-NN). Это ключевой компонент RAG, рекомендательных систем, поиска по изображениям. Примеры: Pinecone (managed), Weaviate (open-source), Qdrant (open-source), Chroma (lightweight), Milvus (enterprise). Также vector search доступен в классических БД: pgvector (PostgreSQL), Elasticsearch, Redis.',
  },
  {
    id: 'ai-vector-databases-002',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Векторные БД',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Какая метрика расстояния чаще всего используется для сравнения текстовых embeddings?',
    options: [
      'Euclidean distance (L2)',
      'Cosine similarity',
      'Manhattan distance (L1)',
      'Hamming distance',
    ],
    correctIndex: 1,
    explanation:
      'Cosine similarity = cos(θ) = (A·B) / (|A|·|B|). Измеряет угол между векторами, игнорируя их длину. Значение от -1 до 1, где 1 — идентичное направление. Для нормализованных векторов cosine similarity эквивалентна dot product. Почему для текста: embedding-модели обычно нормализуют вектора, и семантическая близость лучше отражается углом, чем расстоянием. Euclidean distance используется для изображений и некоторых специфичных задач. Dot product — для моделей, где длина вектора несёт информацию (релевантность).',
  },
  {
    id: 'ai-vector-databases-003',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Векторные БД',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Почему для поиска в миллионах векторов используют ANN (Approximate Nearest Neighbors) вместо точного поиска?',
    options: [
      'Точный поиск даёт неправильные результаты на больших данных',
      'Точный поиск (brute-force) имеет O(n) сложность и слишком медленный для миллионов векторов; ANN находит «достаточно близких» соседей за O(log n)',
      'ANN работает только на GPU, а точный поиск — только на CPU',
      'Точный поиск требует больше дискового пространства',
    ],
    correctIndex: 1,
    explanation:
      'Brute-force k-NN: сравнить query со ВСЕМИ n векторами — O(n·d), где d — размерность. Для 10M векторов × 1536 dim = миллиарды операций на запрос. ANN алгоритмы жертвуют точностью (recall 95-99%) ради скорости: поиск за O(log n) или O(√n). Recall@k: какая доля настоящих k ближайших найдена. ANN с recall 99% достаточен для большинства приложений. Популярные алгоритмы: HNSW, IVF, ScaNN, Annoy.',
  },
  {
    id: 'ai-vector-databases-004',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Векторные БД',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Как работает алгоритм HNSW (Hierarchical Navigable Small World)?',
    options: [
      'Разбивает пространство на равные ячейки (grid) и ищет в соседних ячейках',
      'Строит многослойный граф: верхние слои — «шоссе» для быстрой навигации, нижние — детальные связи; поиск начинается сверху и спускается к точному соседству',
      'Использует хеш-функции для группировки похожих векторов в одни бакеты',
      'Строит бинарное дерево по компонентам вектора',
    ],
    correctIndex: 1,
    explanation:
      'HNSW (Malkov & Yashunin, 2018) — самый популярный ANN-алгоритм. Идея: многослойный граф, похожий на skip list. Верхний слой: мало узлов, длинные связи (быстрая навигация). Нижний слой: все узлы, короткие связи (точный поиск). Поиск: начинаем с верхнего слоя, greedy спускаемся к ближайшему соседу, переходим на нижний слой, повторяем. Параметры: M (количество связей), ef_construction (точность при построении), ef_search (точность при поиске). Trade-off: больше M/ef = выше recall, но больше памяти и медленнее. Используется в: Qdrant, Weaviate, pgvector, Elasticsearch.',
  },
  {
    id: 'ai-vector-databases-005',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Векторные БД',
    difficulty: 'middle',
    type: 'open',
    question: 'Сравните подходы к vector search: HNSW vs IVF. Когда лучше использовать каждый?',
    sampleAnswer:
      'HNSW (Hierarchical Navigable Small World): граф-based. Плюсы: высокий recall, быстрый поиск (O(log n)), хорош для real-time запросов. Минусы: высокое потребление памяти (весь индекс в RAM), долгое построение индекса, сложное обновление (добавление/удаление элементов). IVF (Inverted File Index): разбивает пространство на кластеры (Voronoi cells) через k-means. При поиске: определяем ближайшие кластеры, ищем только внутри них. Плюсы: меньше памяти (можно хранить на диске), быстрое построение, легко обновлять. Минусы: ниже recall при малом числе проверяемых кластеров (nprobe), производительность зависит от распределения данных. Рекомендации: HNSW — для real-time поиска, когда данные помещаются в RAM (<10M векторов). IVF — для больших датасетов (>100M), когда важна экономия памяти, часто в комбинации с PQ (Product Quantization).',
    explanation:
      'На практике часто используется IVF+PQ+HNSW комбинации. FAISS (Meta) поддерживает множество конфигураций. Для большинства RAG-приложений (<5M документов) HNSW — оптимальный выбор. Для масштаба search engine (миллиарды) — IVF+PQ или ScaNN.',
  },
  {
    id: 'ai-vector-databases-006',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Векторные БД',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое metadata filtering в контексте vector search?',
    options: [
      'Удаление дубликатов из результатов поиска',
      'Фильтрация результатов vector search по дополнительным атрибутам (дата, категория, автор) до или после ANN-поиска',
      'Автоматическое извлечение метаданных из документов',
      'Очистка данных перед построением индекса',
    ],
    correctIndex: 1,
    explanation:
      'Metadata filtering: каждый вектор хранится с метаданными (JSON). При поиске можно указать фильтры: «найди похожие документы, НО только за 2024 год И категория=finance». Два подхода: (1) Pre-filtering: сначала фильтр по метаданным, потом ANN среди отфильтрованных. Точный фильтр, но может быть медленным при restrictive фильтрах. (2) Post-filtering: сначала ANN top-k, потом фильтрация. Быстрее, но может вернуть меньше k результатов. Гибрид: filtered ANN — оба условия одновременно. Критично для production RAG: без фильтров нельзя разделить данные по пользователям (multi-tenancy), применить access control, ограничить по дате.',
  },
  {
    id: 'ai-vector-databases-007',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Векторные БД',
    difficulty: 'senior',
    type: 'open',
    question: 'Как выбрать между специализированной vector DB (Pinecone, Qdrant, Weaviate) и vector extension в существующей БД (pgvector, Elasticsearch)?',
    sampleAnswer:
      'Специализированные vector DB: Плюсы: оптимизированы для vector operations, лучшая производительность ANN, продвинутые фичи (multi-tenancy, hybrid search, quantization). Минусы: ещё один сервис в инфраструктуре, дополнительная стоимость, данные в двух местах (sync). Когда: vector search — core функционал, миллионы+ векторов, высокие требования к latency. pgvector / Elasticsearch: Плюсы: используешь уже имеющуюся инфраструктуру, данные в одном месте (joins, transactions), проще операционно. Минусы: менее оптимизированы для vector ops, ограниченные ANN-алгоритмы, pgvector до недавнего времени не поддерживал HNSW. Когда: vector search — дополнительная фича, <1M векторов, уже есть PostgreSQL/ES, важна консистентность данных. Рекомендация: начинай с pgvector, мигрируй на специализированную DB когда упрёшься в производительность или функциональность.',
    explanation:
      'Рынок vector DB быстро развивается. pgvector значительно улучшился (HNSW поддержка), и для многих RAG приложений его достаточно. Qdrant и Weaviate — лидеры open-source. Pinecone — managed option. Суть: не нужно over-engineer — начни с простого, масштабируй по необходимости.',
  },
  {
    id: 'ai-vector-databases-008',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Векторные БД',
    difficulty: 'senior',
    type: 'open',
    question: 'Что такое Product Quantization (PQ) и как оно позволяет хранить миллиарды векторов?',
    sampleAnswer:
      'Product Quantization — метод сжатия векторов для экономии памяти. Алгоритм: (1) Вектор размерности d разбивается на m субвекторов (d/m каждый). (2) Для каждого подпространства строится кодовая книга из k центроидов (через k-means). (3) Каждый субвектор заменяется на ID ближайшего центроида (1 byte при k=256). (4) Вектор 1536-dim × 4 bytes = 6KB → сжимается до m bytes (например, 64 bytes при m=64). Сжатие ~100x. Расстояние между query и сжатым вектором вычисляется через ADC (Asymmetric Distance Computation): query не сжимается, расстояние считается через lookup tables. Качество: recall снижается на 2-5%, но объём данных уменьшается на 1-2 порядка. Комбинации: IVF+PQ — стандарт для больших датасетов в FAISS. OPQ (Optimized PQ): rotation перед quantization для лучшего качества.',
    explanation:
      'PQ — ключевая техника для масштабирования vector search до миллиардов. Meta использует FAISS с IVF+PQ для поиска среди триллионов embeddings. Binary Quantization (1-bit) — ещё более агрессивное сжатие (32x), но с большей потерей качества. Scalar Quantization (SQ) — компромисс между PQ и full precision.',
  },
  {
    id: 'ai-vector-databases-009',
    block: 'ai',
    topic: 'vector-databases',
    topicLabel: 'Векторные БД',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Какая основная проблема multi-tenancy в vector databases и как её решают?',
    options: [
      'Multi-tenancy невозможна в vector databases',
      'Изоляция данных между пользователями: подходы включают namespace/collection per tenant, metadata filtering и гибридные стратегии с разным trade-off производительности, стоимости и изоляции',
      'Multi-tenancy решается только шифрованием данных',
      'Каждому пользователю выделяется отдельный сервер',
    ],
    correctIndex: 1,
    explanation:
      'Multi-tenancy — критична для SaaS: данные одного пользователя не должны быть доступны другому. Подходы: (1) Collection per tenant: полная изоляция, но overhead (отдельный индекс на каждого). Хорошо при <1000 tenants с большими данными. (2) Metadata filtering: один индекс, tenant_id в метаданных, фильтр при каждом запросе. Эффективнее по ресурсам, но требует надёжной фильтрации. (3) Namespace (Pinecone): логическое разделение внутри индекса. (4) Гибрид: sharding по крупным tenants + metadata filtering для мелких. Риски: metadata filter bypass → data leak. Рекомендация: collection per tenant для enterprise (compliance), metadata filtering для consumer apps.',
  },
];
