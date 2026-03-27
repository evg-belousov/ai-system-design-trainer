import type { Scenario } from './types';

export const rateLimiterScenario: Scenario = {
  id: 'rate-limiter',
  title: 'Rate Limiter',
  difficulty: 'middle',
  description:
    'Спроектируйте распределённый rate limiter для API-шлюза, обрабатывающего 10M+ запросов в секунду. Система должна точно ограничивать трафик, масштабироваться горизонтально и не становиться единой точкой отказа.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'rl-requirements',
      title: 'Требования',
      description:
        'Определите область применения и ключ, по которому будет происходить ограничение запросов.',
      decisions: [
        {
          id: 'rl-scope',
          category: 'Область применения',
          question: 'Где применять rate limiting?',
          options: [
            {
              id: 'client-side',
              label: 'Client-side',
              description:
                'Ограничение на стороне клиента (SDK, мобильное приложение).',
              pros: [
                'Снижает нагрузку на сервер ещё до отправки запроса',
                'Мгновенная обратная связь пользователю',
              ],
              cons: [
                'Легко обойти — клиент контролируется пользователем',
                'Невозможно гарантировать соблюдение лимитов',
                'Не защищает от злоумышленников',
              ],
              bestWhen:
                'Нужна мягкая защита от случайных превышений в собственных клиентских приложениях.',
              impact: {
                latency: 2,
                scalability: 0,
                consistency: -2,
                complexity: -1,
                cost: 2,
              },
            },
            {
              id: 'server-side',
              label: 'Server-side (API gateway)',
              description:
                'Ограничение на уровне API-шлюза (Kong, Envoy, NGINX).',
              pros: [
                'Единая точка контроля для всех клиентов',
                'Невозможно обойти со стороны клиента',
                'Стандартный подход — поддерживается всеми API-шлюзами',
              ],
              cons: [
                'API gateway становится узким местом при плохом масштабировании',
                'Добавляет латентность на каждый запрос',
              ],
              bestWhen:
                'Стандартный сценарий — публичный API с предсказуемой моделью лимитов.',
              impact: {
                latency: -1,
                scalability: 1,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'middleware-sidecar',
              label: 'Middleware (sidecar)',
              description:
                'Rate limiter как sidecar-контейнер рядом с каждым сервисом (Envoy в service mesh).',
              pros: [
                'Гранулярный контроль на уровне каждого сервиса',
                'Децентрализованная архитектура — нет единой точки отказа',
                'Хорошо вписывается в service mesh (Istio, Linkerd)',
              ],
              cons: [
                'Сложная координация лимитов между sidecar-инстансами',
                'Потребляет ресурсы на каждом поде',
                'Сложнее поддерживать единую политику лимитов',
              ],
              bestWhen:
                'Микросервисная архитектура с service mesh, где нужны лимиты на уровне отдельных сервисов.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: -1,
                complexity: 1,
                cost: 1,
              },
            },
          ],
        },
        {
          id: 'rl-granularity',
          category: 'Ключ лимитирования',
          question: 'По какому ключу лимитировать?',
          options: [
            {
              id: 'by-ip',
              label: 'По IP-адресу',
              description:
                'Лимит привязан к IP-адресу клиента.',
              pros: [
                'Не требует аутентификации',
                'Простая реализация',
                'Работает для анонимных пользователей',
              ],
              cons: [
                'NAT/прокси — тысячи пользователей за одним IP',
                'IPv6 позволяет легко менять адреса',
                'Не отражает реального потребителя API',
              ],
              bestWhen:
                'Базовая защита от DDoS для публичных эндпоинтов без аутентификации.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: -1,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: 'by-user-id',
              label: 'По user ID',
              description:
                'Лимит привязан к идентификатору аутентифицированного пользователя.',
              pros: [
                'Точное ограничение конкретного пользователя',
                'Не зависит от IP или сети',
                'Позволяет дифференцировать лимиты по тарифам',
              ],
              cons: [
                'Требует аутентификации до проверки лимита',
                'Не защищает от атак на эндпоинт логина',
                'Усложняет flow — сначала auth, потом rate limit',
              ],
              bestWhen:
                'Внутренний API с обязательной аутентификацией и разными уровнями доступа.',
              impact: {
                latency: -1,
                scalability: 0,
                consistency: 1,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'by-api-key',
              label: 'По API key',
              description:
                'Лимит привязан к API-ключу, выданному потребителю.',
              pros: [
                'Стандарт для B2B API (Stripe, Twilio, GitHub)',
                'Ключ передаётся в заголовке — быстрая проверка без полного auth',
                'Гибкие лимиты для каждого клиента/тарифа',
              ],
              cons: [
                'Утечка ключа = утечка квоты',
                'Необходимо управление жизненным циклом ключей',
                'Не подходит для конечных пользователей (B2C)',
              ],
              bestWhen:
                'Публичный B2B API с платными тарифами и индивидуальными лимитами для каждого потребителя.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'combined',
              label: 'Комбинированный',
              description:
                'Несколько уровней лимитов: по IP + по API key + по эндпоинту.',
              pros: [
                'Максимальная гибкость и защита',
                'Разные лимиты для разных сценариев',
                'Защита и от DDoS, и от злоупотреблений конкретным клиентом',
              ],
              cons: [
                'Сложная конфигурация и отладка',
                'Больше обращений к хранилищу счётчиков',
                'Труднее объяснить клиентам, какой лимит сработал',
              ],
              bestWhen:
                'Крупные платформы с разнообразными клиентами и высокими требованиями безопасности.',
              impact: {
                latency: -1,
                scalability: -1,
                consistency: 2,
                complexity: 2,
                cost: 1,
              },
            },
          ],
        },
      ],
    },

    // ── Step 2: Algorithm Selection ───────────────────────────────────
    {
      id: 'rl-algorithm',
      title: 'Выбор алгоритма',
      description:
        'Выберите алгоритм rate limiting, определяющий, как именно подсчитываются и ограничиваются запросы.',
      decisions: [
        {
          id: 'rl-algo',
          category: 'Алгоритм',
          question: 'Какой алгоритм rate limiting использовать?',
          options: [
            {
              id: 'token-bucket',
              label: 'Token Bucket',
              description:
                'Корзина с токенами: токены добавляются с фиксированной скоростью, каждый запрос забирает токен. Используется в AWS и Stripe.',
              pros: [
                'Допускает контролируемые всплески трафика (burst)',
                'Простая и эффективная реализация',
                'Широко используется в production (AWS, Stripe, NGINX)',
              ],
              cons: [
                'Два параметра для настройки (rate + burst size)',
                'Burst может перегрузить downstream-сервисы',
                'Требует атомарной операции «проверить и забрать»',
              ],
              bestWhen:
                'API, где допустимы кратковременные всплески, а средний rate должен быть ограничен.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 0,
                complexity: -1,
                cost: 0,
              },
              capacityImpact: [
                {
                  label: 'Counter storage (Redis)',
                  value: '~20 MB',
                  formula: '1M unique API keys × 20 bytes (2 fields: tokens remaining + last refill timestamp) ≈ 20 MB',
                },
                {
                  label: 'Memory per node (10 nodes)',
                  value: '~10 MB',
                  formula: '20 MB total / 10 nodes = 2 MB + overhead ≈ 10 MB per node',
                },
              ],
            },
            {
              id: 'leaky-bucket',
              label: 'Leaky Bucket',
              description:
                'Запросы поступают в очередь фиксированного размера и обрабатываются с постоянной скоростью. Используется в Shopify.',
              pros: [
                'Сглаживает трафик — ровная нагрузка на backend',
                'Предсказуемая скорость обработки',
                'Защищает downstream от burst-нагрузки',
              ],
              cons: [
                'Не допускает burst — даже легитимные всплески задерживаются',
                'Очередь занимает память',
                'Старые запросы могут вытеснить новые при переполнении',
              ],
              bestWhen:
                'Нужна строго равномерная нагрузка на backend (финансовые транзакции, внешние API с жёсткими лимитами).',
              impact: {
                latency: -1,
                scalability: 0,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'fixed-window',
              label: 'Fixed Window Counter',
              description:
                'Счётчик запросов в фиксированном временном окне (например, 100 req/min). Самая простая реализация.',
              pros: [
                'Минимальное потребление памяти — один счётчик на окно',
                'Проще всего реализовать и понять',
                'Атомарный INCR в Redis — нет race condition',
              ],
              cons: [
                'Проблема границы окна: 2x burst на стыке двух окон',
                'Неравномерное распределение в пределах окна',
                'Не подходит для точных лимитов',
              ],
              bestWhen:
                'Нужна простая, но не идеально точная система ограничений с минимальным потреблением ресурсов.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -2,
                complexity: -2,
                cost: -1,
              },
            },
            {
              id: 'sliding-window-log',
              label: 'Sliding Window Log',
              description:
                'Хранится timestamp каждого запроса; лимит проверяется по скользящему окну. Максимально точный алгоритм.',
              pros: [
                'Идеальная точность — нет проблемы границы окна',
                'Нет burst на стыке окон',
                'Гарантированное соблюдение лимита в любой момент',
              ],
              cons: [
                'Высокое потребление памяти: O(n) на каждого клиента',
                'Дорогие операции: sorted set в Redis для каждого запроса',
                'Не масштабируется при высоких лимитах (10K+ req/min)',
              ],
              bestWhen:
                'Критически важна точность лимитов, а количество клиентов и лимит на клиента невелики.',
              impact: {
                latency: -2,
                scalability: -2,
                consistency: 2,
                complexity: 1,
                cost: 2,
              },
              capacityImpact: [
                {
                  label: 'Counter storage (Redis)',
                  value: '~100 GB',
                  formula: '1M keys × 1000 requests/min window × 100 bytes per timestamp entry = ~100 GB (1000× more than token bucket)',
                },
                {
                  label: 'Memory per node (10 nodes)',
                  value: '~10 GB',
                  formula: '100 GB total / 10 nodes = 10 GB per node — requires significant RAM',
                },
                {
                  label: 'Rule evaluations/sec',
                  value: '10M/sec (with ZRANGEBYSCORE)',
                  formula: '10M RPS × O(log n) sorted set operation per check — Redis CPU-bound at ~500K ops/sec per core',
                },
              ],
            },
            {
              id: 'sliding-window-counter',
              label: 'Sliding Window Counter',
              description:
                'Комбинация fixed window и sliding window: взвешенное среднее текущего и предыдущего окна. Используется в Cloudflare и Kong.',
              pros: [
                'Сглаживает проблему границы окна fixed window',
                'Память O(1) на клиента — два счётчика',
                'Хороший баланс точности и производительности',
              ],
              cons: [
                'Приблизительный подсчёт — не 100% точность',
                'Предполагает равномерное распределение в предыдущем окне',
                'Чуть сложнее в реализации, чем fixed window',
              ],
              bestWhen:
                'Production-системы с высоким RPS, где нужен баланс точности, памяти и латентности.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 1,
                complexity: 0,
                cost: -1,
              },
            },
          ],
        },
      ],
    },

    // ── Step 3: Data Store ────────────────────────────────────────────
    {
      id: 'rl-storage',
      title: 'Хранилище данных',
      description:
        'Определите, где хранить счётчики запросов и как синхронизировать состояние между несколькими инстансами rate limiter.',
      decisions: [
        {
          id: 'rl-store',
          category: 'Хранилище счётчиков',
          question: 'Где хранить счётчики?',
          options: [
            {
              id: 'in-memory',
              label: 'In-memory (локально)',
              description:
                'Счётчики хранятся в памяти каждого инстанса rate limiter.',
              pros: [
                'Минимальная латентность — нет сетевых вызовов',
                'Нет внешних зависимостей',
                'Простейшая реализация',
              ],
              cons: [
                'Нет координации между инстансами — лимит дробится',
                'Потеря данных при перезапуске',
                'Не работает для distributed rate limiting без sticky sessions',
              ],
              bestWhen:
                'Один инстанс, или sticky sessions, или допустим неточный лимит в N раз (N = число инстансов).',
              impact: {
                latency: 2,
                scalability: -2,
                consistency: -2,
                complexity: -2,
                cost: -1,
              },
              capacityImpact: [
                {
                  label: 'Counter storage (Redis)',
                  value: '0 (no Redis needed)',
                  formula: 'All counters in process memory; no external store required',
                },
                {
                  label: 'Latency budget',
                  value: '<0.01 ms',
                  formula: 'In-process hash map lookup: ~10 μs, no network hop (100× faster than Redis)',
                },
                {
                  label: 'Memory per node (10 nodes)',
                  value: '~10 MB per node',
                  formula: '1M keys / 10 nodes = 100K keys × 100 bytes = ~10 MB (but each node sees only 1/N of keys)',
                },
              ],
            },
            {
              id: 'redis',
              label: 'Redis',
              description:
                'Централизованное хранилище счётчиков в Redis. Индустриальный стандарт для rate limiting.',
              pros: [
                'Атомарные операции (INCR, EXPIRE, Lua scripts)',
                'TTL из коробки — автоматическая очистка',
                'Высокая производительность: 100K+ ops/sec на инстанс',
                'Экосистема: готовые библиотеки для rate limiting',
              ],
              cons: [
                'Дополнительная сетевая задержка (~0.5-1ms)',
                'Ещё один компонент инфраструктуры для поддержки',
                'Single point of failure без кластеризации',
              ],
              bestWhen:
                'Стандартный выбор для распределённого rate limiting в production.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'memcached',
              label: 'Memcached',
              description:
                'Распределённый кеш с поддержкой атомарного increment.',
              pros: [
                'Простой протокол, высокая производительность',
                'Встроенный atomic increment',
                'Хорошо масштабируется горизонтально',
              ],
              cons: [
                'Нет Lua scripts — ограниченная атомарность сложных операций',
                'Нет встроенного TTL для отдельных операций increment',
                'Меньше экосистема для rate limiting, чем у Redis',
              ],
              bestWhen:
                'Простые алгоритмы (fixed window с INCR) без сложной логики.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 1,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: 'redis-cluster',
              label: 'Redis Cluster',
              description:
                'Кластер Redis с шардированием по ключам для максимального масштабирования.',
              pros: [
                'Горизонтальное масштабирование чтений и записей',
                'Встроенная репликация и failover',
                'Тот же API, что и standalone Redis',
              ],
              cons: [
                'Lua scripts работают только в рамках одного слота (hash tag)',
                'Сложная эксплуатация и мониторинг',
                'Resharding может вызвать кратковременные сбои',
              ],
              bestWhen:
                'Масштаб 10M+ RPS, когда одного Redis-инстанса недостаточно.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: 1,
                complexity: 2,
                cost: 2,
              },
              capacityImpact: [
                {
                  label: 'Counter storage (Redis)',
                  value: '~100 MB across cluster',
                  formula: '1M keys × 100 bytes sharded across 6+ Redis nodes (3 masters + 3 replicas)',
                },
                {
                  label: 'Latency budget',
                  value: '<1.5 ms',
                  formula: 'Redis Cluster adds ~0.5 ms for MOVED redirects + cross-slot overhead vs standalone Redis',
                },
                {
                  label: 'Network bandwidth',
                  value: '~4 GB/s',
                  formula: '10M RPS × 200 bytes + cluster gossip + replication overhead ≈ ~4 GB/s total cluster bandwidth',
                },
              ],
            },
          ],
        },
        {
          id: 'rl-sync',
          category: 'Синхронизация',
          question: 'Как синхронизировать между нодами?',
          options: [
            {
              id: 'no-sync',
              label: 'Без синхронизации (sticky sessions)',
              description:
                'Каждый инстанс ведёт свои счётчики; клиенты привязаны к конкретному инстансу.',
              pros: [
                'Нет сетевого overhead на синхронизацию',
                'Минимальная латентность',
                'Простая реализация',
              ],
              cons: [
                'Sticky sessions усложняют балансировку',
                'Потеря счётчиков при failover',
                'Неравномерное распределение нагрузки',
              ],
              bestWhen:
                'Малое количество инстансов и допустима неточность лимитов.',
              impact: {
                latency: 2,
                scalability: -2,
                consistency: -2,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'centralized-store',
              label: 'Централизованное хранилище (Redis)',
              description:
                'Все инстансы обращаются к одному Redis — единый источник правды.',
              pros: [
                'Глобально консистентные лимиты',
                'Простая модель: запись и чтение из одного места',
                'Стандартный подход в индустрии',
              ],
              cons: [
                'Зависимость от доступности Redis',
                'Сетевая задержка на каждый запрос',
                'Redis становится bottleneck при экстремальном RPS',
              ],
              bestWhen:
                'Стандартный подход для большинства production-систем.',
              impact: {
                latency: -1,
                scalability: 1,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'gossip-protocol',
              label: 'Gossip protocol',
              description:
                'Инстансы обмениваются счётчиками через gossip (CRDT, SWIM).',
              pros: [
                'Нет центрального хранилища — нет SPOF',
                'Работает при сетевых разделениях',
                'Масштабируется без bottleneck',
              ],
              cons: [
                'Eventual consistency — лимиты неточны в моменте',
                'Сложная реализация и отладка',
                'Медленная конвергенция при большом числе нод',
              ],
              bestWhen:
                'Географически распределённая система, где неприемлем centralized store.',
              impact: {
                latency: 1,
                scalability: 2,
                consistency: -2,
                complexity: 2,
                cost: 0,
              },
            },
            {
              id: 'eventual-sync',
              label: 'Eventual sync с локальным fallback',
              description:
                'Локальные счётчики синхронизируются с Redis асинхронно; при недоступности Redis работает локальный лимит.',
              pros: [
                'Устойчивость к отказу Redis',
                'Минимальная латентность в обычном режиме',
                'Graceful degradation вместо полного отказа',
              ],
              cons: [
                'Временная неточность лимитов при sync lag',
                'Сложная логика переключения local/remote',
                'Возможен overshoot в момент перехода',
              ],
              bestWhen:
                'Высокие требования к доступности; лучше пропустить лишний запрос, чем заблокировать всё.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: -1,
                complexity: 1,
                cost: 0,
              },
            },
          ],
        },
      ],
    },

    // ── Step 4: Architecture ──────────────────────────────────────────
    {
      id: 'rl-architecture',
      title: 'Архитектура',
      description:
        'Определите, где размещается rate limiter и как взаимодействовать с клиентом при превышении лимита.',
      decisions: [
        {
          id: 'rl-placement',
          category: 'Размещение',
          question: 'Где разместить rate limiter?',
          options: [
            {
              id: 'api-gateway',
              label: 'Встроен в API Gateway (Kong, Envoy)',
              description:
                'Rate limiter работает как плагин или фильтр в API-шлюзе.',
              pros: [
                'Единая точка входа — все запросы проходят через gateway',
                'Готовые плагины: Kong rate-limiting, Envoy ratelimit',
                'Централизованное управление политиками',
              ],
              cons: [
                'Зависимость от конкретного gateway',
                'Ограничения кастомизации плагина',
                'Gateway должен масштабироваться вместе с нагрузкой',
              ],
              bestWhen:
                'Уже используется API gateway; стандартные требования к rate limiting.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 1,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'separate-service',
              label: 'Отдельный сервис',
              description:
                'Rate limiter как standalone-микросервис, к которому обращаются другие сервисы.',
              pros: [
                'Независимое масштабирование и деплой',
                'Единый rate limiter для разных gateway/сервисов',
                'Полный контроль над логикой и хранилищем',
              ],
              cons: [
                'Дополнительный сетевой hop на каждый запрос',
                'Ещё один сервис для поддержки и мониторинга',
                'Становится критическим компонентом системы',
              ],
              bestWhen:
                'Сложная логика лимитирования или несколько точек входа в систему.',
              impact: {
                latency: -1,
                scalability: 2,
                consistency: 2,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                {
                  label: 'Latency budget',
                  value: '<3 ms',
                  formula: 'Extra network hop: ~1-2 ms (service call) + <1 ms (Redis check) = ~2-3 ms total (3× standalone gateway)',
                },
                {
                  label: 'Network bandwidth',
                  value: '~4 GB/s',
                  formula: '10M RPS × 200 bytes request + 200 bytes response to rate limiter service = ~4 GB/s inter-service traffic',
                },
              ],
            },
            {
              id: 'library',
              label: 'Библиотека в каждом сервисе',
              description:
                'Rate limiting реализован как SDK/библиотека, подключаемая в каждый сервис.',
              pros: [
                'Нет дополнительного сетевого hop',
                'Переиспользование кода через пакет',
                'Каждый сервис может настроить свои лимиты',
              ],
              cons: [
                'Дублирование логики — нужно обновлять во всех сервисах',
                'Координация лимитов через общий store всё равно нужна',
                'Разные версии библиотеки в разных сервисах',
              ],
              bestWhen:
                'Нет API gateway; каждый сервис управляет своими лимитами.',
              impact: {
                latency: 1,
                scalability: 0,
                consistency: -1,
                complexity: 1,
                cost: -1,
              },
            },
            {
              id: 'cdn-level',
              label: 'CDN-level (Cloudflare)',
              description:
                'Rate limiting на уровне CDN/edge — до того, как трафик дойдёт до origin.',
              pros: [
                'Защита от DDoS на уровне edge — трафик не доходит до серверов',
                'Глобальная сеть — минимальная латентность для клиентов',
                'Нет нагрузки на собственную инфраструктуру',
              ],
              cons: [
                'Ограниченная кастомизация правил',
                'Vendor lock-in (Cloudflare, AWS WAF)',
                'Стоимость при высоком трафике',
                'Сложно реализовать лимиты по бизнес-логике',
              ],
              bestWhen:
                'Защита от DDoS и простые лимиты по IP на edge; бизнес-лимиты — отдельно.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: 0,
                complexity: -2,
                cost: 2,
              },
            },
          ],
        },
        {
          id: 'rl-response',
          category: 'Ответ при превышении',
          question: 'Как отвечать при превышении лимита?',
          options: [
            {
              id: '429-retry-after',
              label: '429 + Retry-After header',
              description:
                'Стандартный HTTP 429 Too Many Requests с заголовком Retry-After.',
              pros: [
                'Стандартный HTTP-подход (RFC 6585)',
                'Клиент знает, когда можно повторить запрос',
                'Простая реализация',
              ],
              cons: [
                'Клиент не знает свой текущий баланс запросов',
                'Retry-After — грубая оценка (секунды)',
                'Недостаточно информации для умного back-off',
              ],
              bestWhen:
                'Простой API без необходимости детальной информации о лимитах.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: '429-with-headers',
              label: '429 + rate limit headers (X-RateLimit-*)',
              description:
                'HTTP 429 с заголовками X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.',
              pros: [
                'Клиент видит полную картину: лимит, остаток, время сброса',
                'Стандарт де-факто (GitHub, Stripe, Twitter API)',
                'Позволяет клиенту реализовать умный back-off',
              ],
              cons: [
                'Дополнительные вычисления для формирования заголовков',
                'Заголовки нужно добавлять ко всем ответам, не только к 429',
                'Нет единого стандарта — разные API используют разные имена',
              ],
              bestWhen:
                'Публичный API с внешними потребителями — стандарт индустрии.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 1,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'throttle-queue',
              label: 'Throttle (очередь + задержка)',
              description:
                'Запросы не отклоняются, а ставятся в очередь и выполняются с задержкой.',
              pros: [
                'Клиент всегда получает ответ — нет ошибок',
                'Сглаживание пиков нагрузки',
                'Подходит для batch-операций и webhook-ов',
              ],
              cons: [
                'Увеличивает латентность для клиента',
                'Очередь может расти бесконечно при перегрузке',
                'Сложнее реализовать, нужен механизм очереди',
              ],
              bestWhen:
                'Асинхронные API или внутренние сервисы, где допустима задержка, но не потеря запроса.',
              impact: {
                latency: -2,
                scalability: -1,
                consistency: 1,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'silent-drop',
              label: 'Silent drop',
              description:
                'Запрос молча отбрасывается без ответа (connection reset или timeout).',
              pros: [
                'Минимальная нагрузка на сервер — даже не формируется ответ',
                'Усложняет жизнь ботам — непонятно, что происходит',
                'Экономит bandwidth при DDoS',
              ],
              cons: [
                'Ужасный UX для легитимных клиентов',
                'Клиент не знает причину ошибки и может бесконечно ретраить',
                'Нарушает принципы REST',
                'Сложно отлаживать проблемы',
              ],
              bestWhen:
                'Только для DDoS-защиты на network level; никогда для application API.',
              impact: {
                latency: 2,
                scalability: 1,
                consistency: -2,
                complexity: -1,
                cost: -1,
              },
            },
          ],
        },
      ],
    },

    // ── Step 5: Scaling ───────────────────────────────────────────────
    {
      id: 'rl-scaling',
      title: 'Масштабирование',
      description:
        'Определите, как обеспечить производительность при высоком RPS и как управлять правилами rate limiting.',
      decisions: [
        {
          id: 'rl-perf',
          category: 'Производительность',
          question: 'Как обеспечить производительность?',
          multiSelect: true,
          options: [
            {
              id: 'lua-scripts',
              label: 'Lua scripts в Redis (атомарность)',
              description:
                'Вся логика проверки и обновления счётчика выполняется в одном Lua-скрипте на стороне Redis.',
              pros: [
                'Атомарность: проверка и инкремент в одной операции',
                'Нет race condition между read и write',
                'Один round-trip к Redis вместо нескольких',
              ],
              cons: [
                'Блокирует Redis на время выполнения скрипта',
                'Ограничения: скрипт должен работать с ключами одного слота в кластере',
                'Сложнее отлаживать, чем обычные команды',
              ],
              bestWhen:
                'Используется Redis, и нужна атомарная проверка лимита без race conditions.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 2,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'local-cache-async',
              label: 'Локальный кеш + async sync',
              description:
                'Часть проверок выполняется по локальному кешу, синхронизация с Redis — асинхронно.',
              pros: [
                'Снижает нагрузку на Redis в разы',
                'Минимальная латентность для большинства запросов',
                'Устойчивость при кратковременных отказах Redis',
              ],
              cons: [
                'Неточность лимитов в окне синхронизации',
                'Сложная логика merge локального и удалённого состояния',
                'Возможен overshoot при burst между sync-интервалами',
              ],
              bestWhen:
                'Экстремальный RPS, где допустим небольшой overshoot лимита.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -1,
                complexity: 1,
                cost: -1,
              },
            },
            {
              id: 'pipelining',
              label: 'Pipelining Redis commands',
              description:
                'Группировка нескольких Redis-команд в один пакет для снижения сетевого overhead.',
              pros: [
                'Снижает количество round-trip к Redis',
                'Повышает throughput при batch-обработке',
                'Простая оптимизация без изменения логики',
              ],
              cons: [
                'Нет атомарности между командами в pipeline (в отличие от Lua)',
                'Эффект заметен только при группировке нескольких операций',
                'Не помогает для single-request rate limiting',
              ],
              bestWhen:
                'Нужно проверять несколько лимитов (IP + API key + endpoint) за один вызов.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'race-tolerance',
              label: 'Race condition tolerance (допуск overshoot)',
              description:
                'Осознанный допуск небольшого превышения лимита ради производительности.',
              pros: [
                'Упрощает реализацию — не нужна строгая атомарность',
                'Максимальная производительность',
                'Достаточно для большинства бизнес-сценариев',
              ],
              cons: [
                'Лимит может быть превышен на 1-5%',
                'Не подходит для финансовых или compliance-сценариев',
                'Сложно объяснить клиентам, почему лимит «плывёт»',
              ],
              bestWhen:
                'Rate limit — рекомендательный, а не строгий; важнее скорость, чем точность.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -2,
                complexity: -2,
                cost: -1,
              },
            },
          ],
        },
        {
          id: 'rl-rules',
          category: 'Управление правилами',
          question: 'Как управлять правилами?',
          options: [
            {
              id: 'hardcoded',
              label: 'Hardcoded config',
              description:
                'Лимиты захардкожены в коде или конфигурации, деплоятся с приложением.',
              pros: [
                'Простота: лимиты прямо в коде',
                'Версионирование через git',
                'Нет дополнительных зависимостей',
              ],
              cons: [
                'Изменение лимита требует деплоя',
                'Невозможно быстро отреагировать на инцидент',
                'Нет UI для управления',
              ],
              bestWhen:
                'Редко меняющиеся лимиты в небольших проектах.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 1,
                complexity: -2,
                cost: -1,
              },
            },
            {
              id: 'config-hot-reload',
              label: 'Config file (hot reload)',
              description:
                'Лимиты хранятся в конфигурационном файле (YAML/JSON), перечитываются без перезапуска.',
              pros: [
                'Изменение без полного деплоя',
                'Версионирование через git (GitOps)',
                'Простая структура — легко понять и аудитировать',
              ],
              cons: [
                'Нет UI — нужен доступ к файловой системе или git',
                'Задержка между коммитом и применением',
                'Не подходит для per-client лимитов в масштабе тысяч клиентов',
              ],
              bestWhen:
                'Десятки правил, GitOps-подход, предсказуемые изменения.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 1,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'database-admin-ui',
              label: 'Database + admin UI',
              description:
                'Правила хранятся в базе данных; управление через административную панель.',
              pros: [
                'UI для менеджеров и поддержки',
                'Мгновенное применение изменений',
                'Per-client лимиты, A/B-тестирование правил',
              ],
              cons: [
                'Ещё одна система для разработки и поддержки',
                'Зависимость от базы данных при загрузке правил',
                'Риск случайных изменений через UI',
              ],
              bestWhen:
                'Большое количество клиентов с индивидуальными лимитами; есть команда поддержки.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 2,
                cost: 1,
              },
            },
            {
              id: 'feature-flags',
              label: 'Feature flags (LaunchDarkly-like)',
              description:
                'Правила управляются через систему feature flags с интерфейсом и API.',
              pros: [
                'Мгновенное включение/выключение правил',
                'A/B-тестирование лимитов',
                'Audit log из коробки',
              ],
              cons: [
                'Зависимость от внешнего SaaS или self-hosted решения',
                'Дополнительная стоимость (LaunchDarkly, Unleash)',
                'Избыточно для простых правил',
              ],
              bestWhen:
                'Уже используется система feature flags; нужно быстро экспериментировать с лимитами.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
            },
          ],
        },
      ],
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'rl-reliability',
      title: 'Надёжность',
      description:
        'Определите поведение при отказах и стратегию мониторинга rate limiter.',
      decisions: [
        {
          id: 'rl-failure',
          category: 'Обработка отказов',
          question: 'Что делать при отказе rate limiter?',
          options: [
            {
              id: 'fail-open',
              label: 'Fail open (пропускать все)',
              description:
                'При отказе rate limiter все запросы пропускаются без ограничений.',
              pros: [
                'Сервис продолжает работать — нет downtime',
                'Rate limiter не становится SPOF',
                'Стандартный подход (Cloudflare, Stripe)',
              ],
              cons: [
                'Временно нет защиты от злоупотреблений',
                'Backend может быть перегружен без лимитов',
                'Нужен мониторинг для быстрого обнаружения отказа',
              ],
              bestWhen:
                'Доступность сервиса важнее строгого соблюдения лимитов.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: -2,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: 'fail-closed',
              label: 'Fail closed (блокировать все)',
              description:
                'При отказе rate limiter все запросы блокируются.',
              pros: [
                'Гарантированная защита backend от перегрузки',
                'Безопасность: нет риска обхода лимитов',
                'Простая логика: нет limiter = нет доступа',
              ],
              cons: [
                'Rate limiter становится SPOF',
                'Полный downtime при любом сбое rate limiter',
                'Неприемлемо для большинства production-систем',
              ],
              bestWhen:
                'Критические системы, где перегрузка backend опаснее downtime (платёжные шлюзы).',
              impact: {
                latency: 0,
                scalability: -2,
                consistency: 2,
                complexity: -1,
                cost: 0,
              },
            },
            {
              id: 'local-fallback',
              label: 'Fallback to local limiter',
              description:
                'При отказе centralized store переключение на in-memory rate limiter.',
              pros: [
                'Graceful degradation — лимиты продолжают работать',
                'Не теряется ни доступность, ни защита',
                'Баланс между fail open и fail closed',
              ],
              cons: [
                'Лимиты неточны — каждый инстанс считает отдельно',
                'Сложная логика переключения',
                'Нужно тестировать оба режима',
              ],
              bestWhen:
                'Нужен компромисс: сохранить и доступность, и базовую защиту.',
              impact: {
                latency: 1,
                scalability: 0,
                consistency: -1,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'circuit-breaker',
              label: 'Circuit breaker',
              description:
                'Circuit breaker перед Redis: при серии ошибок переключается на fallback-режим.',
              pros: [
                'Автоматическое переключение без ручного вмешательства',
                'Защита от каскадных отказов',
                'Автоматическое восстановление (half-open state)',
              ],
              cons: [
                'Дополнительная сложность: параметры (threshold, timeout, half-open)',
                'Может некорректно срабатывать при network flapping',
                'Нужен fallback-режим в любом случае',
              ],
              bestWhen:
                'Зрелая система с потребностью в автоматическом восстановлении после сбоев.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 0,
              },
            },
          ],
        },
        {
          id: 'rl-observability',
          category: 'Мониторинг',
          question: 'Что мониторить?',
          multiSelect: true,
          options: [
            {
              id: 'rate-429',
              label: 'Rate of 429 responses',
              description:
                'Отслеживание количества и процента ответов 429 Too Many Requests.',
              pros: [
                'Основная метрика эффективности rate limiter',
                'Позволяет выявить рост отклонённых запросов',
                'Просто собирать через access log или middleware',
              ],
              cons: [
                'Не показывает причину — нужен drill-down по ключу',
                'Высокий rate 429 может быть нормой или проблемой — нужен контекст',
                'Задержка: метрика появляется после факта',
              ],
              bestWhen:
                'Базовая метрика — обязательна для любого rate limiter.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'redis-latency',
              label: 'Redis latency',
              description:
                'Мониторинг задержки обращений к Redis для rate limiting.',
              pros: [
                'Раннее обнаружение проблем с Redis',
                'Помогает планировать масштабирование Redis',
                'Коррелирует с общей латентностью API',
              ],
              cons: [
                'Нужна отдельная инструментация (Redis SLOWLOG, client-side timing)',
                'Шум: кратковременные спайки латентности — нормальны',
                'Не показывает root cause (сеть vs Redis vs Lua script)',
              ],
              bestWhen:
                'Redis используется как хранилище счётчиков — обязательная метрика.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'rules-distribution',
              label: 'Rules hit distribution',
              description:
                'Распределение срабатываний по правилам: какие лимиты срабатывают чаще.',
              pros: [
                'Выявление неправильно настроенных лимитов',
                'Понимание паттернов использования API',
                'Основа для оптимизации правил',
              ],
              cons: [
                'Требует structured logging с метаданными правил',
                'Большой объём данных при высоком RPS',
                'Нужна аналитическая система для обработки',
              ],
              bestWhen:
                'Много правил с разными лимитами; нужно оптимизировать конфигурацию.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'false-positive-rate',
              label: 'False positive rate',
              description:
                'Процент легитимных запросов, ошибочно заблокированных rate limiter.',
              pros: [
                'Ключевая бизнес-метрика: потеря дохода от заблокированных клиентов',
                'Помогает точно настроить лимиты',
                'Обнаружение проблем с ключом лимитирования (NAT/shared IP)',
              ],
              cons: [
                'Сложно определить, что запрос «легитимный»',
                'Требует корреляции с бизнес-метриками (конверсия, revenue)',
                'Может потребоваться A/B-тестирование для точной оценки',
              ],
              bestWhen:
                'Бизнес-критичные API, где блокировка легитимного клиента = потеря дохода.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 1,
                cost: 0,
              },
            },
          ],
        },
      ],
    },
  ],

  // ── Reference Solution ────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'rl-scope': ['server-side'],
      'rl-granularity': ['by-api-key'],
      'rl-algo': ['sliding-window-counter'],
      'rl-store': ['redis'],
      'rl-sync': ['centralized-store'],
      'rl-placement': ['api-gateway'],
      'rl-response': ['429-with-headers'],
      'rl-perf': ['lua-scripts', 'local-cache-async'],
      'rl-rules': ['config-hot-reload'],
      'rl-failure': ['fail-open'],
      'rl-observability': ['rate-429', 'redis-latency', 'rules-distribution', 'false-positive-rate'],
    },
    explanation:
      'Референсное решение отражает индустриальный стандарт, применяемый в Cloudflare, Stripe и Kong.\n\n' +
      '**Sliding Window Counter** — оптимальный баланс между точностью и производительностью. ' +
      'В отличие от Fixed Window, он не допускает 2x burst на границе окон. ' +
      'В отличие от Sliding Window Log, требует O(1) памяти на клиента.\n\n' +
      '**Redis** как централизованное хранилище — де-факто стандарт. ' +
      'Атомарные Lua-скрипты позволяют выполнить проверку и инкремент за один round-trip без race conditions. ' +
      'TTL автоматически очищает устаревшие счётчики.\n\n' +
      '**API Gateway** — естественное место для rate limiter: все запросы уже проходят через него, ' +
      'готовые плагины (Kong rate-limiting, Envoy ratelimit) сокращают time-to-market.\n\n' +
      '**Fail open** — стандарт индустрии. Rate limiter не должен становиться единой точкой отказа: ' +
      'лучше временно пропустить лишние запросы, чем заблокировать весь трафик.\n\n' +
      '**Локальный кеш + async sync** дополняет Lua-скрипты: снижает нагрузку на Redis при экстремальном RPS ' +
      'и обеспечивает graceful degradation при кратковременных сбоях Redis.',
    diagram:
      '┌─────────┐       ┌──────────────────────────┐       ┌──────────────────┐\n' +
      '│  Client  │──────▶│     API Gateway           │──────▶│  Backend Services │\n' +
      '│         │       │  ┌──────────────────────┐ │       │                  │\n' +
      '│         │◀──────│  │   Rate Limiter        │ │       │  Service A       │\n' +
      '│         │  429  │  │  (Sliding Window)     │ │       │  Service B       │\n' +
      '└─────────┘       │  └──────────┬───────────┘ │       │  Service C       │\n' +
      '                  └─────────────┼─────────────┘       └──────────────────┘\n' +
      '                                │\n' +
      '                  ┌─────────────▼─────────────┐\n' +
      '                  │         Redis              │\n' +
      '                  │  ┌─────────┐ ┌──────────┐ │\n' +
      '                  │  │Counters │ │Lua Script│ │\n' +
      '                  │  │  (TTL)  │ │(atomic)  │ │\n' +
      '                  │  └─────────┘ └──────────┘ │\n' +
      '                  └─────────────▲─────────────┘\n' +
      '                                │\n' +
      '                  ┌─────────────┴─────────────┐\n' +
      '                  │     Rules Config           │\n' +
      '                  │  (YAML / hot reload)       │\n' +
      '                  └───────────────────────────┘',
  },
  capacityEstimates: {
    default: [
      {
        label: 'Peak RPS',
        value: '10M RPS',
        formula: 'Given: API gateway peak load',
      },
      {
        label: 'Counter storage (Redis)',
        value: '~100 MB',
        formula:
          '1M unique API keys × 100 bytes per counter ≈ 100 MB',
      },
      {
        label: 'Rule evaluations/sec',
        value: '10M/sec',
        formula: '10M RPS = 10M rule checks/sec (one evaluation per request)',
      },
      {
        label: 'Latency budget',
        value: '<1 ms',
        formula:
          'Rate limiter adds <1 ms; total API budget ~100 ms → <1% overhead',
      },
      {
        label: 'Network bandwidth',
        value: '~2 GB/s',
        formula:
          '10M RPS × ~200 bytes avg request header = ~2 GB/s inspection',
      },
      {
        label: 'Memory per node (10 nodes)',
        value: '~50 MB',
        formula:
          '100 MB total / 10 nodes = 10 MB per node + overhead ≈ 50 MB',
      },
    ],
  },
};
