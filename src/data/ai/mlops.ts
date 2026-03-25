import type { Question } from '../types';

export const mlopsQuestions: Question[] = [
  {
    id: 'ai-mlops-001',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое MLOps?',
    options: [
      'Язык программирования для машинного обучения',
      'Набор практик для автоматизации и управления жизненным циклом ML-моделей: от разработки до деплоя и мониторинга',
      'Операционная система, оптимизированная для ML-задач',
      'Платформа для обучения нейронных сетей',
    ],
    correctIndex: 1,
    explanation:
      'MLOps = Machine Learning + DevOps. Цель: сделать ML-модели production-ready. Охватывает: (1) Data management: версионирование данных, data pipelines. (2) Experiment tracking: логирование метрик, гиперпараметров. (3) Model training: воспроизводимые пайплайны. (4) Model deployment: serving, scaling, A/B testing. (5) Monitoring: drift detection, performance tracking. Инструменты: MLflow, Weights & Biases, DVC, Kubeflow, BentoML. Без MLOps: 87% ML-моделей не доходят до production (Gartner).',
  },
  {
    id: 'ai-mlops-002',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Зачем нужно версионирование ML-моделей?',
    options: [
      'Для шифрования моделей при передаче по сети',
      'Для отслеживания какая версия модели работает в production, воспроизводимости экспериментов и возможности rollback при деградации',
      'Для уменьшения размера модели при сохранении',
      'Для конвертации между фреймворками (PyTorch → TensorFlow)',
    ],
    correctIndex: 1,
    explanation:
      'Версионирование моделей решает: (1) Воспроизводимость: какие данные, гиперпараметры, код использовались для конкретной модели. (2) Rollback: если новая версия хуже — быстрый откат на предыдущую. (3) Audit: регуляторные требования (finance, healthcare) — нужно знать, какая модель приняла решение. (4) Сравнение: метрики разных версий. Инструменты: MLflow Model Registry, Weights & Biases, DVC, HuggingFace Model Hub. Хорошая практика: версионировать вместе модель + данные + код + конфиг (полная lineage).',
  },
  {
    id: 'ai-mlops-003',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое experiment tracking и какую проблему оно решает?',
    options: [
      'Мониторинг здоровья серверов во время обучения',
      'Систематическое логирование параметров, метрик и артефактов каждого запуска обучения для сравнения экспериментов и воспроизводимости',
      'Отслеживание времени работы каждого data scientist',
      'Трекинг багов в ML-коде',
    ],
    correctIndex: 1,
    explanation:
      'Без experiment tracking: «Какие параметры были у той модели, которая работала хорошо месяц назад?» — не помню. Experiment tracking логирует: гиперпараметры (learning rate, batch size), метрики (loss, accuracy по эпохам), артефакты (модели, графики), среду (versions библиотек, hardware). Инструменты: Weights & Biases (W&B), MLflow Tracking, Neptune, Comet. W&B наиболее популярен для deep learning. Базовый пример: wandb.log({"loss": 0.5, "accuracy": 0.92}). Позволяет сравнивать десятки экспериментов визуально.',
  },
  {
    id: 'ai-mlops-004',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое data drift и concept drift?',
    options: [
      'Data drift — изменение модели, concept drift — изменение инфраструктуры',
      'Data drift — изменение распределения входных данных (P(X) меняется); concept drift — изменение связи между входами и целевой переменной (P(Y|X) меняется)',
      'Оба термина означают одно и то же',
      'Data drift — потеря данных при передаче, concept drift — устаревание документации',
    ],
    correctIndex: 1,
    explanation:
      'Data drift (covariate shift): распределение входных данных P(X) меняется. Пример: модель обучена на зимних фото, летом получает фото с другими характеристиками. Модель может работать хуже, даже если P(Y|X) не изменилась. Concept drift: связь P(Y|X) меняется. Пример: модель предсказания спроса — во время пандемии поведение потребителей изменилось. Старая модель устарела. Обнаружение: мониторинг распределений входных данных (PSI, KL-divergence), мониторинг метрик качества, statistical tests. Реакция: переобучение на новых данных, адаптивные модели, human-in-the-loop.',
  },
  {
    id: 'ai-mlops-005',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'middle',
    type: 'open',
    question: 'Опишите типичный ML pipeline. Какие этапы он включает и как обеспечивается воспроизводимость?',
    sampleAnswer:
      'Типичный ML pipeline: (1) Data ingestion: сбор данных из источников (БД, API, файлы). (2) Data validation: проверка схемы, статистик, выбросов (Great Expectations, TFX Data Validation). (3) Data preprocessing: очистка, feature engineering, разделение на train/val/test. (4) Model training: обучение с логированием метрик и параметров. (5) Model evaluation: оценка на held-out данных, сравнение с baseline. (6) Model validation: проверка на fairness, bias, edge cases. (7) Model registration: сохранение в model registry с метаданными. (8) Deployment: canary/blue-green deployment. (9) Monitoring: drift detection, performance metrics. Воспроизводимость: версионирование данных (DVC), кода (git), окружения (Docker), параметров (config files), random seeds. Orchestration: Kubeflow Pipelines, Apache Airflow, Prefect, Dagster. Каждый запуск pipeline должен быть детерминированным при тех же входных данных.',
    explanation:
      'ML pipeline — основа MLOps. Ключевой принцип: pipeline as code — весь pipeline описан в коде, версионирован, запускается одной командой. На практике многие компании начинают с простого (скрипты + cron) и усложняют по мере роста.',
  },
  {
    id: 'ai-mlops-006',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'middle',
    type: 'open',
    question: 'Как организовать A/B тестирование ML-моделей в production?',
    sampleAnswer:
      'Подходы: (1) Traffic splitting: часть трафика (5-10%) направляется на новую модель, остальное — на текущую. Сравниваем метрики. (2) Canary deployment: постепенное увеличение трафика на новую модель (1% → 5% → 25% → 100%) с мониторингом на каждом этапе. Автоматический rollback при деградации. (3) Shadow mode: новая модель получает тот же трафик, но её ответы не показываются пользователям. Собираем метрики, сравниваем с production. Безопасный, но не ловит user-facing эффекты. (4) Interleaving: для рекомендательных систем — результаты двух моделей перемешиваются в одном ответе, отслеживается CTR каждой. Ключевые метрики: не только ML-метрики (accuracy), но и бизнес-метрики (conversion, revenue, engagement). Длительность: достаточно для статистической значимости (обычно 1-2 недели). Инструменты: LaunchDarkly, Optimizely, custom feature flags.',
    explanation:
      'A/B тестирование — единственный надёжный способ оценить ML-модель в production. Offline метрики (accuracy на test set) не всегда коррелируют с online метриками (user engagement). Принцип: measure what matters — бизнес-метрики важнее ML-метрик.',
  },
  {
    id: 'ai-mlops-007',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'senior',
    type: 'open',
    question: 'Что такое Feature Store? Зачем он нужен и как устроен?',
    sampleAnswer:
      'Feature Store — централизованное хранилище признаков (features) для ML. Проблема без Feature Store: каждая команда вычисляет features по-своему, дублирование, training-serving skew (features при обучении ≠ features при инференсе). Архитектура: (1) Offline store: для batch features (history). Обычно Parquet/Delta Lake. Используется при обучении. (2) Online store: для real-time features. Обычно Redis/DynamoDB. Используется при инференсе. (3) Feature computation: pipelines для вычисления features из raw data. (4) Registry: каталог features с metadata (владелец, описание, lineage). Преимущества: переиспользование features между моделями, гарантия consistency (train = serve), governance и discovery, time-travel (features на момент T). Инструменты: Feast (open-source), Tecton (managed), Databricks Feature Store, Vertex AI Feature Store.',
    explanation:
      'Feature Store — зрелый MLOps паттерн для компаний с множеством ML-моделей. Training-serving skew — одна из главных причин деградации моделей в production. Feature Store решает её архитектурно. Для LLM-приложений Feature Store менее актуален (embeddings + prompts вместо табличных features).',
  },
  {
    id: 'ai-mlops-008',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Чем LLMOps отличается от классического MLOps?',
    options: [
      'LLMOps и MLOps — одно и то же, различий нет',
      'LLMOps фокусируется на управлении промптами, RAG-пайплайнами, eval-наборами и стоимости API-вызовов вместо классического цикла обучения-деплоя',
      'LLMOps используется только для open-source моделей',
      'LLMOps не требует мониторинга в production',
    ],
    correctIndex: 1,
    explanation:
      'Ключевые отличия LLMOps: (1) Prompt management вместо feature engineering: версионирование промптов, A/B тесты промптов, prompt registries. (2) Eval-driven development: оценка качества через eval suites (не accuracy на test set). (3) RAG pipeline management: индексация, chunking, retrieval quality. (4) Cost management: стоимость per token, оптимизация длины промптов, выбор модели по задаче. (5) Guardrails: content filtering, PII detection, safety checks. (6) Fine-tuning vs prompting: решение «учить или промптить». Инструменты: LangSmith, Braintrust, Humanloop, PromptLayer. Обучение модели с нуля — редко, fine-tuning — иногда, prompt engineering — всегда.',
  },
  {
    id: 'ai-mlops-009',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'senior',
    type: 'open',
    question: 'Как организовать мониторинг LLM-приложения в production? Какие метрики отслеживать?',
    sampleAnswer:
      'Метрики: (1) Quality: relevance scores (LLM-as-judge), user feedback (thumbs up/down), task completion rate. (2) Safety: toxicity rate, PII leakage, prompt injection attempts. (3) Performance: latency (TTFT, TPOT, E2E), throughput (requests/sec), error rate. (4) Cost: tokens consumed (input/output), cost per request, cost per user. (5) RAG-specific: retrieval relevance, context utilization, faithfulness (ответ основан на context). (6) Operational: GPU utilization, memory usage, queue depth. Инструменты: LangSmith (traces + evals), Langfuse (open-source observability), Braintrust (evals), Datadog/Grafana (infra). Подход: (1) Structured logging: каждый LLM-вызов логируется с input/output/latency/tokens. (2) Sampling evaluation: % запросов проходят через LLM-as-judge для автоматической оценки качества. (3) Alerting: аномалии в latency, cost spikes, quality degradation. (4) Dashboards: real-time views по key metrics.',
    explanation:
      'Мониторинг LLM — сложнее чем классического ML, потому что «качество» — субъективно. LLM-as-judge (использовать другую LLM для оценки) — прагматичный подход, но требует калибровки. Human eval — gold standard, но дорого. Сбалансированный подход: automated evals (daily) + human eval (weekly sampling).',
  },
];
