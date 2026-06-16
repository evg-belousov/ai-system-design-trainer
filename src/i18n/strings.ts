export type Lang = 'en' | 'ru';

export const LANGS: Lang[] = ['en', 'ru'];

interface MetricCopy {
  label: string;
  description: string;
  low: string;
  high: string;
  strong: string;
  weak: string;
}

export interface Dict {
  brand: string;
  /** Studio attribution prefix shown before the Owlary mark in the footer. */
  madeBy: string;
  startTraining: string;
  next: string;
  back: string;
  finish: string;
  loading: string;
  toHome: string;
  darkTheme: string;
  lightTheme: string;
  language: string;
  api: {
    configured: string;
    configure: string;
    title: string;
    hint: string;
    save: string;
    clear: string;
    cancel: string;
    fallback: string;
    badRequest: string;
  };
  home: {
    title: string;
    subtitle: string;
    blockSA: string;
    blockSD: string;
    blockAI: string;
    questions: (n: number) => string;
    constructorTitle: string;
    constructorDesc: string;
    constructorScenarios: (n: number) => string;
    footer: (n: number) => string;
  };
  quizSetup: {
    title: string;
    block: string;
    topic: string;
    allTopics: string;
    difficulty: string;
    all: string;
    questionCount: (n: number) => string;
  };
  quizSession: {
    notFound: string;
    backToSetup: string;
    complete: string;
    score: (correct: number, total: number) => string;
    newTraining: string;
    aiEvaluating: string;
  };
  result: {
    correct: string;
    incorrect: string;
    aiScore: string;
  };
  openAnswer: {
    placeholder: string;
    submit: string;
  };
  design: {
    subtitle: string;
    footer: (n: number) => string;
  };
  scenarioCard: {
    stepsDecisions: (steps: number, decisions: number) => string;
    passed: string;
  };
  metricsPanel: {
    title: string;
    whatIsThis: string;
    hide: string;
    helpIntro: string;
    helpStrong: string;
    helpMid: string;
    helpWeak: string;
    helpNote: string;
  };
  tradeoff: {
    title: string;
    intro: string;
    won: string;
    compromise: string;
    sacrificed: string;
    neutralText: string;
  };
  metrics: Record<'latency' | 'scalability' | 'consistency' | 'complexity' | 'cost', MetricCopy>;
  optionCard: {
    selected: string;
    showDetails: string;
    hideDetails: string;
    pros: string;
    cons: string;
    bestWhen: string;
  };
  capacityPanel: {
    title: string;
    empty: string;
    show: string;
    hide: string;
    note: string;
  };
  scoreCard: {
    excellent: string;
    good: string;
    poor: string;
    retry: string;
  };
  solutionComparison: {
    title: string;
    yourChoice: string;
    reference: string;
    explanation: string;
    diagram: string;
  };
  summaryView: {
    results: string;
  };
  stepCard: {
    multiSelect: string;
  };
  tipReveal: {
    showTip: string;
  };
  meta: {
    title: string;
    description: string;
  };
}

const en: Dict = {
  brand: 'System Design Trainer',
  madeBy: 'Made in',
  startTraining: 'Start training',
  next: 'Next',
  back: 'Back',
  finish: 'Finish',
  loading: 'Loading…',
  toHome: 'Home',
  darkTheme: 'Dark theme',
  lightTheme: 'Light theme',
  language: 'Language',
  api: {
    configured: 'API key configured',
    configure: 'Configure API key',
    title: 'OpenAI API settings',
    hint: 'Enter your OpenAI API key for AI evaluation of open-ended answers. The key is stored only in your browser.',
    save: 'Save',
    clear: 'Clear',
    cancel: 'Cancel',
    fallback: 'Automatic evaluation is unavailable. Compare your answer with the reference one.',
    badRequest: 'Invalid request: required fields are missing.',
  },
  home: {
    title: 'Interview preparation',
    subtitle: 'Senior / Lead System Analyst',
    blockSA: 'System Analysis',
    blockSD: 'System Design',
    blockAI: 'AI / ML',
    questions: (n) => `${n} question${n === 1 ? '' : 's'}`,
    constructorTitle: 'System Design Constructor',
    constructorDesc: 'Design real systems step by step: choose technologies, study trade-offs, compare against a reference solution',
    constructorScenarios: (n) => `${n} scenarios: URL Shortener, Chat Messenger, News Feed, Video Streaming and more`,
    footer: (n) => `${n} questions total · Quiz + open-ended questions · Junior / Middle / Senior`,
  },
  quizSetup: {
    title: 'Training setup',
    block: 'Block',
    topic: 'Topic',
    allTopics: 'All topics',
    difficulty: 'Difficulty',
    all: 'All',
    questionCount: (n) => `Number of questions (available: ${n})`,
  },
  quizSession: {
    notFound: 'No questions found.',
    backToSetup: 'Back to setup',
    complete: 'Training complete!',
    score: (correct, total) => `Quiz questions: ${correct} / ${total} correct`,
    newTraining: 'New training',
    aiEvaluating: 'AI evaluating…',
  },
  result: {
    correct: 'Correct!',
    incorrect: 'Incorrect',
    aiScore: 'AI evaluation:',
  },
  openAnswer: {
    placeholder: 'Type your answer…',
    submit: 'Submit',
  },
  design: {
    subtitle: 'Design real systems step by step, studying trade-offs and best practices',
    footer: (n) => `${n} scenarios · Middle / Senior`,
  },
  scenarioCard: {
    stepsDecisions: (steps, decisions) => `${steps} steps · ${decisions} decisions`,
    passed: 'Completed',
  },
  metricsPanel: {
    title: 'System metrics',
    whatIsThis: 'What is this?',
    hide: 'Hide',
    helpIntro: 'Each of your choices affects the system characteristics. Scale from 0 to 10:',
    helpStrong: '— a strength of your architecture',
    helpMid: '— acceptable, but a trade-off',
    helpWeak: '— a weak spot that needs attention',
    helpNote: 'In real systems it is impossible to score 10 on every metric — that is the essence of trade-offs. For example, choosing Cassandra raises scalability but lowers consistency.',
  },
  tradeoff: {
    title: 'Trade-off analysis',
    intro: 'Every architectural decision is a compromise. You cannot optimize everything at once. Below is what you gained and what you gave up.',
    won: 'What you gained',
    compromise: 'Compromise',
    sacrificed: 'What you gave up',
    neutralText: 'Acceptable, but may need rework as you scale',
  },
  metrics: {
    latency: {
      label: 'Latency',
      description: 'How fast the system responds to the user',
      low: 'High latency, slow response',
      high: 'Fast response, low latency',
      strong: 'Fast response — users do not wait',
      weak: 'High latency — users will leave',
    },
    scalability: {
      label: 'Scalability',
      description: 'The system’s ability to grow under load',
      low: 'Hard to scale, will hit a ceiling',
      high: 'Easy to add capacity, horizontal growth',
      strong: 'The system is ready for load growth',
      weak: 'Under traffic growth the system will hit a ceiling',
    },
    consistency: {
      label: 'Consistency',
      description: 'Data consistency guarantees (CAP theorem)',
      low: 'Eventual consistency, divergence possible',
      high: 'Strong consistency, data is always up to date',
      strong: 'Data is always up to date and consistent',
      weak: 'Divergence possible — users may see stale data',
    },
    complexity: {
      label: 'Simplicity',
      description: 'Ease of implementation and maintenance',
      low: 'Complex system, hard to maintain and debug',
      high: 'Simple solution, easy to understand and evolve',
      strong: 'Simple system — easy to maintain and onboard new engineers',
      weak: 'High complexity — long onboarding, hard debugging',
    },
    cost: {
      label: 'Cost Efficiency',
      description: 'Infrastructure and operational costs',
      low: 'Expensive: many servers, licenses, traffic',
      high: 'Cost-efficient solution, reasonable spending',
      strong: 'Cost-efficient solution — reasonable infrastructure spend',
      weak: 'Expensive infrastructure — high server and service costs',
    },
  },
  optionCard: {
    selected: 'Selected',
    showDetails: 'Details',
    hideDetails: 'Hide details',
    pros: 'Pros: ',
    cons: 'Cons: ',
    bestWhen: 'Best when: ',
  },
  capacityPanel: {
    title: 'Capacity Estimation',
    empty: 'Choose system parameters — estimates will appear automatically',
    show: 'Show calculations',
    hide: 'Hide calculations',
    note: 'Numbers recalculate on every technology choice',
  },
  scoreCard: {
    excellent: 'Excellent result! Your solution is close to the reference.',
    good: 'Good result. There is room for improvement.',
    poor: 'There is work to do. Study the reference solution.',
    retry: 'Try again',
  },
  solutionComparison: {
    title: 'Comparison with the reference',
    yourChoice: 'Your choice: ',
    reference: 'Reference: ',
    explanation: 'Reference solution explanation',
    diagram: 'Architecture diagram',
  },
  summaryView: {
    results: 'Results',
  },
  stepCard: {
    multiSelect: 'Multiple choice allowed',
  },
  tipReveal: {
    showTip: 'Show hint',
  },
  meta: {
    title: 'System Design Trainer',
    description: 'A trainer for System Design and system analysis interview preparation',
  },
};

const ru: Dict = {
  brand: 'System Design Trainer',
  madeBy: 'Сделано в',
  startTraining: 'Начать тренировку',
  next: 'Далее',
  back: 'Назад',
  finish: 'Завершить',
  loading: 'Загрузка…',
  toHome: 'На главную',
  darkTheme: 'Тёмная тема',
  lightTheme: 'Светлая тема',
  language: 'Язык',
  api: {
    configured: 'API ключ настроен',
    configure: 'Настроить API ключ',
    title: 'Настройки OpenAI API',
    hint: 'Введите ваш OpenAI API ключ для AI-оценки открытых ответов. Ключ хранится только в вашем браузере.',
    save: 'Сохранить',
    clear: 'Очистить',
    cancel: 'Отмена',
    fallback: 'Автоматическая оценка недоступна. Сравните свой ответ с эталонным.',
    badRequest: 'Некорректный запрос: отсутствуют обязательные поля.',
  },
  home: {
    title: 'Подготовка к собеседованию',
    subtitle: 'Senior / Lead System Analyst',
    blockSA: 'Системный Анализ',
    blockSD: 'System Design',
    blockAI: 'AI / ML',
    questions: (n) => `${n} вопросов`,
    constructorTitle: 'System Design Constructor',
    constructorDesc: 'Проектируйте реальные системы шаг за шагом: выбирайте технологии, изучайте trade-offs, сравнивайте с эталоном',
    constructorScenarios: (n) => `${n} сценариев: URL Shortener, Chat Messenger, News Feed, Video Streaming и другие`,
    footer: (n) => `Всего ${n} вопросов · Quiz + открытые вопросы · Junior / Middle / Senior`,
  },
  quizSetup: {
    title: 'Настройка тренировки',
    block: 'Блок',
    topic: 'Тема',
    allTopics: 'Все темы',
    difficulty: 'Сложность',
    all: 'Все',
    questionCount: (n) => `Количество вопросов (доступно: ${n})`,
  },
  quizSession: {
    notFound: 'Вопросы не найдены.',
    backToSetup: 'Назад к настройкам',
    complete: 'Тренировка завершена!',
    score: (correct, total) => `Quiz-вопросы: ${correct} / ${total} правильных`,
    newTraining: 'Новая тренировка',
    aiEvaluating: 'Оценка AI…',
  },
  result: {
    correct: 'Правильно!',
    incorrect: 'Неправильно',
    aiScore: 'Оценка AI:',
  },
  openAnswer: {
    placeholder: 'Введите ваш ответ…',
    submit: 'Ответить',
  },
  design: {
    subtitle: 'Проектируйте реальные системы шаг за шагом, изучая trade-offs и лучшие практики',
    footer: (n) => `${n} сценариев · Middle / Senior`,
  },
  scenarioCard: {
    stepsDecisions: (steps, decisions) => `${steps} шагов · ${decisions} решений`,
    passed: 'Пройден',
  },
  metricsPanel: {
    title: 'Метрики системы',
    whatIsThis: 'Что это?',
    hide: 'Скрыть',
    helpIntro: 'Каждый ваш выбор влияет на характеристики системы. Шкала от 0 до 10:',
    helpStrong: '— сильная сторона вашей архитектуры',
    helpMid: '— приемлемо, но есть компромисс',
    helpWeak: '— слабое место, потребует внимания',
    helpNote: 'В реальных системах невозможно получить 10 по всем метрикам — это и есть суть trade-offs. Например, выбор Cassandra повышает scalability, но снижает consistency.',
  },
  tradeoff: {
    title: 'Trade-off анализ',
    intro: 'Каждое архитектурное решение — это компромисс. Нельзя оптимизировать всё одновременно. Ниже — что вы выиграли и чем пожертвовали.',
    won: 'Вы выиграли',
    compromise: 'Компромисс',
    sacrificed: 'Чем пожертвовали',
    neutralText: 'Приемлемо, но при росте может потребовать доработки',
  },
  metrics: {
    latency: {
      label: 'Latency',
      description: 'Скорость отклика системы для пользователя',
      low: 'Высокие задержки, медленный отклик',
      high: 'Быстрый отклик, низкие задержки',
      strong: 'Быстрый отклик — пользователи не ждут',
      weak: 'Высокие задержки — пользователи будут уходить',
    },
    scalability: {
      label: 'Scalability',
      description: 'Способность системы расти под нагрузкой',
      low: 'Сложно масштабировать, упрётся в потолок',
      high: 'Легко добавлять мощности, горизонтальный рост',
      strong: 'Система готова к росту нагрузки',
      weak: 'При росте трафика система упрётся в потолок',
    },
    consistency: {
      label: 'Consistency',
      description: 'Гарантии согласованности данных (CAP-теорема)',
      low: 'Eventual consistency, возможны рассинхроны',
      high: 'Strong consistency, данные всегда актуальны',
      strong: 'Данные всегда актуальны и согласованы',
      weak: 'Возможны рассинхроны — пользователь может видеть устаревшие данные',
    },
    complexity: {
      label: 'Simplicity',
      description: 'Простота реализации и поддержки',
      low: 'Сложная система, трудно поддерживать и дебажить',
      high: 'Простое решение, легко понять и развивать',
      strong: 'Простая система — легко поддерживать и онбордить новых инженеров',
      weak: 'Высокая сложность — долгий онбординг, сложный дебаг',
    },
    cost: {
      label: 'Cost Efficiency',
      description: 'Стоимость инфраструктуры и операционных расходов',
      low: 'Дорого: много серверов, лицензий, трафика',
      high: 'Экономичное решение, разумные расходы',
      strong: 'Экономичное решение — разумные расходы на инфраструктуру',
      weak: 'Дорогая инфраструктура — высокие расходы на серверы и сервисы',
    },
  },
  optionCard: {
    selected: 'Выбрано',
    showDetails: 'Подробнее',
    hideDetails: 'Скрыть детали',
    pros: 'Плюсы: ',
    cons: 'Минусы: ',
    bestWhen: 'Лучше всего когда: ',
  },
  capacityPanel: {
    title: 'Capacity Estimation',
    empty: 'Выберите параметры системы — расчёты появятся автоматически',
    show: 'Показать расчёты',
    hide: 'Скрыть расчёты',
    note: 'Цифры пересчитываются при каждом выборе технологии',
  },
  scoreCard: {
    excellent: 'Отличный результат! Ваше решение близко к эталону.',
    good: 'Хороший результат. Есть потенциал для улучшения.',
    poor: 'Есть над чем поработать. Изучите эталонное решение.',
    retry: 'Пройти заново',
  },
  solutionComparison: {
    title: 'Сравнение с эталоном',
    yourChoice: 'Ваш выбор: ',
    reference: 'Эталон: ',
    explanation: 'Объяснение эталонного решения',
    diagram: 'Архитектурная диаграмма',
  },
  summaryView: {
    results: 'Результаты',
  },
  stepCard: {
    multiSelect: 'Можно выбрать несколько',
  },
  tipReveal: {
    showTip: 'Показать подсказку',
  },
  meta: {
    title: 'System Design Trainer',
    description: 'Тренажёр для подготовки к собеседованиям по System Design и системному анализу',
  },
};

export const dictionaries: Record<Lang, Dict> = { en, ru };
