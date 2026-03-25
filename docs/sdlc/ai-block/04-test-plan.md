# Тест-план — Блок AI

**Task ID:** `ai-block`
**Дата:** 2026-02-06

## Стратегия

TDD: тесты пишутся ДО кода. Все тесты сначала падают (red), затем проходят после реализации (green).

## Покрытие

### T1: Тип Block включает 'ai' (`__tests__/data/types.test.ts`)

- Обновить тест `should restrict Block to valid values`: проверить что массив `['sa', 'sd', 'ai']` имеет длину 3
- Добавить тест: можно создать `QuizQuestion` с `block: 'ai'`
- Добавить тест: можно создать `OpenQuestion` с `block: 'ai'`

### T2: Фильтрация по блоку AI (`__tests__/lib/questions.test.ts`)

- `should filter by block "ai"` — возвращает >0 вопросов, все с `block === 'ai'`
- `should return AI topics` — `getTopics('ai')` возвращает 12 тем
- `should filter AI questions by topic` — проверка на одной теме (rag)

### T3: Валидация контента AI (`__tests__/data/ai-questions.test.ts` — НОВЫЙ)

Для каждого из 12 файлов:
- Массив не пустой (8–10 вопросов)
- Все вопросы имеют `block === 'ai'`
- Все ID соответствуют формату `ai-{topic}-{NNN}`
- Все ID уникальны внутри файла
- Каждая тема содержит все 3 уровня сложности
- Quiz-вопросы имеют `correctIndex` в пределах `options`
- Quiz-вопросы имеют ровно 4 варианта ответа
- Open-вопросы имеют непустой `sampleAnswer`
- Все вопросы имеют непустой `explanation`
- `topicLabel` одинаковый для всех вопросов в файле

### T4: Интеграция — общие инварианты (`__tests__/lib/questions.test.ts`)

- Уникальность ID сохраняется при добавлении AI-вопросов (существующий тест покрывает)
- `correctIndex` в пределах options (существующий тест покрывает)

## Файлы тестов

| Файл | Действие | Покрытие |
|------|----------|----------|
| `__tests__/data/types.test.ts` | ИЗМЕНЕНИЕ | T1 |
| `__tests__/lib/questions.test.ts` | ИЗМЕНЕНИЕ | T2, T4 |
| `__tests__/data/ai-questions.test.ts` | НОВЫЙ | T3 |
