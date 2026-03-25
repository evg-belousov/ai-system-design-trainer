# Декомпозиция задач — Блок AI

**Task ID:** `ai-block`
**Дата:** 2026-02-06
**Правило:** каждая задача модифицирует не более 1 файла.

## Задачи

### M1: Инфраструктура

| # | Задача | Файл | Зависит от |
|---|--------|------|-----------|
| 1 | Расширить тип Block на 'ai' | `src/data/types.ts` | — |
| 2 | Создать ml-fundamentals.ts | `src/data/ai/ml-fundamentals.ts` | 1 |
| 3 | Создать neural-networks.ts | `src/data/ai/neural-networks.ts` | 1 |
| 4 | Создать transformers.ts | `src/data/ai/transformers.ts` | 1 |
| 5 | Создать llm-fundamentals.ts | `src/data/ai/llm-fundamentals.ts` | 1 |
| 6 | Создать llm-inference.ts | `src/data/ai/llm-inference.ts` | 1 |
| 7 | Создать rag.ts | `src/data/ai/rag.ts` | 1 |
| 8 | Создать agents.ts | `src/data/ai/agents.ts` | 1 |
| 9 | Создать prompt-engineering.ts | `src/data/ai/prompt-engineering.ts` | 1 |
| 10 | Создать vector-databases.ts | `src/data/ai/vector-databases.ts` | 1 |
| 11 | Создать mlops.ts | `src/data/ai/mlops.ts` | 1 |
| 12 | Создать ai-safety.ts | `src/data/ai/ai-safety.ts` | 1 |
| 13 | Создать evaluation.ts | `src/data/ai/evaluation.ts` | 1 |
| 14 | Обновить questions.ts — импорты и регистрация AI | `src/lib/questions.ts` | 2–13 |
| 15 | Обновить главную страницу — карточка AI | `src/app/page.tsx` | 14 |
| 16 | Обновить настройки тренировки — кнопка AI | `src/app/quiz/page.tsx` | 14 |

### Граф зависимостей

```
[1] types.ts
 ├── [2] ml-fundamentals.ts ──┐
 ├── [3] neural-networks.ts ──┤
 ├── [4] transformers.ts ─────┤
 ├── [5] llm-fundamentals.ts ─┤
 ├── [6] llm-inference.ts ────┤
 ├── [7] rag.ts ──────────────┤
 ├── [8] agents.ts ───────────┤
 ├── [9] prompt-engineering.ts┤
 ├── [10] vector-databases.ts ┤
 ├── [11] mlops.ts ───────────┤
 ├── [12] ai-safety.ts ───────┤
 └── [13] evaluation.ts ──────┤
                              ▼
                    [14] questions.ts
                     ├── [15] page.tsx (главная)
                     └── [16] quiz/page.tsx (настройки)
```
