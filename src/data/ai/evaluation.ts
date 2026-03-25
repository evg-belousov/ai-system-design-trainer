import type { Question } from '../types';

export const evaluationQuestions: Question[] = [
  {
    id: 'ai-evaluation-001',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Оценка моделей',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое perplexity и зачем она используется для оценки языковых моделей?',
    options: [
      'Количество параметров модели, влияющее на качество',
      'Мера «удивления» модели текстом: чем ниже perplexity, тем лучше модель предсказывает текст',
      'Время, необходимое модели для генерации одного токена',
      'Процент правильных ответов на бенчмарке',
    ],
    correctIndex: 1,
    explanation:
      'Perplexity = 2^(cross-entropy loss) = exp(average negative log-likelihood). Интуиция: perplexity N означает, что модель «выбирает» из N равновероятных токенов на каждом шаге. Чем ниже — тем увереннее модель. Пример: perplexity 10 → модель как будто выбирает из 10 вариантов. Применение: сравнение base models, оценка quality на domain data. Ограничения: не отражает instruction-following, safety, reasoning. Два модели с одинаковой perplexity могут сильно отличаться по пользовательским метрикам.',
  },
  {
    id: 'ai-evaluation-002',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Оценка моделей',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Для чего используются бенчмарки MMLU и HumanEval?',
    options: [
      'MMLU — для оценки скорости инференса, HumanEval — для оценки UX',
      'MMLU — для оценки знаний и reasoning по 57 предметам, HumanEval — для оценки способности генерировать корректный код',
      'Оба бенчмарка оценивают toxicity модели',
      'MMLU — для оценки перевода, HumanEval — для оценки суммаризации',
    ],
    correctIndex: 1,
    explanation:
      'MMLU (Massive Multitask Language Understanding): 57 предметов от математики до права. Multiple-choice. Оценивает «широту знаний» модели. GPT-4: ~86%, Claude 3.5 Sonnet: ~88%. Критика: data contamination (модели могли видеть ответы при обучении), multiple-choice не отражает реальное использование. HumanEval: 164 задачи на Python. Модель генерирует функцию по docstring, проверяется unit-тестами. pass@1 — процент правильных с первой попытки. GPT-4: ~86%, Claude 3.5 Sonnet: ~92%. Важно: ни один бенчмарк не является исчерпывающей оценкой — нужна комбинация.',
  },
  {
    id: 'ai-evaluation-003',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Оценка моделей',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое BLEU и ROUGE метрики?',
    options: [
      'Метрики оценки скорости обучения модели',
      'BLEU — precision-based метрика для перевода (сколько n-грамм генерации совпадают с reference); ROUGE — recall-based метрика для суммаризации (сколько n-грамм reference покрыты генерацией)',
      'Метрики оценки безопасности модели',
      'Метрики оценки потребления GPU-памяти',
    ],
    correctIndex: 1,
    explanation:
      'BLEU (Bilingual Evaluation Understudy): считает precision n-грамм (1-4). Вопрос: какая доля n-грамм в генерации присутствует в reference? Используется для machine translation. ROUGE (Recall-Oriented Understudy for Gisting Evaluation): считает recall n-грамм. Вопрос: какая доля n-грамм reference присутствует в генерации? ROUGE-1 (unigrams), ROUGE-2 (bigrams), ROUGE-L (longest common subsequence). Используется для summarization. Ограничения обоих: не учитывают семантику (парафраз получит низкий score), зависят от reference (одно «правильное» суммари не существует). Для LLM всё чаще используют LLM-as-judge вместо n-gram метрик.',
  },
  {
    id: 'ai-evaluation-004',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Оценка моделей',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое «LLM-as-judge» и какие у этого подхода преимущества и ограничения?',
    options: [
      'Использование LLM для обучения других моделей',
      'Использование LLM для автоматической оценки качества ответов другой модели по заданным критериям; быстрее и дешевле human eval, но имеет bias (предвзятость к длинным ответам, собственному стилю)',
      'Юридическое использование AI в судебных процессах',
      'Метод выбора лучшей модели из списка кандидатов',
    ],
    correctIndex: 1,
    explanation:
      'LLM-as-judge: сильная модель (GPT-4, Claude) оценивает ответы по критериям (relevance, helpfulness, accuracy). Формат: pointwise (оценка 1-5), pairwise (A лучше B?), reference-based (сравнение с эталоном). Преимущества: масштабируемо (1000+ оценок за минуты), дешевле human eval в 10-100x, воспроизводимо. Ограничения: position bias (предпочитает первый ответ в pairwise), verbosity bias (длинные ответы = лучше), self-enhancement bias (предпочитает свой стиль), не ловит subtle factual errors. Best practice: калибровать на human eval, использовать structured rubrics, рандомизировать порядок в pairwise.',
  },
  {
    id: 'ai-evaluation-005',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Оценка моделей',
    difficulty: 'middle',
    type: 'open',
    question: 'Что такое data contamination (утечка бенчмарков) и почему это проблема для оценки LLM?',
    sampleAnswer:
      'Data contamination: данные бенчмарка попадают в обучающий корпус LLM. Модель «запоминает» ответы вместо того, чтобы рассуждать. Результат: завышенные метрики, не отражающие реальные способности. Примеры: MMLU и GSM8K широко доступны в интернете → модели, обученные на Common Crawl, могли видеть ответы. Масштаб: исследования показывают 1-10% пересечение для популярных бенчмарков. Последствия: нельзя доверять бенчмарк-скорам без проверки на contamination. Решения: (1) Dynamic benchmarks: новые задачи регулярно (Chatbot Arena — live rankings по голосам пользователей). (2) Contamination detection: n-gram overlap анализ между train data и benchmark. (3) Private test sets: не публиковать ответы. (4) Harder benchmarks: задачи, требующие reasoning, а не запоминания (GPQA, SWE-bench). (5) Held-out evaluation: собственные eval наборы, не опубликованные в интернете.',
    explanation:
      'Data contamination — серьёзная проблема индустрии. Chatbot Arena (LMSYS) частично решает её через live evaluation: реальные пользователи сравнивают ответы моделей вслепую. ELO-рейтинг Arena считается одним из наиболее надёжных сравнений LLM. Для своих приложений: всегда создавайте собственные eval наборы.',
  },
  {
    id: 'ai-evaluation-006',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Оценка моделей',
    difficulty: 'middle',
    type: 'open',
    question: 'Как оценить качество RAG-системы? Какие метрики использовать?',
    sampleAnswer:
      'Метрики RAG оценивают два компонента: retrieval и generation. Retrieval: (1) Context Precision: какая доля retrieved чанков реально релевантна вопросу. (2) Context Recall: какая доля необходимой информации найдена. (3) MRR (Mean Reciprocal Rank): позиция первого релевантного результата. Generation: (4) Faithfulness: ответ основан на retrieved контексте (не галлюцинация). (5) Answer Relevancy: ответ отвечает на вопрос. (6) Answer Correctness: фактическая правильность (сравнение с ground truth). End-to-end: (7) Answer Similarity: близость к reference ответу (semantic similarity). Фреймворки: RAGAS (популярный, LLM-based метрики), DeepEval, TruLens. Подход: создать eval dataset (50-100 вопрос-ответ пар), прогонять при каждом изменении pipeline (chunking, model, prompts).',
    explanation:
      'Eval-driven development — ключ к качественному RAG. Без eval dataset невозможно объективно сравнить: размер чанка 256 vs 512, модель A vs B, с reranker vs без. RAGAS — де-факто стандарт, но требует калибровки под конкретный домен.',
  },
  {
    id: 'ai-evaluation-007',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Оценка моделей',
    difficulty: 'senior',
    type: 'open',
    question: 'Как обнаружить и измерить галлюцинации LLM? Какие подходы существуют?',
    sampleAnswer:
      'Подходы: (1) Reference-based: сравнение с gold-standard ответом. NLI (Natural Language Inference): проверить, entailment ли ответ из reference. Ограничение: нужен reference. (2) Reference-free (faithfulness): проверка, что ответ следует из предоставленного контекста (для RAG). SelfCheckGPT: генерировать несколько ответов, проверить консистентность — галлюцинации обычно inconsistent. (3) LLM-as-judge: попросить сильную модель оценить factuality. (4) Retrieval-based verification: проверить факты из ответа через поиск. (5) Claim decomposition: разбить ответ на atomic claims, каждый проверить отдельно. (6) Uncertainty estimation: high entropy/low confidence → higher hallucination risk. Метрики: hallucination rate (% ответов с ложными утверждениями), faithfulness score (RAGAS), factual consistency (SummaC, AlignScore). На практике: комбинация LLM-as-judge + claim decomposition для critical applications.',
    explanation:
      'Hallucination detection — активная область исследований. 100% детекция невозможна (нужно знать все факты). Практический подход: (1) снижать галлюцинации (RAG, CoT, grounding), (2) детектировать оставшиеся (automated checks), (3) human verification для critical outputs.',
  },
  {
    id: 'ai-evaluation-008',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Оценка моделей',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое Chatbot Arena (LMSYS) и почему его ELO-рейтинг считается одним из наиболее надёжных?',
    options: [
      'Автоматический бенчмарк, запускающий все модели на одном наборе задач',
      'Платформа, где реальные пользователи вслепую сравнивают ответы двух анонимных моделей; ELO-рейтинг строится на тысячах таких голосований, устойчив к data contamination',
      'Соревнование между компаниями по производительности GPU',
      'Closed-source бенчмарк, доступный только исследователям',
    ],
    correctIndex: 1,
    explanation:
      'Chatbot Arena: (1) Пользователь задаёт вопрос. (2) Два анонимных модели отвечают параллельно. (3) Пользователь голосует, какой ответ лучше (A/B/tie). (4) После голосования модели раскрываются. ELO рейтинг вычисляется на основе 1M+ голосов. Преимущества: (1) human evaluation at scale, (2) нет data contamination (свежие вопросы от пользователей), (3) diversity задач (реальные use cases), (4) blind evaluation (нет brand bias). Ограничения: bias к chatbot tasks (не coding, не agents), recency bias, demographic bias (кто пользуется Arena). Дополнения: Arena-Hard (автоматическая версия с LLM-as-judge на Arena-derived вопросах).',
  },
  {
    id: 'ai-evaluation-009',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Оценка моделей',
    difficulty: 'senior',
    type: 'open',
    question: 'Как построить систему eval для собственного LLM-приложения? Опишите процесс от начала до автоматизации.',
    sampleAnswer:
      'Процесс: (1) Define criteria: что значит «хороший ответ» для вашего приложения. Rubric: accuracy, completeness, format, tone, safety. Каждый критерий — 1-5 шкала с описанием. (2) Create eval dataset: 50-100 примеров (input, expected_output, metadata). Источники: реальные запросы пользователей, edge cases, adversarial inputs. Golden dataset — вручную проверенные пары. (3) Human eval baseline: разметить golden dataset людьми. Inter-annotator agreement (Cohen kappa > 0.7). Это baseline для калибровки автоматических метрик. (4) Automated evals: LLM-as-judge prompts по каждому критерию. Калибровать на human eval (корреляция > 0.8). Code-based checks: формат, длина, запрещённые слова. (5) CI/CD integration: прогонять evals при каждом изменении промпта/модели/pipeline. Fail if quality drops > threshold. (6) Monitoring: sampling production traffic для continuous eval. Drift detection по метрикам качества. (7) Iteration: расширять eval set (добавлять failure cases), обновлять rubrics. Инструменты: Braintrust, promptfoo, custom scripts с OpenAI/Anthropic API.',
    explanation:
      'Eval — это не one-time activity, а continuous process. Принцип: eval-driven development — каждое изменение проверяется на eval suite. Без eval вы оптимизируете вслепую. Минимальный viable eval: 30 примеров + LLM-as-judge + один ключевой критерий.',
  },
];
