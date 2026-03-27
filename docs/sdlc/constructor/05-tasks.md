# Task Breakdown: System Design Constructor

## Milestone 1: Данные и типы

| # | Task | File | Depends on |
|---|------|------|------------|
| 1 | Типы данных конструктора | `src/data/constructor/types.ts` | — |
| 2 | Тесты типов | `__tests__/data/constructor-types.test.ts` | 1 |
| 3 | Сценарий: URL Shortener | `src/data/constructor/url-shortener.ts` | 1 |
| 4 | Сценарий: Rate Limiter | `src/data/constructor/rate-limiter.ts` | 1 |
| 5 | Сценарий: Notification System | `src/data/constructor/notification-system.ts` | 1 |
| 6 | Сценарий: Chat Messenger | `src/data/constructor/chat-messenger.ts` | 1 |
| 7 | Сценарий: News Feed (Instagram) | `src/data/constructor/news-feed.ts` | 1 |
| 8 | Сценарий: Video Streaming (YouTube) | `src/data/constructor/video-streaming.ts` | 1 |
| 9 | Сценарий: Collaborative Editor (Google Docs) | `src/data/constructor/collaborative-editor.ts` | 1 |
| 10 | Сценарий: Ride Sharing (Yandex Taxi) | `src/data/constructor/ride-sharing.ts` | 1 |
| 11 | Индекс экспорта сценариев | `src/data/constructor/index.ts` | 3–10 |
| 12 | Тесты валидации сценариев | `__tests__/data/constructor-scenarios.test.ts` | 11 |

## Milestone 2: Core-логика

| # | Task | File | Depends on |
|---|------|------|------------|
| 13 | Утилиты конструктора (getScenarios, calculateMetrics, calculateScore) | `src/lib/constructor.ts` | 11 |
| 14 | Тесты утилит | `__tests__/lib/constructor.test.ts` | 13 |
| 15 | Хук useConstructorSession | `src/hooks/useConstructorSession.ts` | 13 |
| 16 | Тесты useConstructorSession | `__tests__/hooks/useConstructorSession.test.ts` | 15 |
| 17 | Хук useConstructorProgress | `src/hooks/useConstructorProgress.ts` | 1 |
| 18 | Тесты useConstructorProgress | `__tests__/hooks/useConstructorProgress.test.ts` | 17 |

## Milestone 3: UI — конструктор

| # | Task | File | Depends on |
|---|------|------|------------|
| 19 | Компонент RadarChart | `src/components/constructor/RadarChart.tsx` | 1 |
| 20 | Тесты RadarChart | `__tests__/components/constructor/RadarChart.test.tsx` | 19 |
| 21 | Компонент MetricsPanel | `src/components/constructor/MetricsPanel.tsx` | 19 |
| 22 | Тесты MetricsPanel | `__tests__/components/constructor/MetricsPanel.test.tsx` | 21 |
| 23 | Компонент TipReveal | `src/components/constructor/TipReveal.tsx` | — |
| 24 | Компонент OptionCard | `src/components/constructor/OptionCard.tsx` | 1 |
| 25 | Тесты OptionCard | `__tests__/components/constructor/OptionCard.test.tsx` | 24 |
| 26 | Компонент StepCard | `src/components/constructor/StepCard.tsx` | 23, 24 |
| 27 | Тесты StepCard | `__tests__/components/constructor/StepCard.test.tsx` | 26 |
| 28 | Компонент StepNavigator | `src/components/constructor/StepNavigator.tsx` | 1 |
| 29 | Компонент ScenarioCard | `src/components/constructor/ScenarioCard.tsx` | 1 |
| 30 | Тесты ScenarioCard | `__tests__/components/constructor/ScenarioCard.test.tsx` | 29 |
| 31 | Страница каталога /constructor | `src/app/constructor/page.tsx` | 13, 17, 29 |
| 32 | Страница сессии /constructor/[id]/session | `src/app/constructor/[id]/session/page.tsx` | 15, 17, 21, 26, 28 |

## Milestone 4: UI — итоговый экран

| # | Task | File | Depends on |
|---|------|------|------------|
| 33 | Компонент TradeOffMatrix | `src/components/constructor/TradeOffMatrix.tsx` | 1 |
| 34 | Тесты TradeOffMatrix | `__tests__/components/constructor/TradeOffMatrix.test.tsx` | 33 |
| 35 | Компонент SolutionComparison | `src/components/constructor/SolutionComparison.tsx` | 1 |
| 36 | Тесты SolutionComparison | `__tests__/components/constructor/SolutionComparison.test.tsx` | 35 |
| 37 | Компонент ScoreCard | `src/components/constructor/ScoreCard.tsx` | 1 |
| 38 | Тесты ScoreCard | `__tests__/components/constructor/ScoreCard.test.tsx` | 37 |
| 39 | Компонент SummaryView (обёртка итогов) | `src/components/constructor/SummaryView.tsx` | 33, 35, 37, 19 |

## Milestone 5: Интеграция

| # | Task | File | Depends on |
|---|------|------|------------|
| 40 | Добавить секцию Constructor на главную страницу | `src/app/page.tsx` | 13 |

## Summary

| Milestone | Tasks | Files |
|-----------|-------|-------|
| M1: Данные и типы | 1–12 | 12 |
| M2: Core-логика | 13–18 | 6 |
| M3: UI — конструктор | 19–32 | 14 |
| M4: UI — итоговый экран | 33–39 | 7 |
| M5: Интеграция | 40 | 1 |
| **Итого** | **40** | **40** |
