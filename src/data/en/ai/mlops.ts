import type { Question } from '@/data/types';

export const mlopsQuestions: Question[] = [
  {
    id: 'ai-mlops-001',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is MLOps?',
    options: [
      'A programming language for machine learning',
      'A set of practices for automating and managing the ML model lifecycle: from development to deployment and monitoring',
      'An operating system optimized for ML tasks',
      'A platform for training neural networks',
    ],
    correctIndex: 1,
    explanation:
      'MLOps = Machine Learning + DevOps. Goal: make ML models production-ready. It covers: (1) Data management: data versioning, data pipelines. (2) Experiment tracking: logging metrics and hyperparameters. (3) Model training: reproducible pipelines. (4) Model deployment: serving, scaling, A/B testing. (5) Monitoring: drift detection, performance tracking. Tools: MLflow, Weights & Biases, DVC, Kubeflow, BentoML. Without MLOps: 87% of ML models never reach production (Gartner).',
  },
  {
    id: 'ai-mlops-002',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Why is ML model versioning needed?',
    options: [
      'To encrypt models when transmitting them over the network',
      'To track which model version runs in production, ensure experiment reproducibility, and enable rollback on degradation',
      'To reduce model size when saving',
      'To convert between frameworks (PyTorch → TensorFlow)',
    ],
    correctIndex: 1,
    explanation:
      'Model versioning addresses: (1) Reproducibility: which data, hyperparameters, and code were used for a specific model. (2) Rollback: if a new version is worse — quickly revert to the previous one. (3) Audit: regulatory requirements (finance, healthcare) — you need to know which model made a decision. (4) Comparison: metrics across versions. Tools: MLflow Model Registry, Weights & Biases, DVC, HuggingFace Model Hub. Good practice: version the model + data + code + config together (full lineage).',
  },
  {
    id: 'ai-mlops-003',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is experiment tracking and what problem does it solve?',
    options: [
      'Monitoring server health during training',
      'Systematically logging the parameters, metrics, and artifacts of every training run to compare experiments and ensure reproducibility',
      'Tracking each data scientist\'s working hours',
      'Tracking bugs in ML code',
    ],
    correctIndex: 1,
    explanation:
      'Without experiment tracking: "What parameters did that model that worked well a month ago use?" — I don\'t remember. Experiment tracking logs: hyperparameters (learning rate, batch size), metrics (loss, accuracy per epoch), artifacts (models, plots), the environment (library versions, hardware). Tools: Weights & Biases (W&B), MLflow Tracking, Neptune, Comet. W&B is the most popular for deep learning. Basic example: wandb.log({"loss": 0.5, "accuracy": 0.92}). It lets you compare dozens of experiments visually.',
  },
  {
    id: 'ai-mlops-004',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What are data drift and concept drift?',
    options: [
      'Data drift is a change in the model, concept drift is a change in the infrastructure',
      'Data drift is a change in the distribution of input data (P(X) changes); concept drift is a change in the relationship between inputs and the target variable (P(Y|X) changes)',
      'Both terms mean the same thing',
      'Data drift is data loss during transmission, concept drift is documentation becoming outdated',
    ],
    correctIndex: 1,
    explanation:
      'Data drift (covariate shift): the distribution of input data P(X) changes. Example: a model trained on winter photos receives summer photos with different characteristics. The model may perform worse even if P(Y|X) has not changed. Concept drift: the relationship P(Y|X) changes. Example: a demand-prediction model — during a pandemic consumer behavior changed. The old model is outdated. Detection: monitoring input data distributions (PSI, KL-divergence), monitoring quality metrics, statistical tests. Response: retraining on new data, adaptive models, human-in-the-loop.',
  },
  {
    id: 'ai-mlops-005',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'middle',
    type: 'open',
    question: 'Describe a typical ML pipeline. What stages does it include and how is reproducibility ensured?',
    sampleAnswer:
      'A typical ML pipeline: (1) Data ingestion: collecting data from sources (databases, APIs, files). (2) Data validation: checking schema, statistics, outliers (Great Expectations, TFX Data Validation). (3) Data preprocessing: cleaning, feature engineering, splitting into train/val/test. (4) Model training: training with logging of metrics and parameters. (5) Model evaluation: assessment on held-out data, comparison against a baseline. (6) Model validation: checks for fairness, bias, edge cases. (7) Model registration: saving to a model registry with metadata. (8) Deployment: canary/blue-green deployment. (9) Monitoring: drift detection, performance metrics. Reproducibility: versioning of data (DVC), code (git), environment (Docker), parameters (config files), random seeds. Orchestration: Kubeflow Pipelines, Apache Airflow, Prefect, Dagster. Every pipeline run should be deterministic given the same input data.',
    explanation:
      'The ML pipeline is the foundation of MLOps. Key principle: pipeline as code — the entire pipeline is described in code, versioned, and runnable with a single command. In practice many companies start simple (scripts + cron) and add complexity as they grow.',
  },
  {
    id: 'ai-mlops-006',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'middle',
    type: 'open',
    question: 'How do you set up A/B testing of ML models in production?',
    sampleAnswer:
      'Approaches: (1) Traffic splitting: part of the traffic (5-10%) is routed to the new model, the rest to the current one. We compare metrics. (2) Canary deployment: gradually increasing traffic to the new model (1% → 5% → 25% → 100%) with monitoring at each stage. Automatic rollback on degradation. (3) Shadow mode: the new model receives the same traffic, but its responses are not shown to users. We collect metrics and compare with production. Safe, but does not catch user-facing effects. (4) Interleaving: for recommendation systems — results from two models are mixed into a single response, and each one\'s CTR is tracked. Key metrics: not only ML metrics (accuracy) but also business metrics (conversion, revenue, engagement). Duration: long enough for statistical significance (usually 1-2 weeks). Tools: LaunchDarkly, Optimizely, custom feature flags.',
    explanation:
      'A/B testing is the only reliable way to evaluate an ML model in production. Offline metrics (accuracy on a test set) do not always correlate with online metrics (user engagement). Principle: measure what matters — business metrics outweigh ML metrics.',
  },
  {
    id: 'ai-mlops-007',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'senior',
    type: 'open',
    question: 'What is a Feature Store? Why is it needed and how is it structured?',
    sampleAnswer:
      'A Feature Store is a centralized store of features for ML. The problem without a Feature Store: each team computes features its own way, leading to duplication and training-serving skew (features at training time ≠ features at inference time). Architecture: (1) Offline store: for batch features (history). Usually Parquet/Delta Lake. Used during training. (2) Online store: for real-time features. Usually Redis/DynamoDB. Used during inference. (3) Feature computation: pipelines to compute features from raw data. (4) Registry: a catalog of features with metadata (owner, description, lineage). Benefits: reuse of features across models, guaranteed consistency (train = serve), governance and discovery, time-travel (features as of time T). Tools: Feast (open-source), Tecton (managed), Databricks Feature Store, Vertex AI Feature Store.',
    explanation:
      'A Feature Store is a mature MLOps pattern for companies with many ML models. Training-serving skew is one of the main causes of model degradation in production. A Feature Store solves it architecturally. For LLM applications a Feature Store is less relevant (embeddings + prompts instead of tabular features).',
  },
  {
    id: 'ai-mlops-008',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'senior',
    type: 'quiz',
    question: 'How does LLMOps differ from classic MLOps?',
    options: [
      'LLMOps and MLOps are the same thing, there are no differences',
      'LLMOps focuses on managing prompts, RAG pipelines, eval sets, and the cost of API calls instead of the classic train-deploy cycle',
      'LLMOps is used only for open-source models',
      'LLMOps does not require monitoring in production',
    ],
    correctIndex: 1,
    explanation:
      'Key differences of LLMOps: (1) Prompt management instead of feature engineering: prompt versioning, prompt A/B tests, prompt registries. (2) Eval-driven development: assessing quality through eval suites (not accuracy on a test set). (3) RAG pipeline management: indexing, chunking, retrieval quality. (4) Cost management: cost per token, optimizing prompt length, choosing a model per task. (5) Guardrails: content filtering, PII detection, safety checks. (6) Fine-tuning vs prompting: deciding whether to "train or prompt". Tools: LangSmith, Braintrust, Humanloop, PromptLayer. Training a model from scratch — rare, fine-tuning — sometimes, prompt engineering — always.',
  },
  {
    id: 'ai-mlops-009',
    block: 'ai',
    topic: 'mlops',
    topicLabel: 'MLOps',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you set up monitoring for an LLM application in production? Which metrics should you track?',
    sampleAnswer:
      'Metrics: (1) Quality: relevance scores (LLM-as-judge), user feedback (thumbs up/down), task completion rate. (2) Safety: toxicity rate, PII leakage, prompt injection attempts. (3) Performance: latency (TTFT, TPOT, E2E), throughput (requests/sec), error rate. (4) Cost: tokens consumed (input/output), cost per request, cost per user. (5) RAG-specific: retrieval relevance, context utilization, faithfulness (the answer is grounded in the context). (6) Operational: GPU utilization, memory usage, queue depth. Tools: LangSmith (traces + evals), Langfuse (open-source observability), Braintrust (evals), Datadog/Grafana (infra). Approach: (1) Structured logging: every LLM call is logged with input/output/latency/tokens. (2) Sampling evaluation: a % of requests pass through an LLM-as-judge for automatic quality assessment. (3) Alerting: anomalies in latency, cost spikes, quality degradation. (4) Dashboards: real-time views of key metrics.',
    explanation:
      'Monitoring an LLM is harder than classic ML because "quality" is subjective. LLM-as-judge (using another LLM to evaluate) is a pragmatic approach, but requires calibration. Human eval is the gold standard, but expensive. A balanced approach: automated evals (daily) + human eval (weekly sampling).',
  },
];
