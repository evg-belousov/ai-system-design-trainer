import type { Question } from '@/data/types';

export const mlFundamentalsQuestions: Question[] = [
  {
    id: 'ai-ml-fundamentals-001',
    block: 'ai',
    topic: 'ml-fundamentals',
    topicLabel: 'ML Fundamentals',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Which type of machine learning uses labeled data (input-output pairs) to train a model?',
    options: [
      'Reinforcement Learning',
      'Supervised Learning',
      'Unsupervised Learning',
      'Self-supervised Learning',
    ],
    correctIndex: 1,
    explanation:
      'Supervised Learning is an approach where a model is trained on labeled data, with a correct answer (label) for each input. The model learns to map input features to a target variable. Example tasks: classification (spam / not spam), regression (price prediction). This contrasts with unsupervised learning, where there are no labels, and reinforcement learning, where an agent learns through interaction with an environment.',
  },
  {
    id: 'ai-ml-fundamentals-002',
    block: 'ai',
    topic: 'ml-fundamentals',
    topicLabel: 'ML Fundamentals',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is overfitting?',
    options: [
      'The model performs poorly on both the training set and the test set',
      'The model performs well on training data but generalizes poorly to new data',
      'The model was trained for too few epochs',
      'The model uses too few features for training',
    ],
    correctIndex: 1,
    explanation:
      'Overfitting is a situation where a model "memorizes" the training set instead of learning general patterns. The symptom: high accuracy on train, low accuracy on test/validation. Causes: a model that is too complex, too little data, training for too long. Mitigation techniques: regularization (L1/L2), dropout, early stopping, data augmentation, cross-validation.',
  },
  {
    id: 'ai-ml-fundamentals-003',
    block: 'ai',
    topic: 'ml-fundamentals',
    topicLabel: 'ML Fundamentals',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Which metric is better suited for evaluating a classification model on imbalanced data (for example, 95% class A, 5% class B)?',
    options: [
      'Accuracy',
      'F1-score',
      'Mean Absolute Error (MAE)',
      'R² (coefficient of determination)',
    ],
    correctIndex: 1,
    explanation:
      'On imbalanced data, accuracy is misleading: a model that always predicts class A would achieve 95% accuracy. F1-score — the harmonic mean of precision and recall — accounts for both error types (false positives and false negatives) and is not affected by class imbalance. Also useful: the precision-recall curve, ROC-AUC, and the confusion matrix for detailed analysis. MAE and R² are metrics for regression tasks, not classification.',
  },
  {
    id: 'ai-ml-fundamentals-004',
    block: 'ai',
    topic: 'ml-fundamentals',
    topicLabel: 'ML Fundamentals',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What does the bias-variance tradeoff describe?',
    options: [
      'A tradeoff between training speed and model quality',
      'A tradeoff between error from simplifying assumptions in the model (bias) and error from sensitivity to the specific data (variance)',
      'A tradeoff between the size of the training set and the test set',
      'A tradeoff between the number of features and the number of examples',
    ],
    correctIndex: 1,
    explanation:
      'The bias-variance tradeoff is a fundamental concept in ML. High bias (underfitting): the model is too simple and fails to capture patterns (example: linear regression for nonlinear data). High variance (overfitting): the model is too complex and adapts to the noise in the data. Total error = bias² + variance + irreducible error. The goal is to find a balance: a model complex enough to capture the patterns, but not so complex that it memorizes the noise.',
  },
  {
    id: 'ai-ml-fundamentals-005',
    block: 'ai',
    topic: 'ml-fundamentals',
    topicLabel: 'ML Fundamentals',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is k-fold cross-validation used for?',
    options: [
      'To increase the amount of training data',
      'To obtain a more reliable estimate of model quality by repeatedly splitting the data into training and validation sets',
      'To automatically tune the model hyperparameters',
      'To reduce training time through parallelization',
    ],
    correctIndex: 1,
    explanation:
      'K-fold cross-validation: the data is split into k parts (folds). The model is trained k times, each time using k-1 folds for training and 1 for validation. The final metric is the average over the k runs. Advantages: every example is used for validation exactly once, and the estimate is more stable than a single train/test split. Typical values of k: 5 or 10. Variations: stratified k-fold (preserves class proportions), leave-one-out (k = N).',
  },
  {
    id: 'ai-ml-fundamentals-006',
    block: 'ai',
    topic: 'ml-fundamentals',
    topicLabel: 'ML Fundamentals',
    difficulty: 'middle',
    type: 'open',
    question: 'Compare L1 (Lasso) and L2 (Ridge) regularization. When is each preferable?',
    sampleAnswer:
      'L1 (Lasso) adds the sum of the absolute values of the weights (|w|) to the loss function. It produces sparse models — some weights are driven to zero, which acts as automatic feature selection. It is suitable when there are many irrelevant features. L2 (Ridge) adds the sum of the squared weights (w²). It shrinks all weights but does not zero them out. It is suitable when all features are potentially important but you need to prevent overfitting. Elastic Net — a combination of L1 and L2 — is used when there are groups of correlated features.',
    explanation:
      'Regularization is a technique for combating overfitting by adding a penalty for model complexity to the loss function. L1 produces sparse solutions (feature selection), while L2 shrinks weights toward zero without zeroing them out. In practice, L2 is more commonly used in neural networks (weight decay), while L1 is used in linear models for interpretability.',
  },
  {
    id: 'ai-ml-fundamentals-007',
    block: 'ai',
    topic: 'ml-fundamentals',
    topicLabel: 'ML Fundamentals',
    difficulty: 'senior',
    type: 'open',
    question: 'Explain how Gradient Boosting works. Why do XGBoost/LightGBM still often beat neural networks on tabular data?',
    sampleAnswer:
      'Gradient Boosting builds an ensemble of weak models (usually decision trees) sequentially. Each new tree is trained to predict the residuals (errors) of the previous ensemble, effectively performing gradient descent in function space. The final prediction is the sum of the predictions of all trees. XGBoost/LightGBM beat neural networks on tabular data because: (1) trees naturally handle mixed data types (numerical + categorical), (2) they do not require normalization, (3) they are robust to irrelevant features, (4) they work well with small amounts of data, (5) neural networks are optimized for data with spatial/temporal structure (images, text), which tabular data lacks.',
    explanation:
      'Gradient Boosting is one of the most powerful algorithms for tabular data. XGBoost (2014), LightGBM (2017), and CatBoost (2017) are optimized implementations with various improvements: histogram-based splitting, leaf-wise growth, ordered boosting. Studies (for example, tabular benchmarks from 2022-2024) regularly confirm their superiority over deep learning on structured data.',
  },
  {
    id: 'ai-ml-fundamentals-008',
    block: 'ai',
    topic: 'ml-fundamentals',
    topicLabel: 'ML Fundamentals',
    difficulty: 'senior',
    type: 'open',
    question: 'What is data leakage in ML? Give examples and explain how to detect and prevent it.',
    sampleAnswer:
      'Data leakage is a situation where information from the test set or from future data "leaks" into training, leading to unrealistically high metrics. Examples: (1) normalization before the train/test split (test statistics enter training), (2) a feature directly tied to the target variable (a patient ID correlated with the diagnosis), (3) using future data in time-series forecasting tasks. Detection: suspiciously high metrics, a sharp drop in quality on real data, analysis of feature importance. Prevention: strict separation of data before any preprocessing, using a pipeline (sklearn Pipeline), a temporal split for time-series data, and reviewing feature engineering.',
    explanation:
      'Data leakage is one of the most insidious mistakes in ML, because the model looks excellent on validation but fails in production. It is especially dangerous in medicine, finance, and other high-stakes domains. The rule: everything the model knows during training must also be available to it at inference time.',
  },
  {
    id: 'ai-ml-fundamentals-009',
    block: 'ai',
    topic: 'ml-fundamentals',
    topicLabel: 'ML Fundamentals',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Which statement about the "No Free Lunch" theorem in machine learning is correct?',
    options: [
      'There exists a universal algorithm that outperforms all others on any task',
      'No algorithm can be better than all others on all possible tasks — the choice of algorithm depends on the data and the task',
      'Deep learning always outperforms classical methods given enough data',
      'Ensemble methods are always better than single models',
    ],
    correctIndex: 1,
    explanation:
      'The No Free Lunch theorem (Wolpert, 1996) states that, averaged over all possible tasks, all optimization algorithms are equivalent. The practical conclusion: there is no single "best" algorithm — the choice depends on the specific task, data, and constraints. This is why it is important to understand the assumptions (inductive bias) of each algorithm, try different approaches, and use domain knowledge to guide the choice.',
  },
];
