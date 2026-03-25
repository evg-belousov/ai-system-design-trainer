import type { Question } from '../types';

export const llmFundamentalsQuestions: Question[] = [
  {
    id: 'ai-llm-fundamentals-001',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'Основы LLM',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что делает LLM (Large Language Model) на базовом уровне?',
    options: [
      'Ищет ответы в базе данных знаний',
      'Предсказывает наиболее вероятный следующий токен на основе предыдущего контекста',
      'Выполняет символические вычисления над грамматическими правилами',
      'Переводит запрос пользователя в SQL-запросы к базе данных',
    ],
    correctIndex: 1,
    explanation:
      'LLM — авторегрессивная модель, обученная предсказывать следующий токен (next token prediction). Дано: последовательность токенов [t1, t2, ..., tn]. Модель предсказывает распределение вероятностей P(t_{n+1} | t1, ..., tn). Генерация: выбираем токен из распределения, добавляем к контексту, повторяем. Несмотря на простоту цели обучения, модели масштаба >10B параметров демонстрируют emergent abilities: reasoning, code generation, translation.',
  },
  {
    id: 'ai-llm-fundamentals-002',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'Основы LLM',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое токенизация в контексте LLM?',
    options: [
      'Шифрование текста для безопасной передачи',
      'Разбиение текста на минимальные единицы (токены), которые модель обрабатывает: подслова, слова или символы',
      'Преобразование текста в аудиосигнал',
      'Присвоение меток классов словам в тексте',
    ],
    correctIndex: 1,
    explanation:
      'Токенизация — первый этап обработки текста в LLM. Текст разбивается на токены (субслова), каждый получает числовой ID из словаря (vocabulary). Популярные алгоритмы: BPE (Byte Pair Encoding) — GPT, LLaMA; WordPiece — BERT; SentencePiece — T5, LLaMA. Типичный размер словаря: 32K–128K токенов. Один токен ≈ 3–4 символа в английском, в русском обычно меньше. Токенизация влияет на стоимость (billing per token), длину контекста и качество для разных языков.',
  },
  {
    id: 'ai-llm-fundamentals-003',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'Основы LLM',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое temperature при генерации текста LLM?',
    options: [
      'Физическая температура GPU во время инференса',
      'Параметр, контролирующий «случайность» генерации: низкая temperature — более детерминированный вывод, высокая — более разнообразный',
      'Скорость обучения модели',
      'Максимальная длина генерируемого ответа',
    ],
    correctIndex: 1,
    explanation:
      'Temperature (T) масштабирует логиты перед softmax: P(token) = softmax(logits / T). T → 0: распределение стремится к delta-функции (greedy), всегда выбирается самый вероятный токен. Детерминированно, но скучно. T = 1: исходное обученное распределение. T > 1: более плоское распределение, больше случайности. Используется вместе с top-k (выбор из k наиболее вероятных токенов) и top-p / nucleus sampling (выбор из токенов с суммарной вероятностью ≥ p).',
  },
  {
    id: 'ai-llm-fundamentals-004',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'Основы LLM',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Какие этапы обучения проходит современная LLM от «нуля» до готового ассистента?',
    options: [
      'Pretraining → Deployment',
      'Pretraining → Supervised Fine-tuning (SFT) → Alignment (RLHF/DPO) → Deployment',
      'Data Collection → Rule-based Programming → Testing',
      'Transfer Learning → Zero-shot Evaluation → Release',
    ],
    correctIndex: 1,
    explanation:
      'Три основных этапа: (1) Pretraining: обучение на огромном корпусе текстов (триллионы токенов) задаче next token prediction. Результат — base model, которая хорошо продолжает текст, но не следует инструкциям. (2) SFT (Supervised Fine-tuning): дообучение на размеченных примерах «инструкция → ответ». Модель учится формату диалога. (3) Alignment (RLHF или DPO): выравнивание с человеческими предпочтениями. RLHF: обучение reward model → оптимизация через PPO. DPO: прямая оптимизация без reward model. Результат — helpful, harmless, honest ассистент.',
  },
  {
    id: 'ai-llm-fundamentals-005',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'Основы LLM',
    difficulty: 'middle',
    type: 'open',
    question: 'Объясните разницу между RLHF и DPO для alignment LLM. Какие преимущества и недостатки у каждого подхода?',
    sampleAnswer:
      'RLHF (Reinforcement Learning from Human Feedback): (1) Собираются пары ответов с рейтингами от людей. (2) Обучается reward model, предсказывающая качество ответа. (3) LLM оптимизируется через PPO (Proximal Policy Optimization) для максимизации reward. Плюсы: мощный, проверенный подход (ChatGPT, Claude). Минусы: сложный пайплайн (3 модели), нестабильность PPO, дорого. DPO (Direct Preference Optimization): формулирует alignment как задачу классификации на парах предпочтений без явной reward model. Оптимизирует LLM напрямую на данных «ответ A лучше ответа B». Плюсы: простой пайплайн, стабильнее обучается, дешевле. Минусы: менее гибкий, качество зависит от данных предпочтений, может быть менее устойчив при переобучении.',
    explanation:
      'DPO (Rafailov et al., 2023) показал, что можно достичь сравнимого с RLHF качества alignment без сложного RL-пайплайна. Стал популярным для open-source моделей (Zephyr, LLaMA-based). На практике крупные лаборатории часто используют комбинацию: SFT → DPO → RLHF для финальной полировки.',
  },
  {
    id: 'ai-llm-fundamentals-006',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'Основы LLM',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что описывают Scaling Laws (законы масштабирования) Каплана/Chinchilla?',
    options: [
      'Зависимость скорости инференса от размера модели',
      'Предсказуемую зависимость качества модели (loss) от количества параметров, объёма данных и вычислительного бюджета',
      'Максимальный размер контекстного окна для разных архитектур',
      'Оптимальное количество слоёв в зависимости от задачи',
    ],
    correctIndex: 1,
    explanation:
      'Scaling Laws (Kaplan et al., 2020): loss модели предсказуемо снижается как степенная функция от N (параметры), D (данные) и C (compute). Chinchilla (Hoffmann et al., 2022) уточнил: оптимально N и D должны расти пропорционально. Правило Chinchilla: на каждый параметр ~20 токенов обучающих данных. Следствия: (1) можно предсказать качество до обучения, (2) многие ранние LLM были «недообучены» (мало данных для размера модели), (3) LLaMA 7B с достаточным количеством данных может превзойти GPT-3 175B. Современные модели (LLaMA 3) обучаются «over Chinchilla» — больше данных, чем оптимум, для лучшего инференса.',
  },
  {
    id: 'ai-llm-fundamentals-007',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'Основы LLM',
    difficulty: 'senior',
    type: 'open',
    question: 'Что такое emergent abilities LLM? Приведите примеры и объясните дискуссию вокруг этой концепции.',
    sampleAnswer:
      'Emergent abilities — способности, которые отсутствуют у малых моделей, но внезапно появляются при определённом масштабе. Примеры: chain-of-thought reasoning, in-context learning на нескольких примерах, code generation, mathematical reasoning. Дискуссия: Wei et al. (2022) показали «фазовые переходы» — резкое появление способностей при увеличении модели. Schaeffer et al. (2023) возразили, что «внезапность» — артефакт выбранных метрик: при использовании непрерывных метрик (вместо точного совпадения) улучшение плавное. Консенсус: способности реальны, но их «внезапность» зависит от того, как мы измеряем. Практически: scaling laws предсказывают loss, но не предсказывают точно, при каком масштабе появится конкретная способность.',
    explanation:
      'Emergent abilities — одна из причин, почему компании инвестируют в всё большие модели. Но дискуссия о «настоящей эмерджентности» vs «плавном улучшении» важна для планирования R&D и управления ожиданиями от будущих моделей.',
  },
  {
    id: 'ai-llm-fundamentals-008',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'Основы LLM',
    difficulty: 'senior',
    type: 'open',
    question: 'Сравните подходы к fine-tuning LLM: Full Fine-tuning, LoRA, QLoRA. Когда применять каждый?',
    sampleAnswer:
      'Full Fine-tuning: обновляются все параметры модели. Лучшее качество, но требует GPU памяти на все параметры + оптимизатор (для 7B модели: ~28GB в fp16 + ~56GB для Adam states). LoRA (Low-Rank Adaptation): замораживает оригинальные веса, обучает низкоранговые матрицы-адаптеры (A×B, rank r=8-64) для проекций attention. Обучается <1% параметров, качество близко к full fine-tuning. QLoRA: LoRA поверх квантизированной модели (4-bit NormalFloat). 7B модель помещается в ~6GB GPU для обучения. Рекомендации: Full FT — когда достаточно ресурсов и нужно максимальное качество (>70B моделей редко). LoRA — стандартный выбор для большинства задач. QLoRA — когда ограничены в GPU (consumer hardware, single GPU). На практике разница LoRA vs Full FT часто минимальна для задач instruction following и domain adaptation.',
    explanation:
      'LoRA (Hu et al., 2021) революционизировал fine-tuning, сделав адаптацию LLM доступной. QLoRA (Dettmers et al., 2023) пошёл дальше — fine-tuning 65B модели на одном 48GB GPU. Современные инструменты: PEFT, Hugging Face TRL, Axolotl. Вариации: DoRA (Weight-Decomposed LoRA), LoRA+ (разные LR для A и B).',
  },
  {
    id: 'ai-llm-fundamentals-009',
    block: 'ai',
    topic: 'llm-fundamentals',
    topicLabel: 'Основы LLM',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое «галлюцинации» (hallucinations) LLM и какова их основная причина?',
    options: [
      'Ошибки, вызванные багами в коде фреймворка (PyTorch, TensorFlow)',
      'Генерация правдоподобного, но фактически неверного текста, вызванная тем, что модель оптимизирована на правдоподобность (likelihood), а не на фактическую корректность',
      'Результат намеренной «креативности» модели, заложенной в обучение',
      'Следствие слишком низкой температуры при генерации',
    ],
    correctIndex: 1,
    explanation:
      'Галлюцинации — фундаментальная проблема LLM. Причина: модель обучена максимизировать P(next token | context), а не P(factually correct token). Она моделирует распределение языка, а не «знает факты». Типы: (1) фактологические ошибки (несуществующие цитаты), (2) логические противоречия, (3) несоответствие контексту. Методы снижения: RAG (retrieval-augmented generation), grounding, chain-of-thought, constitutional AI, fine-tuning на фактологических данных, citation/attribution. Полностью устранить нельзя — это свойство генеративных моделей.',
  },
];
