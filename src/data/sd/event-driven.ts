import type { Question } from '../types';

export const eventDrivenQuestions: Question[] = [
  {
    id: 'sd-event-driven-001',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'Что такое событийно-ориентированная архитектура (Event-Driven Architecture)?',
    options: [
      'Архитектура, в которой все сервисы общаются исключительно через синхронные HTTP-запросы',
      'Архитектура, в которой компоненты взаимодействуют через отправку и получение событий (асинхронных сообщений о произошедших фактах)',
      'Архитектура, в которой база данных автоматически оповещает все сервисы при изменении любой записи',
      'Архитектура, в которой каждый сервис работает независимо и не взаимодействует с другими',
    ],
    correctIndex: 1,
    explanation:
      'Event-Driven Architecture (EDA) — это архитектурный стиль, в котором компоненты системы взаимодействуют путём отправки и получения событий. Событие (event) — это неизменяемая запись о факте, который произошёл в системе (например, «заказ создан», «платёж обработан»). Это позволяет достичь слабой связанности между сервисами, высокой масштабируемости и гибкости в обработке бизнес-логики.',
  },
  {
    id: 'sd-event-driven-002',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'Какой из перечисленных компонентов является посредником для передачи событий между сервисами?',
    options: [
      'Load Balancer',
      'Event Broker (например, Apache Kafka, RabbitMQ)',
      'API Gateway',
      'CDN (Content Delivery Network)',
    ],
    correctIndex: 1,
    explanation:
      'Event Broker (брокер событий) — это инфраструктурный компонент, который принимает события от продюсеров (publishers) и доставляет их потребителям (subscribers). Примеры: Apache Kafka, RabbitMQ, Amazon EventBridge, NATS. Брокер обеспечивает развязку продюсеров и потребителей, буферизацию сообщений, гарантии доставки и масштабируемость.',
  },
  {
    id: 'sd-event-driven-003',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое Dead Letter Queue (DLQ)?',
    options: [
      'Очередь для хранения устаревших событий, срок хранения которых истёк',
      'Очередь, в которую попадают сообщения, которые не удалось обработать после заданного числа попыток',
      'Основная очередь, через которую проходят все события системы',
      'Специальная очередь для приоритетных событий, требующих немедленной обработки',
    ],
    correctIndex: 1,
    explanation:
      'Dead Letter Queue (DLQ) — это специальная очередь, куда помещаются сообщения, которые не удалось успешно обработать после заданного числа попыток (retry). Это позволяет не блокировать основную очередь и не терять проблемные сообщения. Команда может позже проанализировать DLQ, выявить причину ошибок и переотправить сообщения после исправления. DLQ — критически важный элемент отказоустойчивой EDA.',
  },
  {
    id: 'sd-event-driven-004',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что означает идемпотентность обработки событий?',
    options: [
      'Событие может быть отправлено только одному потребителю',
      'Повторная обработка одного и того же события приводит к тому же результату, что и при первой обработке',
      'Каждое событие обрабатывается строго один раз без возможности повтора',
      'Потребитель может обрабатывать события только в порядке их поступления',
    ],
    correctIndex: 1,
    explanation:
      'Идемпотентность (idempotency) — свойство операции, при котором многократное применение с одними и теми же параметрами даёт тот же результат, что и однократное. В EDA это критически важно, потому что сообщения могут доставляться повторно (at-least-once delivery). Типичные подходы: хранение обработанных event ID в базе, использование идемпотентных ключей (idempotency key), версионирование состояния.',
  },
  {
    id: 'sd-event-driven-005',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'Чем доменное событие (domain event) отличается от технического события (integration event)?',
    options: [
      'Доменное событие всегда синхронное, а техническое — асинхронное',
      'Доменное событие описывает факт внутри bounded context и имеет бизнес-смысл, а интеграционное событие предназначено для общения между сервисами',
      'Доменные события хранятся только в оперативной памяти, а технические — в базе данных',
      'Доменные события не содержат данных, а только идентификатор произошедшего действия',
    ],
    correctIndex: 1,
    explanation:
      'Доменное событие (domain event) — это запись о значимом факте внутри конкретного ограниченного контекста (bounded context). Например, OrderPlaced, PaymentReceived. Оно имеет чёткий бизнес-смысл и принадлежит модели предметной области. Интеграционное событие (integration event) используется для коммуникации между разными bounded context / сервисами. Оно может быть результатом доменного события, но содержит только ту информацию, которая нужна внешним потребителям, и не раскрывает внутреннюю модель.',
  },
  {
    id: 'sd-event-driven-006',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'open',
    question:
      'Опишите, в чём преимущества событийно-ориентированной архитектуры перед синхронным взаимодействием между сервисами. Назовите минимум три преимущества.',
    sampleAnswer:
      '1) Слабая связанность (loose coupling): продюсеры не знают о потребителях, что позволяет добавлять, удалять и изменять сервисы независимо. 2) Масштабируемость: потребители могут обрабатывать события параллельно и независимо масштабироваться. 3) Отказоустойчивость: если потребитель временно недоступен, события сохраняются в брокере и обрабатываются после восстановления. 4) Гибкость: можно добавить нового потребителя для уже существующих событий без модификации продюсера. 5) Буферизация нагрузки: брокер сглаживает пики нагрузки.',
    explanation:
      'EDA позволяет строить распределённые системы, которые лучше переносят сбои, легче масштабируются и проще эволюционируют. Однако у этого подхода есть и недостатки: сложность отладки (трассировка событий через несколько сервисов), eventual consistency, необходимость обеспечения идемпотентности и упорядочивания событий.',
  },
  {
    id: 'sd-event-driven-007',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое Event Sourcing?',
    options: [
      'Паттерн, при котором текущее состояние объекта восстанавливается путём последовательного воспроизведения всех произошедших с ним событий',
      'Механизм подписки нескольких потребителей на одно событие через fan-out',
      'Метод фильтрации событий на уровне брокера до отправки потребителям',
      'Стратегия кэширования событий для ускорения повторной обработки',
    ],
    correctIndex: 0,
    explanation:
      'Event Sourcing — паттерн, при котором вместо хранения текущего состояния объекта в базе данных сохраняется полная последовательность событий (event log), которые привели к этому состоянию. Текущее состояние восстанавливается путём «проигрывания» всех событий. Преимущества: полная аудитность, возможность воспроизвести любое прошлое состояние, естественная интеграция с EDA. Недостатки: сложность запросов к текущему состоянию, рост хранилища, необходимость снимков (snapshots) для оптимизации.',
  },
  {
    id: 'sd-event-driven-008',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Какой паттерн разделяет модели чтения и записи данных, позволяя оптимизировать каждую из них независимо?',
    options: [
      'Saga Pattern',
      'Outbox Pattern',
      'CQRS (Command Query Responsibility Segregation)',
      'Event Mesh',
    ],
    correctIndex: 2,
    explanation:
      'CQRS (Command Query Responsibility Segregation) — паттерн, разделяющий операции чтения (Query) и записи (Command) на уровне модели. Модель записи оптимизирована для обработки команд и бизнес-логики, а модель чтения — для быстрых запросов (может быть денормализованной, использовать отдельное хранилище). Часто применяется вместе с Event Sourcing: события из модели записи проецируются (project) в модель чтения. Это повышает производительность и масштабируемость, но увеличивает сложность системы.',
  },
  {
    id: 'sd-event-driven-009',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Чем отличается оркестрация (orchestration) от хореографии (choreography) в паттерне Saga?',
    options: [
      'Оркестрация использует синхронные вызовы, а хореография — асинхронные',
      'Оркестрация предполагает центральный координатор, управляющий шагами саги, а хореография — децентрализованное взаимодействие через события',
      'Оркестрация применяется только для монолитов, а хореография — только для микросервисов',
      'Оркестрация гарантирует строгую консистентность, а хореография — нет',
    ],
    correctIndex: 1,
    explanation:
      'В оркестрации (orchestration-based saga) существует центральный координатор (оркестратор), который последовательно вызывает участников саги и управляет потоком. Он знает обо всех шагах и компенсирующих действиях. В хореографии (choreography-based saga) каждый сервис самостоятельно реагирует на события и публикует свои, нет центрального координатора. Оркестрация проще для понимания и отладки, но создаёт единую точку отказа. Хореография обеспечивает лучшую связанность, но поток сложнее отслеживать.',
  },
  {
    id: 'sd-event-driven-010',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Для чего используется Outbox Pattern?',
    options: [
      'Для кэширования событий перед отправкой потребителям с целью снижения нагрузки на брокер',
      'Для гарантии атомарной записи изменений в БД и публикации события, без потери данных при сбоях',
      'Для маршрутизации событий по различным топикам в зависимости от содержимого',
      'Для дедупликации событий на стороне потребителя',
    ],
    correctIndex: 1,
    explanation:
      'Outbox Pattern решает проблему «двойной записи» (dual write): когда нужно атомарно сохранить данные в БД и опубликовать событие в брокер. Без паттерна возможна ситуация, когда данные сохранены, а событие потеряно (или наоборот). Решение: вместо отправки события напрямую, оно записывается в таблицу outbox в той же транзакции, что и бизнес-данные. Отдельный процесс (polling publisher или CDC — Change Data Capture, например Debezium) читает outbox и публикует события в брокер. Это гарантирует at-least-once доставку.',
  },
  {
    id: 'sd-event-driven-011',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Какой подход к эволюции схемы событий позволяет добавлять новые поля без нарушения совместимости с существующими потребителями?',
    options: [
      'Strict Schema — полный запрет на изменение схемы после публикации',
      'Backward-compatible (обратно совместимая) эволюция с необязательными полями и Schema Registry',
      'Полная замена схемы с принудительным обновлением всех потребителей',
      'Двойная публикация события в старом и новом формате одновременно',
    ],
    correctIndex: 1,
    explanation:
      'Backward-compatible evolution — основной подход к эволюции схемы событий. Новые поля добавляются как необязательные (optional), старые поля не удаляются и не меняют тип. Schema Registry (например, Confluent Schema Registry с Avro/Protobuf/JSON Schema) автоматически проверяет совместимость при регистрации новой версии схемы. Существуют уровни совместимости: backward (новый потребитель читает старые события), forward (старый потребитель читает новые события), full (обе стороны).',
  },
  {
    id: 'sd-event-driven-012',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question:
      'Объясните, что такое eventual consistency и почему она неизбежна в событийно-ориентированных системах. Как минимизировать её негативное влияние на пользовательский опыт?',
    sampleAnswer:
      'Eventual consistency — модель консистентности, при которой система гарантирует, что все реплики данных со временем придут к одному состоянию, но в любой момент времени данные могут быть неконсистентны. В EDA она неизбежна, потому что события обрабатываются асинхронно: после публикации события изменения в модели чтения происходят с задержкой. Способы минимизации влияния: 1) Read-your-writes: после записи перенаправлять пользователя на чтение из модели записи. 2) Оптимистичный UI: показывать предполагаемый результат до подтверждения. 3) Уведомления: сообщать пользователю о статусе обработки (WebSocket, polling). 4) Каузальная консистентность: гарантировать порядок обработки зависимых событий.',
    explanation:
      'Eventual consistency — это фундаментальный компромисс в распределённых системах (CAP-теорема). В EDA-системах важно проектировать UX с учётом асинхронности: использовать паттерны вроде «заказ принят к обработке» вместо «заказ создан», предоставлять механизмы отслеживания статуса и обрабатывать конфликты.',
  },
  {
    id: 'sd-event-driven-013',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question:
      'Что такое паттерн Saga? Объясните, как он обеспечивает консистентность данных в распределённой системе при отсутствии распределённых транзакций. Приведите пример.',
    sampleAnswer:
      'Saga — паттерн управления распределёнными транзакциями, который заменяет одну ACID-транзакцию последовательностью локальных транзакций в разных сервисах. Каждый шаг имеет компенсирующее действие (compensating transaction), которое выполняется при сбое. Пример: оформление заказа — 1) Сервис заказов создаёт заказ (компенсация: отменить заказ). 2) Сервис оплаты списывает средства (компенсация: вернуть средства). 3) Сервис склада резервирует товар (компенсация: снять резерв). 4) Сервис доставки создаёт отправку. Если шаг 3 неуспешен, выполняются компенсации в обратном порядке: возврат средств → отмена заказа. Saga обеспечивает eventual consistency, а не строгую ACID.',
    explanation:
      'Saga — один из ключевых паттернов в микросервисной архитектуре. Его правильная реализация требует тщательного проектирования компенсирующих действий, обработки тайм-аутов и обеспечения идемпотентности каждого шага. Два подхода реализации — оркестрация и хореография — имеют свои компромиссы по сложности и связанности.',
  },
  {
    id: 'sd-event-driven-014',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question:
      'Сравните модели доставки сообщений: at-most-once, at-least-once и exactly-once. Какая из них наиболее реалистична для распределённых систем и почему?',
    sampleAnswer:
      'At-most-once: сообщение доставляется не более одного раза, возможна потеря. Продюсер отправляет и не ждёт подтверждения (fire-and-forget). At-least-once: сообщение доставляется минимум один раз, возможны дубликаты. Продюсер повторяет отправку при отсутствии подтверждения. At-least-once — наиболее реалистичная и распространённая модель, потому что true exactly-once в распределённой системе практически невозможна (Two Generals Problem). Exactly-once семантика достигается через at-least-once delivery + идемпотентная обработка на стороне потребителя (effectively-once). Kafka Streams и Apache Flink реализуют exactly-once через транзакции и идемпотентных продюсеров в рамках своей экосистемы.',
    explanation:
      'Выбор гарантии доставки — ключевое архитектурное решение. At-most-once подходит для метрик и логов, where потеря отдельных сообщений допустима. At-least-once + идемпотентность — стандарт для бизнес-критичных операций. «Exactly-once» в маркетинге брокеров обычно означает «effectively-once» в рамках конкретной платформы.',
  },
  {
    id: 'sd-event-driven-015',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Что такое Event Mesh и чем он отличается от простого Event Broker?',
    options: [
      'Event Mesh — это кэширующий слой поверх Event Broker для ускорения доставки',
      'Event Mesh — это сеть взаимосвязанных Event Broker-ов, обеспечивающая маршрутизацию событий между различными средами, облаками и регионами',
      'Event Mesh — это паттерн организации хранения событий в файловой системе',
      'Event Mesh и Event Broker — это синонимы одной и той же технологии',
    ],
    correctIndex: 1,
    explanation:
      'Event Mesh — это архитектурный слой, состоящий из сети взаимосвязанных event broker-ов, которая динамически маршрутизирует события между приложениями, облачными провайдерами, средами (dev/staging/prod) и дата-центрами. В отличие от одного брокера, event mesh обеспечивает глобальную маршрутизацию, протокольную трансляцию (MQTT, AMQP, REST), отказоустойчивость на уровне инфраструктуры. Примеры: Solace PubSub+ Event Mesh, Confluent Platform с Multi-Region Clusters.',
  },
  {
    id: 'sd-event-driven-016',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Какая стратегия в Event Sourcing решает проблему длительного восстановления состояния при большом количестве событий?',
    options: [
      'Event Compaction — удаление всех событий и сохранение только последнего состояния',
      'Snapshotting — периодическое сохранение агрегированного состояния, от которого начинается воспроизведение последующих событий',
      'Event Batching — группировка нескольких событий в одно агрегированное событие',
      'Parallel Replay — параллельное воспроизведение всех событий на нескольких потоках',
    ],
    correctIndex: 1,
    explanation:
      'Snapshotting — ключевая оптимизация в Event Sourcing. Вместо воспроизведения всех событий с начала жизни агрегата, система периодически (например, каждые N событий) сохраняет «снимок» текущего состояния. При восстановлении загружается последний snapshot и воспроизводятся только события после него. Это кардинально сокращает время восстановления — с O(n) для всех событий до O(1) для snapshot + O(k) для оставшихся событий. Важно: snapshot — это оптимизация, источником истины остаётся лог событий.',
  },
  {
    id: 'sd-event-driven-017',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question:
      'Как реализовать Outbox Pattern с использованием Change Data Capture (CDC)? Опишите архитектуру, компоненты и гарантии, которые обеспечивает этот подход.',
    sampleAnswer:
      'Архитектура: 1) Сервис записывает бизнес-данные и событие в таблицу outbox в одной транзакции БД. 2) CDC-коннектор (например, Debezium) подключается к WAL (Write-Ahead Log) / binlog базы данных и отслеживает изменения в таблице outbox. 3) Каждая новая запись в outbox автоматически захватывается CDC и публикуется в Kafka-топик. 4) Потребители подписываются на топик и обрабатывают события. Компоненты: PostgreSQL/MySQL (БД с outbox-таблицей), Debezium (CDC-коннектор), Apache Kafka Connect (инфраструктура), Kafka (брокер). Гарантии: атомарность (событие и данные в одной транзакции), at-least-once доставка (CDC гарантирует захват всех изменений из WAL), низкая задержка (CDC читает WAL почти в реальном времени, без polling). Потребитель должен быть идемпотентным.',
    explanation:
      'CDC-based Outbox Pattern — это production-grade решение, используемое в Netflix, Uber, Airbnb. Debezium + Kafka Connect — де-факто стандарт. Альтернатива — polling publisher (SELECT из outbox по крону), но CDC эффективнее, так как не нагружает БД запросами и обеспечивает меньшую задержку.',
  },
  {
    id: 'sd-event-driven-018',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question:
      'Спроектируйте систему обработки заказов на основе Event Sourcing и CQRS. Опишите основные агрегаты, события, модели чтения и потоки данных.',
    sampleAnswer:
      'Агрегат Order: управляет жизненным циклом заказа. События: OrderCreated(orderId, items, customerId), OrderPaymentReceived(orderId, paymentId, amount), OrderItemReserved(orderId, itemId), OrderShipped(orderId, trackingNumber), OrderCancelled(orderId, reason). Модель записи: Event Store хранит все события. Агрегат Order загружается из событий, применяет бизнес-правила (нельзя оплатить отменённый заказ), генерирует новые события. Модели чтения (проекции): 1) OrderSummaryView — денормализованная таблица для быстрого отображения списка заказов. 2) OrderDetailView — полная информация о заказе с историей статусов. 3) CustomerOrdersView — заказы клиента для личного кабинета. 4) AnalyticsView — агрегированные данные для аналитики. Потоки: Command → Aggregate → Event Store → Event Bus → Projectors → Read Models. Проекторы подписываются на поток событий и обновляют соответствующие read-модели. Read API обращается к денормализованным моделям чтения.',
    explanation:
      'Event Sourcing + CQRS — мощная комбинация для сложных доменов. Ключевые решения: выбор Event Store (EventStoreDB, Kafka, PostgreSQL), стратегия проецирования (синхронная/асинхронная), обработка ошибок проекций (replay, dead letter), снимки для агрегатов с большим числом событий.',
  },
  {
    id: 'sd-event-driven-019',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question:
      'Как обеспечить строгий порядок обработки событий в распределённой системе с несколькими партициями (partitions) в Kafka? Какие компромиссы возникают?',
    sampleAnswer:
      'Kafka гарантирует порядок событий только внутри одной партиции. Стратегии обеспечения порядка: 1) Партиционирование по ключу: все события одной сущности (например, orderId) направляются в одну партицию через partition key. Это гарантирует порядок для конкретного агрегата. 2) Одна партиция: использовать один partition для всего топика — порядок глобальный, но пропускная способность сильно ограничена (один consumer). 3) Sequence numbers: каждое событие содержит порядковый номер, потребитель обнаруживает пропуски и ожидает недостающие события. 4) Causal ordering: включать в событие ссылку на предыдущее (causation ID), потребитель выстраивает цепочку. Компромиссы: строгий порядок ограничивает параллелизм (только один потребитель на партицию), увеличивает задержку (ожидание недостающих событий), усложняет ребалансировку. Оптимальный подход — порядок на уровне entity key, а не глобальный.',
    explanation:
      'Ordering — одна из самых сложных проблем в EDA. В реальных системах глобальный порядок обычно не нужен — достаточно порядка для конкретной сущности. Kafka с partition key по entity ID — стандартное решение. При ребалансировке потребителей важно учитывать, что новый consumer должен «дочитать» текущее смещение до начала обработки новых сообщений.',
  },
  {
    id: 'sd-event-driven-020',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Какая проблема возникает при использовании Event Sourcing, если необходимо изменить структуру уже сохранённых событий?',
    options: [
      'Невозможность добавить новые типы событий в систему',
      'Event upcasting — необходимость преобразования старых событий к новой схеме при воспроизведении, что требует поддержки версионирования и миграции схем',
      'Автоматическое удаление всех событий при изменении схемы',
      'Невозможность создать snapshot до обновления всех событий',
    ],
    correctIndex: 1,
    explanation:
      'Event upcasting — процесс преобразования событий из старой версии схемы в новую «на лету» при загрузке из Event Store. Поскольку события неизменяемы (immutable), мы не можем переписать историю. Подходы: 1) Upcasters — трансформеры, которые конвертируют v1 → v2 → v3 при загрузке. 2) Lazy migration — событие хранит номер версии, агрегат умеет обрабатывать все версии. 3) Copy-transform — создание нового потока с трансформированными событиями (дорого). Schema Registry помогает контролировать совместимость, но upcasting остаётся ответственностью приложения.',
  },
  {
    id: 'sd-event-driven-021',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое Event Storming и для чего он используется?',
    options: [
      'Техника нагрузочного тестирования event-driven систем',
      'Воркшоп-техника для коллективного моделирования бизнес-процессов через идентификацию доменных событий',
      'Метод защиты от DDoS-атак на message broker',
      'Алгоритм балансировки нагрузки между consumer-ами',
    ],
    correctIndex: 1,
    explanation:
      'Event Storming — интерактивная техника моделирования, разработанная Alberto Brandolini. Участники (разработчики, бизнес-эксперты) записывают события на стикерах на большой стене в хронологическом порядке. Элементы: Events (оранжевые, прошедшее время — OrderPlaced), Commands (синие — PlaceOrder), Aggregates (жёлтые), Policies (лиловые — when...then), External Systems, Read Models. Результат: общее понимание домена, выявление bounded contexts, основа для Event Sourcing и CQRS.',
  },
  {
    id: 'sd-event-driven-022',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Чем notification event отличается от event-carried state transfer?',
    options: [
      'Notification event содержит полные данные, event-carried state — только ID',
      'Notification event сообщает о факте с минимумом данных, event-carried state transfer содержит полные данные для обновления состояния без дополнительного запроса',
      'Notification event асинхронный, event-carried state — синхронный',
      'Это синонимы одного паттерна',
    ],
    correctIndex: 1,
    explanation:
      'Notification event: «OrderCreated {orderId: 123}» — уведомляет о факте, потребитель при необходимости запрашивает детали через API. Минимальный payload, но coupling через API. Event-carried state transfer: «OrderCreated {orderId: 123, items: [...], total: 500, customer: {...}}» — всё необходимое в событии. Потребитель обновляет локальную копию данных без запросов. Меньше coupling, но больше payload и сложность поддержания совместимости. Выбор зависит от use case.',
  },
  {
    id: 'sd-event-driven-023',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'open',
    question: 'Что такое backpressure в event-driven системах? Как с ним справляться?',
    sampleAnswer:
      'Backpressure возникает, когда producer генерирует события быстрее, чем consumer успевает обрабатывать. Признаки: рост consumer lag, увеличение latency, переполнение очередей. Стратегии: 1) Буферизация — увеличить размер очередей (временное решение). 2) Dropping — отбрасывать события при переполнении (для некритичных данных). 3) Sampling — обрабатывать только часть событий. 4) Producer throttling — замедлить продюсера (сигнализировать через backpressure). 5) Scaling consumers — добавить инстансы, увеличить партиции. 6) Batching — обрабатывать события пакетами. Reactive Streams (Java), Kafka consumer pause/resume, RabbitMQ prefetch — механизмы backpressure. Мониторинг consumer lag — ключевой индикатор.',
    explanation:
      'Backpressure — фундаментальная проблема асинхронных систем. Без управления backpressure система падает при пиках нагрузки. Kafka consumer lag — каноничная метрика: если lag растёт, система не справляется.',
  },
  {
    id: 'sd-event-driven-024',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое consumer group в Apache Kafka?',
    options: [
      'Группа топиков, объединённых по бизнес-домену',
      'Группа consumer-ов, совместно обрабатывающих партиции топика: каждая партиция назначается только одному consumer в группе',
      'Административная группа для управления кластером',
      'Набор правил фильтрации сообщений',
    ],
    correctIndex: 1,
    explanation:
      'Consumer group — механизм параллельной обработки в Kafka. Consumer-ы с одинаковым group.id образуют группу. Kafka назначает партиции между ними: каждая партиция читается ровно одним consumer-ом в группе. При добавлении/удалении consumer-а происходит rebalance. Если consumer-ов больше партиций — лишние простаивают. Разные consumer groups читают данные независимо (каждая со своим offset). Это обеспечивает масштабирование обработки и multiple consumers pattern.',
  },
  {
    id: 'sd-event-driven-025',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое Complex Event Processing (CEP)?',
    options: [
      'Шифрование событий перед отправкой',
      'Технология анализа потоков событий в реальном времени для обнаружения паттернов, корреляций и аномалий',
      'Сжатие событий для экономии места',
      'Механизм репликации событий между дата-центрами',
    ],
    correctIndex: 1,
    explanation:
      'Complex Event Processing (CEP) — анализ потоков событий для обнаружения сложных паттернов. Операции: фильтрация, агрегация, windowing (временные окна), pattern matching (A → B → C за 5 минут), корреляция событий из разных источников. Примеры: fraud detection (3 транзакции из разных стран за минуту), IoT alerting (температура > 100°C в течение 5 минут), algorithmic trading. Инструменты: Apache Flink, Kafka Streams, Esper, AWS Kinesis Data Analytics. CEP требует stateful processing и checkpointing для fault tolerance.',
  },
  {
    id: 'sd-event-driven-026',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Как организовать версионирование событий при backward-incompatible изменениях?',
    options: [
      'Всегда удалять старые версии событий',
      'Создать новый топик/тип события с версией (OrderCreatedV2), параллельная публикация обеих версий на переходный период',
      'Остановить всех consumer-ов для обновления',
      'Использовать только forward-compatible изменения',
    ],
    correctIndex: 1,
    explanation:
      'При breaking changes в схеме события: 1) Новый event type: OrderCreatedV2 наряду с OrderCreated. 2) Producer публикует оба события в переходный период. 3) Consumer-ы мигрируют на V2, после чего V1 deprecated. 4) Альтернатива — версия в metadata события (event_version: 2), consumer обрабатывает обе версии. Schema Registry (Confluent) автоматизирует проверку совместимости при регистрации новых версий. Compatibility levels: backward, forward, full. Правило: избегать breaking changes через добавление optional fields.',
  },
  {
    id: 'sd-event-driven-027',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question: 'Сравните pull-based (Kafka) и push-based (RabbitMQ) модели доставки сообщений. Когда какую выбрать?',
    sampleAnswer:
      'Pull-based (Kafka): consumer сам запрашивает сообщения. Преимущества: consumer контролирует скорость (backpressure из коробки), replay возможен (читать с любого offset), batch processing эффективен. Недостатки: latency выше (polling interval), consumer сложнее. Подходит: высокая пропускная способность, stream processing, replay/reprocessing. Push-based (RabbitMQ): broker отправляет сообщения consumer-у. Преимущества: низкая latency (мгновенная доставка), проще consumer. Недостатки: backpressure сложнее (prefetch), нет replay (сообщение удаляется после ack). Подходит: task queues, RPC, низкая latency критична. Гибрид: Kafka с reactive consumer (poll с блокировкой) снижает latency. Выбор: Kafka для data pipeline и event sourcing, RabbitMQ для traditional messaging и job queues.',
    explanation:
      'Kafka и RabbitMQ — разные инструменты для разных задач. Kafka — distributed log для event streaming. RabbitMQ — message broker для task distribution. Современный тренд: Kafka как универсальная платформа, RabbitMQ для legacy интеграций.',
  },
  {
    id: 'sd-event-driven-028',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question: 'Как реализовать паттерн Transactional Outbox без CDC? Опишите polling publisher подход.',
    sampleAnswer:
      'Polling Publisher — альтернатива CDC для Outbox Pattern. Реализация: 1) Таблица outbox в БД: id, aggregate_type, aggregate_id, event_type, payload, created_at, published_at (nullable). 2) Бизнес-транзакция записывает данные и событие в outbox атомарно. 3) Publisher процесс (отдельный или в приложении) периодически (каждые N секунд) выполняет: SELECT * FROM outbox WHERE published_at IS NULL ORDER BY created_at LIMIT 100. 4) Публикует события в broker. 5) Обновляет published_at (или удаляет записи). Нюансы: exactly-once — при сбое между publish и update будут дубликаты → consumer должен быть идемпотентным. Упорядочивание: ORDER BY + sequential processing или partition key для параллелизма. Cleanup: периодическое удаление старых записей.',
    explanation:
      'Polling publisher проще CDC (не нужен Debezium), но менее эффективен (нагрузка на БД от polling, выше latency). Для простых систем — хороший старт. При росте — миграция на CDC. Microservices Patterns (Chris Richardson) детально описывает оба подхода.',
  },
  {
    id: 'sd-event-driven-029',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое event replay и для чего он используется?',
    options: [
      'Повторная отправка события при ошибке сети',
      'Повторная обработка исторических событий из Event Store или топика для восстановления состояния, миграции или исправления ошибок',
      'Кэширование событий для быстрого доступа',
      'Репликация событий между кластерами',
    ],
    correctIndex: 1,
    explanation:
      'Event replay — воспроизведение событий из хранилища. Use cases: 1) Восстановление состояния агрегата в Event Sourcing (load all events, apply). 2) Rebuilding read models: при изменении схемы projection перечитываем все события. 3) Bug fix: исправили баг в обработчике — replay для коррекции данных. 4) New consumer: новый сервис подписывается и читает историю. 5) Testing: replay production событий в staging. Требования: events immutable, идемпотентная обработка, хранение достаточной истории. Kafka retention, EventStoreDB, custom event store обеспечивают replay capability.',
  },
  {
    id: 'sd-event-driven-030',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое Choreography-based Saga и какие у неё преимущества перед Orchestration?',
    options: [
      'Choreography быстрее, так как не использует сеть',
      'В Choreography нет центрального координатора: каждый сервис реагирует на события и публикует свои, что обеспечивает лучшую decoupling и отсутствие single point of failure',
      'Choreography поддерживает только два участника',
      'Choreography проще в отладке',
    ],
    correctIndex: 1,
    explanation:
      'Choreography-based Saga: сервисы общаются только через события. OrderService публикует OrderCreated → PaymentService слушает, обрабатывает, публикует PaymentProcessed → InventoryService слушает, резервирует, публикует InventoryReserved → ... Преимущества: loose coupling (сервисы не знают друг о друге), no single point of failure, лучше масштабируется. Недостатки: сложнее понять полный flow (распределён по сервисам), сложнее отлаживать, cyclic dependencies возможны. Orchestration проще для понимания, но оркестратор — bottleneck. Выбор: простые саги (3-4 шага) — choreography, сложные — orchestration.',
  },
  {
    id: 'sd-event-driven-031',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое projection в контексте Event Sourcing и CQRS?',
    options: [
      'Прогнозирование будущих событий на основе ML',
      'Функция, преобразующая поток событий в оптимизированную read model (view) для запросов',
      'Проекция базы данных на другой сервер',
      'Шифрование событий при хранении',
    ],
    correctIndex: 1,
    explanation:
      'Projection (проекция) — процесс построения read model из потока событий. Projector подписывается на события и обновляет денормализованное представление. Пример: события OrderCreated, ItemAdded, OrderShipped → OrderSummaryView (таблица с текущим статусом заказа). Виды: sync projection (в той же транзакции — strong consistency), async projection (отдельный процесс — eventual consistency). Rebuild: при изменении логики проекции — replay всех событий. Checkpoint: проекция сохраняет последний обработанный event position для recovery.',
  },
  {
    id: 'sd-event-driven-032',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Как обеспечить exactly-once семантику в Kafka? Опишите механизмы transactional producer и idempotent consumer.',
    sampleAnswer:
      'Exactly-once в Kafka (Kafka Streams, Transactional API): 1) Idempotent Producer: enable.idempotence=true. Kafka присваивает producer ID и sequence numbers. При retry дублирующие сообщения отбрасываются брокером. Гарантирует exactly-once per partition. 2) Transactional Producer: транзакция охватывает multiple partitions. initTransactions() → beginTransaction() → send() → sendOffsetsToTransaction() → commitTransaction(). Consumer читает только committed сообщения (isolation.level=read_committed). 3) Kafka Streams: exactly-once между read и write через processing.guarantee=exactly_once. Работает внутри Kafka экосистемы. 4) Idempotent Consumer: для внешних систем — дедупликация по event ID в БД consumer-а (INSERT ON CONFLICT DO NOTHING). Важно: exactly-once — effectively-once (at-least-once + idempotency/transactions). True exactly-once между distributed systems невозможен.',
    explanation:
      'Exactly-once — маркетинговый термин, но Kafka Transactions реально обеспечивают atomic read-process-write. Для систем вне Kafka (DB, external API) необходим idempotent consumer. Confluent документация детально описывает гарантии и ограничения.',
  },
  {
    id: 'sd-event-driven-033',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите паттерн Event-Driven Microservices. Как разделить bounded contexts и определить контракты событий?',
    sampleAnswer:
      'Event-Driven Microservices: сервисы общаются преимущественно через асинхронные события. Bounded Context определение: 1) Event Storming для выявления domains и событий. 2) Группировка событий по ubiquitous language — разные термины = разные contexts. 3) Context Mapping: определить отношения (customer/supplier, conformist, anticorruption layer). Контракты событий: 1) Event Schema: структура события в JSON Schema, Avro, Protobuf. 2) Schema Registry: централизованное хранение и версионирование схем. 3) Consumer-Driven Contracts: consumer определяет minimal required fields, producer обязуется их предоставить (Pact, Spring Cloud Contract). 4) Event Catalog: документация всех событий (AsyncAPI specification). 5) Compatibility rules: backward/forward compatible changes. Integration Events vs Domain Events: integration events — публичный контракт между contexts, domain events — внутренние.',
    explanation:
      'Event-driven microservices требуют дисциплины в управлении контрактами. Без Schema Registry и compatibility checks — integration hell. AsyncAPI — стандарт документирования event-driven APIs, аналог OpenAPI для async.',
  },
  {
    id: 'sd-event-driven-034',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое fan-out паттерн в event-driven системах?',
    options: [
      'Объединение нескольких событий в одно',
      'Доставка одного события множеству независимых потребителей для параллельной обработки',
      'Последовательная обработка событий',
      'Фильтрация событий по критериям',
    ],
    correctIndex: 1,
    explanation:
      'Fan-out — паттерн, при котором одно событие доставляется нескольким независимым consumer-ам. Каждый consumer обрабатывает событие по-своему. Пример: OrderCreated → NotificationService (email), AnalyticsService (статистика), InventoryService (резерв), RecommendationService (ML). Реализация: Kafka — разные consumer groups, RabbitMQ — fanout exchange, SNS → multiple SQS. Fan-out обеспечивает loose coupling — producer не знает о consumers, добавление нового consumer не требует изменений в producer.',
  },
  {
    id: 'sd-event-driven-035',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое event enrichment и когда его применять?',
    options: [
      'Сжатие событий для экономии места',
      'Добавление дополнительных данных к событию из внешних источников перед доставкой consumer-у',
      'Шифрование payload события',
      'Удаление лишних полей из события',
    ],
    correctIndex: 1,
    explanation:
      'Event enrichment — обогащение события дополнительными данными. Пример: OrderCreated {userId: 123} → enricher добавляет данные пользователя из User Service → OrderCreated {userId: 123, userName: "John", userTier: "gold"}. Реализация: enrichment service между producer и consumer, или в Kafka Streams (join с KTable). Применение: consumer-у нужны данные, которых нет в исходном событии; снижение coupling (consumer не вызывает User Service). Осторожно: enricher добавляет latency, зависимость от external service, stale data возможны.',
  },
  {
    id: 'sd-event-driven-036',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question: 'Как тестировать event-driven системы? Опишите стратегии unit, integration и contract testing.',
    sampleAnswer:
      'Testing event-driven systems: 1) Unit tests: тестирование event handlers изолированно. Mock event → handler → assert state change / published events. Для Event Sourcing: given events → when command → then events. 2) Integration tests: тестирование с реальным broker. Testcontainers для запуска Kafka/RabbitMQ. Publish event → wait → assert consumer processed. Challenges: асинхронность (await/polling), timing. 3) Contract tests: Consumer-Driven Contracts (Pact). Consumer определяет ожидаемую структуру события. Producer проверяет, что генерирует совместимые события. Защита от breaking changes. 4) E2E tests: полный flow через несколько сервисов. Сложно, но необходимо для критичных путей. 5) Chaos testing: симуляция сбоев broker, consumer lag, duplicates. Инструменты: Pact, Spring Cloud Contract (schema compatibility), ArchUnit (architecture rules).',
    explanation:
      'Тестирование EDA сложнее синхронных систем из-за асинхронности и распределённости. Contract tests критически важны — предотвращают integration issues. Event Storming → Scenario-based tests обеспечивают покрытие бизнес-сценариев.',
  },
  {
    id: 'sd-event-driven-037',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое temporal coupling и как event-driven архитектура помогает его избежать?',
    options: [
      'Связывание сервисов по времени их deployment',
      'Зависимость, при которой для выполнения операции все участники должны быть доступны одновременно; EDA устраняет это через асинхронность и буферизацию',
      'Привязка событий к конкретному времени суток',
      'Синхронизация часов между сервисами',
    ],
    correctIndex: 1,
    explanation:
      'Temporal coupling — форма coupling, при которой компоненты должны быть доступны в одно время. Синхронный вызов: Service A → HTTP → Service B. Если B недоступен, A не может работать. Event-driven: A публикует событие в broker → B обрабатывает когда доступен. Broker буферизует события. A и B temporally decoupled — работают независимо. Это повышает resilience: partial failures не каскадируют, системы могут «догнать» после восстановления. Компромисс: eventual consistency вместо strong consistency.',
  },
  {
    id: 'sd-event-driven-038',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Как спроектировать систему уведомлений на основе event-driven архитектуры? Опишите ключевые компоненты.',
    sampleAnswer:
      'Notification system на EDA: 1) Event Sources: различные сервисы публикуют бизнес-события (OrderShipped, PaymentFailed, PasswordChanged). 2) Notification Router: подписывается на события, определяет какие уведомления отправить на основе rules (OrderShipped → email + push, PaymentFailed → SMS + email). User preferences учитываются. 3) Channel Services: отдельные сервисы для каждого канала (EmailService, SMSService, PushService). Каждый слушает notification requests из своей очереди. 4) Template Engine: шаблоны уведомлений с локализацией. 5) Delivery Tracking: статус доставки (sent, delivered, failed), retry для failed. 6) Rate Limiting: защита от спама (не более N уведомлений в час). 7) Aggregation: группировка уведомлений (5 новых сообщений вместо 5 отдельных). DLQ для failed notifications, monitoring delivery rates по каналам.',
    explanation:
      'Notification system — классический use case для EDA. Decoupling от бизнес-сервисов через события, независимое масштабирование каналов, resilience к сбоям external providers (email/SMS). Twilio, SendGrid как managed channel providers.',
  },
  {
    id: 'sd-event-driven-039',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Объясните концепцию event-driven data mesh. Как события связаны с data products?',
    sampleAnswer:
      'Data Mesh (Zhamak Dehghani) — децентрализованная архитектура данных. Принципы: domain ownership (данные принадлежат доменам), data as a product, self-serve platform, federated governance. Event-driven в Data Mesh: 1) Events as data products: поток событий — продукт данных домена. OrderDomain публикует OrderEvents stream как data product с SLA, schema, documentation. 2) Event streaming platform: Kafka как self-serve инфраструктура для data products. Домены создают топики, consumer-ы подписываются. 3) Real-time data products: events → stream processing (Flink) → materialized views, aggregations как data products. 4) Event catalog: discovery всех event streams (schema registry + metadata). 5) Governance: стандарты для событий (naming, schema evolution), quality metrics. Events обеспечивают decoupling между data producers и consumers в data mesh.',
    explanation:
      'Data Mesh + Event-Driven — мощная комбинация для data-intensive организаций. Events — natural fit для real-time data products. Confluent активно продвигает event streaming как основу data mesh.',
  },
  {
    id: 'sd-event-driven-040',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое event-driven serverless и какие AWS сервисы его поддерживают?',
    options: [
      'Serverless только для обработки HTTP запросов',
      'Архитектура, где serverless функции триггерятся событиями из различных источников; AWS: Lambda + EventBridge + SQS + SNS + Kinesis',
      'Использование servers для обработки событий',
      'Serverless базы данных',
    ],
    correctIndex: 1,
    explanation:
      'Event-driven serverless: функции выполняются в ответ на события, платишь только за execution time. AWS stack: Lambda — compute, EventBridge — event bus (routing, filtering, transformation), SQS — queue (buffering, DLQ), SNS — pub/sub (fan-out), Kinesis — streaming (high throughput, ordering), DynamoDB Streams — CDC для DynamoDB, S3 Events — реакция на upload. Паттерны: EventBridge → Lambda (event routing), SQS → Lambda (decoupling, retry), Kinesis → Lambda (stream processing). Step Functions — orchestration for sagas. Преимущества: auto-scaling, no infrastructure management, pay-per-use.',
  },
  {
    id: 'sd-event-driven-041',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'open',
    question: 'Что такое message и чем оно отличается от event? Приведите примеры.',
    sampleAnswer:
      'Message — общий термин для данных, передаваемых между компонентами. Event — тип message, описывающий факт, который произошёл (прошедшее время). Отличия: Event: факт (OrderCreated), immutable, нет ожидания ответа, множество consumer-ов. Command: приказ (CreateOrder), направлен конкретному получателю, ожидает выполнения. Query: запрос данных (GetOrder), ожидает ответ. Events vs Commands: Event — «заказ создан» (информирование), Command — «создай заказ» (директива). Events публикуются без знания о consumer-ах (fire-and-forget), commands адресованы конкретному сервису. Events хранятся для replay, commands обычно нет. В CQRS: Commands изменяют состояние, Events — результат изменения, Queries — чтение.',
    explanation:
      'Различение events, commands, queries — фундамент для правильного моделирования EDA. Event — то, что случилось (факт). Command — то, что нужно сделать. Смешивание приводит к tight coupling.',
  },
  {
    id: 'sd-event-driven-042',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое competing consumers pattern?',
    options: [
      'Конкуренция producers за публикацию в топик',
      'Паттерн, где несколько consumer-ов обрабатывают сообщения из одной очереди параллельно, каждое сообщение обрабатывается ровно одним consumer-ом',
      'Consumer-ы соревнуются за право подписки',
      'Разные consumer groups конкурируют за сообщения',
    ],
    correctIndex: 1,
    explanation:
      'Competing consumers — несколько инстансов одного consumer-а обрабатывают очередь параллельно для масштабирования. Каждое сообщение доставляется ровно одному consumer-у (в отличие от fan-out). Реализация: RabbitMQ — несколько consumer-ов на одну queue, Kafka — consumer group с partition assignment. Challenges: 1) Ordering — сообщения обрабатываются out-of-order (разные consumer-ы). 2) Visibility timeout — что если consumer упал до ack? Паттерны: message locking, acknowledge after processing. Используется для: task queues, job processing, work distribution.',
  },
  {
    id: 'sd-event-driven-043',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое event-carried state transfer vs event notification?',
    options: [
      'Event notification содержит полные данные объекта',
      'Event-carried state transfer включает полные данные для обновления локальной копии; event notification только сигнализирует об изменении, требуя callback для получения данных',
      'Event notification для синхронной связи, event-carried — для асинхронной',
      'Они идентичны по структуре',
    ],
    correctIndex: 1,
    explanation:
      'Event notification: {type: "CustomerUpdated", customerId: 123}. Consumer при необходимости вызывает Customer API для получения данных. Pros: маленький payload, всегда свежие данные. Cons: runtime coupling к source service. Event-carried state transfer: {type: "CustomerUpdated", customerId: 123, name: "John", email: "john@example.com", tier: "gold"}. Consumer обновляет локальную копию. Pros: no runtime coupling, работает при недоступности source. Cons: большой payload, stale data возможны, schema evolution сложнее. Выбор зависит от требований к coupling и freshness данных.',
  },
  {
    id: 'sd-event-driven-044',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Как реализовать distributed tracing в event-driven системе? Какие challenges?',
    sampleAnswer:
      'Distributed tracing в EDA: propagation trace context через сообщения. Реализация: 1) Producer: добавляет traceparent header в message (W3C Trace Context или custom). 2) Message broker: сохраняет headers. Kafka, RabbitMQ, SQS поддерживают message attributes/headers. 3) Consumer: извлекает trace context, создаёт child span с parent из message. Challenges: 1) Async nature: trace может длиться часы (message в queue). 2) Fan-out: один message → несколько traces. Ссылки (links) вместо parent-child. 3) Batching: один trace для batch или отдельные? 4) Retry: не создавать новый trace при retry. 5) DLQ: как связать DLQ message с original trace. OpenTelemetry: messaging semantic conventions, context propagation APIs. Инструменты: Jaeger, Zipkin поддерживают async patterns, но visualisation challenge — длинные traces.',
    explanation:
      'Tracing в EDA сложнее синхронного из-за decoupling во времени. OpenTelemetry messaging instrumentation автоматизирует propagation для популярных клиентов. Важно: не терять trace context при error handling, DLQ processing.',
  },
  {
    id: 'sd-event-driven-045',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Зачем нужен retention period для событий в Kafka?',
    options: [
      'Для шифрования старых событий',
      'Для определения, как долго события хранятся в топике, позволяя replay и новым consumer-ам читать историю',
      'Для ограничения скорости записи',
      'Для сжатия событий',
    ],
    correctIndex: 1,
    explanation:
      'Retention period в Kafka определяет, как долго сообщения хранятся в топике. По умолчанию 7 дней. Настройки: retention.ms (время), retention.bytes (размер). Зачем: 1) Replay — переобработка событий при багах, миграциях. 2) New consumers — новый сервис читает историю с beginning. 3) Recovery — восстановление после сбоя consumer-а. Compacted topics: вместо retention по времени — хранение последнего значения для каждого ключа (log compaction). Используется для changelog, reference data. Бесконечный retention возможен, но требует storage planning.',
  },
  {
    id: 'sd-event-driven-046',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'open',
    question: 'Объясните паттерн Event Aggregator. Когда его использовать?',
    sampleAnswer:
      'Event Aggregator собирает несколько связанных событий и генерирует одно агрегированное. Use cases: 1) Notification batching: вместо 10 emails об активности — один daily digest. События собираются за период, затем отправляется сводка. 2) Order completion: OrderCreated + PaymentReceived + ItemsPacked + Shipped → OrderCompleted (summary event). 3) Analytics: сырые click events → aggregated session events. Реализация: stateful processor (Kafka Streams, Flink) с time windows или event correlation. KTable для хранения partial state. Timer для emit агрегированного события. Challenges: определение completeness (когда все события получены?), handling late arrivals, state management. Event Aggregator снижает нагрузку на downstream, упрощает consumer logic.',
    explanation:
      'Event Aggregator — противоположность fan-out. Полезен для notification systems, analytics, business process completion. Kafka Streams windowing, Flink CEP — типичные инструменты.',
  },
  {
    id: 'sd-event-driven-047',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое Apache Kafka Connect и для чего он используется?',
    options: [
      'Клиентская библиотека для подключения к Kafka',
      'Фреймворк для интеграции Kafka с внешними системами через source и sink connectors без написания кода',
      'Инструмент мониторинга Kafka кластера',
      'Сервис аутентификации для Kafka',
    ],
    correctIndex: 1,
    explanation:
      'Kafka Connect — фреймворк для интеграции Kafka с внешними системами. Source connectors: импорт данных в Kafka (JDBC Source — из БД, Debezium — CDC). Sink connectors: экспорт из Kafka (JDBC Sink — в БД, S3 Sink, Elasticsearch Sink). Преимущества: готовые connectors (Confluent Hub), no code (JSON configuration), auto-scaling, fault tolerance, exactly-once (с transactions). Standalone mode (single process) и distributed mode (cluster). Single Message Transforms (SMT) для простой трансформации без Kafka Streams. Типичный use case: Debezium CDC → Kafka → Elasticsearch Sink для search.',
  },
  {
    id: 'sd-event-driven-048',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Сравните Kafka Streams и Apache Flink для stream processing. Когда какой выбрать?',
    sampleAnswer:
      'Kafka Streams: библиотека (не отдельный cluster), embedded в приложение. Pros: простой deployment (JAR), тесная интеграция с Kafka, no separate cluster management, exactly-once с Kafka transactions. Cons: только Kafka как источник, масштабирование через instances приложения. Apache Flink: distributed stream processing framework, отдельный cluster. Pros: multiple sources/sinks (Kafka, Kinesis, files, databases), advanced windowing и CEP, lower latency, более мощный API (Table API, SQL). Cons: operational complexity (cluster management), отдельная инфраструктура. Выбор: Kafka-centric система, простой use case → Kafka Streams. Complex processing, multiple sources, sub-second latency → Flink. Hybrid: Kafka Streams для simple transformations, Flink для complex analytics.',
    explanation:
      'Kafka Streams — «serverless stream processing» (no infrastructure), Flink — enterprise-grade с advanced features. Confluent ksqlDB добавляет SQL interface к Kafka Streams. Databricks, Spark Streaming — альтернативы для batch+stream.',
  },
  {
    id: 'sd-event-driven-049',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое log compaction в Kafka?',
    options: [
      'Сжатие логов для экономии места',
      'Механизм сохранения только последнего значения для каждого ключа, превращая топик в changelog/KTable',
      'Удаление всех сообщений старше retention period',
      'Объединение нескольких партиций в одну',
    ],
    correctIndex: 1,
    explanation:
      'Log compaction — альтернатива time-based retention. Kafka сохраняет последнее сообщение для каждого ключа, удаляя предыдущие. Пример: key=user123 → [{v1}, {v2}, {v3}] compacted to [{v3}]. Tombstone: сообщение с null value удаляет ключ. Use cases: changelog для state (KTable), reference data (product catalog), CDC — последнее состояние сущности. Конфигурация: cleanup.policy=compact. Compaction происходит в background, не мгновенно. Combination: cleanup.policy=compact,delete — compact + удаление по retention.',
  },
  {
    id: 'sd-event-driven-050',
    block: 'sd',
    topic: 'event-driven',
    topicLabel: 'Event-Driven Architecture',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите архитектуру real-time fraud detection системы на event-driven принципах.',
    sampleAnswer:
      'Fraud detection architecture: 1) Event Sources: Payment Gateway публикует TransactionInitiated events в Kafka. 2) Enrichment: Stream processor (Flink) обогащает событие: user profile, device fingerprint, historical patterns (join с KTables). 3) Feature Engineering: вычисление features в real-time — transactions per hour, avg amount, geo velocity. 4) ML Scoring: событие отправляется в ML model service (синхронно для low latency или async). Model возвращает fraud probability. 5) Rules Engine: CEP rules — «3 транзакции из разных стран за 10 минут». Flink CEP или custom. 6) Decision: score > threshold → FraudSuspected event → Block transaction, notify. 7) Feedback Loop: FraudConfirmed/FraudDismissed events для model retraining. 8) Storage: все события в data lake для offline analysis, model training. Requirements: sub-second latency, high throughput, exactly-once (не заблокировать легитимную транзакцию дважды).',
    explanation:
      'Fraud detection — showcase для real-time event processing. Stripe, PayPal используют event-driven ML pipelines. Latency критична — решение за 100ms. Feature stores (Feast, Tecton) ускоряют feature serving.',
  },
];
