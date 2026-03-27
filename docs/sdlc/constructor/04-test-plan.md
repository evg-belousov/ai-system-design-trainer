# Test Plan: System Design Constructor

## 1. Стратегия

Тесты пишутся до реализации (TDD red → green → refactor). Структура тестов повторяет существующие паттерны проекта: `__tests__/<layer>/<name>.test.ts(x)`.

## 2. Coverage Map

### 2.1 Data Validation — `__tests__/data/constructor-scenarios.test.ts`

Валидация структуры всех 8 сценариев. Гарантирует целостность данных.

```
describe('Constructor scenarios data')
  ├── it('all scenarios have required fields: id, title, description, difficulty, steps, referenceSolution')
  ├── it('scenario ids are unique')
  ├── it('scenario difficulty is middle or senior')
  ├── it('each scenario has 5-7 steps')
  ├── it('each step has id, title, description, and at least one decision')
  ├── it('step ids are unique within scenario')
  ├── it('each decision has id, category, question, and at least 2 options')
  ├── it('decision ids are unique within scenario')
  ├── it('each option has id, label, description, pros, cons, bestWhen, impact')
  ├── it('option ids are unique within decision')
  ├── it('impact values are within range [-2, +2]')
  ├── it('pros and cons arrays are non-empty for every option')
  ├── it('referenceSolution.decisions references only existing decision and option ids')
  ├── it('referenceSolution has at least one selection per decision')
  ├── it('referenceSolution has explanation and diagram as non-empty strings')
  └── it('multiSelect decisions in referenceSolution can have multiple option ids')
```

### 2.2 Constructor Types — `__tests__/data/constructor-types.test.ts`

Проверка типов на уровне runtime (аналог существующего `types.test.ts`).

```
describe('Constructor types')
  ├── it('should allow creating a valid Scenario')
  ├── it('should allow creating a Step with decisions')
  ├── it('should allow creating a Decision with multiSelect')
  ├── it('should allow creating an Option with impact')
  └── it('should allow creating a ReferenceSolution')
```

### 2.3 Library: constructor utils — `__tests__/lib/constructor.test.ts`

```
describe('getScenarios')
  ├── it('returns all 8 scenarios')
  └── it('each scenario matches Scenario type shape')

describe('getScenarioById')
  ├── it('returns scenario for valid id')
  └── it('returns undefined for unknown id')

describe('getScenariosByDifficulty')
  ├── it('filters middle scenarios correctly')
  └── it('filters senior scenarios correctly')

describe('calculateMetrics')
  ├── it('returns base metrics (all 5) when no selections')
  ├── it('applies single option impact correctly')
  ├── it('sums impacts from multiple selections across decisions')
  ├── it('clamps metric values to [0, 10] range')
  ├── it('recalculates from scratch (not incremental) — changing selection resets')
  └── it('handles multiSelect: sums impacts of all selected options in one decision')

describe('calculateScore')
  ├── it('returns 100 when selections match reference exactly')
  ├── it('returns 0 when no selections match reference')
  ├── it('returns partial score for partial match')
  ├── it('handles multiSelect decisions: Jaccard similarity')
  └── it('averages across all decisions')
```

### 2.4 Hook: useConstructorSession — `__tests__/hooks/useConstructorSession.test.ts`

```
describe('useConstructorSession')
  describe('initialization')
    ├── it('starts at step 0 with empty selections')
    ├── it('sets completed to false')
    ├── it('currentStep returns the first step')
    └── it('metrics start at base values')

  describe('option selection')
    ├── it('selectOption adds option to selections for decision')
    ├── it('selectOption replaces option for single-select decision')
    ├── it('selectOption adds option for multiSelect decision')
    ├── it('deselectOption removes option from multiSelect decision')
    ├── it('deselectOption clears single-select decision')
    └── it('metrics update after selection change')

  describe('navigation')
    ├── it('nextStep increments currentStepIndex')
    ├── it('nextStep does nothing on last step')
    ├── it('prevStep decrements currentStepIndex')
    ├── it('prevStep does nothing on step 0')
    ├── it('goToStep navigates to any completed step')
    └── it('goToStep does not navigate beyond current furthest step + 1')

  describe('completion')
    ├── it('finish sets completed to true')
    ├── it('finish calculates score')
    └── it('reset clears all state to initial')

  describe('back navigation recalculation')
    ├── it('changing selection on previous step recalculates metrics from scratch')
    └── it('selections on later steps are preserved when going back')
```

### 2.5 Hook: useConstructorProgress — `__tests__/hooks/useConstructorProgress.test.ts`

```
describe('useConstructorProgress')
  ├── it('getProgress returns null for unknown scenario')
  ├── it('saveProgress stores data in localStorage')
  ├── it('getProgress returns saved data')
  ├── it('getAllProgress returns all saved scenarios')
  ├── it('saveProgress overwrites existing progress for same scenario')
  └── it('clearProgress removes scenario data')
```

### 2.6 Component: ScenarioCard — `__tests__/components/constructor/ScenarioCard.test.tsx`

```
describe('ScenarioCard')
  ├── it('renders scenario title and description')
  ├── it('renders difficulty badge')
  ├── it('renders completed badge when progress exists with score')
  ├── it('renders link to /constructor/[id]/session')
  └── it('does not render completed badge when no progress')
```

### 2.7 Component: OptionCard — `__tests__/components/constructor/OptionCard.test.tsx`

```
describe('OptionCard')
  ├── it('renders option label and description')
  ├── it('shows pros/cons/bestWhen on expand')
  ├── it('applies selected styling when selected=true')
  ├── it('calls onToggle when clicked')
  └── it('renders impact indicators')
```

### 2.8 Component: StepCard — `__tests__/components/constructor/StepCard.test.tsx`

```
describe('StepCard')
  ├── it('renders step title and description')
  ├── it('renders all decisions with their options')
  ├── it('shows TipReveal button when tip exists')
  ├── it('does not show TipReveal when no tip')
  └── it('tip content is hidden by default and shows on click')
```

### 2.9 Component: MetricsPanel — `__tests__/components/constructor/MetricsPanel.test.tsx`

```
describe('MetricsPanel')
  ├── it('renders all 5 metric labels')
  ├── it('renders RadarChart with correct values')
  └── it('updates when metrics prop changes')
```

### 2.10 Component: RadarChart — `__tests__/components/constructor/RadarChart.test.tsx`

```
describe('RadarChart')
  ├── it('renders SVG element')
  ├── it('renders 5 axis labels')
  ├── it('renders polygon for values')
  └── it('renders reference polygon when reference prop provided')
```

### 2.11 Component: TradeOffMatrix — `__tests__/components/constructor/TradeOffMatrix.test.tsx`

```
describe('TradeOffMatrix')
  ├── it('renders table with all 5 metrics')
  ├── it('shows positive metrics as strengths')
  └── it('shows negative metrics as weaknesses')
```

### 2.12 Component: SolutionComparison — `__tests__/components/constructor/SolutionComparison.test.tsx`

```
describe('SolutionComparison')
  ├── it('renders user selections and reference selections side by side')
  ├── it('highlights matching decisions')
  ├── it('highlights differing decisions')
  └── it('renders reference explanation and diagram')
```

### 2.13 Component: ScoreCard — `__tests__/components/constructor/ScoreCard.test.tsx`

```
describe('ScoreCard')
  ├── it('renders score as percentage')
  ├── it('renders reset button')
  └── it('calls onReset when reset button clicked')
```

## 3. Test File Summary

| File | Tests | Layer |
|------|-------|-------|
| `__tests__/data/constructor-scenarios.test.ts` | 16 | Data |
| `__tests__/data/constructor-types.test.ts` | 5 | Data |
| `__tests__/lib/constructor.test.ts` | 14 | Lib |
| `__tests__/hooks/useConstructorSession.test.ts` | 16 | Hook |
| `__tests__/hooks/useConstructorProgress.test.ts` | 6 | Hook |
| `__tests__/components/constructor/ScenarioCard.test.tsx` | 5 | Component |
| `__tests__/components/constructor/OptionCard.test.tsx` | 5 | Component |
| `__tests__/components/constructor/StepCard.test.tsx` | 5 | Component |
| `__tests__/components/constructor/MetricsPanel.test.tsx` | 3 | Component |
| `__tests__/components/constructor/RadarChart.test.tsx` | 4 | Component |
| `__tests__/components/constructor/TradeOffMatrix.test.tsx` | 3 | Component |
| `__tests__/components/constructor/SolutionComparison.test.tsx` | 4 | Component |
| `__tests__/components/constructor/ScoreCard.test.tsx` | 3 | Component |
| **Total** | **89** | |

## 4. Приоритеты

1. **Критичные**: data validation (целостность сценариев), calculateMetrics, calculateScore, useConstructorSession
2. **Высокие**: useConstructorProgress, StepCard, OptionCard
3. **Средние**: ScenarioCard, MetricsPanel, RadarChart
4. **Низкие**: TradeOffMatrix, SolutionComparison, ScoreCard (простые презентационные компоненты)
