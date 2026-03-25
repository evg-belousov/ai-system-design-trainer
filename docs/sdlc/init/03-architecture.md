# Архитектура — System Design Trainer

## Стек технологий
- **Frontend + Backend**: Next.js 15 (App Router)
- **Язык**: TypeScript
- **Тестирование**: Vitest + React Testing Library (unit), Playwright (E2E)
- **AI**: OpenAI API (ChatGPT)
- **Хранилище**: localStorage (прогресс), статические TS-файлы (вопросы)

## Архитектурные решения

### Данные вопросов — статические TypeScript файлы
- Вопросы хранятся в `src/data/sa/` и `src/data/sd/` как типизированные массивы
- Compile-time проверка типов
- Нет необходимости в БД
- ID формат: `{block}-{topic}-{NNN}` (например, `sa-modeling-001`)

### Компонентная архитектура
- **Server Components**: layout, header (статика)
- **Client Components**: всё интерактивное (квиз, таймер, прогресс)
- 3 ключевых хука: `useQuizSession`, `useProgress`, `useTimer`

### API Design
- Единственный API route: `POST /api/evaluate`
- Всегда возвращает HTTP 200
- Поле `source: "openai" | "fallback"` указывает источник оценки

### Стейт-машина квиза (useQuizSession)
```
IDLE → ACTIVE → ANSWERED → ACTIVE → ... → COMPLETED
```
- `IDLE`: выбор темы
- `ACTIVE`: показ вопроса
- `ANSWERED`: показ результата
- `COMPLETED`: все вопросы отвечены

### Прогресс (localStorage)
```typescript
interface ProgressData {
  answers: Record<string, {
    correct: boolean;
    answeredAt: string;
  }>;
}
```

## Диаграмма потоков данных

```
User → TopicSelector → useQuizSession(questions)
         ↓
       QuizCard → QuizOptions (quiz) / OpenAnswer (open)
         ↓
       User answers
         ↓
    [quiz: instant check] / [open: POST /api/evaluate]
         ↓
       ResultCard (результат + объяснение)
         ↓
       useProgress.save() → localStorage
```

## Структура файлов
См. план реализации в `/Users/evgenij/.claude/plans/cuddly-plotting-church.md`
