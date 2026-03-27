import type { Scenario } from './types';

export const urlShortenerScenario: Scenario = {
  id: 'url-shortener',
  title: 'URL Shortener',
  description:
    'Спроектируйте сервис сокращения ссылок (аналог Bitly/TinyURL) для 100 миллионов активных пользователей в день. Система должна генерировать короткие уникальные ссылки, выполнять редирект с минимальной задержкой и опционально собирать аналитику переходов.',
  difficulty: 'middle',
  steps: [
    // ────────────────────────────────────────────
    // Step 1: Requirements Clarification
    // ────────────────────────────────────────────
    {
      id: 'url-requirements',
      title: 'Уточнение требований',
      description:
        'Определите масштаб системы и набор функциональных требований. От этого зависят все последующие архитектурные решения.',
      decisions: [
        {
          id: 'url-scale',
          category: 'Масштаб',
          question: 'Какой масштаб системы?',
          options: [
            {
              id: 'small-scale',
              label: 'Small (1M DAU)',
              description:
                'Небольшой сервис: ~1 миллион активных пользователей в день, ~10 миллионов ссылок, ~100 редиректов/сек в пике.',
              pros: [
                'Минимальные затраты на инфраструктуру',
                'Простая архитектура — один сервер справится с нагрузкой',
                'Быстрый запуск и итерации',
              ],
              cons: [
                'Ограниченный потенциал роста без переархитектуры',
                'Не подходит для глобального продукта',
                'Один сервер — единая точка отказа',
              ],
              bestWhen:
                'Внутренний корпоративный инструмент или MVP с ограниченной аудиторией.',
              impact: {
                latency: 1,
                scalability: -2,
                consistency: 1,
                complexity: -2,
                cost: -2,
              },
              capacityImpact: [
                { label: 'DAU / MAU', value: '1M DAU', formula: 'Small scale: 1M DAU' },
                { label: 'Write RPS', value: '~1.2', formula: '1M × 0.1 / 86400 ≈ 1.2 RPS' },
                { label: 'Read RPS', value: '~120', formula: 'Read:Write = 100:1 → 1.2 × 100 = 120 RPS' },
                { label: 'Storage (1 year)', value: '~18 GB', formula: '1M × 0.1 × 365 = 36.5M URLs × 500 bytes ≈ 18 GB' },
                { label: 'Cache memory (20% hot URLs)', value: '~1 GB', formula: '36.5M × 20% × 500 bytes ≈ 3.6 GB, but only active subset ≈ 1 GB' },
                { label: 'Bandwidth (outbound)', value: '~60 KB/s', formula: '120 RPS × 500 bytes ≈ 60 KB/s' },
              ],
            },
            {
              id: 'medium-scale',
              label: 'Medium (100M DAU)',
              description:
                'Крупный сервис: ~100 миллионов DAU, ~1 миллиард ссылок, ~10 000 редиректов/сек в пике. Типичный масштаб Bitly.',
              pros: [
                'Покрывает большинство реальных бизнес-сценариев',
                'Требует продуманного кэширования и шардирования',
                'Оптимальный баланс сложности и функциональности',
              ],
              cons: [
                'Нужна распределённая инфраструктура',
                'Требуется кэширование и партиционирование данных',
                'Значительные расходы на инфраструктуру',
              ],
              bestWhen:
                'Продуктовый сервис с глобальной аудиторией, аналог Bitly или TinyURL.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'large-scale',
              label: 'Large (1B DAU)',
              description:
                'Гипермасштаб: ~1 миллиард DAU, ~10 миллиардов ссылок, ~100 000 редиректов/сек. Уровень встроенного сервиса в соцсети.',
              pros: [
                'Система выдерживает экстремальные нагрузки',
                'Готовность к вирусному контенту и DDoS',
                'Глобальное покрытие с минимальной задержкой',
              ],
              cons: [
                'Очень высокая сложность проектирования и эксплуатации',
                'Значительные затраты на мульти-региональную инфраструктуру',
                'Требуется большая команда инженеров для поддержки',
              ],
              bestWhen:
                'Встроенный сервис в крупной платформе (Twitter, Facebook) или глобальный SaaS на уровне t.co.',
              impact: {
                latency: -1,
                scalability: 2,
                consistency: -1,
                complexity: 2,
                cost: 2,
              },
              capacityImpact: [
                { label: 'DAU / MAU', value: '1B DAU', formula: 'Large scale: 1B DAU' },
                { label: 'Write RPS', value: '~1.2K', formula: '1B × 0.1 / 86400 ≈ 1,160 RPS' },
                { label: 'Read RPS', value: '~116K', formula: 'Read:Write = 100:1 → 1,160 × 100 ≈ 116K RPS' },
                { label: 'Storage (1 year)', value: '~18 TB', formula: '1B × 0.1 × 365 = 36.5B URLs × 500 bytes ≈ 18 TB' },
                { label: 'Cache memory (20% hot URLs)', value: '~1 TB', formula: '116K RPS × 86400 ≈ 10B reads/day, top 20% ≈ 2B URLs × 500 bytes ≈ 1 TB' },
                { label: 'Bandwidth (outbound)', value: '~58 MB/s', formula: '116K RPS × 500 bytes ≈ 58 MB/s' },
              ],
            },
          ],
        },
        {
          id: 'url-features',
          category: 'Функциональность',
          question: 'Какие дополнительные фичи поддерживать?',
          multiSelect: true,
          options: [
            {
              id: 'analytics',
              label: 'Аналитика кликов',
              description:
                'Отслеживание количества переходов, географии, источников трафика, устройств (referrer, user-agent, IP-геолокация).',
              pros: [
                'Ключевая бизнес-ценность — пользователи видят статистику',
                'Монетизация через платные тарифы с расширенной аналитикой',
                'Данные помогают обнаруживать злоупотребления',
              ],
              cons: [
                'Дополнительная запись на каждый редирект увеличивает задержку',
                'Объём данных аналитики растёт линейно с трафиком',
                'Требуется отдельный pipeline для агрегации (Kafka, ClickHouse)',
              ],
              bestWhen:
                'Коммерческий продукт, где аналитика — основная ценность для пользователей.',
              impact: {
                latency: -1,
                scalability: -1,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'Analytics write RPS', value: '= Read RPS', formula: 'Каждый редирект = 1 событие аналитики. При 11.6K read RPS → 11.6K analytics writes/sec' },
                { label: 'Analytics storage (1 year)', value: '~36 TB', formula: '11.6K RPS × 86400 × 365 × 100 bytes (timestamp, short_url, IP, referrer, UA) ≈ 36 TB/year' },
                { label: 'Kafka throughput', value: '~1.2 MB/s', formula: '11.6K events/sec × 100 bytes ≈ 1.2 MB/s → 1 Kafka partition достаточно' },
                { label: 'ClickHouse cluster', value: '3+ nodes', formula: '36 TB/year ÷ 12 TB per node (сжатие ~10×) ≈ 3 nodes с репликацией' },
              ],
            },
            {
              id: 'custom-aliases',
              label: 'Пользовательские алиасы',
              description:
                'Позволяет пользователям задавать собственные короткие ключи (например, bit.ly/my-brand).',
              pros: [
                'Брендирование ссылок повышает CTR',
                'Запоминаемые URL для маркетинговых кампаний',
                'Конкурентное преимущество продукта',
              ],
              cons: [
                'Необходима проверка уникальности с гонками (race conditions)',
                'Фильтрация нецензурных и зарезервированных слов',
                'Увеличивает пространство ключей и усложняет валидацию',
              ],
              bestWhen:
                'Продукт для маркетологов и брендов, где кастомные ссылки — платная фича.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: -1,
                complexity: 1,
                cost: 0,
              },
              capacityImpact: [
                { label: 'Uniqueness check RPS', value: '~116 RPS', formula: 'Каждый write с custom alias требует lookup: равен Write RPS' },
                { label: 'Bloom filter memory', value: '~500 MB', formula: '3.65B URLs × 1 bit × 10 (FP rate 1%) ≈ 4.5 GB, или ~500 MB при вероятностной структуре' },
              ],
            },
            {
              id: 'link-expiration',
              label: 'Срок действия ссылок',
              description:
                'Автоматическое удаление или деактивация ссылок через заданное время (TTL).',
              pros: [
                'Экономия хранилища — старые ссылки удаляются автоматически',
                'Повышает безопасность для временных ссылок',
                'Освобождает короткие ключи для повторного использования',
              ],
              cons: [
                'Нужен фоновый процесс очистки (cron / TTL в БД)',
                'Пользователи могут потерять ссылки без предупреждения',
                'Кэш должен учитывать TTL ссылок',
              ],
              bestWhen:
                'Сервис с ограниченным пространством ключей или требованиями безопасности.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: -1,
              },
              capacityImpact: [
                { label: 'Storage savings', value: '~30-50%', formula: 'При avg TTL 1 год: хранилище стабилизируется на ~1.8 TB вместо бесконечного роста' },
                { label: 'Cleanup job', value: '~4.2K deletes/sec', formula: '3.65B URLs/year ÷ 365 ÷ 86400 ≈ 4.2K expired URLs/sec to delete' },
              ],
            },
            {
              id: 'qr-codes',
              label: 'QR-коды',
              description:
                'Автоматическая генерация QR-кода для каждой короткой ссылки.',
              pros: [
                'Востребовано в офлайн-маркетинге и ритейле',
                'Простая реализация с помощью готовых библиотек',
                'Дополнительная ценность для пользователей без больших затрат',
              ],
              cons: [
                'Генерация изображений увеличивает нагрузку на CPU',
                'Нужно хранилище для изображений (S3/CDN)',
                'Необходимо инвалидировать QR при изменении ссылки',
              ],
              bestWhen:
                'Продукт ориентирован на офлайн-маркетинг и физические носители.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'QR image storage', value: '~73 GB/year', formula: '3.65B URLs × 20% используют QR × 100 bytes (SVG) ≈ 73 GB' },
                { label: 'QR generation CPU', value: '~23 RPS', formula: '116 write RPS × 20% QR requests ≈ 23 QR generations/sec, ~50ms each' },
              ],
            },
          ],
        },
      ],
      tip: 'На собеседовании всегда уточняйте масштаб и фичи до начала проектирования. Для URL shortener ключевой вопрос — соотношение чтений к записям (обычно 100:1).',
    },

    // ────────────────────────────────────────────
    // Step 2: API Design
    // ────────────────────────────────────────────
    {
      id: 'url-api',
      title: 'Проектирование API',
      description:
        'Определите протокол взаимодействия и семантику HTTP-редиректов. Выбор кода редиректа — один из ключевых trade-off в URL shortener.',
      decisions: [
        {
          id: 'url-protocol',
          category: 'Протокол',
          question: 'Какой протокол для API?',
          options: [
            {
              id: 'rest',
              label: 'REST',
              description:
                'Классический REST API поверх HTTP/JSON: POST /api/urls для создания, GET /{shortKey} для редиректа.',
              pros: [
                'Стандартный и понятный — легко интегрировать любому клиенту',
                'Отлично работает с CDN и кэшированием',
                'Широчайшая экосистема инструментов и библиотек',
              ],
              cons: [
                'Over-fetching / under-fetching данных',
                'Нет строгой типизации контракта без дополнительных инструментов',
                'Для сложных запросов аналитики потребуется много эндпоинтов',
              ],
              bestWhen:
                'Публичный API для URL shortener — стандарт индустрии. Bitly, TinyURL, rebrandly используют REST.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'grpc',
              label: 'gRPC',
              description:
                'Бинарный протокол на базе Protocol Buffers и HTTP/2. Используется для межсервисного взаимодействия.',
              pros: [
                'Высокая производительность благодаря бинарной сериализации',
                'Строго типизированные контракты через .proto файлы',
                'Поддержка стриминга и двунаправленной связи',
              ],
              cons: [
                'Не работает напрямую из браузера без grpc-web прокси',
                'Сложнее отлаживать — бинарный формат не читаем человеком',
                'Избыточен для простого CRUD-сервиса',
              ],
              bestWhen:
                'Внутреннее межсервисное взаимодействие или если URL shortener — часть большой микросервисной платформы с gRPC-стеком.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 1,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'graphql',
              label: 'GraphQL',
              description:
                'Язык запросов для API, позволяющий клиенту запрашивать только нужные поля.',
              pros: [
                'Клиент запрашивает ровно те данные, что ему нужны',
                'Единый эндпоинт для всех операций',
                'Удобно для сложных запросов аналитики с вложенными данными',
              ],
              cons: [
                'Избыточная сложность для простых операций создания/редиректа',
                'Сложнее кэшировать на уровне HTTP (один URL для всех запросов)',
                'N+1 проблема при неосторожной реализации резолверов',
              ],
              bestWhen:
                'Если URL shortener — часть большего продукта с единым GraphQL gateway и сложной аналитической панелью.',
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
        {
          id: 'url-redirect',
          category: 'Редирект',
          question: 'Какой HTTP-код для редиректа?',
          options: [
            {
              id: '301-redirect',
              label: '301 Moved Permanently',
              description:
                'Браузер кэширует редирект навсегда. Последующие запросы не доходят до сервера — браузер редиректит локально.',
              pros: [
                'Минимальная нагрузка на сервер — браузер кэширует редирект',
                'Мгновенный повторный редирект для пользователя',
                'Подходит для постоянных ссылок, которые никогда не меняются',
              ],
              cons: [
                'Невозможно отслеживать повторные клики — они не доходят до сервера',
                'Нельзя изменить destination URL после первого перехода пользователя',
                'Аналитика будет неполной — только первые переходы',
              ],
              bestWhen:
                'Сервис без аналитики, где главная цель — минимальная задержка и снижение нагрузки. Пример: внутренний корпоративный shortener.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: 0,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: '302-redirect',
              label: '302 Found (Temporary)',
              description:
                'Браузер не кэширует редирект. Каждый клик проходит через сервер, что позволяет собирать аналитику.',
              pros: [
                'Каждый переход фиксируется — полная аналитика кликов',
                'Можно менять destination URL в любой момент',
                'Стандартный подход Bitly, TinyURL и большинства shortener-ов',
              ],
              cons: [
                'Каждый клик создаёт нагрузку на сервер',
                'Чуть выше задержка при повторных переходах',
                'Требуется масштабирование под весь объём трафика',
              ],
              bestWhen:
                'Коммерческий URL shortener с аналитикой. Это выбор Bitly — аналитика является основным продуктом.',
              impact: {
                latency: -1,
                scalability: -1,
                consistency: 1,
                complexity: 0,
                cost: 1,
              },
            },
          ],
        },
      ],
      tip: 'Выбор между 301 и 302 — классический вопрос на собеседовании по URL shortener. Объясните trade-off: 301 снижает нагрузку, но убивает аналитику. Bitly использует 301 для бесплатных ссылок и 307 для платных с аналитикой.',
    },

    // ────────────────────────────────────────────
    // Step 3: Data Model & Storage
    // ────────────────────────────────────────────
    {
      id: 'url-storage',
      title: 'Модель данных и хранилище',
      description:
        'Выберите базу данных и стратегию генерации коротких ключей. При 100M DAU и соотношении чтений к записям 100:1 хранилище должно быть оптимизировано под чтение.',
      decisions: [
        {
          id: 'url-db',
          category: 'База данных',
          question: 'Какую БД использовать?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL',
              description:
                'Реляционная СУБД с ACID-транзакциями, мощным SQL, расширениями и отличной экосистемой.',
              pros: [
                'Полная ACID-гарантия — уникальность ключей без гонок',
                'Мощный SQL для аналитических запросов',
                'Зрелая экосистема: pgBouncer, pg_partman, логическая репликация',
              ],
              cons: [
                'Горизонтальное шардирование сложнее, чем в NoSQL',
                'При масштабе 1B+ записей требуется Citus или ручное шардирование',
                'Write-amplification при большом количестве индексов',
              ],
              bestWhen:
                'Масштаб до ~100M ссылок, нужна транзакционная консистентность и аналитика по SQL.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
              capacityImpact: [
                { label: 'DB Storage overhead', value: '+30-40%', formula: 'PostgreSQL: indexes + WAL + MVCC overhead ≈ 30-40% extra storage' },
                { label: 'Max single node', value: '~2-5 TB', formula: 'PostgreSQL single node comfortable limit before sharding needed' },
              ],
            },
            {
              id: 'mysql',
              label: 'MySQL',
              description:
                'Популярная реляционная СУБД. Используется Twitter для t.co — один из крупнейших URL shortener-ов.',
              pros: [
                'Проверена на масштабе Twitter (t.co) и Facebook',
                'Хорошая производительность на чтение с InnoDB Buffer Pool',
                'Простая master-slave репликация для read-реплик',
              ],
              cons: [
                'Менее мощный SQL по сравнению с PostgreSQL',
                'Шардирование требует Vitess или ProxySQL',
                'Ограниченные типы данных и расширения',
              ],
              bestWhen:
                'Команда с опытом MySQL, готовая инфраструктура шардирования (Vitess).',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 2,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'dynamodb',
              label: 'DynamoDB',
              description:
                'Managed NoSQL от AWS. Key-value хранилище с автоматическим шардированием и предсказуемой задержкой.',
              pros: [
                'Автоматическое горизонтальное масштабирование — не нужно управлять шардами',
                'Предсказуемая задержка < 10 мс при любой нагрузке',
                'Managed сервис — нет operational overhead на администрирование БД',
                'Встроенный TTL для автоматического удаления истёкших ссылок',
              ],
              cons: [
                'Eventual consistency по умолчанию (strong consistency стоит 2x)',
                'Ограниченные возможности запросов — только по ключу и sort key',
                'Vendor lock-in на AWS',
                'Стоимость растёт линейно с RCU/WCU при пиках',
              ],
              bestWhen:
                'Read-heavy workload в AWS. Идеально для URL shortener: простая key-value модель, предсказуемая задержка, автоскейлинг.',
              impact: {
                latency: 1,
                scalability: 2,
                consistency: -1,
                complexity: -1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'DB Storage overhead', value: '+15-20%', formula: 'DynamoDB: GSI + metadata overhead ≈ 15-20%' },
                { label: 'DB Cost estimate', value: '~$1,500/mo', formula: '11.6K RPS reads ($0.25/M) + 116 RPS writes ($1.25/M) + 1.8 TB storage ($0.25/GB)' },
              ],
            },
            {
              id: 'cassandra',
              label: 'Apache Cassandra',
              description:
                'Распределённая NoSQL БД с линейным масштабированием. Спроектирована для write-heavy нагрузок, но эффективна и для чтений по ключу.',
              pros: [
                'Линейное горизонтальное масштабирование без единой точки отказа',
                'Высокая доступность — кластер работает при потере нескольких нод',
                'Отличная производительность при чтении по partition key',
              ],
              cons: [
                'Операционная сложность: компакшен, ремонт, тюнинг consistency level',
                'Нет ACID-транзакций — нужны lightweight transactions для уникальности',
                'Неэффективна для произвольных запросов — требует денормализации',
              ],
              bestWhen:
                'Масштаб 1B+ ссылок, мульти-датацентровая репликация, команда с опытом Cassandra.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: -1,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'DB Storage overhead', value: '+200-300%', formula: 'Cassandra: replication factor 3 = 3× data + compaction overhead' },
                { label: 'Min cluster size', value: '6+ nodes', formula: 'RF=3, 2 datacenters minimum = 6 nodes for production' },
              ],
            },
          ],
        },
        {
          id: 'url-keygen',
          category: 'Генерация ключей',
          question: 'Как генерировать короткие ключи?',
          options: [
            {
              id: 'base62-counter',
              label: 'Base62 от счётчика',
              description:
                'Атомарный инкрементальный счётчик (в БД или ZooKeeper), значение которого кодируется в Base62 (a-z, A-Z, 0-9).',
              pros: [
                'Гарантия уникальности без коллизий',
                'Короткие ключи — длина растёт логарифмически',
                'Простая и понятная логика',
              ],
              cons: [
                'Счётчик — единая точка отказа, требуется координация',
                'Предсказуемые ключи — можно перебирать все URL (security concern)',
                'Сложно масштабировать на несколько инстансов без диапазонов',
              ],
              bestWhen:
                'Небольшой масштаб или архитектура с выделенным координатором (ZooKeeper, Redis INCR).',
              impact: {
                latency: 0,
                scalability: -1,
                consistency: 2,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'hash-truncation',
              label: 'MD5/SHA256 + обрезка',
              description:
                'Хэшируем оригинальный URL, берём первые 6-8 символов Base62-представления хэша.',
              pros: [
                'Не требует координации — stateless генерация',
                'Один и тот же URL всегда даёт один и тот же ключ (дедупликация)',
                'Простая реализация в любом языке',
              ],
              cons: [
                'Коллизии неизбежны при обрезке — нужна retry-логика',
                'Один URL = один ключ — нельзя создать несколько коротких ссылок для одного URL',
                'Длина ключа ограничена вероятностью коллизий (birthday paradox)',
              ],
              bestWhen:
                'Нужна дедупликация (один URL → одна короткая ссылка) и нет требований к кастомным алиасам.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'kgs',
              label: 'Key Generation Service (KGS)',
              description:
                'Отдельный сервис заранее генерирует пул уникальных ключей и раздаёт их app-серверам пачками. Подход, используемый в production у Bitly.',
              pros: [
                'Нет коллизий — ключи уникальны по построению',
                'Нет координации в момент запроса — ключ берётся из локального буфера',
                'Масштабируется горизонтально — каждый сервер получает свой пул',
                'Непредсказуемые ключи — нельзя перебрать (security)',
              ],
              cons: [
                'Дополнительный сервис для поддержки и мониторинга',
                'Часть ключей может быть потеряна при падении app-сервера',
                'Нужна отдельная БД для хранения неиспользованных ключей',
              ],
              bestWhen:
                'Production-grade URL shortener при масштабе 100M+ DAU. Стандартный подход Bitly и аналогов.',
              impact: {
                latency: 1,
                scalability: 2,
                consistency: 1,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'uuid-base62',
              label: 'UUID + Base62',
              description:
                'Генерируем UUID v4 (128 бит) и кодируем в Base62. Результат — 22-символьная строка, можно обрезать.',
              pros: [
                'Полностью децентрализованная генерация без координации',
                'Стандартная библиотека в любом языке',
                'Крайне низкая вероятность коллизий',
              ],
              cons: [
                'Длинные ключи — 22 символа вместо 6-7, что противоречит идее shortener',
                'Обрезка до 7 символов возвращает проблему коллизий',
                'Нет дедупликации — один URL может получить множество ключей',
              ],
              bestWhen:
                'Прототип или сервис, где длина ключа не критична (внутренний инструмент).',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: -1,
                cost: -1,
              },
            },
          ],
        },
      ],
      tip: 'На собеседовании обязательно упомяните Key Generation Service — это показывает знание production-подходов. Объясните, почему Base62 (62^7 ≈ 3.5 триллиона комбинаций) достаточно для большинства сценариев.',
    },

    // ────────────────────────────────────────────
    // Step 4: High-Level Architecture
    // ────────────────────────────────────────────
    {
      id: 'url-architecture',
      title: 'Высокоуровневая архитектура',
      description:
        'Определите компоненты системы: балансировщик нагрузки, архитектуру сервисов и их взаимодействие.',
      decisions: [
        {
          id: 'url-lb',
          category: 'Балансировка нагрузки',
          question: 'Какой балансировщик нагрузки?',
          options: [
            {
              id: 'nginx',
              label: 'Nginx (L7)',
              description:
                'Reverse proxy на уровне приложения (L7). Понимает HTTP, может делать SSL termination, маршрутизацию по URL, rate limiting.',
              pros: [
                'Гибкая маршрутизация по URL, заголовкам, cookies',
                'Встроенный SSL termination и статический контент',
                'Можно использовать как кэш для редиректов',
              ],
              cons: [
                'Ниже throughput по сравнению с L4 балансировщиками',
                'Требует ручной настройки и обновления конфигурации',
                'Один инстанс — потолок ~50К RPS для L7',
              ],
              bestWhen:
                'Небольшой-средний масштаб, нужна маршрутизация по URL или совмещение с кэшированием.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: -1,
              },
            },
            {
              id: 'haproxy',
              label: 'HAProxy (L4/L7)',
              description:
                'Высокопроизводительный балансировщик нагрузки. Поддерживает L4 (TCP) и L7 (HTTP) режимы.',
              pros: [
                'Очень высокая производительность — до 1M+ concurrent connections',
                'Продвинутые health checks и circuit breaking',
                'Мощная система ACL для маршрутизации',
              ],
              cons: [
                'Более сложная конфигурация по сравнению с Nginx',
                'Нет встроенной раздачи статического контента',
                'Требует отдельной инфраструктуры для управления',
              ],
              bestWhen:
                'Высоконагруженная система, где важна максимальная производительность балансировки.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 0,
              },
            },
            {
              id: 'cloud-lb',
              label: 'Cloud LB (AWS ALB/NLB)',
              description:
                'Managed балансировщик облачного провайдера. ALB для L7 (HTTP), NLB для L4 (TCP). Автоматическое масштабирование.',
              pros: [
                'Нулевой operational overhead — полностью managed',
                'Автоматическое масштабирование под нагрузку',
                'Интеграция с auto-scaling groups, WAF, ACM (SSL)',
              ],
              cons: [
                'Vendor lock-in на облачного провайдера',
                'Выше стоимость по сравнению с self-hosted решениями',
                'Меньше контроля над тонкой настройкой',
              ],
              bestWhen:
                'Инфраструктура в облаке, команда хочет минимизировать operational burden. Стандарт для стартапов и среднего бизнеса.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: 0,
                complexity: -2,
                cost: 1,
              },
            },
          ],
        },
        {
          id: 'url-service-arch',
          category: 'Архитектура сервисов',
          question: 'Архитектура сервисов?',
          options: [
            {
              id: 'monolith',
              label: 'Монолит',
              description:
                'Единое приложение, содержащее всю логику: создание ссылок, редирект, аналитика.',
              pros: [
                'Простота разработки и деплоя — один артефакт',
                'Нет сетевых вызовов между компонентами — минимальная задержка',
                'Проще тестирование и отладка',
                'Достаточен для URL shortener — бизнес-логика проста',
              ],
              cons: [
                'Масштабирование только целиком — нельзя отдельно масштабировать read-path',
                'Большая кодовая база со временем усложняется',
                'Деплой всего приложения при любом изменении',
              ],
              bestWhen:
                'URL shortener — простой сервис. Монолит оптимален для масштаба до 100M DAU при правильном кэшировании.',
              impact: {
                latency: 1,
                scalability: -1,
                consistency: 1,
                complexity: -2,
                cost: -1,
              },
            },
            {
              id: 'modular-monolith',
              label: 'Модульный монолит',
              description:
                'Единое приложение с чётко разделёнными модулями: URL-модуль, Analytics-модуль, Auth-модуль. Общая БД, но изолированные границы.',
              pros: [
                'Чёткие границы модулей при простоте деплоя',
                'Легко извлечь модуль в микросервис при необходимости',
                'Нет network overhead — вызовы через интерфейсы в памяти',
              ],
              cons: [
                'Требует дисциплины для поддержания границ модулей',
                'Всё ещё деплоится как единое целое',
                'Масштабирование модулей независимо невозможно',
              ],
              bestWhen:
                'Растущая команда, планируется добавление фич (аналитика, API для партнёров), но микросервисы пока избыточны.',
              impact: {
                latency: 1,
                scalability: 0,
                consistency: 1,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'microservices',
              label: 'Микросервисы',
              description:
                'Отдельные сервисы: URL Service (CRUD), Redirect Service (чтение + редирект), Analytics Service (сбор и агрегация), KGS Service.',
              pros: [
                'Независимое масштабирование — redirect service можно масштабировать отдельно',
                'Изолированные деплои — обновление аналитики не влияет на редирект',
                'Разные технологии для разных задач (Go для redirect, Python для analytics)',
              ],
              cons: [
                'Значительный operational overhead: service mesh, tracing, мониторинг',
                'Сетевые вызовы между сервисами увеличивают задержку',
                'Сложность distributed system: saga, eventual consistency, debugging',
                'Избыточно для простой бизнес-логики URL shortener',
              ],
              bestWhen:
                'Масштаб 1B+ DAU, большая команда (10+ инженеров), разные требования к масштабированию read и write путей.',
              impact: {
                latency: -1,
                scalability: 2,
                consistency: -1,
                complexity: 2,
                cost: 2,
              },
            },
          ],
        },
      ],
      tip: 'Не усложняйте архитектуру URL shortener. Это простой сервис с одной основной операцией (key→URL lookup). Монолит + кэш + шардированная БД покрывает масштаб до сотен миллионов DAU.',
    },

    // ────────────────────────────────────────────
    // Step 5: Scaling & Performance
    // ────────────────────────────────────────────
    {
      id: 'url-scaling',
      title: 'Масштабирование и производительность',
      description:
        'URL shortener — read-heavy система (100:1 соотношение чтений к записям). Кэширование и партиционирование — ключ к производительности.',
      decisions: [
        {
          id: 'url-cache',
          category: 'Кэширование',
          question: 'Стратегия кэширования?',
          options: [
            {
              id: 'no-cache',
              label: 'Без кэша',
              description:
                'Каждый запрос на редирект идёт напрямую в базу данных.',
              pros: [
                'Максимальная простота — нет проблем с инвалидацией',
                'Данные всегда актуальны — нет stale cache',
                'Нет дополнительных компонентов в архитектуре',
              ],
              cons: [
                'При 10К+ RPS БД станет бутылочным горлышком',
                'Высокая задержка на каждый запрос (сетевой вызов к БД)',
                'Не подходит для production URL shortener при любом значимом масштабе',
              ],
              bestWhen:
                'Прототип или внутренний инструмент с минимальной нагрузкой (< 100 RPS).',
              impact: {
                latency: -2,
                scalability: -2,
                consistency: 2,
                complexity: -2,
                cost: -1,
              },
              capacityImpact: [
                { label: 'Cache memory', value: '0', formula: 'No caching — all reads hit database directly' },
                { label: 'DB read load', value: '100%', formula: 'Database handles all 11.6K RPS reads' },
              ],
            },
            {
              id: 'local-cache',
              label: 'Локальный in-memory кэш',
              description:
                'Кэш в памяти процесса (LRU-кэш, Caffeine, Guava Cache). Каждый инстанс приложения хранит свой кэш.',
              pros: [
                'Минимальная задержка — данные в памяти процесса',
                'Нет сетевого вызова к внешнему кэшу',
                'Простая реализация — стандартная библиотека',
              ],
              cons: [
                'Дублирование данных между инстансами — неэффективное использование памяти',
                'Инвалидация кэша между инстансами не синхронизирована',
                'Кэш теряется при рестарте процесса (cold start)',
              ],
              bestWhen:
                'Дополнение к Redis-кэшу для hot keys или единственный уровень кэша при небольшом масштабе.',
              impact: {
                latency: 2,
                scalability: 0,
                consistency: -1,
                complexity: -1,
                cost: -1,
              },
            },
            {
              id: 'redis-cache',
              label: 'Redis (распределённый кэш)',
              description:
                'Централизованный кэш Redis/ElastiCache, общий для всех app-серверов. Cache-aside pattern: проверяем кэш → при промахе читаем из БД → сохраняем в кэш.',
              pros: [
                'Общий кэш для всех инстансов — консистентные данные',
                'Высокая производительность: ~100К ops/sec на один инстанс',
                'Поддержка TTL для автоматической инвалидации',
              ],
              cons: [
                'Дополнительный сетевой вызов (~0.5 мс) по сравнению с локальным кэшем',
                'Ещё один компонент для мониторинга и поддержки',
                'Redis cluster добавляет operational complexity',
              ],
              bestWhen:
                'Средний масштаб (до ~50К RPS), когда одного уровня кэша достаточно.',
              impact: {
                latency: 1,
                scalability: 1,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
              capacityImpact: [
                { label: 'Cache memory', value: '~100 GB', formula: 'Top 20% hot URLs cached: ~200M × 500 bytes ≈ 100 GB Redis' },
                { label: 'DB read load', value: '~20%', formula: 'Cache hit ratio ~80% → only ~2.3K RPS hit DB' },
                { label: 'Redis nodes', value: '3-5', formula: '100 GB / 25 GB per node = 4 nodes + 1 replica' },
              ],
            },
            {
              id: 'multi-layer-cache',
              label: 'Многоуровневый кэш (Local + Redis)',
              description:
                'Двухуровневый кэш: L1 — локальный LRU-кэш в памяти для hot keys, L2 — Redis для полного набора популярных ссылок. Запрос проверяет L1 → L2 → БД.',
              pros: [
                'Минимальная задержка для самых популярных ссылок (L1 hit)',
                'Высокий общий cache hit ratio (L1 + L2)',
                'Снижение нагрузки на Redis за счёт L1',
              ],
              cons: [
                'Сложная инвалидация — нужно инвалидировать оба уровня',
                'Потенциально stale данные в L1 между инстансами',
                'Больше кода и конфигурации для управления двумя уровнями',
              ],
              bestWhen:
                'Production URL shortener при 100M+ DAU. Стандартный подход для read-heavy систем с горячим подмножеством данных (закон Парето: 20% ссылок = 80% трафика).',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -1,
                complexity: 1,
                cost: 1,
              },
              capacityImpact: [
                { label: 'L1 cache (local)', value: '~2 GB/server', formula: 'In-process cache: top 1% URLs ≈ 2M × 500B × per app server' },
                { label: 'L2 cache (Redis)', value: '~100 GB', formula: 'Distributed Redis: top 20% ≈ 100 GB' },
                { label: 'DB read load', value: '~5%', formula: 'L1 hit ~60%, L2 hit ~35% → only ~5% reach DB ≈ 580 RPS' },
              ],
            },
          ],
        },
        {
          id: 'url-partitioning',
          category: 'Партиционирование',
          question: 'Стратегия партиционирования данных?',
          options: [
            {
              id: 'no-partitioning',
              label: 'Без партиционирования',
              description:
                'Все данные в одной БД без разделения. Вертикальное масштабирование (bigger server).',
              pros: [
                'Простота — нет маршрутизации запросов',
                'ACID-транзакции без ограничений',
                'Нет проблем с cross-shard queries',
              ],
              cons: [
                'Потолок масштабирования — один сервер ограничен по IOPS и хранилищу',
                'Единая точка отказа (SPOF)',
                'При 1B+ записей производительность деградирует',
              ],
              bestWhen:
                'Масштаб до ~10M ссылок. Один PostgreSQL с read-репликами может обработать до ~10К RPS.',
              impact: {
                latency: 0,
                scalability: -2,
                consistency: 2,
                complexity: -2,
                cost: -1,
              },
            },
            {
              id: 'hash-sharding',
              label: 'Hash-based шардирование',
              description:
                'Данные распределяются по шардам на основе хэша от короткого ключа: shard = hash(shortKey) % N. Consistent hashing для минимизации перебалансировки.',
              pros: [
                'Равномерное распределение данных и нагрузки',
                'Горизонтальное масштабирование — добавление шардов увеличивает throughput',
                'Consistent hashing минимизирует перемещение данных при добавлении нод',
              ],
              cons: [
                'Range-запросы невозможны (например, все URL пользователя)',
                'Добавление шардов требует ребалансировки части данных',
                'Маршрутизация запросов добавляет complexity',
              ],
              bestWhen:
                'URL shortener с access pattern по ключу (point lookups). Стандартный выбор для key-value нагрузок.',
              impact: {
                latency: 0,
                scalability: 2,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'range-sharding',
              label: 'Range-based шардирование',
              description:
                'Данные распределяются по диапазонам ключей: шард 1 = ключи "a"-"f", шард 2 = "g"-"m" и т.д.',
              pros: [
                'Range-запросы выполняются эффективно в пределах шарда',
                'Предсказуемое расположение данных',
                'Полезно если нужна сортировка по ключам',
              ],
              cons: [
                'Неравномерное распределение — hotspots при скошенном распределении ключей',
                'Один шард может получить непропорционально большую нагрузку',
                'Требуется мониторинг и ручная перебалансировка',
              ],
              bestWhen:
                'Нужны range-запросы (например, все ключи с определённым префиксом). Для URL shortener обычно не оптимален.',
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
      tip: 'Для URL shortener кэширование важнее партиционирования. При cache hit ratio 90%+ до БД доходит только 10% запросов. Начните с расчёта: 10К RPS × 10% = 1К RPS к БД — это посильно для одного инстанса.',
    },

    // ────────────────────────────────────────────
    // Step 6: Reliability & Monitoring
    // ────────────────────────────────────────────
    {
      id: 'url-reliability',
      title: 'Надёжность и мониторинг',
      description:
        'Обеспечьте высокую доступность сервиса и настройте мониторинг ключевых метрик. URL shortener — инфраструктурный сервис, его недоступность блокирует все ссылки.',
      decisions: [
        {
          id: 'url-availability',
          category: 'Доступность',
          question: 'Стратегия обеспечения доступности?',
          options: [
            {
              id: 'single-region',
              label: 'Один регион',
              description:
                'Вся инфраструктура в одном дата-центре/регионе. Резервирование на уровне AZ (Availability Zones).',
              pros: [
                'Минимальная стоимость инфраструктуры',
                'Простая архитектура без cross-region репликации',
                'Нет проблем с консистентностью между регионами',
              ],
              cons: [
                'Высокая задержка для пользователей из других регионов',
                'Региональный сбой = полная недоступность сервиса',
                'Не подходит для глобального продукта',
              ],
              bestWhen:
                'Аудитория сконцентрирована в одном регионе (например, только Россия или только US).',
              impact: {
                latency: -1,
                scalability: -1,
                consistency: 2,
                complexity: -2,
                cost: -2,
              },
            },
            {
              id: 'multi-region-active-passive',
              label: 'Multi-region Active-Passive',
              description:
                'Primary регион обрабатывает все записи, secondary — горячий standby. При сбое primary — failover на secondary (DNS failover или Route53 health checks).',
              pros: [
                'Защита от регионального сбоя — RTO минуты',
                'Чтения можно направлять в ближайший регион через CDN',
                'Проще, чем active-active — нет конфликтов записи',
              ],
              cons: [
                'Двойная стоимость инфраструктуры',
                'Failover не мгновенный — минуты на переключение DNS',
                'Lag репликации — возможна потеря недавних записей при failover',
              ],
              bestWhen:
                'Глобальный URL shortener с SLA 99.9%+. Оптимальный баланс доступности и сложности.',
              impact: {
                latency: 0,
                scalability: 1,
                consistency: 0,
                complexity: 1,
                cost: 1,
              },
            },
            {
              id: 'multi-region-active-active',
              label: 'Multi-region Active-Active',
              description:
                'Несколько регионов одновременно обрабатывают и чтения, и записи. Требует разрешения конфликтов при одновременной записи.',
              pros: [
                'Минимальная задержка для пользователей по всему миру',
                'Нет простоя при сбое любого региона',
                'Максимальная пропускная способность — нагрузка распределена',
              ],
              cons: [
                'Конфликты записи — два региона могут создать одинаковый ключ',
                'Очень высокая сложность: CRDT, vector clocks, conflict resolution',
                'Самая дорогая конфигурация — полная инфраструктура в каждом регионе',
              ],
              bestWhen:
                'Масштаб 1B+ DAU с жёсткими требованиями к задержке по всему миру. Уровень t.co / Bitly Enterprise.',
              impact: {
                latency: 2,
                scalability: 2,
                consistency: -2,
                complexity: 2,
                cost: 2,
              },
            },
          ],
        },
        {
          id: 'url-monitoring',
          category: 'Мониторинг',
          question: 'Что мониторить?',
          multiSelect: true,
          options: [
            {
              id: 'redirect-latency',
              label: 'Задержка редиректа (p99)',
              description:
                'Время от получения запроса до отправки HTTP-ответа с редиректом. p99 — критичная метрика для SLA.',
              pros: [
                'Основная метрика пользовательского опыта',
                'Позволяет отслеживать деградацию до того, как пользователи заметят',
                'p99 показывает worst-case для большинства запросов',
              ],
              cons: [
                'Требуется сбор гистограмм, а не просто средних значений',
                'Может флуктуировать при GC-паузах (Java) — нужна интерпретация',
                'Не показывает причину деградации — нужны дополнительные метрики',
              ],
              bestWhen:
                'Всегда. Это метрика номер один для любого URL shortener.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'error-rate',
              label: 'Процент ошибок (4xx/5xx)',
              description:
                'Доля запросов, завершившихся ошибкой. 4xx — клиентские (несуществующий ключ), 5xx — серверные (сбой БД/кэша).',
              pros: [
                'Мгновенное обнаружение сбоев компонентов',
                'Рост 404 может указывать на атаку перебором ключей',
                'Основа для алертинга и SLA-метрик',
              ],
              cons: [
                'Нужно разделять 4xx (нормальные) и 5xx (инциденты)',
                'Процент может маскировать абсолютные числа при низком трафике',
                'Не показывает конкретный источник ошибки',
              ],
              bestWhen:
                'Всегда. Базовая метрика здоровья для любого веб-сервиса.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'cache-hit-ratio',
              label: 'Cache hit ratio',
              description:
                'Процент запросов, обслуженных из кэша без обращения к БД. Для URL shortener целевое значение — 90%+.',
              pros: [
                'Показывает эффективность кэширования и размера кэша',
                'Падение hit ratio = рост нагрузки на БД (ранний индикатор проблем)',
                'Помогает оптимизировать TTL и eviction policy',
              ],
              cons: [
                'Требует инструментирования на уровне приложения',
                'Низкий hit ratio может быть нормой при cold start',
                'Не учитывает различия в стоимости промахов (быстрый vs медленный запрос к БД)',
              ],
              bestWhen:
                'Система с кэшированием. Критично для read-heavy URL shortener.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
            {
              id: 'db-query-latency',
              label: 'Задержка запросов к БД',
              description:
                'Время выполнения запросов к базе данных. Включает p50, p95, p99 для read и write операций отдельно.',
              pros: [
                'Раннее обнаружение проблем с БД до влияния на пользователей',
                'Помогает планировать масштабирование (когда БД приближается к лимитам)',
                'Различие read/write латенси показывает тип проблемы',
              ],
              cons: [
                'При хорошем cache hit ratio мало запросов доходит до БД — статистика зашумлена',
                'Требуется инструментирование каждого запроса',
                'Задержка БД может зависеть от инфраструктуры (сеть), а не от самой БД',
              ],
              bestWhen:
                'Всегда. Особенно важно при шардировании — для обнаружения hot shards.',
              impact: {
                latency: 0,
                scalability: 0,
                consistency: 0,
                complexity: 0,
                cost: 0,
              },
            },
          ],
        },
      ],
      tip: 'На собеседовании покажите, что вы думаете о мониторинге и SLA. Для URL shortener SLA по задержке обычно < 100 мс p99 для редиректа. Упомяните алертинг на рост error rate и падение cache hit ratio.',
    },
  ],

  // ────────────────────────────────────────────
  // Reference Solution
  // ────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'url-scale': ['medium-scale'],
      'url-features': ['analytics', 'link-expiration'],
      'url-protocol': ['rest'],
      'url-redirect': ['302-redirect'],
      'url-db': ['dynamodb'],
      'url-keygen': ['kgs'],
      'url-lb': ['cloud-lb'],
      'url-service-arch': ['monolith'],
      'url-cache': ['multi-layer-cache'],
      'url-partitioning': ['hash-sharding'],
      'url-availability': ['multi-region-active-passive'],
      'url-monitoring': [
        'redirect-latency',
        'error-rate',
        'cache-hit-ratio',
        'db-query-latency',
      ],
    },
    explanation: `Для URL shortener на 100M DAU оптимальна следующая архитектура:

**Масштаб и фичи:** 100M DAU означает ~10К редиректов/сек в пике при соотношении чтений к записям 100:1. Аналитика кликов — основная бизнес-ценность (монетизация через платные тарифы). Срок действия ссылок экономит хранилище и освобождает ключи.

**REST + 302:** REST — стандарт индустрии для публичных API. HTTP 302 (temporary redirect) критически важен: каждый клик проходит через наш сервер, что позволяет собирать аналитику. Это подход Bitly — аналитика является основным продуктом.

**DynamoDB + KGS:** DynamoDB идеально подходит для URL shortener: простая key-value модель (shortKey → originalURL), предсказуемая задержка < 10 мс, автоматическое шардирование, встроенный TTL для истекающих ссылок. Key Generation Service (KGS) заранее генерирует пул уникальных ключей и раздаёт их app-серверам — нет коллизий, нет координации в момент запроса, ключи непредсказуемы.

**Монолит + Cloud LB:** URL shortener — простой сервис. Монолит с горизонтальным масштабированием за Cloud Load Balancer достаточен. Микросервисы добавили бы сложность без значимых преимуществ. Cloud LB (AWS ALB) автоматически масштабируется и не требует operational overhead.

**Многоуровневый кэш + Hash sharding:** L1 (локальный LRU) для hot keys + L2 (Redis) для популярных ссылок. При cache hit ratio 90%+ до БД доходит только ~1К RPS — посильно даже для одного инстанса DynamoDB. Hash-based шардирование по короткому ключу обеспечивает равномерное распределение.

**Multi-region active-passive:** Primary регион обрабатывает все записи, secondary — горячий standby. CDN (CloudFront) кэширует 302-редиректы на короткий срок (30-60 сек), снижая нагрузку. DNS failover через Route53 при сбое primary.

**Мониторинг:** Все четыре метрики критичны. Redirect latency p99 < 100 мс — основной SLA. Cache hit ratio > 90% — индикатор здоровья кэша. Error rate и DB latency — ранние индикаторы проблем.`,
    diagram: `
┌─────────────────────────────────────────────────────────────────┐
│                    URL Shortener Architecture                    │
│                         (100M DAU)                               │
└─────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │  Client  │
    │(Browser) │
    └────┬─────┘
         │
         ▼
    ┌──────────┐     Кэширует 302 на 30-60 сек
    │   CDN    │     (CloudFront / Fastly)
    │          │
    └────┬─────┘
         │
         ▼
    ┌──────────────┐  Auto-scaling, SSL termination
    │  Cloud LB    │  (AWS ALB)
    │              │
    └────┬─────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │         App Servers (Monolith)        │
    │  ┌────────────┐  ┌────────────────┐  │
    │  │ URL Service │  │ Analytics Sink │  │
    │  │  (CRUD +    │  │ (async write   │  │
    │  │  Redirect)  │  │  to Kafka)     │  │
    │  └──────┬─────┘  └───────┬────────┘  │
    │         │                │            │
    │  ┌──────┴──────┐         │            │
    │  │ L1 Cache    │         │            │
    │  │ (Local LRU) │         │            │
    │  └──────┬──────┘         │            │
    └─────────┼────────────────┼────────────┘
              │                │
         ┌────┴────┐     ┌────┴─────┐
         ▼         │     ▼          │
    ┌─────────┐    │  ┌───────┐    │
    │  Redis  │    │  │ Kafka │    │
    │L2 Cache │    │  │       │    │
    │(cluster)│    │  └───┬───┘    │
    └────┬────┘    │      │        │
         │         │      ▼        │
         │    ┌────┴──────────┐    │
         │    │   DynamoDB    │    │
         │    │  (shortKey →  │    │
         └───▶│  originalURL) │    │
              │  TTL enabled  │    │
              └───────────────┘    │
                                   │
    ┌──────────┐             ┌─────┴──────┐
    │   KGS    │             │ ClickHouse │
    │ (Key     │             │ (Analytics │
    │Generator)│             │  Storage)  │
    └──────────┘             └────────────┘

    Потоки данных:
    ─────────────
    Создание:  Client → LB → App → KGS(get key) → DynamoDB(save)
    Редирект:  Client → CDN → LB → App → L1 → L2(Redis) → DynamoDB
    Аналитика: App → Kafka → ClickHouse (async pipeline)
`,
  },
  capacityEstimates: {
    default: [
      {
        label: 'DAU / MAU',
        value: '100M DAU',
        formula: 'Given in requirements',
      },
      {
        label: 'Write RPS',
        value: '~116 RPS',
        formula:
          'Each user creates ~0.1 short URLs/day → 100M × 0.1 / 86 400 ≈ 116 RPS',
      },
      {
        label: 'Read RPS',
        value: '~11.6K RPS',
        formula: 'Read:write ratio 100:1 → 116 × 100 ≈ 11 600 RPS',
      },
      {
        label: 'Storage (1 year)',
        value: '~1.8 TB',
        formula:
          '100M × 0.1 × 365 = 3.65B URLs, each ~500 bytes → 3.65B × 500 B ≈ 1.8 TB/year',
      },
      {
        label: 'Cache memory (20% hot URLs)',
        value: '~100 GB',
        formula:
          '11.6K RPS × 86 400 ≈ 1B reads/day, cache top 20% → 200M URLs × 500 bytes ≈ 100 GB',
      },
      {
        label: 'Bandwidth (outbound)',
        value: '~5.8 MB/s',
        formula: '11.6K RPS × 500 bytes ≈ 5.8 MB/s',
      },
    ],
  },
};
