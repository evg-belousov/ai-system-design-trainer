import type { Question } from '../types';

export const rateLimitingQuestions: Question[] = [
  {
    id: 'sd-rate-limiting-001',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое rate limiting и зачем оно нужно?',
    options: [
      'Ограничение размера HTTP-запросов для экономии трафика',
      'Ограничение количества запросов, которые клиент может отправить за определённый период, для защиты сервиса от перегрузки и злоупотреблений',
      'Ограничение скорости передачи данных между серверами',
      'Механизм приоритизации запросов от VIP-клиентов',
    ],
    correctIndex: 1,
    explanation:
      'Rate limiting — механизм контроля частоты запросов к API или сервису. Цели: 1) Защита от перегрузки — предотвращение отказа сервиса при пиковых нагрузках. 2) Защита от злоупотреблений — предотвращение DDoS-атак, brute-force, scraping. 3) Справедливое распределение ресурсов — один клиент не должен потреблять все ресурсы. 4) Контроль стоимости — ограничение использования дорогих downstream-сервисов. Rate limiting возвращает HTTP 429 (Too Many Requests) при превышении лимита.',
  },
  {
    id: 'sd-rate-limiting-002',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Как работает алгоритм Token Bucket?',
    options: [
      'Корзина заполняется токенами с фиксированной скоростью; каждый запрос забирает токен; если корзина пуста — запрос отклоняется; корзина имеет максимальную ёмкость',
      'Каждый запрос создаёт новый токен, и при достижении лимита все токены удаляются',
      'Токены распределяются между пользователями поровну в начале каждого часа',
      'Запросы помещаются в очередь и обрабатываются строго в порядке поступления',
    ],
    correctIndex: 0,
    explanation:
      'Token Bucket — один из самых популярных алгоритмов rate limiting. Принцип: 1) Корзина имеет максимальную ёмкость (burst size). 2) Токены добавляются с фиксированной скоростью (rate). 3) Каждый запрос забирает один токен. 4) Если токенов нет — запрос отклоняется или ставится в очередь. Преимущество: позволяет «всплески» (bursts) — если корзина полная, клиент может отправить несколько запросов подряд. Параметры: rate (токены/сек) и burst (макс. ёмкость). Используется в AWS API Gateway, Nginx, Stripe API.',
  },
  {
    id: 'sd-rate-limiting-003',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Какой HTTP-код возвращается при превышении лимита запросов?',
    options: [
      '403 Forbidden',
      '429 Too Many Requests',
      '503 Service Unavailable',
      '408 Request Timeout',
    ],
    correctIndex: 1,
    explanation:
      'HTTP 429 Too Many Requests — стандартный код ответа (RFC 6585), указывающий, что клиент отправил слишком много запросов за определённый период. Ответ обычно включает заголовок Retry-After (через сколько секунд можно повторить) и заголовки X-RateLimit-Limit (лимит), X-RateLimit-Remaining (оставшиеся запросы), X-RateLimit-Reset (время сброса). Важно отличать от 503 Service Unavailable (сервер перегружен в целом) и 403 Forbidden (доступ запрещён по другим причинам).',
  },
  {
    id: 'sd-rate-limiting-004',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'Какой компонент инфраструктуры обычно отвечает за rate limiting в микросервисной архитектуре?',
    options: [
      'Каждый микросервис реализует свой rate limiter',
      'API Gateway — единая точка входа, где централизованно применяются политики rate limiting',
      'База данных ограничивает количество запросов к себе',
      'CDN выполняет rate limiting для всех типов запросов',
    ],
    correctIndex: 1,
    explanation:
      'API Gateway — стандартное место для централизованного rate limiting. Он является единой точкой входа для всех внешних запросов и может применять различные политики: глобальные лимиты, лимиты по пользователю, по API-ключу, по IP, по endpoint. Примеры: Kong, AWS API Gateway, Apigee, Envoy. Однако rate limiting может применяться и на других уровнях: load balancer (L4), CDN (для статики), сервис (для специфичной логики), middleware.',
  },
  {
    id: 'sd-rate-limiting-005',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'open',
    question:
      'Объясните разницу между rate limiting на основе IP-адреса и на основе пользователя (API-ключа). Какие у каждого подхода плюсы и минусы?',
    sampleAnswer:
      'IP-based rate limiting: лимит привязан к IP-адресу клиента. Плюсы: работает без аутентификации, простая реализация, защищает от анонимных атак. Минусы: пользователи за одним NAT/прокси (корпоративные сети, VPN) делят один IP — легитимные запросы блокируются; злоумышленник может использовать множество IP (ботнет, ротация прокси). User-based (API key) rate limiting: лимит привязан к аутентифицированному пользователю или API-ключу. Плюсы: точный контроль, разные лимиты для разных тарифных планов, не зависит от IP. Минусы: не работает для неаутентифицированных запросов (login, register), злоумышленник может создать много аккаунтов. Рекомендация: использовать оба — IP-based для грубой защиты + user-based для точного контроля.',
    explanation:
      'На практике применяется многоуровневый rate limiting: глобальный лимит (общая пропускная способность), IP-based (анти-DDoS), user-based (тарифные планы), endpoint-based (дорогие операции лимитируются строже). GitHub API: 60 req/hour для неаутентифицированных, 5000 req/hour для аутентифицированных.',
  },
  {
    id: 'sd-rate-limiting-006',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'open',
    question:
      'Что такое throttling (троттлинг)? Чем он отличается от rate limiting?',
    sampleAnswer:
      'Rate limiting — жёсткое ограничение: при превышении лимита запрос отклоняется (HTTP 429). Throttling — более мягкий подход: замедление обработки запросов вместо полного отклонения. Стратегии throttling: 1) Задержка (delay) — запрос ставится в очередь и обрабатывается позже. 2) Деградация (degradation) — при высокой нагрузке отключаются некоторые функции (рекомендации, персонализация), сохраняя core functionality. 3) Приоритизация — критические запросы обрабатываются первыми, некритические — откладываются. На практике термины часто используются взаимозаменяемо, но throttling подразумевает более гибкое управление нагрузкой, а rate limiting — строгое ограничение.',
    explanation:
      'Throttling — важная стратегия graceful degradation. Amazon использует throttling для защиты downstream-сервисов: при перегрузке сервиса рекомендаций главная страница показывает статичный контент вместо персонализированного. Пользователь получает ответ, но с ограниченной функциональностью.',
  },
  {
    id: 'sd-rate-limiting-007',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Чем алгоритм Leaky Bucket отличается от Token Bucket?',
    options: [
      'Leaky Bucket обрабатывает запросы с фиксированной скоростью (как вода из дырявого ведра), сглаживая всплески; Token Bucket позволяет burst-ы до ёмкости корзины',
      'Leaky Bucket работает только с UDP-трафиком, Token Bucket — с TCP',
      'Leaky Bucket быстрее Token Bucket на порядок',
      'Они идентичны по принципу работы, различаются только названием',
    ],
    correctIndex: 0,
    explanation:
      'Leaky Bucket: запросы помещаются в «ведро» (очередь) фиксированного размера. Из ведра запросы «вытекают» (обрабатываются) с постоянной скоростью. Если ведро полное — новые запросы отбрасываются. Результат: ровный выходной поток, burst-ы сглаживаются. Token Bucket: токены добавляются с фиксированной скоростью. Запрос потребляет токен. Если корзина полная — клиент может отправить burst. Результат: средняя скорость ограничена, но краткосрочные всплески допускаются. Leaky Bucket — строгий (ровная скорость), Token Bucket — гибкий (burst + средний rate).',
  },
  {
    id: 'sd-rate-limiting-008',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Какую проблему алгоритма Fixed Window решает Sliding Window?',
    options: [
      'Fixed Window потребляет слишком много памяти',
      'Fixed Window имеет проблему «boundary burst»: на стыке двух окон клиент может отправить двойной лимит запросов; Sliding Window устраняет это, учитывая запросы в скользящем временном интервале',
      'Fixed Window не поддерживает IP-based rate limiting',
      'Fixed Window не работает в распределённых системах',
    ],
    correctIndex: 1,
    explanation:
      'Fixed Window: время делится на окна фиксированного размера (например, 1 минута). Счётчик запросов сбрасывается в начале каждого окна. Проблема: если лимит 100 req/min, клиент может отправить 100 запросов в конце одного окна и 100 в начале следующего — 200 запросов за 2 секунды. Sliding Window Log: хранит timestamp каждого запроса, считает запросы за скользящий интервал. Точный, но требует больше памяти. Sliding Window Counter: комбинация — взвешенное среднее между текущим и предыдущим окном на основе позиции внутри окна. Эффективный компромисс: O(1) по памяти, хорошая точность.',
  },
  {
    id: 'sd-rate-limiting-009',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Какая главная сложность при реализации распределённого rate limiting?',
    options: [
      'Выбор алгоритма rate limiting',
      'Синхронизация счётчиков запросов между несколькими экземплярами сервиса: race conditions, задержка синхронизации, точность подсчёта',
      'Генерация уникальных API-ключей для каждого клиента',
      'Шифрование счётчиков для безопасности',
    ],
    correctIndex: 1,
    explanation:
      'В распределённой системе запросы одного клиента попадают на разные экземпляры сервиса (через load balancer). Каждый экземпляр должен знать общее количество запросов клиента. Подходы: 1) Централизованное хранилище (Redis) — все экземпляры читают/пишут счётчик в Redis. Проблемы: race condition (MULTI/EXEC или Lua-скрипт для атомарности), latency Redis, единая точка отказа. 2) Sticky sessions — запросы одного клиента всегда на одном экземпляре. Проблема: неравномерная нагрузка. 3) Локальный rate limiting с уменьшенным лимитом (global_limit / num_instances). Проблема: неточно при неравномерном распределении.',
  },
  {
    id: 'sd-rate-limiting-010',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое WAF (Web Application Firewall)?',
    options: [
      'Инструмент для мониторинга производительности веб-приложений',
      'Защитный фильтр на уровне приложения (L7), анализирующий HTTP-трафик и блокирующий вредоносные запросы: SQL injection, XSS, CSRF и другие атаки OWASP Top 10',
      'Аппаратный файрволл для защиты дата-центра',
      'Средство шифрования трафика между клиентом и сервером',
    ],
    correctIndex: 1,
    explanation:
      'WAF (Web Application Firewall) работает на уровне приложения (L7) и анализирует содержимое HTTP-запросов. Функции: блокировка SQL injection, XSS, CSRF, path traversal, bot detection, rate limiting, geo-blocking, IP blacklisting. WAF может работать в режимах: detect (логирование) и prevent (блокировка). Примеры: AWS WAF, Cloudflare WAF, ModSecurity (open source). WAF дополняет rate limiting: rate limiter ограничивает количество запросов, WAF анализирует содержимое запросов.',
  },
  {
    id: 'sd-rate-limiting-011',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое backpressure и как он связан с rate limiting?',
    options: [
      'Механизм сжатия данных для уменьшения нагрузки на сеть',
      'Механизм, при котором перегруженный потребитель сигнализирует продюсеру о необходимости снизить скорость отправки, предотвращая каскадные сбои',
      'Метод приоритизации запросов по важности',
      'Стратегия кэширования ответов при высокой нагрузке',
    ],
    correctIndex: 1,
    explanation:
      'Backpressure — механизм обратной связи в системах «продюсер-потребитель». Когда потребитель не успевает обрабатывать данные, он сообщает об этом продюсеру, который замедляет отправку. Стратегии: 1) Drop — отбросить лишние данные. 2) Buffer — буферизовать (ограниченно). 3) Signal — сообщить продюсеру (TCP flow control, Reactive Streams). Rate limiting — частный случай backpressure на уровне API: «ты отправляешь слишком быстро — подожди» (HTTP 429 + Retry-After). В Kafka backpressure реализуется через consumer lag: если consumer отстаёт, данные накапливаются в партиции.',
  },
  {
    id: 'sd-rate-limiting-012',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'open',
    question:
      'Как реализовать распределённый rate limiter на базе Redis? Опишите алгоритм и обеспечение атомарности.',
    sampleAnswer:
      'Реализация Token Bucket в Redis: Ключ: rate_limit:{client_id}. Хранит: количество оставшихся токенов и timestamp последнего пополнения. Алгоритм (Lua-скрипт для атомарности): 1) Получить текущие токены и last_refill_time. 2) Рассчитать, сколько токенов добавить: elapsed_time * rate. 3) Обновить количество токенов (не более max_tokens). 4) Если tokens >= 1: уменьшить на 1, вернуть «разрешено». 5) Иначе: вернуть «отклонено» + время до следующего токена. Lua-скрипт выполняется атомарно в Redis (single-threaded). Альтернатива: Sliding Window Counter — два ключа (текущее и предыдущее окно) с INCR и EXPIRE. Sliding Window Log — sorted set с timestamp запросов и ZRANGEBYSCORE. Важно: установить TTL на ключи для автоочистки, мониторить latency Redis, иметь fallback при недоступности Redis (fail-open или fail-closed).',
    explanation:
      'Redis — стандартный выбор для распределённого rate limiting благодаря скорости (sub-millisecond), атомарности (Lua-скрипты, MULTI/EXEC) и поддержке TTL. Stripe, GitHub, Cloudflare используют Redis-based rate limiting. Библиотеки: rate-limiter-flexible (Node.js), python-ratelimiter, bucket4j (Java).',
  },
  {
    id: 'sd-rate-limiting-013',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'open',
    question:
      'Опишите многоуровневую стратегию защиты API. На каких уровнях применяется rate limiting и какие дополнительные механизмы защиты используются?',
    sampleAnswer:
      'Уровни защиты: 1) Edge/CDN (Cloudflare, AWS CloudFront): DDoS protection (L3/L4), geo-blocking, IP reputation, WAF (L7 фильтрация), базовый rate limiting. 2) Load Balancer: connection rate limiting, SSL termination, health checks. 3) API Gateway: rate limiting по API-ключу/пользователю/endpoint, аутентификация (JWT, OAuth), request validation, throttling. 4) Application: бизнес-логика rate limiting (например, 3 попытки входа), input validation, authorization. 5) Database: connection pooling, query timeout, read replicas. Дополнительные механизмы: CAPTCHA при подозрительной активности, IP blacklisting (автоматический и ручной), request signing (HMAC), abuse detection (ML-based аномалии), circuit breaker для защиты downstream. Каждый уровень обеспечивает defense-in-depth.',
    explanation:
      'Defense-in-depth — ключевой принцип безопасности. Ни один уровень не является достаточным сам по себе. DDoS на уровне CDN + rate limiting на API Gateway + business logic rate limiting + WAF = комплексная защита. Важно: rate limiting должен быть graceful — клиент должен получить понятный ответ с Retry-After.',
  },
  {
    id: 'sd-rate-limiting-014',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Какой алгоритм rate limiting лучше всего подходит для сценария, где нужно гарантировать ровный поток запросов без burst-ов?',
    options: [
      'Token Bucket — позволяет burst-ы до ёмкости корзины',
      'Leaky Bucket — обрабатывает запросы с фиксированной скоростью, полностью сглаживая всплески',
      'Fixed Window Counter — самый простой, но с проблемой boundary burst',
      'Sliding Window Log — точный, но потребляет много памяти',
    ],
    correctIndex: 1,
    explanation:
      'Leaky Bucket гарантирует ровный выходной поток: запросы ставятся в очередь и обрабатываются с постоянной скоростью, как вода из дырявого ведра. Это идеально для сценариев, где downstream-система чувствительна к burst-ам: оплата через платёжный шлюз (фиксированный TPS), вызовы к стороннему API с жёстким лимитом, запись в БД с ограниченной пропускной способностью. Token Bucket, напротив, специально допускает burst-ы и подходит для API, где краткосрочные всплески допустимы.',
  },
  {
    id: 'sd-rate-limiting-015',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Что такое adaptive rate limiting и чем он отличается от статического?',
    options: [
      'Adaptive rate limiting шифрует запросы адаптивно к нагрузке',
      'Adaptive rate limiting динамически изменяет лимиты на основе текущей нагрузки, здоровья системы и метрик (CPU, latency, error rate), вместо использования фиксированных пороговых значений',
      'Adaptive rate limiting применяется только к мобильным клиентам',
      'Adaptive rate limiting использует машинное обучение для предсказания атак',
    ],
    correctIndex: 1,
    explanation:
      'Adaptive (динамический) rate limiting автоматически корректирует лимиты на основе текущего состояния системы. Если error rate растёт или latency увеличивается — лимиты снижаются. Если система здорова — лимиты повышаются. Реализации: Netflix Concurrency Limits (на основе TCP congestion control алгоритмов — Vegas, Gradient), Envoy adaptive concurrency filter, AWS Auto Scaling. Это лучше статического rate limiting, потому что лимиты адаптируются к реальной ёмкости системы, которая меняется в зависимости от нагрузки, деплоев, инцидентов.',
  },
  {
    id: 'sd-rate-limiting-016',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Как защититься от DDoS-атаки на уровне приложения (L7 DDoS)?',
    options: [
      'Достаточно увеличить bandwidth сервера',
      'Комбинация: CDN с DDoS mitigation (Cloudflare, AWS Shield), WAF с ML-based bot detection, rate limiting, CAPTCHA для подозрительных запросов, геоблокировка, анализ поведенческих паттернов',
      'Полное отключение API на время атаки',
      'Перевод всех endpoint-ов на HTTPS решает проблему DDoS',
    ],
    correctIndex: 1,
    explanation:
      'L7 DDoS (application-layer) — наиболее сложный тип атаки, имитирующий легитимный трафик. Стратегии защиты: 1) CDN/Edge: Cloudflare, AWS Shield Advanced — анализ трафика, фильтрация на edge. 2) WAF: правила для OWASP Top 10, custom rules, ML-based anomaly detection. 3) Rate limiting: многоуровневый (по IP, по user, по endpoint). 4) Bot detection: fingerprinting (JA3, device), CAPTCHA (reCAPTCHA v3 — невидимая), JavaScript challenge. 5) Анализ поведения: аномальные паттерны (слишком быстрая навигация, отсутствие cookies/JS). 6) Auto-scaling: масштабирование для поглощения атаки (дорого, но может быть эффективно).',
  },
  {
    id: 'sd-rate-limiting-017',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question:
      'Спроектируйте систему rate limiting для API, обслуживающего 10 миллионов пользователей. Опишите архитектуру, выбор алгоритма, хранилище и обработку граничных случаев.',
    sampleAnswer:
      'Архитектура: API Gateway (Kong/Envoy) с Redis-кластером как хранилищем счётчиков. Алгоритм: Sliding Window Counter — баланс точности и эффективности. Два Redis-ключа на клиента: текущее и предыдущее окно, взвешенное среднее. Хранилище: Redis Cluster (3+ master, 3+ replica) для горизонтального масштабирования. Sharding по client_id. Estimated memory: 10M пользователей × 100 байт = ~1GB. Лимиты: глобальный (10K RPS), по тарифу (free: 100/min, pro: 1000/min, enterprise: 10000/min), по endpoint (search: 10/min, write: 100/min). Граничные случаи: 1) Redis недоступен — fail-open (пропускать запросы) с локальным in-memory rate limiting. 2) Race condition — Lua-скрипт для атомарности. 3) Clock skew — использовать timestamp Redis, не клиента. 4) Многоуровневый fallback: edge (Cloudflare) → API Gateway (Redis-based) → application (in-memory). Ответ клиенту: HTTP 429 + Retry-After + X-RateLimit-* headers.',
    explanation:
      'При проектировании rate limiting для масштаба важно учитывать: latency Redis-вызовов (pipeline/batch), memory footprint, поведение при partial failures, мониторинг (dashboard с rate limit hits, blocked requests, Redis latency), alerting. Stripe и GitHub публикуют подробную документацию по своим rate limiting стратегиям.',
  },
  {
    id: 'sd-rate-limiting-018',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question:
      'Что такое circuit breaker pattern и как он дополняет rate limiting для обеспечения устойчивости системы?',
    sampleAnswer:
      'Circuit Breaker — паттерн, предотвращающий каскадные сбои при отказе downstream-сервиса. Три состояния: 1) Closed (нормальное) — запросы проходят; при накоплении ошибок (threshold, например 50% за 10 сек) переход в Open. 2) Open — все запросы немедленно отклоняются (fail-fast) без обращения к downstream. Через timeout переход в Half-Open. 3) Half-Open — пропускается ограниченное число пробных запросов; если успешны — Closed; если ошибки — обратно в Open. Дополняет rate limiting: rate limiting защищает сервис от перегрузки входящим трафиком, circuit breaker — от каскадного сбоя при отказе downstream. Пример: если payment service не отвечает, circuit breaker в order service быстро отклоняет запросы к нему, а не ждёт timeout. Инструменты: Resilience4j (Java), Polly (.NET), Hystrix (deprecated), Envoy circuit breaker.',
    explanation:
      'Rate limiting и circuit breaker — два ключевых паттерна устойчивости. Rate limiting — входящая защита (inbound), circuit breaker — исходящая защита (outbound). Вместе с retry (с exponential backoff), timeout и bulkhead (изоляция ресурсов) они формируют полный набор паттернов resilience.',
  },
  {
    id: 'sd-rate-limiting-019',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question:
      'Сравните подходы fail-open и fail-closed при недоступности rate limiter (например, при падении Redis). Когда какой подход предпочтительнее?',
    sampleAnswer:
      'Fail-open: при недоступности rate limiter запросы пропускаются без ограничений. Плюсы: сервис остаётся доступным, пользователи не теряют функциональность. Минусы: система уязвима к перегрузке и злоупотреблениям. Подходит для: критически важных API, где доступность важнее защиты (checkout, платежи). Fail-closed: при недоступности rate limiter все запросы отклоняются. Плюсы: максимальная защита от перегрузки. Минусы: полная недоступность сервиса из-за сбоя вспомогательного компонента — rate limiter становится single point of failure. Подходит для: систем с жёсткими требованиями безопасности, где перегрузка опаснее недоступности. Гибридный подход: fail-open с локальным in-memory fallback rate limiter (менее точный, но лучше, чем ничего). Локальный лимит = global_limit / num_instances. Дополнительно: мониторинг и алертинг при переключении на fallback.',
    explanation:
      'Решение fail-open vs fail-closed — принципиальное архитектурное решение. Большинство production-систем используют fail-open с fallback, потому что каскадный сбой из-за rate limiter недопустим. Netflix, Amazon отдают приоритет доступности (availability) перед точностью ограничений.',
  },
  {
    id: 'sd-rate-limiting-020',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Какие HTTP-заголовки обычно используются для информирования клиента о лимитах rate limiting?',
    options: [
      'Content-Type, Content-Length, Cache-Control',
      'X-RateLimit-Limit (максимум запросов), X-RateLimit-Remaining (осталось), X-RateLimit-Reset (время сброса), Retry-After (при 429)',
      'Authorization, X-API-Key, X-Request-ID',
      'Accept-Encoding, Transfer-Encoding, Vary',
    ],
    correctIndex: 1,
    explanation:
      'Стандартные заголовки rate limiting: X-RateLimit-Limit — максимальное количество запросов за период. X-RateLimit-Remaining — сколько запросов осталось в текущем окне. X-RateLimit-Reset — timestamp (Unix epoch) или количество секунд до сброса лимита. Retry-After — включается в ответ 429 (Too Many Requests), указывает, через сколько секунд можно повторить запрос. IETF разрабатывает стандарт RateLimit header fields (draft-ietf-httpapi-ratelimit-headers) для унификации. Эти заголовки критически важны для клиентов: они позволяют реализовать graceful rate limit handling вместо бессмысленных retry.',
  },
  {
    id: 'sd-rate-limiting-021',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое quota management и чем оно отличается от rate limiting?',
    options: [
      'Quota management — это синоним rate limiting',
      'Quota management ограничивает общее количество ресурсов за период (день/месяц), rate limiting — мгновенную частоту запросов',
      'Quota management работает только с платными API',
      'Rate limiting — это тип quota management',
    ],
    correctIndex: 1,
    explanation:
      'Rate limiting: ограничивает мгновенную частоту — 100 запросов в минуту. Защита от перегрузки, всплесков. Quota management: ограничивает общий объём за период — 10,000 запросов в день, 1TB трафика в месяц. Используется для биллинга, тарифных планов. Примеры: free tier — 1000 API calls/day, pro — 100,000/month. Оба механизма комплементарны: quota для долгосрочного лимита (billing), rate limit для защиты от burst (stability). API может иметь quota 100K/month И rate limit 100/min одновременно.',
  },
  {
    id: 'sd-rate-limiting-022',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Какой компонент используется для хранения счётчиков в distributed rate limiting?',
    options: [
      'Локальная файловая система',
      'Redis или другое in-memory хранилище с поддержкой атомарных операций',
      'Реляционная база данных',
      'Блокчейн',
    ],
    correctIndex: 1,
    explanation:
      'Redis — стандартный выбор для distributed rate limiting благодаря: sub-millisecond latency (in-memory), атомарным операциям (INCR, MULTI/EXEC, Lua scripts), поддержке TTL (автоматическая очистка), масштабируемости (Redis Cluster). Альтернативы: Memcached (проще, но без TTL per key), DynamoDB (managed, но выше latency), local cache с eventual consistency (приблизительный лимит). Реляционная БД слишком медленная для high-throughput rate limiting. Lua scripts в Redis обеспечивают атомарность complex операций.',
  },
  {
    id: 'sd-rate-limiting-023',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'open',
    question: 'Что такое API abuse и какие типы злоупотреблений существуют?',
    sampleAnswer:
      'API abuse — использование API способами, нарушающими terms of service или создающими проблемы для сервиса. Типы: 1) Credential stuffing — тестирование украденных паролей через login API. 2) Scraping — массовый сбор данных (цены, контент) для конкурентного анализа или перепродажи. 3) Spam — создание fake accounts, отправка массовых сообщений. 4) Resource exhaustion — намеренная перегрузка дорогих endpoints (search, ML inference). 5) Enumeration — перебор IDs для обнаружения скрытых данных (BOLA). 6) Competitive abuse — замедление сервиса конкурента DDoS-подобной активностью. 7) Free tier abuse — создание множества аккаунтов для обхода лимитов. Защита: rate limiting, bot detection, behavioral analysis, CAPTCHA, phone/card verification, terms enforcement.',
    explanation:
      'API abuse растёт с популярностью API economy. По данным Salt Security, 95% организаций испытывали API security incidents. Комплексный подход: prevention (rate limiting, auth) + detection (anomaly detection) + response (blocking, legal).',
  },
  {
    id: 'sd-rate-limiting-024',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что произойдёт, если отправить запрос при исчерпанном rate limit?',
    options: [
      'Запрос будет обработан с задержкой',
      'Сервер вернёт HTTP 429 Too Many Requests с заголовком Retry-After',
      'Запрос будет перенаправлен на другой сервер',
      'Соединение будет разорвано без ответа',
    ],
    correctIndex: 1,
    explanation:
      'При превышении rate limit стандартный ответ — HTTP 429 Too Many Requests. Best practices для response: 1) Retry-After header — через сколько секунд повторить. 2) X-RateLimit-* headers — информация о лимитах. 3) Понятное сообщение об ошибке в body (JSON). 4) Distinguish между rate limit types (global vs per-user vs per-endpoint). Важно: не разрывать соединение без ответа — клиент должен понимать причину. Некоторые системы используют «soft limit» — запрос выполняется, но с warning header (близко к лимиту).',
  },
  {
    id: 'sd-rate-limiting-025',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое distributed rate limiting и почему оно сложнее локального?',
    options: [
      'Distributed rate limiting работает быстрее локального',
      'При distributed rate limiting необходимо синхронизировать счётчики между несколькими инстансами сервиса, что создаёт challenges с consistency и latency',
      'Distributed rate limiting не поддерживает sliding window',
      'Локальный rate limiting невозможен в cloud',
    ],
    correctIndex: 1,
    explanation:
      'Distributed rate limiting challenges: 1) Synchronization: запросы от одного клиента попадают на разные серверы (через load balancer). Каждый сервер должен видеть общий счётчик. 2) Latency: обращение к централизованному хранилищу (Redis) добавляет latency к каждому запросу. 3) Race conditions: concurrent increments могут превысить лимит. Решение: Lua scripts для атомарности. 4) Availability: Redis failure → fail-open или fail-closed? 5) Cost: каждый запрос = Redis call. Оптимизации: local cache с periodic sync, probabilistic rate limiting (approximate), sliding window counter вместо log.',
  },
  {
    id: 'sd-rate-limiting-026',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое GCRA (Generic Cell Rate Algorithm)?',
    options: [
      'Алгоритм шифрования для API-ключей',
      'Эффективная реализация leaky bucket с использованием одного timestamp вместо счётчика, используемая в производственных rate limiters',
      'Протокол связи между rate limiter-ами',
      'Метод географического распределения лимитов',
    ],
    correctIndex: 1,
    explanation:
      'GCRA (Generic Cell Rate Algorithm) — элегантная реализация leaky bucket. Хранит один timestamp (TAT — Theoretical Arrival Time) вместо счётчика токенов. При запросе: если current_time >= TAT, запрос разрешён, TAT обновляется. Если TAT в будущем — запрос отклонён или ждёт. Преимущества: O(1) memory на клиента, точный rate limiting, burst handling. Используется: Cloudflare rate limiting, Stripe API, Kong. GCRA эквивалентен leaky bucket математически, но проще в реализации для distributed systems (один ключ в Redis).',
  },
  {
    id: 'sd-rate-limiting-027',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'open',
    question: 'Как реализовать tiered rate limiting для разных тарифных планов?',
    sampleAnswer:
      'Tiered rate limiting по тарифам: 1) Определение tiers: free (100 req/hour), basic (1000/hour), pro (10000/hour), enterprise (custom). 2) Идентификация tier: API key → lookup tier из БД/cache. JWT claim с tier. 3) Конфигурация limits: JSON/YAML config per tier, stored в config service или environment. 4) Implementation: при проверке rate limit передавать tier, получать соответствующий limit. Redis key: rate_limit:{tier}:{client_id} или разные limits per tier. 5) Upgrade path: при превышении лимита — сообщение о upgrade. 6) Overages: для enterprise — возможность soft limit с overage billing. 7) Burst allowance: разные burst sizes per tier (pro может накопить больше токенов). 8) Monitoring: usage dashboards per tier, alerting при приближении к лимиту. API Gateway (Kong, AWS API Gateway) имеют built-in tier support.',
    explanation:
      'Tiered pricing — стандарт API economy. Stripe, Twilio, AWS используют tiered rate limits привязанные к pricing. Важно: transparent communication о limits, easy upgrade path, graceful degradation при достижении лимита.',
  },
  {
    id: 'sd-rate-limiting-028',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'open',
    question: 'Сравните алгоритмы rate limiting: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window. Когда какой использовать?',
    sampleAnswer:
      'Token Bucket: корзина наполняется токенами с фиксированной скоростью. Burst allowed до capacity. Pros: гибкий (burst + sustained rate), простой в понимании. Cons: memory для counter + timestamp. Use: общий rate limiting с burst (API общего назначения). Leaky Bucket: запросы «вытекают» с постоянной скоростью. Pros: ровный выходной поток. Cons: нет burst. Use: upstream с strict rate limit (payment gateway), сглаживание трафика. Fixed Window: счётчик сбрасывается в начале каждого окна. Pros: простой, O(1). Cons: boundary burst (2x лимит на стыке окон). Use: простые сценарии, где precision не критична. Sliding Window Log: хранит timestamp каждого запроса. Pros: точный. Cons: O(n) memory. Use: низкий throughput, нужна точность. Sliding Window Counter: взвешенное среднее текущего и предыдущего окна. Pros: O(1), устраняет boundary burst. Cons: приблизительный. Use: высокий throughput, good enough accuracy.',
    explanation:
      'На практике Token Bucket и Sliding Window Counter — наиболее популярны. Cloudflare, Stripe используют GCRA (вариант leaky bucket). Выбор зависит от: нужен ли burst, требуемая точность, memory constraints.',
  },
  {
    id: 'sd-rate-limiting-029',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое request coalescing и как оно помогает защитить backend?',
    options: [
      'Объединение нескольких одинаковых запросов в один для снижения нагрузки на backend',
      'Шифрование нескольких запросов вместе',
      'Сжатие запросов перед отправкой',
      'Разделение больших запросов на части',
    ],
    correctIndex: 0,
    explanation:
      'Request coalescing (deduplication): если несколько идентичных запросов приходят одновременно, выполняется только один, результат возвращается всем. Пример: 1000 пользователей запрашивают одну горячую новость → 1 запрос к БД, 1000 одинаковых ответов. Реализация: proxy/cache отслеживает in-flight requests, дубликаты ждут результата первого. Nginx proxy_cache_lock, Varnish coalescing. Дополняет rate limiting: rate limiting ограничивает частоту, coalescing уменьшает actual backend load. Особенно эффективен для: cache miss thundering herd, expensive computations, read-heavy traffic.',
  },
  {
    id: 'sd-rate-limiting-030',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое cost-based rate limiting?',
    options: [
      'Rate limiting на основе финансовых затрат клиента',
      'Ограничение на основе «стоимости» запроса — разные endpoints имеют разный вес, общий бюджет лимитирован',
      'Rate limiting с оплатой за превышение',
      'Балансировка нагрузки по стоимости серверов',
    ],
    correctIndex: 1,
    explanation:
      'Cost-based rate limiting: вместо простого счётчика запросов учитывается «стоимость» каждого запроса. Простой GET = 1 point, сложный search = 10 points, ML inference = 100 points. Бюджет: 1000 points/minute. Преимущества: справедливый лимит (тяжёлые запросы потребляют больше), защита дорогих endpoints, гибкость (не нужен отдельный лимит для каждого endpoint). GitHub GraphQL API использует cost-based: complexity query вычисляется, вычитается из budget. Shopify GraphQL: каждый запрос имеет cost, разные планы имеют разный budget. Реализация: вычисление cost before execution или после, deduction from budget.',
  },
  {
    id: 'sd-rate-limiting-031',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое token bucket с priority queues?',
    options: [
      'Bucket с разными приоритетами токенов',
      'Расширение token bucket, где запросы с разным приоритетом обрабатываются по-разному: high-priority получает токены первым',
      'Очередь для хранения отклонённых запросов',
      'Метод сортировки API-ключей',
    ],
    correctIndex: 1,
    explanation:
      'Priority-based rate limiting: не все запросы равны. High-priority (health checks, admin, paying customers) получают преимущество при rate limiting. Реализация: 1) Separate buckets per priority: high-priority bucket больше или восполняется быстрее. 2) Reserved capacity: часть rate резервируется для critical traffic. 3) Priority queues: при throttling low-priority throttled первым. 4) Weighted fair queuing: bandwidth распределяется пропорционально весам. Use cases: платные vs бесплатные пользователи, internal vs external traffic, critical vs best-effort operations. Envoy, Nginx Plus поддерживают priority-based rate limiting.',
  },
  {
    id: 'sd-rate-limiting-032',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question: 'Как реализовать rate limiting для GraphQL API? Какие challenges?',
    sampleAnswer:
      'GraphQL rate limiting challenges: 1) Single endpoint — нельзя лимитировать per-endpoint как в REST. 2) Query complexity — простой query vs сложный nested query с тысячами объектов. 3) Batching — несколько operations в одном запросе. Подходы: 1) Query complexity analysis: статический анализ AST, присвоение cost каждому полю/типу. GitHub: complexity = nodes * connections. Shopify: calculated cost per query. 2) Depth limiting: максимальная глубина вложенности (например, 10 levels). 3) Breadth limiting: максимальное количество полей на уровне. 4) Time-based: timeout на execution. 5) Response size limiting: maximum bytes/objects. 6) Cost-based budget: общий бюджет points, каждый query вычитает свой cost. Инструменты: graphql-cost-analysis, graphql-query-complexity libraries. Важно: вычисление cost до execution (reject expensive queries), reporting remaining budget клиенту.',
    explanation:
      'GraphQL rate limiting сложнее REST из-за гибкости queries. GitHub, Shopify, GitLab публикуют свои подходы. Без complexity limiting злоумышленник может создать query, потребляющую огромные ресурсы.',
  },
  {
    id: 'sd-rate-limiting-033',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите Netflix Concurrency Limits library. Как она реализует adaptive rate limiting?',
    sampleAnswer:
      'Netflix Concurrency Limits — библиотека для adaptive limiting на основе TCP congestion control алгоритмов. Концепция: вместо статических лимитов, динамически определяем оптимальный concurrency limit на основе latency signals. Алгоритмы: 1) Vegas: увеличивает limit при низкой latency, уменьшает при росте queue delay. 2) Gradient: отслеживает gradient latency (RTT), адаптируется к изменениям. 3) AIMD (Additive Increase Multiplicative Decrease): классический congestion control. Metrics: latency (gradient), queue delay, error rate, inflight requests. Limit adjustment: при хорошей latency — увеличиваем limit (additive), при плохой — уменьшаем (multiplicative). Интеграция: servlet filters, gRPC interceptors, Envoy. Преимущества: self-tuning (не нужно угадывать capacity), адаптация к изменениям (deploys, traffic patterns), protection от cascading failures. Envoy adaptive concurrency filter использует аналогичный подход.',
    explanation:
      'Adaptive rate limiting — state of the art. Netflix Concurrency Limits применяет decades of research в TCP congestion control к application-level. Результат: система автоматически находит оптимальную throughput, не перегружая downstream.',
  },
  {
    id: 'sd-rate-limiting-034',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое bot detection и как оно дополняет rate limiting?',
    options: [
      'Антивирусная защита серверов',
      'Идентификация автоматизированного трафика (ботов) через fingerprinting, behavior analysis, CAPTCHA для блокировки вредоносной активности',
      'Ограничение доступа для определённых браузеров',
      'Шифрование трафика для защиты от ботов',
    ],
    correctIndex: 1,
    explanation:
      'Bot detection дополняет rate limiting: rate limiting не различает бота и человека, bot detection — различает. Методы: 1) Fingerprinting: анализ headers, TLS fingerprint (JA3), device properties. 2) Behavioral: скорость действий, mouse movements, keyboard dynamics. 3) Challenge: CAPTCHA, JavaScript challenge, proof-of-work. 4) Reputation: IP reputation databases, known bot networks. 5) ML-based: anomaly detection по паттернам трафика. Инструменты: Cloudflare Bot Management, AWS WAF Bot Control, PerimeterX, DataDome. Rate limiting + bot detection: боты получают stricter limits или блокируются, legitimate users — normal experience.',
  },
  {
    id: 'sd-rate-limiting-035',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое load shedding и чем оно отличается от rate limiting?',
    options: [
      'Load shedding и rate limiting — одно и то же',
      'Load shedding — отбрасывание части трафика при критической перегрузке для сохранения работоспособности; rate limiting — превентивное ограничение частоты',
      'Load shedding работает только на сетевом уровне',
      'Rate limiting требует больше ресурсов',
    ],
    correctIndex: 1,
    explanation:
      'Rate limiting: проактивное ограничение, применяется всегда, защищает от превышения capacity. Load shedding: реактивная мера, активируется при критической нагрузке (CPU > 90%, latency spike). Отбрасываем часть запросов для сохранения системы. Стратегии load shedding: 1) Random: отбрасываем random % запросов. 2) LIFO: отбрасываем последние (очередь новых). 3) Priority-based: отбрасываем low-priority первыми. 4) Deadline-based: отбрасываем запросы, которые уже превысили deadline. Google использует «overload control»: при перегрузке backend отвечает «retry later» вместо обработки. Combination: rate limiting всегда + load shedding как safety net.',
  },
  {
    id: 'sd-rate-limiting-036',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'open',
    question: 'Как мониторить эффективность rate limiting? Какие метрики отслеживать?',
    sampleAnswer:
      'Rate limiting metrics: 1) Request rate: total RPS, per-endpoint, per-client. 2) Rejected requests: count и % запросов, отклонённых rate limiter. Разбивка по причинам (global limit, user limit, IP limit). 3) Rate limit usage: % от лимита, который клиенты используют. Distribution: сколько клиентов близки к лимиту. 4) Latency impact: добавляемая rate limiter latency. 5) Redis/storage metrics: Redis latency, error rate, memory usage. 6) False positives: legitimate users hitting limits (требует correlation с support tickets). 7) Abuse detection: spikes in rejected requests, new IPs hitting limits. Dashboards: real-time rate limit status, top clients by usage, trend analysis. Alerting: sudden spike in rejections, Redis issues, individual client anomalies. Tools: Prometheus + Grafana, Datadog APM, custom metrics в rate limiter.',
    explanation:
      'Мониторинг rate limiting важен для tuning: слишком strict — legitimate users страдают, слишком loose — не защищает. Iterative approach: установить baseline, мониторить, adjust. Usage reports для клиентов (API dashboard).',
  },
  {
    id: 'sd-rate-limiting-037',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое local rate limiting с gossip protocol?',
    options: [
      'Rate limiting с шифрованием',
      'Каждый сервер ведёт локальный счётчик и периодически обменивается состоянием с другими серверами через gossip, достигая eventual consistency без centralized storage',
      'Rate limiting для localhost трафика',
      'Протокол передачи rate limit конфигурации',
    ],
    correctIndex: 1,
    explanation:
      'Local rate limiting с gossip: альтернатива централизованному Redis. Каждый сервер: 1) Ведёт локальный счётчик запросов. 2) Периодически (каждые N секунд) обменивается counters с peers через gossip protocol. 3) Merge counters (sum или CRDT). Pros: нет single point of failure (Redis), низкая latency (local check), продолжает работать при network partition. Cons: eventual consistency — лимит может быть превышен между sync-ами, сложнее реализация. Подходит для: approximate rate limiting где exact enforcement не критичен, very high throughput где Redis latency проблематична. Envoy поддерживает local rate limiting как fallback.',
  },
  {
    id: 'sd-rate-limiting-038',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question: 'Как спроектировать rate limiting для микросервисной архитектуры? Где размещать rate limiter?',
    sampleAnswer:
      'Rate limiting layers в microservices: 1) Edge/API Gateway: первая линия защиты. Global limits, per-client limits (API key, IP). Centralized enforcement, consistent policies. Kong, AWS API Gateway, Envoy. 2) Service mesh (sidecar): каждый сервис имеет локальный rate limiter. Per-service limits, защита от внутренних overloads. Istio/Envoy rate limiting. 3) Application level: бизнес-логика rate limiting. Например: 5 password attempts per hour, 100 search queries per user per day. Custom rules, domain-specific. Архитектура: external traffic → Edge rate limiter → internal services с service mesh rate limiting → application-level для business rules. Shared state: Redis cluster, accessible from all services. Configuration: centralized config service (Consul, etcd), dynamically updated. Tradeoffs: too much rate limiting = latency overhead, maintenance complexity; too little = vulnerability to overload.',
    explanation:
      'Layered rate limiting — defense in depth. Каждый layer защищает от разных угроз: edge — external abuse, service mesh — internal cascading failures, application — business rule enforcement.',
  },
  {
    id: 'sd-rate-limiting-039',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите подход Stripe к rate limiting. Какие особенности их системы?',
    sampleAnswer:
      'Stripe rate limiting подход: 1) GCRA algorithm: Generic Cell Rate Algorithm (leaky bucket variant) для точного и эффективного лимитирования. Один timestamp per client вместо counter. 2) Multiple dimensions: лимиты по API key, по endpoint, по IP, по account. Compound: api_key + endpoint. 3) Tiered limits: разные лимиты для разных endpoints (write operations stricter). 4) Burst allowance: накопление capacity при неиспользовании. 5) Clear communication: детальные error messages, X-RateLimit headers, documentation. 6) Client libraries: built-in retry с exponential backoff. 7) Monitoring: real-time dashboards для операций, alerting на anomalies. 8) Gradual enforcement: warning period при введении новых лимитов. 9) Enterprise exceptions: custom limits для large customers через negotiation. Stripe публично документирует свои лимиты и рекомендует best practices для клиентов.',
    explanation:
      'Stripe — reference implementation для API rate limiting. Их подход балансирует защиту платформы и developer experience. Open-source библиотека: stripe/stripe-go содержит retry logic.',
  },
  {
    id: 'sd-rate-limiting-040',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое bulkhead pattern и как он связан с rate limiting?',
    options: [
      'Паттерн для массовой загрузки данных',
      'Паттерн изоляции ресурсов: разделение системы на независимые compartments, чтобы сбой одного не влиял на другие',
      'Метод сжатия bulk requests',
      'Алгоритм bulk rate limiting',
    ],
    correctIndex: 1,
    explanation:
      'Bulkhead pattern (переборка корабля): изоляция ресурсов для fault isolation. Примеры: отдельные thread pools для разных клиентов, отдельные connection pools для разных downstream services, отдельные rate limit buckets для разных tenant-ов. Связь с rate limiting: rate limiting ограничивает общую нагрузку, bulkhead — изолирует потребителей друг от друга. Один «noisy neighbor» не может исчерпать все ресурсы. Реализация: Hystrix (deprecated), Resilience4j bulkhead, Envoy connection limits per upstream. Combination: global rate limit + per-tenant bulkhead обеспечивает и защиту системы, и fairness между tenants.',
  },
  {
    id: 'sd-rate-limiting-041',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'open',
    question: 'Как клиент должен обрабатывать rate limit ответы? Опишите best practices.',
    sampleAnswer:
      'Client-side rate limit handling: 1) Parse response: распознавать HTTP 429, читать Retry-After header. 2) Exponential backoff: wait time = base * 2^attempt + jitter. Пример: 1s, 2s, 4s, 8s с random jitter ±0.5s. 3) Respect Retry-After: если сервер указал конкретное время — использовать его вместо собственного backoff. 4) Maximum retries: ограничить количество попыток (например, 5), после — fail с понятной ошибкой. 5) Circuit breaker: при частых 429 — прекратить попытки на время. 6) Proactive throttling: отслеживать X-RateLimit-Remaining, замедляться при приближении к лимиту. 7) Queue management: при burst — локальная очередь с controlled drain rate. 8) Logging/alerting: логировать rate limits для диагностики, alerting при частых occurrences. SDK best practice: встроенный retry в client library (AWS SDK, Stripe SDK делают это автоматически).',
    explanation:
      'Правильный client-side handling критичен: без backoff клиент создаёт retry storm, ухудшая ситуацию. Jitter предотвращает thundering herd. Stripe, AWS публикуют recommended retry strategies.',
  },
  {
    id: 'sd-rate-limiting-042',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое request prioritization и как оно работает с rate limiting?',
    options: [
      'Сортировка запросов по времени поступления',
      'Назначение приоритетов запросам, при котором high-priority трафик обрабатывается преимущественно, а low-priority — throttled первым при перегрузке',
      'Шифрование приоритетных запросов',
      'Выделение отдельных серверов для приоритетного трафика',
    ],
    correctIndex: 1,
    explanation:
      'Request prioritization: не все запросы равны. Примеры приоритетов: health checks (critical), paid customers (high), free users (normal), background jobs (low). Реализация: 1) Priority header/parameter: клиент указывает priority. 2) Inferred priority: на основе endpoint, user tier, request type. 3) Separate buckets: отдельный rate limit per priority class. 4) Weighted fair queuing: при throttling low-priority теряет больше. 5) Reserved capacity: часть bandwidth зарезервирована для high-priority. При overload: сначала throttle low-priority, high-priority продолжает работать. Защищает критические функции от деградации.',
  },
  {
    id: 'sd-rate-limiting-043',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое service-to-service rate limiting и чем оно отличается от client rate limiting?',
    options: [
      'Rate limiting между микросервисами для предотвращения cascading failures и защиты downstream dependencies',
      'Rate limiting работает одинаково для клиентов и сервисов',
      'Service rate limiting не использует Redis',
      'Только внешний трафик нуждается в rate limiting',
    ],
    correctIndex: 0,
    explanation:
      'Service-to-service rate limiting: защита между внутренними сервисами. Отличия от client rate limiting: 1) Purpose: cascading failure prevention vs abuse prevention. 2) Identifiers: service identity vs API key/IP. 3) Limits: capacity-based (downstream can handle) vs policy-based. 4) Enforcement: часто в service mesh vs API gateway. 5) Failure mode: circuit breaker + retry vs 429 to client. Примеры: Service A rate limits calls to Service B на основе B\'s capacity. При B slowdown — A throttles calls, предотвращая overload. Envoy: rate limiting между sidecars. Resilience patterns: rate limiting + circuit breaker + bulkhead.',
  },
  {
    id: 'sd-rate-limiting-044',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question: 'Как интегрировать rate limiting с billing системой для usage-based pricing?',
    sampleAnswer:
      'Rate limiting + billing integration: 1) Shared metering: один source of truth для usage (rate limiter + billing). Варианты: rate limiter пишет в billing DB, или billing читает rate limiter logs. 2) Quota sync: billing определяет quota (10K calls/month), rate limiter enforces. При покупке upgrade — quota увеличивается. 3) Overage handling: при превышении quota — блокировка (hard limit) или продолжение с overage charges (soft limit). 4) Real-time usage: dashboard для клиента с current usage, remaining quota, projected cost. 5) Alerts: предупреждения при приближении к лимиту (80%, 100%). 6) Prepaid vs postpaid: prepaid — strict enforcement, postpaid — track и charge. 7) Grace period: не блокировать немедленно при превышении, дать время на upgrade. Implementation: rate limit events → message queue → billing service aggregates → invoice generation. Stripe Billing, Metronome, Chargebee — platforms для usage-based billing.',
    explanation:
      'Usage-based pricing (pay-as-you-go) требует точного metering. Rate limiter — natural place для tracking. Challenges: consistency между rate limiting и billing (не заблокировать оплаченный трафик, не пропустить неоплаченный).',
  },
  {
    id: 'sd-rate-limiting-045',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'open',
    question: 'Что такое request hedging и как оно влияет на rate limiting?',
    sampleAnswer:
      'Request hedging: отправка duplicate requests к разным backends или retry до истечения timeout, использование первого ответа. Цель: снижение tail latency (p99). Пример: отправить запрос к replica A, через 50ms (если нет ответа) — к replica B, вернуть первый ответ. Влияние на rate limiting: 1) Increased load: hedged requests удваивают (или больше) request rate. 2) Rate limit consumption: один logical request потребляет multiple rate limit tokens. 3) Accounting: как считать — один запрос или несколько? Solutions: 1) Hedge limit: ограничить % запросов, которые можно hedge. 2) Cancel on response: отменять pending hedged requests при получении ответа. 3) Budget-based: hedging только когда есть запас в rate limit budget. 4) Separate accounting: hedged requests не считаются в client rate limit. Hedging полезен для latency, но требует careful integration с rate limiting.',
    explanation:
      'Hedging — powerful technique для tail latency, но может amplify load. Google «The Tail at Scale» paper описывает hedging practices. Important: cancel outstanding hedged requests to avoid wasted work.',
  },
  {
    id: 'sd-rate-limiting-046',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое concurrency limiting и чем оно отличается от rate limiting?',
    options: [
      'Это синонимы',
      'Concurrency limiting ограничивает количество одновременных запросов (in-flight), rate limiting — количество запросов за период времени',
      'Concurrency limiting работает только с базами данных',
      'Rate limiting быстрее concurrency limiting',
    ],
    correctIndex: 1,
    explanation:
      'Rate limiting: X запросов за Y секунд (например, 100 req/min). Контролирует throughput. Concurrency limiting: максимум X одновременных запросов в обработке. Контролирует parallelism. Пример: rate limit 1000 req/min, concurrency limit 50. Если запросы быстрые (10ms) — 1000/min легко достижимо. Если запросы медленные (1s) — concurrency limit 50 станет bottleneck. Use cases: concurrency limit защищает от slow requests exhausting resources (connections, threads). Rate limit защищает от burst traffic. Часто используются вместе: rate limit для sustained load, concurrency limit для instant protection.',
  },
  {
    id: 'sd-rate-limiting-047',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое cell-based architecture для rate limiting?',
    options: [
      'Rate limiting на клеточных сетях',
      'Архитектура, где инфраструктура разделена на независимые cells, каждая с собственным rate limiting, для изоляции failures и улучшения scalability',
      'Использование spreadsheet cells для конфигурации',
      'Биологически-вдохновлённый алгоритм',
    ],
    correctIndex: 1,
    explanation:
      'Cell-based architecture: система разделена на независимые cells (units of deployment). Каждая cell обслуживает subset клиентов и имеет собственную инфраструктуру включая rate limiting. Benefits: 1) Blast radius: проблема в одной cell не влияет на другие. 2) Scalability: добавление cells для роста. 3) Independent rate limiting: каждая cell имеет свой Redis, свои лимиты. 4) Testing: можно тестировать изменения на одной cell. AWS использует cell-based architecture. DynamoDB cells: независимые partitions. Rate limiting per cell: локальные счётчики, нет cross-cell synchronization overhead. Trade-off: client routing к правильной cell, cross-cell operations сложнее.',
  },
  {
    id: 'sd-rate-limiting-048',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question: 'Как реализовать graceful degradation при rate limiting? Опишите стратегии.',
    sampleAnswer:
      'Graceful degradation при rate limiting: вместо hard block — постепенное снижение качества сервиса. Стратегии: 1) Cached responses: при rate limit — возвращать cached/stale данные вместо fresh. 2) Simplified responses: убирать expensive fields (recommendations, analytics). 3) Lower quality: изображения в меньшем разрешении, video в lower bitrate. 4) Partial results: вернуть первые 10 результатов вместо всех. 5) Async processing: вместо синхронного ответа — принять запрос в очередь, вернуть job ID. 6) Priority queuing: rate limited requests в low-priority queue, обрабатываются когда есть capacity. 7) Feature flags: при overload отключать non-critical features. 8) Informative response: вместо простого 429 — указать что доступно (cached data, limited results). Implementation: response middleware проверяет rate limit status, applies degradation rules. UX: сообщить пользователю о degraded mode.',
    explanation:
      'Graceful degradation лучше hard failure для UX. Amazon prime day: при overload некоторые features отключались, checkout работал. Netflix: при rate limiting — lower quality streams вместо failure.',
  },
  {
    id: 'sd-rate-limiting-049',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое token bucket с hierarchical limits?',
    options: [
      'Bucket с несколькими типами токенов',
      'Система вложенных лимитов: global → organization → user → endpoint, где каждый уровень имеет свой bucket',
      'Иерархия серверов rate limiting',
      'Многоуровневое шифрование токенов',
    ],
    correctIndex: 1,
    explanation:
      'Hierarchical rate limiting: вложенные лимиты на разных уровнях. Пример: Global: 100K RPS для всей платформы. Organization: 10K RPS per org. User: 1K RPS per user. Endpoint: 100 RPS для expensive endpoints. Запрос должен пройти все уровни. Реализация: проверяем buckets последовательно (от global к specific) или параллельно. Преимущества: защита на всех уровнях, fairness (один user не может exhausted org quota, один org не может exhausted global). Challenges: multiple Redis operations per request (можно batch), complexity. API Gateway products (Kong, Apigee) поддерживают hierarchical limits.',
  },
  {
    id: 'sd-rate-limiting-050',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting и защита API',
    difficulty: 'senior',
    type: 'open',
    question: 'Как rate limiting интегрируется с API monetization? Опишите patterns для API marketplace.',
    sampleAnswer:
      'API monetization patterns с rate limiting: 1) Freemium: бесплатный tier с low limits (1000 req/month), paid tiers с higher limits. Conversion через limit hitting. 2) Pay-as-you-go: no hard limit, charge per request. Soft limits для fraud prevention. 3) Tiered pricing: Bronze/Silver/Gold с increasing limits и decreasing per-request cost. 4) Burst pricing: базовый тариф + premium за burst capacity. 5) Reserved capacity: pay upfront для guaranteed rate. 6) Marketplace model: API provider sets limits, marketplace enforces и bills. Implementation: API Gateway (Kong, Apigee) интегрируется с billing (Stripe, Chargebee). Usage events → metering → invoice. Features: real-time usage dashboards, budget alerts, self-service upgrade, developer portal с rate limit documentation. Success metrics: conversion rate от free к paid, revenue per customer, churn due to limits.',
    explanation:
      'API-as-a-product требует thoughtful monetization. Twilio, Stripe — примеры successful API monetization. Rate limits — часть pricing strategy: не слишком restrictive (отпугнёт), не слишком generous (не заработаешь).',
  },
];
