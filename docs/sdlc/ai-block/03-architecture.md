# Архитектура — Блок AI

**Task ID:** `ai-block`
**Дата:** 2026-02-06

## Принцип: минимальные изменения

Блок AI **полностью повторяет** существующую архитектуру блоков SA и SD. Новых паттернов, компонентов или абстракций не вводится.

## Изменения по слоям

### 1. Типы (`src/data/types.ts`)

```typescript
// Было:
export type Block = 'sa' | 'sd';

// Станет:
export type Block = 'sa' | 'sd' | 'ai';
```

Остальные типы (`BaseQuestion`, `QuizQuestion`, `OpenQuestion`, `Question`) — без изменений. Поле `block: Block` автоматически примет новое значение.

### 2. Данные (`src/data/ai/*.ts`)

Новая директория `src/data/ai/` с 12 файлами. Каждый файл — один экспортируемый массив:

```typescript
// src/data/ai/rag.ts
import type { Question } from '../types';

export const ragQuestions: Question[] = [
  {
    id: 'ai-rag-001',
    block: 'ai',
    topic: 'rag',
    topicLabel: 'RAG',
    difficulty: 'junior',
    type: 'quiz',
    question: '...',
    options: ['...', '...', '...', '...'],
    correctIndex: 0,
    explanation: '...',
  },
  // ...
];
```

Конвенция именования экспортов — `{topic}Questions` (camelCase), по аналогии с `cachingQuestions`, `scalabilityQuestions`.

| Файл | Экспорт |
|------|---------|
| `ml-fundamentals.ts` | `mlFundamentalsQuestions` |
| `neural-networks.ts` | `neuralNetworksQuestions` |
| `transformers.ts` | `transformersQuestions` |
| `llm-fundamentals.ts` | `llmFundamentalsQuestions` |
| `llm-inference.ts` | `llmInferenceQuestions` |
| `rag.ts` | `ragQuestions` |
| `agents.ts` | `agentsQuestions` |
| `prompt-engineering.ts` | `promptEngineeringQuestions` |
| `vector-databases.ts` | `vectorDatabasesQuestions` |
| `mlops.ts` | `mlopsQuestions` |
| `ai-safety.ts` | `aiSafetyQuestions` |
| `evaluation.ts` | `evaluationQuestions` |

### 3. Реестр вопросов (`src/lib/questions.ts`)

Добавляются 12 импортов и 12 spread-элементов в `allQuestions`:

```typescript
// Новые импорты
import { mlFundamentalsQuestions } from '@/data/ai/ml-fundamentals';
import { neuralNetworksQuestions } from '@/data/ai/neural-networks';
// ... ещё 10

const allQuestions: Question[] = [
  // ... существующие SA и SD
  ...mlFundamentalsQuestions,
  ...neuralNetworksQuestions,
  // ... ещё 10
];
```

Функции `getQuestionsByBlock`, `getQuestionsByTopic`, `getTopics` — **без изменений**. Они уже фильтруют по `block` и `topic` динамически.

### 4. Главная страница (`src/app/page.tsx`)

Добавляется третья карточка AI. Grid меняется с `md:grid-cols-2` на `md:grid-cols-3`:

```
Было:    [SA] [SD]
Станет:  [SA] [SD] [AI]
```

Подзаголовок на главной расширяется, т.к. тренажёр теперь не только для системных аналитиков.

### 5. Настройки тренировки (`src/app/quiz/page.tsx`)

Добавляется третья кнопка блока:

```
[Системный Анализ] [System Design] [AI]
```

Остальная логика (выбор темы, сложности, количества) — без изменений, работает через существующие функции `getTopics(block)` и `getQuestionsByBlock(block)`.

## Альтернативы рассмотренные и отклонённые

| Альтернатива | Причина отклонения |
|-------------|-------------------|
| Вынести блоки в конфиг-файл (registry pattern) | Over-engineering для 3 блоков, нарушает текущий паттерн |
| Генерировать вопросы динамически через AI | Вне скоупа, вопросы должны быть статичными и проверенными |
| Создать отдельную страницу для AI-блока | Нарушает единообразие UX, блоки должны быть равноправны |
| Разбить AI на суб-блоки (ML / LLM / Applied) | Усложняет навигацию, 12 тем достаточно плоской структуры |

## Диаграмма затронутых файлов

```
src/
├── data/
│   ├── types.ts              ← ИЗМЕНЕНИЕ: Block + 'ai'
│   ├── sa/                   (без изменений)
│   ├── sd/                   (без изменений)
│   └── ai/                   ← НОВАЯ ДИРЕКТОРИЯ
│       ├── ml-fundamentals.ts
│       ├── neural-networks.ts
│       ├── transformers.ts
│       ├── llm-fundamentals.ts
│       ├── llm-inference.ts
│       ├── rag.ts
│       ├── agents.ts
│       ├── prompt-engineering.ts
│       ├── vector-databases.ts
│       ├── mlops.ts
│       ├── ai-safety.ts
│       └── evaluation.ts
├── lib/
│   └── questions.ts          ← ИЗМЕНЕНИЕ: импорты + allQuestions
├── app/
│   ├── page.tsx              ← ИЗМЕНЕНИЕ: карточка AI + grid
│   └── quiz/
│       └── page.tsx          ← ИЗМЕНЕНИЕ: кнопка AI
```

## Влияние на существующий код

- **Тесты**: могут потребовать обновления если проверяют количество блоков или конкретные значения `Block`
- **localStorage**: формат `ProgressData` не меняется, новые ответы (`ai-*`) добавляются в тот же `answers` record
- **API `/api/evaluate`**: без изменений, принимает любые вопросы
- **Компоненты** (`QuizCard`, `QuizOptions`, `OpenAnswer`, `ResultCard`, `ProgressBar`, `Timer`): без изменений — работают с типом `Question` generically
