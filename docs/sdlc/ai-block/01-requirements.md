# Требования — Блок AI (Искусственный интеллект)

**Task ID:** `ai-block`
**Дата:** 2026-02-06

## Цель

Добавить третий блок вопросов «AI» в тренажёр System Design Trainer, покрывающий темы искусственного интеллекта, LLM, RAG и смежные области. Блок предназначен для подготовки к собеседованиям и прокачки знаний.

## Функциональные требования

### FR-1: Новый блок AI

- Добавить блок `ai` наравне с существующими `sa` и `sd`
- Блок доступен на главной странице и в настройках тренировки
- Тип `Block` расширяется: `'sa' | 'sd' | 'ai'`

### FR-2: 12 тем блока AI

| # | topic ID | Название (topicLabel) | Ключевые области |
|---|----------|-----------------------|------------------|
| 1 | `ml-fundamentals` | Основы ML | supervised/unsupervised/RL, bias-variance, метрики, overfitting, cross-validation |
| 2 | `neural-networks` | Нейронные сети | архитектуры, backpropagation, CNN, RNN, функции активации, regularization |
| 3 | `transformers` | Трансформеры | attention mechanism, positional encoding, encoder/decoder, self-attention, multi-head attention |
| 4 | `llm-fundamentals` | Основы LLM | токенизация, pretraining, fine-tuning, RLHF/DPO, scaling laws, emergent abilities |
| 5 | `llm-inference` | Инференс LLM | KV-cache, квантизация (GPTQ, AWQ, GGUF), batching, speculative decoding, latency vs throughput |
| 6 | `rag` | RAG | chunking стратегии, embeddings, vector search, retrieval strategies, reranking, hybrid search |
| 7 | `agents` | AI-агенты | tool use, ReAct, planning, multi-agent systems, memory (short/long-term), function calling |
| 8 | `prompt-engineering` | Промпт-инжиниринг | few-shot, chain-of-thought, system prompts, structured output, prompt chaining |
| 9 | `vector-databases` | Векторные БД | HNSW, IVF, Pinecone/Weaviate/Chroma, similarity metrics, ANN search, indexing |
| 10 | `mlops` | MLOps | ML-пайплайны, версионирование моделей, мониторинг drift, A/B тестирование, feature stores |
| 11 | `ai-safety` | Безопасность AI | jailbreaking, guardrails, alignment, prompt injection, content filtering, red teaming |
| 12 | `evaluation` | Оценка моделей | бенчмарки, human eval, LLM-as-judge, hallucination detection, BLEU/ROUGE, perplexity |

### FR-3: Объём вопросов

- 8–10 вопросов на каждую тему
- Mix типов: quiz (с вариантами ответа) и open (открытый ответ)
- Примерное соотношение: ~60% quiz, ~40% open
- Итого: ~100–120 вопросов в блоке

### FR-4: Уровни сложности

- Те же уровни: `junior`, `middle`, `senior`
- Каждая тема содержит вопросы всех трёх уровней
- Примерное распределение: 3 junior, 3-4 middle, 3 senior на тему

### FR-5: Формат вопросов

- Идентичен существующим блокам SA и SD
- ID формат: `ai-{topic}-{NNN}` (например `ai-rag-001`)
- Каждый вопрос содержит `explanation` с развёрнутым пояснением
- Открытые вопросы содержат `sampleAnswer` — эталонный ответ

### FR-6: Интеграция в UI

- Кнопка выбора блока AI на странице настройки тренировки (`/quiz`)
- Главная страница отображает блок AI наравне с SA и SD
- Фильтрация по темам и сложности работает аналогично

## Нефункциональные требования

### NFR-1: Язык контента

- Русский (как в существующих блоках)

### NFR-2: Качество контента

- Вопросы актуальны на 2025–2026 гг.
- Объяснения содержат практические примеры
- Сложность junior — определения и базовые концепции
- Сложность middle — сравнение подходов, trade-offs, практическое применение
- Сложность senior — архитектурные решения, edge cases, дизайн систем с AI

### NFR-3: Совместимость

- Все существующие тесты продолжают проходить
- Структура данных не меняется (используется существующий тип `Question`)
- Прогресс по AI-блоку сохраняется в localStorage аналогично SA/SD

## Вне скоупа

- Изменение дизайна/стилей существующих компонентов
- Новые типы вопросов (только quiz и open)
- Новые уровни сложности
- Изменение API evaluate
