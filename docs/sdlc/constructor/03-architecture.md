# Architecture: System Design Constructor

## 1. Обзор

Фича добавляет новый раздел `/constructor` в существующее Next.js-приложение. Архитектура повторяет паттерны проекта: статические данные в `src/data/`, клиентские хуки для состояния, Server Components для страниц-обёрток и Client Components для интерактива.

## 2. Структура файлов

```
src/
├── data/
│   └── constructor/
│       ├── types.ts                    # Типы: Scenario, Step, Decision, Option, Impact...
│       ├── index.ts                    # Агрегация и экспорт всех сценариев
│       ├── url-shortener.ts
│       ├── rate-limiter.ts
│       ├── notification-system.ts
│       ├── chat-messenger.ts
│       ├── news-feed.ts
│       ├── video-streaming.ts
│       ├── collaborative-editor.ts
│       └── ride-sharing.ts
├── lib/
│   └── constructor.ts                  # Утилиты: getScenarios, getScenarioById, calculateMetrics
├── hooks/
│   ├── useConstructorSession.ts        # Состояние сессии
│   └── useConstructorProgress.ts       # Прогресс в localStorage
├── components/
│   └── constructor/
│       ├── ScenarioCard.tsx            # Карточка сценария в каталоге
│       ├── StepCard.tsx                # Текущий шаг с решениями
│       ├── OptionCard.tsx              # Вариант выбора (pros/cons/bestWhen)
│       ├── MetricsPanel.tsx            # Панель метрик с radar chart
│       ├── RadarChart.tsx              # SVG radar chart (5 осей)
│       ├── StepNavigator.tsx           # Прогресс-бар + навигация по шагам
│       ├── TipReveal.tsx               # Подсказка (скрыта по умолчанию)
│       ├── SummaryView.tsx             # Итоговый экран (обёртка)
│       ├── TradeOffMatrix.tsx          # Таблица trade-offs
│       ├── SolutionComparison.tsx      # Сравнение с эталоном
│       └── ScoreCard.tsx              # Оценка результата
├── app/
│   └── constructor/
│       ├── page.tsx                    # Каталог сценариев (Server Component)
│       └── [id]/
│           └── session/
│               └── page.tsx            # Сессия конструктора (Client Component)
```

## 3. Типы данных

```typescript
// src/data/constructor/types.ts

export type MetricKey = 'latency' | 'scalability' | 'consistency' | 'complexity' | 'cost';

export interface Impact {
  latency: number;       // -2..+2 (отрицательное = хуже, положительное = лучше)
  scalability: number;
  consistency: number;
  complexity: number;    // отрицательное = сложнее
  cost: number;          // отрицательное = дороже
}

export interface Option {
  id: string;
  label: string;
  description: string;
  pros: string[];
  cons: string[];
  bestWhen: string;
  impact: Impact;
}

export interface Decision {
  id: string;
  category: string;
  question: string;
  options: Option[];
  multiSelect?: boolean;  // default: false (одиночный выбор)
}

export interface Step {
  id: string;
  title: string;
  description: string;
  decisions: Decision[];
  tip?: string;
}

export interface ReferenceSolution {
  decisions: Record<string, string[]>;  // decisionId → optionId[]
  explanation: string;
  diagram: string;                      // ASCII-диаграмма
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'middle' | 'senior';
  steps: Step[];
  referenceSolution: ReferenceSolution;
}
```

## 4. Компоненты

### 4.1 Серверные (Server Components)

**`/constructor/page.tsx`** — каталог:
- Импортирует `getScenarios()` из `lib/constructor.ts`
- Рендерит `ScenarioCard` для каждого сценария
- Фильтр по сложности — Client Component (useState)

**`/constructor/[id]/session/page.tsx`** — обёртка сессии:
- Получает `id` из params
- Загружает сценарий через `getScenarioById(id)`
- Передаёт данные в Client Component `ConstructorSession`

### 4.2 Клиентские (Client Components)

**`StepCard`** — отображает текущий шаг:
```
Props: { step: Step, selections: Record<string, string[]>, onSelect }
```
- Рендерит `Decision` → `OptionCard` для каждого решения
- Подсвечивает выбранные опции
- Показывает `TipReveal` если есть tip

**`OptionCard`** — карточка варианта:
```
Props: { option: Option, selected: boolean, onToggle }
```
- Компактный вид: label + description
- Раскрытие: pros/cons/bestWhen
- Визуальное состояние: выбран / не выбран

**`MetricsPanel`** — живая сводка:
```
Props: { metrics: Record<MetricKey, number> }
```
- Содержит `RadarChart` + легенду
- Цветовая индикация: зелёный (хорошо) / жёлтый (средне) / красный (плохо)

**`RadarChart`** — SVG, 5 осей:
```
Props: { values: Record<MetricKey, number>, max: number }
```
- Чистый SVG без библиотек
- Оси: latency, scalability, consistency, complexity, cost
- Полигон текущих значений + полигон эталона (полупрозрачный, на итоговом экране)

**`SummaryView`** — итоговый экран:
```
Props: { scenario: Scenario, selections: Record<string, string[]>, metrics }
```
- Собирает `TradeOffMatrix`, `SolutionComparison`, `ScoreCard`

## 5. Хуки

### 5.1 useConstructorSession

```typescript
interface ConstructorSessionState {
  currentStepIndex: number;
  selections: Record<string, string[]>;  // decisionId → optionId[]
  metrics: Record<MetricKey, number>;
  completed: boolean;
}

interface UseConstructorSessionReturn {
  state: ConstructorSessionState;
  currentStep: Step;
  selectOption: (decisionId: string, optionId: string) => void;
  deselectOption: (decisionId: string, optionId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  finish: () => void;
  reset: () => void;
  score: number | null;          // рассчитывается при finish()
}
```

**Логика пересчёта метрик:**
- Базовые значения: все метрики = 5 (из 10)
- При каждом изменении selections: проход по всем выбранным опциям → суммирование impact → clamp(0, 10)
- Пересчёт всегда от базы (не инкрементальный) — корректно работает при навигации назад

**Логика score:**
- Сравнение selections с referenceSolution.decisions
- За каждое совпадение decisionId → пересечение optionId[] / объединение optionId[]
- Итоговый score = среднее по всем decisions × 100

### 5.2 useConstructorProgress

```typescript
interface ScenarioProgress {
  scenarioId: string;
  selections: Record<string, string[]>;
  score: number | null;
  completedAt: string | null;    // ISO date
}

interface UseConstructorProgressReturn {
  getProgress: (scenarioId: string) => ScenarioProgress | null;
  getAllProgress: () => ScenarioProgress[];
  saveProgress: (progress: ScenarioProgress) => void;
  clearProgress: (scenarioId: string) => void;
}
```

localStorage key: `constructor-progress`

## 6. Data Flow

```
[Каталог]
  getScenarios() + getAllProgress()
  → ScenarioCard[] (с badge прогресса)
  → клик → router.push(`/constructor/${id}/session`)

[Сессия]
  getScenarioById(id) → scenario
  useConstructorSession(scenario) → state, actions
  useConstructorProgress() → save/load

  Цикл:
    StepCard(step, selections) → пользователь выбирает → selectOption()
                                                        → metrics пересчитываются
                                                        → MetricsPanel обновляется
    → nextStep() → следующий StepCard
    → ... (повтор для каждого шага)
    → finish() → score рассчитывается
              → saveProgress()
              → SummaryView отображается
```

## 7. Альтернативы и trade-offs

### Radar chart: SVG vs библиотека (recharts/chart.js)

| | Свой SVG | Библиотека |
|--|----------|-----------|
| Bundle size | 0 KB | +40-80 KB |
| Гибкость | Полная | Ограничена API |
| Время разработки | Больше | Меньше |
| Поддержка | Своя | Сообщество |

**Решение:** Свой SVG. 5 осей — это простая геометрия, не нужна библиотека ради одного графика. Соответствует принципу проекта — минимум зависимостей.

### Хранение выборов: в URL vs в state

| | URL (searchParams) | React state + localStorage |
|--|---------------------|---------------------------|
| Shareability | Можно поделиться ссылкой | Нет |
| Длина URL | Может быть очень длинным | Не проблема |
| Простота | Сложная сериализация | Просто |

**Решение:** React state + localStorage. URL стал бы слишком длинным (десятки решений), shareability вне скоупа v1.

### Все сценарии сразу vs итеративно

| | Все 8 сразу | 2 MVP + остальные потом |
|--|-------------|------------------------|
| Time to launch | Дольше | Быстрее |
| Качество контента | Риск неоднородности | Можно отточить формат |
| Полнота | Сразу полный продукт | Неполный на старте |

**Решение:** Все 8 сразу (по запросу). Формат уже определён, типы зафиксированы.

## 8. Интеграция с существующим приложением

- **Header**: переиспользуется без изменений (уже содержит навигацию)
- **Главная страница**: добавляется секция «System Design Constructor» со ссылкой на `/constructor`
- **Тема**: все компоненты используют существующие Tailwind dark: классы
- **Типы**: `Difficulty` из `src/data/types.ts` переиспользуется (но в constructor только `middle | senior`)
