import type { Question } from '../types';

export const transformersQuestions: Question[] = [
  {
    id: 'ai-transformers-001',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Трансформеры',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Какой механизм является ключевым в архитектуре Transformer?',
    options: [
      'Рекуррентные связи (recurrence)',
      'Свёрточные фильтры (convolution)',
      'Механизм внимания (attention)',
      'Остаточные связи (residual connections)',
    ],
    correctIndex: 2,
    explanation:
      'Self-attention (самовнимание) — ключевой механизм трансформера, представленный в статье "Attention Is All You Need" (Vaswani et al., 2017). Позволяет каждому токену «обращаться» ко всем остальным токенам в последовательности, вычисляя веса внимания. В отличие от RNN, не требует последовательной обработки, что позволяет эффективную параллелизацию. Residual connections также используются, но они не уникальны для трансформеров.',
  },
  {
    id: 'ai-transformers-002',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Трансформеры',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Зачем в трансформере используется позиционное кодирование (positional encoding)?',
    options: [
      'Для сжатия длинных последовательностей в фиксированный вектор',
      'Для добавления информации о порядке токенов, поскольку attention сам по себе не учитывает позиции',
      'Для преобразования токенов в числовые представления (embeddings)',
      'Для ускорения обучения за счёт кэширования позиций',
    ],
    correctIndex: 1,
    explanation:
      'Self-attention — операция над множеством (set operation): результат не зависит от порядка входных элементов. Но в языке порядок слов критичен: «кот съел рыбу» ≠ «рыба съела кота». Positional encoding добавляет к эмбеддингу каждого токена вектор, кодирующий его позицию. Варианты: синусоидальное (оригинальный Transformer), обучаемое (BERT, GPT), относительное (T5, ALiBi), RoPE (Rotary Position Embedding — LLaMA, GPT-NeoX).',
  },
  {
    id: 'ai-transformers-003',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Трансформеры',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Из каких основных компонентов состоит один слой (block) трансформера?',
    options: [
      'Свёрточный слой + пулинг + полносвязный слой',
      'Multi-Head Attention + Feed-Forward Network + Layer Normalization + Residual Connections',
      'RNN-ячейка + attention + dropout',
      'Embedding + softmax + cross-entropy',
    ],
    correctIndex: 1,
    explanation:
      'Каждый блок трансформера содержит: (1) Multi-Head Self-Attention — параллельные головы внимания, (2) Feed-Forward Network (FFN) — два линейных слоя с нелинейностью (обычно GELU), (3) Layer Normalization — стабилизация активаций, (4) Residual connections — вокруг каждого подблока (attention и FFN). В decoder-блоках также есть masked self-attention (чтобы не «подсматривать» в будущие токены) и cross-attention (для encoder-decoder моделей).',
  },
  {
    id: 'ai-transformers-004',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Трансформеры',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Как вычисляется Scaled Dot-Product Attention?',
    options: [
      'Attention(Q,K,V) = softmax(QK^T / √d_k) × V — скалярное произведение queries и keys, масштабированное, затем softmax, затем умножение на values',
      'Attention(Q,K,V) = sigmoid(Q + K) × V',
      'Attention(Q,K,V) = softmax(Q × V) × K',
      'Attention(Q,K,V) = ReLU(QK^T) × V / d_k',
    ],
    correctIndex: 0,
    explanation:
      'Scaled Dot-Product Attention: (1) вычисляем скалярные произведения query с каждым key: QK^T, (2) масштабируем на √d_k (размерность ключа), чтобы градиенты не затухали при большой d_k, (3) применяем softmax для получения весов внимания (сумма = 1), (4) умножаем на values V. Q, K, V — линейные проекции входа. Масштабирование критично: без него при большом d_k softmax «насыщается», и градиенты затухают.',
  },
  {
    id: 'ai-transformers-005',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Трансформеры',
    difficulty: 'middle',
    type: 'open',
    question: 'Что такое Multi-Head Attention и зачем нужно несколько «голов» вместо одного attention?',
    sampleAnswer:
      'Multi-Head Attention — параллельное выполнение нескольких операций attention с разными линейными проекциями. Вход проецируется в h наборов Q, K, V (по одному на голову), каждая голова вычисляет attention независимо, результаты конкатенируются и проецируются обратно. Зачем: каждая голова может «специализироваться» на разных типах зависимостей — одна следит за синтаксисом, другая за семантикой, третья за позиционными отношениями. Одна голова attention может фокусироваться только на одном паттерне за раз, а Multi-Head позволяет параллельно улавливать множество зависимостей. d_model обычно делится поровну между головами (d_k = d_model / h), поэтому вычислительная сложность примерно равна single-head attention с полной размерностью.',
    explanation:
      'Multi-Head Attention — одна из ключевых идей оригинального Transformer. На практике разные головы действительно обучаются разным паттернам: positional heads, syntactic heads, rare-word heads. Исследования (Clark et al., 2019) показали, что часть голов можно обрезать (pruning) без потери качества — не все головы одинаково полезны.',
  },
  {
    id: 'ai-transformers-006',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Трансформеры',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Чем отличаются архитектуры encoder-only, decoder-only и encoder-decoder трансформеров?',
    options: [
      'Encoder-only (BERT) — для генерации текста, decoder-only (GPT) — для понимания, encoder-decoder (T5) — для перевода',
      'Encoder-only (BERT) — двунаправленный контекст для задач понимания, decoder-only (GPT) — авторегрессивная генерация слева направо, encoder-decoder (T5) — для задач seq2seq (перевод, суммаризация)',
      'Различий нет, это маркетинговые названия одной архитектуры',
      'Encoder-only не использует attention, decoder-only использует только cross-attention',
    ],
    correctIndex: 1,
    explanation:
      'Три семейства: (1) Encoder-only (BERT, RoBERTa): двунаправленный self-attention, видит весь контекст. Задачи: классификация, NER, поиск. Pretraining: masked language modeling. (2) Decoder-only (GPT, LLaMA, Claude): causal (masked) self-attention, видит только предыдущие токены. Задачи: генерация, чат, reasoning. Pretraining: next token prediction. (3) Encoder-decoder (T5, BART): encoder обрабатывает вход (двунаправленно), decoder генерирует выход с cross-attention к encoder. Задачи: перевод, суммаризация. Сегодня decoder-only доминирует в LLM.',
  },
  {
    id: 'ai-transformers-007',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Трансформеры',
    difficulty: 'senior',
    type: 'open',
    question: 'Почему self-attention имеет квадратичную сложность O(n²) по длине последовательности? Какие подходы существуют для её снижения?',
    sampleAnswer:
      'Self-attention вычисляет попарные скалярные произведения между всеми n токенами: матрица QK^T имеет размер n×n, что даёт O(n²) по памяти и вычислениям. Для длинных последовательностей (n > 8K) это становится узким местом. Подходы к снижению: (1) Sparse attention: каждый токен обращается только к подмножеству (local window + global tokens) — Longformer, BigBird. O(n√n) или O(n·w). (2) Linear attention: аппроксимация softmax(QK^T)V через kernel-трюк — Performer, FNet. O(n). (3) Flash Attention: не снижает теоретическую сложность, но оптимизирует доступ к памяти GPU (tiling), уменьшая IO между SRAM и HBM. На практике 2-4x ускорение. (4) Multi-Query/Grouped-Query Attention: уменьшают размер KV-cache, не меняя сложность attention, но снижая memory bandwidth. (5) Ring Attention: распределяет длинные последовательности по нескольким GPU. (6) Альтернативные архитектуры: Mamba (SSM), RWKV — O(n) по дизайну.',
    explanation:
      'Квадратичная сложность — главное ограничение трансформеров. Flash Attention стал стандартом де-факто: не аппроксимирует, а точно вычисляет attention с оптимальным использованием GPU памяти. Grouped-Query Attention (GQA) используется в LLaMA 2/3, Mistral. Mamba и другие SSM-модели — активная область исследований как замена attention.',
  },
  {
    id: 'ai-transformers-008',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Трансформеры',
    difficulty: 'senior',
    type: 'open',
    question: 'Объясните разницу между Multi-Head Attention (MHA), Multi-Query Attention (MQA) и Grouped-Query Attention (GQA). Как это влияет на инференс?',
    sampleAnswer:
      'MHA: каждая голова имеет свои Q, K, V проекции. При инференсе нужно хранить KV-cache для каждой головы. Для модели с 32 головами — 32 набора K и V. MQA: все головы разделяют одну пару K, V, но имеют свои Q. KV-cache уменьшается в h раз (h — число голов). Быстрее инференс, но может терять качество. GQA: компромисс — головы делятся на g групп, каждая группа разделяет K, V. При g=1 это MQA, при g=h это MHA. LLaMA 2 70B использует GQA с 8 KV-головами на 64 query-головы. Влияние на инференс: KV-cache — основной потребитель памяти при генерации длинных последовательностей. MQA/GQA уменьшают memory bandwidth requirement, что критично для batch inference и длинных контекстов.',
    explanation:
      'GQA стал стандартом в современных LLM как оптимальный баланс качество/эффективность. Используется в LLaMA 2/3, Mistral, Gemma. При инференсе bottleneck часто не compute, а memory bandwidth — GQA напрямую решает эту проблему.',
  },
  {
    id: 'ai-transformers-009',
    block: 'ai',
    topic: 'transformers',
    topicLabel: 'Трансформеры',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое RoPE (Rotary Position Embedding) и почему этот подход стал стандартом в современных LLM?',
    options: [
      'RoPE кодирует абсолютные позиции через обучаемые эмбеддинги, ограниченные максимальной длиной контекста',
      'RoPE применяет поворотные матрицы к Q и K, кодируя относительные позиции через угол поворота, что позволяет экстраполяцию на длины больше обучающих',
      'RoPE заменяет positional encoding на специальные attention masks',
      'RoPE использует хеш-функции для кодирования позиций токенов',
    ],
    correctIndex: 1,
    explanation:
      'RoPE (Su et al., 2021) кодирует позицию, поворачивая вектор query/key на угол, пропорциональный позиции. Скалярное произведение повёрнутых Q и K зависит только от относительного расстояния между токенами, а не от абсолютных позиций. Преимущества: (1) естественное кодирование относительных позиций, (2) возможность экстраполяции на длины больше обучающих (через NTK-aware scaling, YaRN), (3) эффективная реализация. Используется в LLaMA, Mistral, Qwen, Gemma — фактически стандарт для современных open-source LLM.',
  },
];
