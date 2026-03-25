import type { Question } from '../types';

export const llmInferenceQuestions: Question[] = [
  {
    id: 'ai-llm-inference-001',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'Инференс LLM',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Из каких двух фаз состоит генерация текста в авторегрессивной LLM?',
    options: [
      'Encoding и Decoding',
      'Prefill (обработка промпта) и Decode (генерация токенов по одному)',
      'Training и Inference',
      'Tokenization и Detokenization',
    ],
    correctIndex: 1,
    explanation:
      'Инференс LLM состоит из двух фаз: (1) Prefill: весь входной промпт обрабатывается параллельно за один forward pass. Вычисляются KV-cache для всех входных токенов. Compute-bound (зависит от вычислительной мощности). (2) Decode: токены генерируются по одному, каждый новый токен требует forward pass с attention ко всем предыдущим. Memory-bandwidth-bound (зависит от скорости чтения весов и KV-cache). Поэтому «time to first token» (TTFT, prefill) и «time per output token» (TPOT, decode) — разные метрики.',
  },
  {
    id: 'ai-llm-inference-002',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'Инференс LLM',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое KV-cache и зачем он нужен при генерации?',
    options: [
      'Кэш для хранения промежуточных результатов токенизации',
      'Хранилище Key и Value тензоров из предыдущих шагов attention, чтобы не пересчитывать их при генерации каждого нового токена',
      'Кэш оптимизатора для ускорения fine-tuning',
      'Буфер для хранения сгенерированных токенов до детокенизации',
    ],
    correctIndex: 1,
    explanation:
      'При авторегрессивной генерации каждый новый токен требует attention ко всем предыдущим. Без KV-cache пришлось бы пересчитывать K и V для всех предыдущих токенов на каждом шаге — O(n²) вычислений. KV-cache сохраняет вычисленные K и V: при генерации n+1 токена нужно вычислить только Q, K, V для нового токена и использовать кэшированные K, V для предыдущих. Это снижает вычисления до O(n) на шаг. Цена: память. Для LLaMA 70B KV-cache может занимать десятки GB при длинных последовательностях.',
  },
  {
    id: 'ai-llm-inference-003',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'Инференс LLM',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое квантизация модели?',
    options: [
      'Удаление неиспользуемых слоёв из модели',
      'Уменьшение точности весов модели (например, из float16 в int8/int4) для снижения потребления памяти и ускорения инференса',
      'Разбиение модели на части для параллельного выполнения',
      'Шифрование весов модели для защиты интеллектуальной собственности',
    ],
    correctIndex: 1,
    explanation:
      'Квантизация — снижение точности числовых представлений весов и/или активаций. FP16 → INT8: ~2x экономия памяти, минимальная потеря качества. FP16 → INT4: ~4x экономия, заметная но приемлемая потеря. Популярные форматы: GPTQ (post-training, 4-bit), AWQ (Activation-aware Weight Quantization), GGUF (llama.cpp, CPU-friendly), bitsandbytes (dynamic quantization). Позволяет запускать модель 7B на consumer GPU (6GB VRAM) или 70B на одном сервере вместо кластера.',
  },
  {
    id: 'ai-llm-inference-004',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'Инференс LLM',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое continuous batching и почему оно эффективнее статического батчинга для LLM?',
    options: [
      'Continuous batching увеличивает размер батча во время обучения',
      'При continuous batching новые запросы добавляются в batch сразу после завершения предыдущих, не дожидаясь окончания всех запросов в batch',
      'Continuous batching объединяет несколько моделей в один инференс',
      'Continuous batching — это синоним pipeline parallelism',
    ],
    correctIndex: 1,
    explanation:
      'Static batching: все запросы в batch стартуют и заканчиваются вместе. Если один запрос генерирует 10 токенов, а другой 500 — GPU простаивает, ожидая длинный запрос. Continuous batching (Orca, 2022): запросы могут покидать batch по завершении, а новые — добавляться на их место. Результат: GPU утилизация растёт с ~30% до ~90%+, throughput увеличивается в 2-5x. Реализации: vLLM, TensorRT-LLM, TGI (Text Generation Inference). Это стандарт для production serving LLM.',
  },
  {
    id: 'ai-llm-inference-005',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'Инференс LLM',
    difficulty: 'middle',
    type: 'open',
    question: 'Объясните, как работает PagedAttention (vLLM). Какую проблему он решает?',
    sampleAnswer:
      'Проблема: KV-cache требует непрерывных блоков GPU памяти для каждого запроса. При переменной длине генерации память выделяется «с запасом» (по максимальной длине), что приводит к фрагментации и waste (до 60-80% памяти тратится впустую). PagedAttention (Kwon et al., 2023): вдохновлён виртуальной памятью ОС. KV-cache разбивается на «страницы» (blocks) фиксированного размера. Таблица страниц (page table) для каждого запроса указывает, где в физической GPU памяти лежат его блоки. Блоки могут быть не непрерывными. Результат: near-zero waste of memory, возможность sharing страниц между запросами (для beam search, parallel sampling), увеличение throughput в 2-4x за счёт обслуживания большего числа параллельных запросов.',
    explanation:
      'PagedAttention — одна из ключевых инноваций в LLM serving. vLLM — open-source проект, реализующий его. Стал стандартом для self-hosted LLM. Идея «виртуальная память для KV-cache» элегантна и показывает, как концепции из OS применяются в AI infra.',
  },
  {
    id: 'ai-llm-inference-006',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'Инференс LLM',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Какая метрика лучше характеризует пользовательский опыт при использовании LLM в чат-приложении?',
    options: [
      'Tokens per second (TPS) — общее количество сгенерированных токенов в секунду на GPU',
      'Time to First Token (TTFT) + Time Per Output Token (TPOT) — время до первого токена и скорость потоковой генерации',
      'Total generation time — общее время генерации ответа',
      'GPU utilization — процент загрузки GPU',
    ],
    correctIndex: 1,
    explanation:
      'Для streaming-приложений (чат) важны две метрики: TTFT (Time to First Token) — сколько ждать до начала ответа. Зависит от длины промпта (prefill). Целевое значение: <500ms. TPOT (Time Per Output Token) — скорость «печатания» ответа. Определяет плавность streaming. Целевое: <50ms/token (~20 tokens/sec). Для batch-сценариев (API) важнее throughput (tokens/sec/GPU). Для разных use cases — разные метрики. Общее «TPS» не различает prefill и decode, маскируя реальные bottlenecks.',
  },
  {
    id: 'ai-llm-inference-007',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'Инференс LLM',
    difficulty: 'senior',
    type: 'open',
    question: 'Что такое Speculative Decoding? Как оно ускоряет генерацию без потери качества?',
    sampleAnswer:
      'Speculative Decoding использует малую «draft» модель для быстрой генерации k кандидатов-токенов, которые затем верифицируются основной моделью за один forward pass. Алгоритм: (1) Draft model генерирует k токенов (быстро, т.к. модель маленькая). (2) Target model обрабатывает все k токенов за один forward pass (параллельно). (3) Проверяются вероятности каждого токена: принимаются токены, для которых draft и target «согласны». (4) Первый «отвергнутый» токен заменяется сэмплом из target model. Результат: если draft model хорошо аппроксимирует target, большинство токенов принимается, и за один forward pass target model генерируется k токенов вместо одного. Ускорение 2-3x без потери качества (распределение гарантированно совпадает с target). Требования: draft model должна быть значительно быстрее target и достаточно точной.',
    explanation:
      'Speculative Decoding (Leviathan et al., 2023; Chen et al., 2023) — одна из немногих техник, ускоряющих генерацию без компромиссов по качеству. Вариации: self-speculative decoding (draft из ранних слоёв той же модели), Medusa (несколько prediction heads), EAGLE. Особенно эффективен для «предсказуемого» текста (код, structured output).',
  },
  {
    id: 'ai-llm-inference-008',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'Инференс LLM',
    difficulty: 'senior',
    type: 'open',
    question: 'Сравните стратегии параллелизма для инференса LLM: Tensor Parallelism, Pipeline Parallelism и Data Parallelism. Когда использовать каждую?',
    sampleAnswer:
      'Tensor Parallelism (TP): один слой модели разделяется между GPU. Матричные умножения выполняются параллельно, результаты синхронизируются (all-reduce). Плюсы: уменьшает latency одного запроса, модель не помещающаяся в 1 GPU работает. Минусы: требует быстрой связи между GPU (NVLink). Обычно TP=2-8 внутри одного узла. Pipeline Parallelism (PP): разные слои на разных GPU. Запрос проходит последовательно через «стадии». Плюсы: работает между узлами (медленная сеть ОК). Минусы: bubble overhead, не снижает latency одного запроса. Data Parallelism (DP): полная копия модели на каждом GPU, разные запросы обрабатываются параллельно. Плюсы: линейно масштабирует throughput. Минусы: каждый GPU должен вмещать всю модель. Типичная комбинация: TP внутри узла (4-8 GPU) + PP между узлами + DP для масштабирования throughput.',
    explanation:
      'Для production serving LLM важно правильно комбинировать стратегии. vLLM, TensorRT-LLM, DeepSpeed-Inference поддерживают все три. Для моделей до 70B обычно достаточно TP на одном узле (4-8 A100/H100). Для 400B+ моделей требуется комбинация TP+PP.',
  },
  {
    id: 'ai-llm-inference-009',
    block: 'ai',
    topic: 'llm-inference',
    topicLabel: 'Инференс LLM',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Почему decode-фаза LLM инференса является memory-bandwidth-bound, а не compute-bound?',
    options: [
      'Потому что используется квантизация, которая уменьшает compute',
      'Потому что при генерации одного токена нужно прочитать все веса модели из GPU HBM, но вычислений на каждый вес мало (низкий arithmetic intensity)',
      'Потому что decode-фаза не использует GPU-ядра',
      'Потому что KV-cache занимает всю доступную вычислительную мощность',
    ],
    correctIndex: 1,
    explanation:
      'При decode одного токена: нужно прочитать ~все веса модели (~14GB для 7B fp16) из HBM для одного матричного умножения vector × matrix. Arithmetic intensity ≈ 1 FLOP/byte — крайне низкая. GPU A100 имеет ~2TB/s bandwidth и ~300 TFLOPS, но при 1 FLOP/byte bandwidth ограничивает throughput на ~2T tokens-ops/sec. Для сравнения, prefill с batch=32 имеет intensity ~32 FLOPs/byte — compute-bound. Поэтому batching критичен: объединяя запросы, увеличиваем arithmetic intensity и утилизацию GPU compute.',
  },
];
