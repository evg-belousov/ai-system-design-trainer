import type { Scenario } from './types';

export const notificationSystemScenario: Scenario = {
  id: 'notification-system',
  title: 'Notification System',
  difficulty: 'middle',
  description:
    'Спроектируйте систему уведомлений для крупной платформы (push, SMS, email), обрабатывающую миллионы уведомлений в день. Система должна поддерживать несколько каналов доставки, приоритизацию, retry-логику и аналитику.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'ns-requirements',
      title: 'Требования',
      description:
        'Определите каналы доставки и стратегию приоритизации уведомлений. От этих решений зависит архитектура очередей и worker-пулов.',
      decisions: [
        {
          id: 'ns-channels',
          category: 'Каналы доставки',
          question: 'Какие каналы доставки поддерживать?',
          multiSelect: true,
          options: [
            {
              id: 'push',
              label: 'Push (mobile)',
              description:
                'Push-уведомления через FCM (Android) и APNs (iOS). Мгновенная доставка на устройство.',
              pros: [
                'Мгновенная доставка при наличии соединения',
                'Низкая стоимость отправки',
                'Высокая вовлечённость пользователей',
              ],
              cons: [
                'Требует регистрации device token',
                'Пользователь может отключить уведомления',
                'Зависимость от внешних провайдеров (Google, Apple)',
              ],
              bestWhen: 'Нужна мгновенная доставка на мобильные устройства',
              impact: { latency: 2, scalability: 1, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'email',
              label: 'Email',
              description:
                'Отправка email через SMTP или API провайдера (SES, SendGrid). Поддержка HTML-шаблонов, вложений.',
              pros: [
                'Универсальный канал — есть у всех пользователей',
                'Поддержка rich-контента (HTML, вложения)',
                'Возможность повторной доставки (inbox)',
              ],
              cons: [
                'Высокая задержка доставки (секунды — минуты)',
                'Проблемы со спам-фильтрами',
                'Нужна настройка DKIM/SPF/DMARC',
              ],
              bestWhen: 'Нужна доставка длинного контента или документов',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'sms',
              label: 'SMS',
              description:
                'Отправка SMS через провайдеров (Twilio, Vonage). Высокая стоимость, но гарантированная доставка.',
              pros: [
                'Не требует интернета на устройстве',
                'Высокий процент прочтения (>90%)',
                'Работает на любых телефонах',
              ],
              cons: [
                'Высокая стоимость за сообщение',
                'Ограничение по длине (160 символов)',
                'Регуляторные требования (opt-in, TCPA)',
              ],
              bestWhen: 'Критичные уведомления (OTP, alerts), где нужна гарантированная доставка',
              impact: { latency: 1, scalability: -1, consistency: 2, complexity: 1, cost: -2 },
              capacityImpact: [
                {
                  label: 'Email/SMS costs',
                  value: '~$500K/day',
                  formula: '500M/day × 10% SMS × $0.01/SMS = $500K/day (50× more than email-only)',
                },
                {
                  label: 'Push payload bandwidth',
                  value: '~2.7 MB/s (SMS payloads are tiny)',
                  formula: '17K/sec × 10% SMS × 160 bytes = ~270 KB/s for SMS channel',
                },
              ],
            },
            {
              id: 'in-app',
              label: 'In-app',
              description:
                'Уведомления внутри приложения. Колокольчик, notification center, real-time через WebSocket.',
              pros: [
                'Полный контроль над UI и UX',
                'Нулевая стоимость доставки',
                'Не зависит от внешних провайдеров',
              ],
              cons: [
                'Пользователь видит только при входе в приложение',
                'Требует WebSocket или polling для real-time',
                'Нужен собственный notification center',
              ],
              bestWhen: 'Уведомления не критичны по времени и пользователь часто в приложении',
              impact: { latency: 0, scalability: 2, consistency: 1, complexity: 0, cost: 2 },
            },
          ],
        },
        {
          id: 'ns-priority',
          category: 'Приоритизация',
          question: 'Нужна ли приоритизация уведомлений?',
          options: [
            {
              id: 'single-queue',
              label: 'Единая очередь (FIFO)',
              description:
                'Все уведомления обрабатываются в порядке поступления без разделения по приоритету.',
              pros: [
                'Максимально простая реализация',
                'Предсказуемый порядок обработки',
                'Лёгкость отладки и мониторинга',
              ],
              cons: [
                'Критичные уведомления (OTP) ждут в общей очереди',
                'Всплеск маркетинговых рассылок блокирует срочные сообщения',
                'Нет контроля SLA по типам уведомлений',
              ],
              bestWhen: 'Низкий объём уведомлений, все сообщения одинаковой важности',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: 2, cost: 1 },
            },
            {
              id: 'priority-levels',
              label: 'Уровни приоритета (critical/high/normal/low)',
              description:
                'Каждому уведомлению назначается приоритет. Worker-ы сначала обрабатывают сообщения с высоким приоритетом.',
              pros: [
                'OTP и security-алерты доставляются первыми',
                'Гибкий контроль SLA по классам сообщений',
                'Масштабируется под бизнес-требования',
              ],
              cons: [
                'Сложнее логика маршрутизации',
                'Возможно голодание (starvation) низкоприоритетных сообщений',
                'Нужна логика назначения приоритетов',
              ],
              bestWhen: 'Разные типы уведомлений с разными SLA — стандарт для production-систем',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'separate-queues',
              label: 'Отдельные очереди на каждый канал',
              description:
                'Каждый канал (push, email, SMS) имеет свою очередь. Приоритизация внутри канала не выполняется.',
              pros: [
                'Изоляция сбоев: проблема с email не влияет на push',
                'Независимое масштабирование каналов',
                'Простая модель потребителей',
              ],
              cons: [
                'Нет приоритизации внутри канала',
                'Больше очередей для управления',
                'Не решает проблему блокировки срочных сообщений',
              ],
              bestWhen: 'Каналы имеют сильно разные характеристики пропускной способности',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: -1, cost: -1 },
            },
          ],
        },
      ],
      tip: 'В production-системах (Airbnb, Uber) приоритизация критична: OTP-коды и security-алерты не должны ждать за маркетинговыми рассылками.',
    },

    // ── Step 2: API Design ────────────────────────────────────────────
    {
      id: 'ns-api',
      title: 'API и шаблоны',
      description:
        'Определите интерфейс приёма запросов на отправку и стратегию управления шаблонами уведомлений.',
      decisions: [
        {
          id: 'ns-api-style',
          category: 'API стиль',
          question: 'Как принимать запросы на отправку уведомлений?',
          options: [
            {
              id: 'sync-rest',
              label: 'Синхронный REST API',
              description:
                'Клиент отправляет POST-запрос и ждёт подтверждения отправки. Простой request-response.',
              pros: [
                'Простая интеграция для клиентов',
                'Мгновенная обратная связь об ошибках валидации',
                'Легко тестировать и отлаживать',
              ],
              cons: [
                'Клиент блокируется на время обработки',
                'Пиковая нагрузка напрямую давит на сервис',
                'Сложно обеспечить гарантию доставки',
              ],
              bestWhen: 'Небольшой объём уведомлений, нужна простота интеграции',
              impact: { latency: -1, scalability: -2, consistency: 0, complexity: 2, cost: 1 },
            },
            {
              id: 'async-queue',
              label: 'Асинхронная очередь сообщений',
              description:
                'Клиент помещает запрос в очередь и сразу получает acknowledgement. Обработка происходит асинхронно.',
              pros: [
                'Сглаживание пиков нагрузки',
                'Гарантия доставки (at-least-once)',
                'Независимое масштабирование producer и consumer',
              ],
              cons: [
                'Нет мгновенной обратной связи о результате',
                'Сложнее отладка (асинхронный flow)',
                'Нужна инфраструктура очередей',
              ],
              bestWhen: 'Высокий объём уведомлений — стандарт индустрии (LinkedIn, Uber)',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'event-driven',
              label: 'Event-driven (pub/sub)',
              description:
                'Уведомления генерируются из доменных событий (OrderCompleted, PaymentFailed). Notification service подписывается на события.',
              pros: [
                'Слабая связанность: сервисы не знают о notification service',
                'Легко добавлять новые триггеры уведомлений',
                'Единый источник событий для аудита',
              ],
              cons: [
                'Сложная маршрутизация событий к уведомлениям',
                'Нужен маппинг «событие → шаблон уведомления»',
                'Труднее контролировать дублирование',
              ],
              bestWhen: 'Микросервисная архитектура, уведомления привязаны к бизнес-событиям',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: -2, cost: -1 },
            },
          ],
        },
        {
          id: 'ns-template',
          category: 'Шаблоны',
          question: 'Как управлять шаблонами уведомлений?',
          options: [
            {
              id: 'hardcoded',
              label: 'Захардкожено в коде',
              description:
                'Текст уведомлений зашит в код сервиса. Изменение текста требует нового деплоя.',
              pros: [
                'Нулевая дополнительная сложность',
                'Шаблоны в одном репозитории с логикой',
                'Type-safe подстановка переменных',
              ],
              cons: [
                'Изменение текста = новый деплой',
                'Маркетинг не может редактировать без разработчиков',
                'Сложно поддерживать локализацию',
              ],
              bestWhen: 'Маленькая команда, редкие изменения шаблонов',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 2, cost: 2 },
            },
            {
              id: 'template-engine',
              label: 'Template engine (Handlebars/Jinja)',
              description:
                'Шаблоны хранятся отдельно от кода, рендерятся через движок с переменными.',
              pros: [
                'Отделение контента от логики',
                'Переиспользуемые блоки и layouts',
                'Обновление шаблонов без деплоя сервиса',
              ],
              cons: [
                'Нужна валидация переменных шаблона',
                'Runtime-ошибки при несовпадении переменных',
                'Нужна система версионирования шаблонов',
              ],
              bestWhen: 'Средний объём шаблонов, нужна гибкость без лишней сложности',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 0, cost: 1 },
            },
            {
              id: 'cms-editor',
              label: 'CMS с визуальным редактором',
              description:
                'Визуальный редактор для маркетинга и продукта. Drag-and-drop, предпросмотр, A/B-тестирование.',
              pros: [
                'Маркетинг редактирует без разработчиков',
                'Предпросмотр уведомлений перед отправкой',
                'Поддержка A/B-тестирования контента',
              ],
              cons: [
                'Значительные затраты на разработку/покупку CMS',
                'Сложная интеграция с notification pipeline',
                'Риск «сломанных» шаблонов от не-технических пользователей',
              ],
              bestWhen: 'Большая продуктовая команда, частые изменения контента уведомлений',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: -2, cost: -2 },
            },
          ],
        },
      ],
      tip: 'LinkedIn использует асинхронный API + шаблонизатор для отправки миллиардов уведомлений в день. Синхронный API допустим только как фасад перед очередью.',
    },

    // ── Step 3: Data Model & Storage ──────────────────────────────────
    {
      id: 'ns-storage',
      title: 'Хранение данных',
      description:
        'Определите, где хранить историю уведомлений (write-heavy нагрузка) и пользовательские настройки (opt-in/out).',
      decisions: [
        {
          id: 'ns-db',
          category: 'История уведомлений',
          question: 'Где хранить историю уведомлений?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL',
              description:
                'Реляционная БД с ACID-транзакциями. Подходит для структурированных данных и сложных запросов.',
              pros: [
                'Мощные SQL-запросы и JOINы',
                'ACID-гарантии для критичных данных',
                'Зрелая экосистема и инструменты',
              ],
              cons: [
                'Плохо масштабируется горизонтально для write-heavy нагрузки',
                'Деградация на миллиардах записей без партиционирования',
                'Вертикальное масштабирование дорого',
              ],
              bestWhen: 'Небольшой объём уведомлений (<1M в день), нужны сложные запросы',
              impact: { latency: 0, scalability: -1, consistency: 2, complexity: 1, cost: 0 },
            },
            {
              id: 'mongodb',
              label: 'MongoDB',
              description:
                'Документная БД. Гибкая схема, горизонтальное масштабирование через шардинг.',
              pros: [
                'Гибкая схема для разных типов уведомлений',
                'Встроенный шардинг из коробки',
                'Хорошая производительность записи',
              ],
              cons: [
                'Слабые гарантии консистентности по умолчанию',
                'Сложные аналитические запросы неэффективны',
                'Потребляет больше памяти чем реляционные БД',
              ],
              bestWhen: 'Разнородные типы уведомлений, средний объём, нужна гибкость схемы',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 0, cost: 0 },
            },
            {
              id: 'cassandra',
              label: 'Cassandra',
              description:
                'Распределённая wide-column БД, оптимизированная для write-heavy нагрузки. Линейное горизонтальное масштабирование.',
              pros: [
                'Отличная производительность записи при любом масштабе',
                'Линейное горизонтальное масштабирование',
                'Нет single point of failure',
              ],
              cons: [
                'Ограниченная модель запросов (нужно проектировать под query pattern)',
                'Eventual consistency по умолчанию',
                'Высокий порог входа для операционной поддержки',
              ],
              bestWhen: 'Write-heavy нагрузка, миллионы уведомлений в день — выбор Uber и Netflix',
              impact: { latency: 1, scalability: 2, consistency: -1, complexity: -1, cost: -1 },
            },
            {
              id: 'clickhouse',
              label: 'ClickHouse (для аналитики)',
              description:
                'Колоночная OLAP БД для аналитических запросов. Молниеносная агрегация на больших объёмах.',
              pros: [
                'Мгновенные аналитические запросы (delivery rate, bounce rate)',
                'Отличная компрессия данных',
                'Поддержка SQL-подобного языка запросов',
              ],
              cons: [
                'Не подходит для OLTP (точечные update, delete)',
                'Нет полноценных транзакций',
                'Нужна отдельная БД для оперативных данных',
              ],
              bestWhen: 'Аналитика и отчётность по уведомлениям как дополнение к основной БД',
              impact: { latency: 0, scalability: 1, consistency: -2, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'ns-preferences',
          category: 'Пользовательские настройки',
          question: 'Где хранить настройки пользователей (opt-in/out)?',
          options: [
            {
              id: 'main-db',
              label: 'В основной БД (PostgreSQL)',
              description:
                'Настройки уведомлений хранятся в таблице user_preferences рядом с профилем пользователя.',
              pros: [
                'Единый источник правды для данных пользователя',
                'ACID-гарантии при обновлении настроек',
                'Не нужна дополнительная инфраструктура',
              ],
              cons: [
                'Дополнительная нагрузка на основную БД при каждой отправке',
                'Задержка при чтении настроек из OLTP-базы',
                'Сложно кэшировать при частых изменениях',
              ],
              bestWhen: 'Небольшой масштаб, настройки меняются редко',
              impact: { latency: -1, scalability: -1, consistency: 2, complexity: 1, cost: 1 },
            },
            {
              id: 'redis-source',
              label: 'Redis (кэш + source of truth)',
              description:
                'Настройки хранятся в Redis. Быстрый доступ, но риск потери данных при сбое.',
              pros: [
                'Субмиллисекундный доступ к настройкам',
                'Минимальная нагрузка на notification pipeline',
                'Простая модель данных (hash per user)',
              ],
              cons: [
                'Риск потери данных при сбое (даже с AOF)',
                'RAM-only — дорого при большом числе пользователей',
                'Не подходит для аудита изменений настроек',
              ],
              bestWhen: 'Нужна максимальная скорость, данные можно восстановить из других источников',
              impact: { latency: 2, scalability: 0, consistency: -2, complexity: 0, cost: -1 },
            },
            {
              id: 'preference-service',
              label: 'Отдельный preference service',
              description:
                'Микросервис с собственной БД для user notification preferences. API для чтения/записи, кэш внутри.',
              pros: [
                'Изоляция от notification pipeline',
                'Собственный кэш и масштабирование',
                'Чёткие API-контракты, повторное использование другими сервисами',
              ],
              cons: [
                'Дополнительный сервис для поддержки',
                'Сетевой вызов при каждой отправке',
                'Нужна стратегия инвалидации кэша',
              ],
              bestWhen: 'Микросервисная архитектура, настройки используются несколькими сервисами',
              impact: { latency: 0, scalability: 2, consistency: 1, complexity: -1, cost: -1 },
            },
          ],
        },
      ],
      tip: 'При write-heavy нагрузке (миллионы уведомлений/день) реляционные БД становятся узким местом. Cassandra — выбор Uber, Apple, Netflix для подобных задач.',
    },

    // ── Step 4: Architecture ──────────────────────────────────────────
    {
      id: 'ns-architecture',
      title: 'Архитектура',
      description:
        'Выберите message broker и стратегию гарантии доставки. Это ядро notification pipeline.',
      decisions: [
        {
          id: 'ns-queue',
          category: 'Message broker',
          question: 'Какой message broker использовать?',
          options: [
            {
              id: 'rabbitmq',
              label: 'RabbitMQ',
              description:
                'Классический message broker с гибкой маршрутизацией (exchanges, bindings). Поддержка приоритетных очередей.',
              pros: [
                'Гибкая маршрутизация (topic, fanout, headers)',
                'Встроенная поддержка приоритетных очередей',
                'Подтверждение доставки (ack/nack)',
              ],
              cons: [
                'Сложно масштабировать горизонтально',
                'Деградация при миллионах сообщений в очереди',
                'Нет встроенного replay сообщений',
              ],
              bestWhen: 'Средний объём, нужна сложная маршрутизация по типам уведомлений',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
              capacityImpact: [
                {
                  label: 'Queue throughput',
                  value: '~17K msgs/sec (single cluster limit ~50K)',
                  formula: 'RabbitMQ: ~50K msgs/sec per cluster; 17K/sec = 34% capacity, limited horizontal scaling',
                },
                {
                  label: 'Storage (30 days history)',
                  value: '~15 TB (no built-in retention)',
                  formula: 'RabbitMQ is not designed for message storage; need separate DB for history',
                },
              ],
            },
            {
              id: 'kafka',
              label: 'Apache Kafka',
              description:
                'Распределённый log-based broker. Высокая пропускная способность, retention, replay. Стандарт для high-throughput систем.',
              pros: [
                'Миллионы сообщений в секунду',
                'Replay: перечитывание сообщений для отладки',
                'Горизонтальное масштабирование через партиции',
              ],
              cons: [
                'Нет нативной поддержки приоритетных очередей',
                'Высокий операционный overhead (ZooKeeper/KRaft)',
                'Задержка выше чем у RabbitMQ для единичных сообщений',
              ],
              bestWhen: 'High-throughput, нужен replay и аудит — выбор LinkedIn и Uber',
              impact: { latency: 0, scalability: 2, consistency: 1, complexity: -1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Queue throughput',
                  value: '17K msgs/sec (1% of Kafka capacity)',
                  formula: 'Kafka: ~2M msgs/sec per cluster; 17K/sec = trivial load, room for 100× growth',
                },
                {
                  label: 'Storage (30 days history)',
                  value: '~45 TB (with Kafka retention)',
                  formula: '500M/day × 30 days × 1 KB + 2× replication factor = ~30 TB data + Kafka overhead ≈ 45 TB (built-in retention & replay)',
                },
              ],
            },
            {
              id: 'sqs',
              label: 'Amazon SQS',
              description:
                'Managed очередь от AWS. Zero ops, автоматическое масштабирование, встроенные DLQ.',
              pros: [
                'Полностью managed — zero ops',
                'Автоматическое масштабирование',
                'Встроенные dead letter queues',
              ],
              cons: [
                'Vendor lock-in на AWS',
                'Ограниченная пропускная способность на FIFO-очередях',
                'Нет replay сообщений',
              ],
              bestWhen: 'AWS-инфраструктура, нужна простота без операционного overhead',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 2, cost: 0 },
            },
            {
              id: 'redis-streams',
              label: 'Redis Streams',
              description:
                'Log-based структура данных в Redis. Consumer groups, автоматический acknowledgement.',
              pros: [
                'Минимальная задержка (in-memory)',
                'Простая настройка при наличии Redis',
                'Consumer groups из коробки',
              ],
              cons: [
                'Ограничена RAM-ом сервера',
                'Слабее гарантии persistence чем у Kafka',
                'Не подходит для долгосрочного хранения сообщений',
              ],
              bestWhen: 'Небольшой масштаб, Redis уже в стеке, нужна минимальная задержка',
              impact: { latency: 2, scalability: -1, consistency: -1, complexity: 1, cost: 1 },
            },
          ],
        },
        {
          id: 'ns-delivery',
          category: 'Гарантия доставки',
          question: 'Какая стратегия доставки сообщений?',
          options: [
            {
              id: 'fire-and-forget',
              label: 'Fire and forget',
              description:
                'Сообщение отправляется провайдеру без подтверждения доставки. Максимальная скорость, минимальная надёжность.',
              pros: [
                'Максимальная пропускная способность',
                'Минимальная сложность',
                'Наименьшая задержка',
              ],
              cons: [
                'Потеря уведомлений при сбое',
                'Нет гарантии доставки',
                'Невозможно отследить статус',
              ],
              bestWhen: 'Некритичные уведомления, где потеря допустима',
              impact: { latency: 2, scalability: 1, consistency: -2, complexity: 2, cost: 1 },
            },
            {
              id: 'at-least-once',
              label: 'At-least-once с идемпотентностью',
              description:
                'Сообщение обрабатывается повторно при сбое. Идемпотентный ключ предотвращает дублирование уведомлений.',
              pros: [
                'Гарантия обработки каждого уведомления',
                'Идемпотентность предотвращает спам пользователю',
                'Баланс надёжности и сложности',
              ],
              cons: [
                'Нужна реализация idempotency key',
                'Дополнительная нагрузка на проверку дубликатов',
                'Возможна задержка при retry',
              ],
              bestWhen: 'Стандарт индустрии для notification-систем — Airbnb, LinkedIn',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'exactly-once',
              label: 'Exactly-once (transactional outbox)',
              description:
                'Запись в БД и отправка в очередь в одной транзакции через outbox pattern. Гарантия ровно одной обработки.',
              pros: [
                'Строгая гарантия ровно одной обработки',
                'Нет потери и дублирования уведомлений',
                'Аудитный trail в outbox-таблице',
              ],
              cons: [
                'Значительная сложность реализации',
                'Дополнительная нагрузка на БД (outbox polling/CDC)',
                'Снижение пропускной способности',
              ],
              bestWhen: 'Финансовые уведомления, где дублирование критично (платёжные подтверждения)',
              impact: { latency: -1, scalability: -1, consistency: 2, complexity: -2, cost: -1 },
            },
          ],
        },
      ],
      tip: 'At-least-once + idempotency key — практический стандарт. Exactly-once через outbox добавляет надёжность, но значительно усложняет систему.',
    },

    // ── Step 5: Scaling ───────────────────────────────────────────────
    {
      id: 'ns-scaling',
      title: 'Масштабирование',
      description:
        'Определите стратегию контроля скорости отправки и батчинга уведомлений для оптимизации нагрузки.',
      decisions: [
        {
          id: 'ns-rate-control',
          category: 'Rate limiting',
          question: 'Как контролировать скорость отправки?',
          options: [
            {
              id: 'no-rate-limit',
              label: 'Без rate limiting',
              description:
                'Уведомления отправляются с максимальной скоростью без ограничений.',
              pros: [
                'Максимальная пропускная способность',
                'Простота реализации',
                'Минимальная задержка доставки',
              ],
              cons: [
                'Провайдеры блокируют при превышении лимитов',
                'Пользователь может получить шквал уведомлений',
                'Нет защиты от случайного flood',
              ],
              bestWhen: 'Только на ранних стадиях, когда объём мал',
              impact: { latency: 1, scalability: -2, consistency: -1, complexity: 2, cost: 0 },
            },
            {
              id: 'per-channel-limits',
              label: 'Rate limits по каналам',
              description:
                'Ограничение скорости отправки для каждого канала (email: 1000/сек, SMS: 100/сек).',
              pros: [
                'Защита от блокировки провайдерами',
                'Предсказуемая нагрузка на каждый канал',
                'Простая реализация через token bucket',
              ],
              cons: [
                'Не защищает пользователя от спама',
                'Фиксированные лимиты не адаптируются к нагрузке',
                'Нужна настройка лимитов под каждый провайдер',
              ],
              bestWhen: 'Нужна базовая защита от перегрузки провайдеров',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'per-user-limits',
              label: 'Rate limits по пользователям (anti-spam)',
              description:
                'Ограничение количества уведомлений на пользователя в единицу времени (max 5 push в час).',
              pros: [
                'Защита пользователя от перегрузки уведомлениями',
                'Снижение opt-out и unsubscribe rate',
                'Улучшение пользовательского опыта',
              ],
              cons: [
                'Сложная логика подсчёта по пользователям',
                'Нужно хранить счётчики (Redis)',
                'Потенциальная потеря важных уведомлений',
              ],
              bestWhen: 'Много триггеров уведомлений, нужна защита от спама пользователя',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: -1 },
            },
            {
              id: 'provider-rate-limit',
              label: 'Provider rate limit compliance',
              description:
                'Адаптивное ограничение скорости с учётом лимитов провайдера (SMTP throttling, FCM quota, Twilio rate limits).',
              pros: [
                'Автоматическая адаптация к лимитам провайдеров',
                'Предотвращение блокировки аккаунта',
                'Максимальная утилизация разрешённой пропускной способности',
              ],
              cons: [
                'Сложная реализация адаптивного алгоритма',
                'Нужен мониторинг ответов провайдера (429, rate limit headers)',
                'Различные API у разных провайдеров',
              ],
              bestWhen: 'Production-система с несколькими провайдерами — стандарт для зрелых систем',
              impact: { latency: 0, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'ns-batch',
          category: 'Батчинг',
          question: 'Нужен ли батчинг уведомлений?',
          options: [
            {
              id: 'no-batching',
              label: 'Без батчинга (real-time)',
              description:
                'Каждое уведомление отправляется немедленно по мере поступления.',
              pros: [
                'Минимальная задержка доставки',
                'Простая реализация pipeline',
                'Пользователь сразу получает уведомление',
              ],
              cons: [
                'Пользователь может получить десятки уведомлений подряд',
                'Высокая нагрузка при пиках',
                'Нет оптимизации стоимости (каждый SMS отдельно)',
              ],
              bestWhen: 'Все уведомления требуют мгновенной доставки',
              impact: { latency: 2, scalability: -1, consistency: 0, complexity: 1, cost: -1 },
            },
            {
              id: 'digest-batching',
              label: 'Digest-батчинг (группировка по интервалу)',
              description:
                'Уведомления одного типа группируются по пользователю за интервал (5 мин, 1 час) в один digest.',
              pros: [
                'Снижение количества отправок (экономия на SMS/email)',
                'Улучшение UX: «3 новых комментария» вместо 3 отдельных',
                'Снижение opt-out rate',
              ],
              cons: [
                'Задержка доставки на длину интервала',
                'Нужна логика группировки и хранения pending уведомлений',
                'Не подходит для срочных уведомлений',
              ],
              bestWhen: 'Много однотипных уведомлений (лайки, комментарии) — подход LinkedIn',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: -1, cost: 1 },
              capacityImpact: [
                {
                  label: 'Peak send rate',
                  value: '~3.4K/sec',
                  formula: 'Digest reduces sends by ~5× (avg 5 notifications per digest) → 17K/5 ≈ 3.4K/sec actual sends',
                },
                {
                  label: 'Email/SMS costs',
                  value: '~$2K/day',
                  formula: 'Digest batching: 500M/5 = 100M actual sends × 20% email × $0.0001 = $2K/day (5× cheaper)',
                },
                {
                  label: 'Storage (30 days history)',
                  value: '~18 TB',
                  formula: '15 TB notification records + 3 TB pending digest buffer (5 min windows × concurrent digests)',
                },
              ],
            },
            {
              id: 'smart-batching',
              label: 'Smart batching (ML-based timing)',
              description:
                'ML-модель определяет оптимальное время доставки для каждого пользователя на основе его активности.',
              pros: [
                'Максимальный engagement — уведомление приходит в «правильное» время',
                'Адаптация под часовой пояс и привычки пользователя',
                'Конкурентное преимущество',
              ],
              cons: [
                'Значительная сложность ML-инфраструктуры',
                'Нужны данные об активности пользователя',
                'Долгий time-to-market',
              ],
              bestWhen: 'Крупная платформа с ML-командой, цель — максимизация engagement',
              impact: { latency: -2, scalability: 0, consistency: 0, complexity: -2, cost: -2 },
            },
          ],
        },
      ],
      tip: 'Uber использует адаптивный rate limiting с учётом лимитов провайдеров. LinkedIn применяет digest-батчинг для группировки уведомлений о социальных взаимодействиях.',
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'ns-reliability',
      title: 'Надёжность',
      description:
        'Определите стратегию повторных попыток при ошибках и ключевые метрики для мониторинга.',
      decisions: [
        {
          id: 'ns-retry',
          category: 'Retry-стратегия',
          question: 'Стратегия повторных попыток при ошибках доставки?',
          options: [
            {
              id: 'no-retry',
              label: 'Без повторных попыток',
              description:
                'При ошибке доставки уведомление помечается как failed. Повторная отправка не выполняется.',
              pros: [
                'Нулевая дополнительная сложность',
                'Нет дублирования уведомлений',
                'Предсказуемая нагрузка',
              ],
              cons: [
                'Потеря уведомлений при временных сбоях провайдера',
                'Низкий delivery rate',
                'Неприемлемо для критичных уведомлений',
              ],
              bestWhen: 'Некритичные уведомления, где потеря допустима (маркетинг)',
              impact: { latency: 1, scalability: 1, consistency: -2, complexity: 2, cost: 1 },
            },
            {
              id: 'fixed-retry',
              label: 'Retry с фиксированным интервалом',
              description:
                'Повторная попытка через фиксированное время (30 сек, 30 сек, 30 сек). Максимум 3 попытки.',
              pros: [
                'Простая реализация',
                'Предсказуемое время между попытками',
                'Лучше, чем отсутствие retry',
              ],
              cons: [
                'Thundering herd при массовом сбое провайдера',
                'Не адаптируется к характеру ошибки',
                'Нагрузка на провайдер не снижается между попытками',
              ],
              bestWhen: 'Простые сценарии с редкими сбоями',
              impact: { latency: 0, scalability: -1, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'exponential-backoff',
              label: 'Exponential backoff',
              description:
                'Интервал между попытками растёт экспоненциально (1с, 2с, 4с, 8с...) с jitter для предотвращения thundering herd.',
              pros: [
                'Даёт провайдеру время восстановиться',
                'Jitter предотвращает одновременный retry',
                'Стандартный подход в распределённых системах',
              ],
              cons: [
                'Задержка доставки растёт с каждой попыткой',
                'Проблемные сообщения занимают ресурсы worker-а',
                'Нет изоляции «ядовитых» сообщений',
              ],
              bestWhen: 'Хороший базовый подход, но недостаточен для production-масштаба',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'exponential-backoff-dlq',
              label: 'Exponential backoff + Dead Letter Queue',
              description:
                'Экспоненциальный backoff с jitter. После исчерпания попыток — сообщение в DLQ для ручного разбора.',
              pros: [
                'Автоматическая обработка временных сбоев',
                'Изоляция «ядовитых» сообщений в DLQ',
                'Возможность ручного replay из DLQ',
              ],
              cons: [
                'Нужна система для мониторинга и обработки DLQ',
                'Сообщения в DLQ требуют ручного внимания',
                'Сложнее тестирование retry-логики',
              ],
              bestWhen: 'Индустриальный стандарт для production-систем — Airbnb, Uber, LinkedIn',
              impact: { latency: 0, scalability: 1, consistency: 2, complexity: -1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Storage (30 days history)',
                  value: '~16.5 TB',
                  formula: '15 TB base + ~1.5 TB DLQ storage (assuming 1% failure rate × 5 retry copies × 1 KB = ~750 GB + metadata)',
                },
                {
                  label: 'Peak send rate',
                  value: '~20K/sec (with retry overhead)',
                  formula: '17K/sec base + ~3K/sec retries (1% fail × 5 retries spread over backoff window) = ~20K/sec peak worker load',
                },
              ],
            },
          ],
        },
        {
          id: 'ns-monitoring',
          category: 'Мониторинг',
          question: 'Какие метрики мониторить?',
          multiSelect: true,
          options: [
            {
              id: 'delivery-rate',
              label: 'Delivery rate по каналам',
              description:
                'Процент успешно доставленных уведомлений для каждого канала (push: 95%, email: 98%, SMS: 99%).',
              pros: [
                'Главная метрика здоровья notification-системы',
                'Позволяет сравнивать эффективность каналов',
                'Быстрое обнаружение деградации провайдера',
              ],
              cons: [
                'Не все провайдеры дают точный delivery status',
                'Push delivery confirmation ненадёжен',
                'Нужен feedback loop с провайдерами',
              ],
              bestWhen: 'Базовая метрика — обязательна для любой notification-системы',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'bounce-rate',
              label: 'Bounce/failure rate',
              description:
                'Процент отказов: email bounce, invalid device tokens, SMS delivery failures.',
              pros: [
                'Индикатор качества данных (устаревшие токены, невалидные email)',
                'Предотвращение попадания в чёрные списки (email)',
                'Оптимизация стоимости (не отправлять на невалидные адреса)',
              ],
              cons: [
                'Нужна обработка webhooks от провайдеров',
                'Разные форматы bounce-отчётов у разных провайдеров',
                'Задержка получения bounce-информации (email: до 72ч)',
              ],
              bestWhen: 'Обязательно для email-канала — иначе попадёте в спам-листы',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 1 },
            },
            {
              id: 'e2e-latency',
              label: 'E2E latency (отправка → доставка)',
              description:
                'Время от запроса на отправку до фактической доставки пользователю. P50, P95, P99 по каналам.',
              pros: [
                'Отслеживание SLA по приоритетам (OTP < 5 сек)',
                'Обнаружение узких мест в pipeline',
                'Основа для capacity planning',
              ],
              cons: [
                'Сложно измерить точное время доставки (push, email)',
                'Нужна распределённая трассировка (tracing)',
                'Батчинг искажает метрику для digest-уведомлений',
              ],
              bestWhen: 'Критично для time-sensitive уведомлений (OTP, security alerts)',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'queue-depth',
              label: 'Queue depth / consumer lag',
              description:
                'Количество необработанных сообщений в очереди и отставание consumer-ов от producer-ов.',
              pros: [
                'Раннее предупреждение о перегрузке системы',
                'Основа для автоскейлинга worker-ов',
                'Обнаружение зависших consumer-ов',
              ],
              cons: [
                'Нужен доступ к метрикам broker-а',
                'Интерпретация зависит от типа broker-а',
                'Алерты требуют настройки пороговых значений',
              ],
              bestWhen: 'Обязательно для систем с очередями — основа автоскейлинга',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 0, cost: 0 },
            },
          ],
        },
      ],
      tip: 'Airbnb мониторит все четыре метрики. Queue depth используется для автоскейлинга worker-ов, delivery rate — как SLO для on-call инженеров.',
    },
  ],

  referenceSolution: {
    decisions: {
      'ns-channels': ['push', 'email', 'sms'],
      'ns-priority': ['priority-levels'],
      'ns-api-style': ['async-queue'],
      'ns-template': ['template-engine'],
      'ns-db': ['cassandra'],
      'ns-preferences': ['preference-service'],
      'ns-queue': ['kafka'],
      'ns-delivery': ['at-least-once'],
      'ns-rate-control': ['provider-rate-limit'],
      'ns-batch': ['digest-batching'],
      'ns-retry': ['exponential-backoff-dlq'],
      'ns-monitoring': ['delivery-rate', 'bounce-rate', 'e2e-latency', 'queue-depth'],
    },
    explanation:
      'Референсная архитектура основана на практиках Airbnb, LinkedIn и Uber.\n\n' +
      '**Каналы и приоритизация:** Push, Email и SMS покрывают основные сценарии. Приоритизация через уровни ' +
      '(critical/high/normal/low) гарантирует, что OTP-коды и security-алерты доставляются первыми, ' +
      'не блокируясь маркетинговыми рассылками.\n\n' +
      '**API и шаблоны:** Асинхронный приём через Kafka обеспечивает сглаживание пиков и гарантию at-least-once. ' +
      'Template engine (Handlebars) отделяет контент от логики, позволяя обновлять шаблоны без деплоя.\n\n' +
      '**Хранение:** Cassandra оптимальна для write-heavy нагрузки (миллионы записей/день) с линейным масштабированием. ' +
      'Отдельный preference service изолирует пользовательские настройки и позволяет кэшировать их независимо.\n\n' +
      '**Message broker:** Kafka обеспечивает высокую пропускную способность, replay для отладки и горизонтальное масштабирование ' +
      'через партиции. Приоритизация реализуется через отдельные topic-и по приоритетам.\n\n' +
      '**Rate limiting и батчинг:** Provider rate limit compliance адаптирует скорость отправки к лимитам каждого провайдера ' +
      '(FCM, SES, Twilio). Digest-батчинг группирует однотипные уведомления, снижая стоимость и улучшая UX.\n\n' +
      '**Надёжность:** Exponential backoff с jitter и DLQ — индустриальный стандарт. DLQ изолирует проблемные сообщения, ' +
      'позволяя основному потоку работать без задержек. Мониторинг всех четырёх ключевых метрик обеспечивает полную ' +
      'наблюдаемость системы.',
    diagram:
      '```\n' +
      '                    ┌─────────────────────────────────────┐\n' +
      '                    │           API Gateway               │\n' +
      '                    │      (rate limit, auth)             │\n' +
      '                    └──────────────┬──────────────────────┘\n' +
      '                                   │\n' +
      '                                   ▼\n' +
      '                    ┌─────────────────────────────────────┐\n' +
      '                    │      Notification Service           │\n' +
      '                    │  (validate, enrich, template)       │\n' +
      '                    └──────────────┬──────────────────────┘\n' +
      '                                   │\n' +
      '                                   ▼\n' +
      '              ┌────────────────────────────────────────────┐\n' +
      '              │              Apache Kafka                  │\n' +
      '              │  ┌──────────┬──────────┬──────────┐       │\n' +
      '              │  │ critical │   high   │  normal  │ low   │\n' +
      '              │  │  topic   │  topic   │  topic   │ topic │\n' +
      '              │  └──────────┴──────────┴──────────┘       │\n' +
      '              └───────────────────┬────────────────────────┘\n' +
      '                                  │\n' +
      '                                  ▼\n' +
      '                    ┌─────────────────────────────┐\n' +
      '                    │      Priority Router        │\n' +
      '                    │  (channel + priority logic) │\n' +
      '                    └──┬──────────┬───────────┬───┘\n' +
      '                       │          │           │\n' +
      '              ┌────────▼──┐ ┌─────▼─────┐ ┌──▼────────┐\n' +
      '              │   Push    │ │   Email   │ │    SMS    │\n' +
      '              │  Workers  │ │  Workers  │ │  Workers  │\n' +
      '              │(rate ctrl)│ │(rate ctrl)│ │(rate ctrl)│\n' +
      '              └────┬──┬──┘ └───┬───┬───┘ └──┬────┬───┘\n' +
      '                   │  │        │   │        │    │\n' +
      '              ┌────▼┐ │   ┌────▼┐  │   ┌───▼─┐  │\n' +
      '              │ FCM │ │   │ SES │  │   │Twil.│  │\n' +
      '              │APNs │ │   │     │  │   │     │  │\n' +
      '              └─────┘ │   └─────┘  │   └─────┘  │\n' +
      '                      │            │            │\n' +
      '                      ▼            ▼            ▼\n' +
      '              ┌───────────────────────────────────────┐\n' +
      '              │          Dead Letter Queue            │\n' +
      '              │   (failed after max retries)          │\n' +
      '              └───────────────────┬───────────────────┘\n' +
      '                                  │\n' +
      '     ┌────────────────────────────┼────────────────────────┐\n' +
      '     │                            │                        │\n' +
      '     ▼                            ▼                        ▼\n' +
      '┌──────────┐          ┌───────────────────┐    ┌───────────────┐\n' +
      '│Cassandra │          │Preference Service │    │  Monitoring   │\n' +
      '│(history) │          │  (user opt-in/    │    │ (delivery %,  │\n' +
      '│          │          │   out settings)   │    │  bounce rate, │\n' +
      '└──────────┘          └───────────────────┘    │  latency,     │\n' +
      '                                               │  queue depth) │\n' +
      '                                               └───────────────┘\n' +
      '```',
  },
  capacityEstimates: {
    default: [
      {
        label: 'Daily notifications',
        value: '500M/day',
        formula:
          '100M users × avg 5 notifications/day = 500M/day',
      },
      {
        label: 'Peak send rate',
        value: '~17K/sec',
        formula:
          '500M / 86 400 ≈ 5 787/sec × 3× peak factor ≈ 17K/sec',
      },
      {
        label: 'Storage (30 days history)',
        value: '~15 TB',
        formula:
          '500M/day × 30 days × 1 KB per notification = 15 TB',
      },
      {
        label: 'Queue throughput',
        value: '17K msgs/sec',
        formula: '17K msgs/sec across all channels (push + email + SMS)',
      },
      {
        label: 'Push payload bandwidth',
        value: '~68 MB/s',
        formula: '17K/sec × 4 KB avg payload = ~68 MB/s',
      },
      {
        label: 'Email/SMS costs',
        value: '~$10K/day',
        formula:
          '500M × 20% email × $0.0001/email = $10 000/day',
      },
    ],
  },
};
