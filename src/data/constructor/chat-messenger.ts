import type { Scenario } from './types';

export const chatMessengerScenario: Scenario = {
  id: 'chat-messenger',
  title: 'Chat Messenger',
  difficulty: 'senior',
  description:
    'Спроектируйте real-time чат-мессенджер уровня WhatsApp/Telegram для 500M+ пользователей. Система должна поддерживать мгновенную доставку сообщений, групповые чаты, медиа-файлы и end-to-end шифрование с гарантией доставки и порядка сообщений.',

  steps: [
    // ── Step 1: Requirements ────────────────────────────────────────────
    {
      id: 'chat-requirements',
      title: 'Требования',
      description:
        'Определите типы чатов и функциональность сообщений, которые должен поддерживать мессенджер.',
      tip: 'WhatsApp ограничивает группы 256 участниками не случайно — это порог, при котором fanout on write остаётся эффективным. Telegram разделяет группы и каналы архитектурно.',
      decisions: [
        {
          id: 'chat-type',
          category: 'Типы чатов',
          question: 'Какие типы чатов поддерживать?',
          multiSelect: true,
          options: [
            {
              id: 'one-on-one',
              label: 'Личные чаты (1-on-1)',
              description:
                'Приватные диалоги между двумя пользователями — основа любого мессенджера.',
              pros: [
                'Простая модель доставки — ровно один получатель',
                'Легко реализовать E2E шифрование (один ключ на пару)',
                'Минимальная нагрузка на fanout',
              ],
              cons: [
                'Необходимо хранить отдельный inbox для каждого пользователя',
                'Синхронизация между устройствами одного пользователя усложняет модель',
              ],
              bestWhen: 'Всегда — базовый тип чата для любого мессенджера',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'group-chats',
              label: 'Групповые чаты (до 256 участников)',
              description:
                'Чаты с несколькими участниками. WhatsApp ограничивает 256, Telegram — 200 000 (но архитектурно это ближе к каналам).',
              pros: [
                'Покрывает большинство сценариев группового общения',
                'При ограничении размера группы fanout остаётся управляемым',
                'Можно хранить один экземпляр сообщения + список получателей',
              ],
              cons: [
                'Fanout на N участников при каждом сообщении',
                'E2E шифрование усложняется (Sender Keys / группа ключей)',
                'Управление составом группы — отдельная подсистема',
              ],
              bestWhen:
                'Нужна поддержка командного и семейного общения с управляемой нагрузкой на доставку',
              impact: { latency: -1, scalability: -1, consistency: -1, complexity: 1, cost: 1 },
            },
            {
              id: 'channels',
              label: 'Каналы (broadcast, без ограничения подписчиков)',
              description:
                'Односторонняя рассылка от авторов подписчикам. Telegram channels могут иметь миллионы подписчиков.',
              pros: [
                'Отлично подходит для контент-дистрибуции',
                'Fanout on read снимает нагрузку с отправителя',
                'Подписчики читают из общей ленты — одна копия сообщения',
              ],
              cons: [
                'Требует отдельной стратегии доставки (fanout on read)',
                'Push-уведомления миллионам подписчиков — отдельный инфраструктурный вызов',
                'Не подходит для двустороннего общения',
              ],
              bestWhen:
                'Нужна поддержка медиа/новостных каналов с большой аудиторией',
              impact: { latency: 0, scalability: -1, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'threads',
              label: 'Треды (ответы внутри чата)',
              description:
                'Вложенные обсуждения внутри основного чата. Используется в Slack, Telegram (reply threads), Discord.',
              pros: [
                'Структурирует обсуждения в больших группах',
                'Уменьшает шум в основном потоке сообщений',
                'Позволяет подписаться только на интересующие ветки',
              ],
              cons: [
                'Усложняет модель данных (parent_message_id, thread counters)',
                'Уведомления по тредам — отдельная логика',
                'UI/UX становится сложнее',
              ],
              bestWhen: 'Мессенджер ориентирован на рабочие команды или большие сообщества',
              impact: { latency: 0, scalability: 0, consistency: -1, complexity: 1, cost: 0 },
            },
          ],
        },
        {
          id: 'chat-features',
          category: 'Фичи сообщений',
          question: 'Какие фичи сообщений поддерживать?',
          multiSelect: true,
          options: [
            {
              id: 'text',
              label: 'Только текст',
              description: 'Базовые текстовые сообщения — фундамент мессенджера.',
              pros: [
                'Минимальный размер сообщения (единицы КБ)',
                'Простая сериализация и хранение',
                'Мгновенная доставка даже на медленных каналах',
              ],
              cons: [
                'Ограниченная выразительность',
                'Пользователи ожидают мультимедиа в современном мессенджере',
              ],
              bestWhen: 'MVP или мессенджер для слабых каналов связи',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'media',
              label: 'Медиа (фото, видео, файлы)',
              description:
                'Поддержка отправки фотографий, видео, документов и голосовых сообщений.',
              pros: [
                'Полноценный пользовательский опыт',
                'Возможность монетизации (расширенное хранилище)',
                'Конкурентоспособность с существующими мессенджерами',
              ],
              cons: [
                'Требует отдельного хранилища для медиа (object storage)',
                'Транскодирование видео/сжатие изображений — вычислительно дорого',
                'Значительно увеличивает трафик и стоимость хранения',
              ],
              bestWhen: 'Мессенджер должен быть полноценной заменой WhatsApp/Telegram',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: 1, cost: 2 },
            },
            {
              id: 'read-receipts',
              label: 'Статусы доставки и прочтения',
              description:
                'Sent / Delivered / Read галочки, как в WhatsApp (одна серая, две серые, две синие).',
              pros: [
                'Пользователи понимают состояние своих сообщений',
                'Повышает доверие к платформе',
                'Стандарт индустрии для мессенджеров',
              ],
              cons: [
                'Дополнительный трафик ACK-сообщений (2 ACK на каждое сообщение)',
                'В группах — N ACK на одно сообщение, квадратичная нагрузка',
                'Приватность: не все хотят показывать, когда прочитали',
              ],
              bestWhen:
                'Мессенджер ориентирован на личное общение, где важна обратная связь',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'e2e-encryption',
              label: 'End-to-end шифрование',
              description:
                'Шифрование на стороне клиента. Сервер не может прочитать сообщения. Signal Protocol используется в WhatsApp и Signal.',
              pros: [
                'Максимальная приватность пользователей',
                'Сервер не является точкой компрометации данных',
                'Конкурентное преимущество в эпоху privacy-first',
              ],
              cons: [
                'Серверный поиск по сообщениям невозможен',
                'Усложняет multi-device sync (нужен протокол типа Signal Sesame)',
                'Групповое шифрование сложнее (Sender Keys, MLS)',
              ],
              bestWhen:
                'Приватность — ключевое требование продукта (личные мессенджеры)',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: 2, cost: 0 },
            },
            {
              id: 'edit-delete',
              label: 'Редактирование и удаление сообщений',
              description:
                'Возможность изменить или удалить отправленное сообщение. Telegram позволяет редактировать без ограничений, WhatsApp — удалять "для всех".',
              pros: [
                'Пользователи могут исправить ошибки',
                'Удаление для всех повышает контроль над приватностью',
                'Стандартная фича современных мессенджеров',
              ],
              cons: [
                'Нужно пропагировать изменения всем получателям (ещё один fanout)',
                'Конфликт с E2E шифрованием — как подтвердить удаление?',
                'Хранение истории изменений увеличивает объём данных',
              ],
              bestWhen: 'Важен полноценный UX редактирования, как в Telegram',
              impact: { latency: 0, scalability: -1, consistency: -1, complexity: 1, cost: 0 },
            },
          ],
        },
      ],
    },

    // ── Step 2: Realtime Communication ──────────────────────────────────
    {
      id: 'chat-realtime',
      title: 'Real-time коммуникация',
      description:
        'Выберите протокол и архитектуру соединений для обеспечения мгновенной доставки сообщений.',
      tip: 'WhatsApp использует кастомный бинарный протокол поверх TCP на Erlang/BEAM. Telegram — MTProto (свой бинарный протокол). Для большинства новых систем WebSocket — оптимальный баланс между производительностью и простотой.',
      decisions: [
        {
          id: 'chat-protocol',
          category: 'Транспортный протокол',
          question: 'Какой протокол использовать для real-time коммуникации?',
          options: [
            {
              id: 'websocket',
              label: 'WebSocket',
              description:
                'Полнодуплексное TCP-соединение через стандартный WebSocket API. Поддерживается всеми браузерами и мобильными платформами.',
              pros: [
                'Двунаправленная связь с минимальным overhead (2-14 байт на фрейм)',
                'Нативная поддержка в браузерах и мобильных SDK',
                'Работает через стандартные порты 80/443, проходит через большинство firewall',
              ],
              cons: [
                'Stateful-соединение усложняет балансировку (нужен sticky sessions или L4 LB)',
                'Переподключение при смене сети (Wi-Fi → LTE) — на стороне клиента',
                'Не поддерживает мультиплексирование потоков (в отличие от HTTP/2)',
              ],
              bestWhen:
                'Стандартный выбор для web + mobile мессенджеров с разумной сложностью',
              impact: { latency: 2, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
              capacityImpact: [
                {
                  label: 'Concurrent connections',
                  value: '50M (~500 GB RAM)',
                  formula:
                    '50M WebSocket connections × ~10 KB memory per connection (buffers + TLS state) = ~500 GB RAM across gateway fleet',
                },
                {
                  label: 'Gateway fleet size',
                  value: '~200 servers',
                  formula:
                    '50M connections / 250K connections per server (64 GB RAM, tuned kernel) = 200 gateway servers',
                },
                {
                  label: 'Bandwidth (messages only)',
                  value: '~155 MB/s',
                  formula:
                    '700K msgs/sec × (100 bytes payload + 14 bytes WS frame + ~8 bytes TCP) × 2 (send+recv) ≈ 155 MB/s',
                },
              ],
            },
            {
              id: 'long-polling',
              label: 'Long Polling',
              description:
                'Клиент держит HTTP-запрос открытым, сервер отвечает при появлении новых данных. Fallback для сред без WebSocket.',
              pros: [
                'Работает везде, включая корпоративные прокси',
                'Stateless — легко балансировать',
                'Простая реализация на стороне сервера',
              ],
              cons: [
                'Задержка до секунды на переоткрытие соединения после каждого ответа',
                'Высокий overhead HTTP-заголовков на каждый запрос',
                'Не подходит для high-frequency обновлений (typing indicators)',
              ],
              bestWhen:
                'Fallback для окружений с ограниченной поддержкой WebSocket или как временное решение',
              impact: { latency: -1, scalability: 1, consistency: 0, complexity: -1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Concurrent connections',
                  value: '50M (~750 GB RAM)',
                  formula:
                    '50M users polling; each poll = new HTTP connection with ~15 KB overhead (headers + TLS handshake) = ~750 GB RAM peak',
                },
                {
                  label: 'Gateway fleet size',
                  value: '~350 servers',
                  formula:
                    'Each poll reconnects every ~30s; 50M / 30 ≈ 1.7M new connections/sec; need ~350 servers to handle TLS handshake overhead',
                },
                {
                  label: 'Bandwidth (messages only)',
                  value: '~1.7 GB/s',
                  formula:
                    '1.7M polls/sec × ~1 KB HTTP headers per request/response = ~1.7 GB/s overhead; 10× more than WebSocket',
                },
              ],
            },
            {
              id: 'sse',
              label: 'Server-Sent Events (SSE)',
              description:
                'Однонаправленный поток от сервера к клиенту по HTTP. Отправка сообщений — обычные HTTP POST.',
              pros: [
                'Автоматическое переподключение встроено в API',
                'Работает через HTTP/2 с мультиплексированием',
                'Проще серверная реализация, чем WebSocket',
              ],
              cons: [
                'Однонаправленный — нужен отдельный канал для отправки',
                'Ограничение на количество соединений в браузере (6 на домен в HTTP/1.1)',
                'Не подходит для бинарных данных',
              ],
              bestWhen:
                'Система с преобладанием серверных обновлений (ленты, уведомления), не чат',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'xmpp',
              label: 'XMPP (Extensible Messaging and Presence Protocol)',
              description:
                'Открытый стандарт для мессенджинга. Изначально использовался в Google Talk, ранних версиях WhatsApp и Facebook Messenger.',
              pros: [
                'Зрелый стандарт с поддержкой presence, групп, федерации',
                'Большая экосистема серверов (ejabberd, Prosody)',
                'Поддержка федерации между серверами из коробки',
              ],
              cons: [
                'XML-формат — значительный overhead по трафику',
                'Сложный стандарт с множеством XEP-расширений',
                'WhatsApp и Facebook ушли от XMPP к кастомным протоколам из-за overhead',
              ],
              bestWhen:
                'Нужна федерация между серверами или совместимость с существующей XMPP-инфраструктурой',
              impact: { latency: -1, scalability: -1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'custom-binary',
              label: 'Кастомный бинарный протокол',
              description:
                'Собственный протокол поверх TCP/TLS. WhatsApp использует кастомный протокол на Erlang, Telegram — MTProto.',
              pros: [
                'Минимальный overhead — каждый байт под контролем',
                'Можно оптимизировать под конкретные сценарии (батчинг, сжатие)',
                'Максимальная производительность на мобильных сетях',
              ],
              cons: [
                'Огромные затраты на разработку и поддержку',
                'Нет стандартных инструментов для отладки (нужен свой tooling)',
                'Нужны клиентские библиотеки для каждой платформы',
              ],
              bestWhen:
                'Масштаб WhatsApp/Telegram, где каждый сэкономленный байт имеет значение на миллиардах сообщений',
              impact: { latency: 2, scalability: 1, consistency: 0, complexity: 2, cost: 1 },
              capacityImpact: [
                {
                  label: 'Concurrent connections',
                  value: '50M (~250 GB RAM)',
                  formula:
                    '50M connections × ~5 KB per connection (no HTTP overhead, minimal framing, compact TLS state) = ~250 GB RAM',
                },
                {
                  label: 'Gateway fleet size',
                  value: '~100 servers',
                  formula:
                    '50M / 500K connections per server (Erlang/BEAM-style lightweight processes, 64 GB RAM) = 100 servers',
                },
                {
                  label: 'Bandwidth (messages only)',
                  value: '~84 MB/s',
                  formula:
                    '700K msgs/sec × 60 bytes avg (binary encoding, ~40% smaller than JSON+WS) × 2 = ~84 MB/s; ~40% bandwidth savings vs WebSocket',
                },
              ],
            },
          ],
        },
        {
          id: 'chat-connection',
          category: 'Управление соединениями',
          question: 'Как управлять соединениями пользователей?',
          options: [
            {
              id: 'stateful-gateway',
              label: 'Stateful gateway серверы',
              description:
                'Выделенные серверы, которые держат WebSocket/TCP-соединения. Каждый gateway знает своих подключённых пользователей. WhatsApp использует stateful Erlang-ноды, каждая держит ~2M соединений.',
              pros: [
                'Мгновенная доставка — gateway знает, какой сокет принадлежит пользователю',
                'Erlang/BEAM может держать миллионы лёгких процессов на одном сервере',
                'Минимальный latency — нет промежуточных lookup при отправке',
              ],
              cons: [
                'При падении gateway — все соединения теряются (нужен graceful reconnect)',
                'Перебалансировка при добавлении/удалении нод — нетривиальна',
                'Нужен service discovery для маршрутизации сообщений между gateway',
              ],
              bestWhen:
                'Приоритет — минимальный latency доставки и высокая плотность соединений',
              impact: { latency: 2, scalability: 0, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'connection-broker',
              label: 'Connection broker + stateless workers',
              description:
                'Отдельный брокер отслеживает, где подключён каждый пользователь. Stateless worker-серверы обрабатывают бизнес-логику.',
              pros: [
                'Worker-серверы легко масштабировать горизонтально',
                'Падение worker не теряет соединения',
                'Чёткое разделение ответственности',
              ],
              cons: [
                'Дополнительный hop через брокер при каждом сообщении',
                'Брокер — потенциальная точка отказа и bottleneck',
                'Сложность маршрутизации: broker → lookup → gateway → user',
              ],
              bestWhen:
                'Команда предпочитает stateless архитектуру и готова платить дополнительным latency',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 1, cost: 1 },
            },
            {
              id: 'edge-servers',
              label: 'Edge серверы (CDN-подобная архитектура)',
              description:
                'Географически распределённые серверы, ближайшие к пользователям. Подобно CDN, но для WebSocket-соединений.',
              pros: [
                'Минимальный RTT для пользователей по всему миру',
                'Устойчивость к региональным сбоям',
                'Может кешировать медиа на edge',
              ],
              cons: [
                'Сообщения между пользователями на разных edge — дополнительный hop',
                'Сложная синхронизация состояния между edge-нодами',
                'Высокая стоимость инфраструктуры в десятках регионов',
              ],
              bestWhen:
                'Глобальный мессенджер с пользователями на всех континентах и жёсткими требованиями к latency',
              impact: { latency: 2, scalability: 1, consistency: -1, complexity: 2, cost: 2 },
            },
          ],
        },
      ],
    },

    // ── Step 3: Data Model & Storage ────────────────────────────────────
    {
      id: 'chat-storage',
      title: 'Модель данных и хранение',
      description:
        'Выберите базы данных для хранения сообщений и медиа-контента.',
      tip: 'Discord изначально использовал Cassandra, но мигрировал на ScyllaDB из-за проблем с GC-паузами при больших партициях. WhatsApp хранит сообщения в Mnesia (Erlang), но это уникальный случай. Для большинства систем — ScyllaDB или Cassandra.',
      decisions: [
        {
          id: 'chat-message-db',
          category: 'Хранилище сообщений',
          question: 'Где хранить сообщения?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL (с партиционированием по времени)',
              description:
                'Реляционная БД с партиционированием таблиц по временным диапазонам. Используется в небольших и средних системах.',
              pros: [
                'Богатые возможности запросов (JOIN, полнотекстовый поиск)',
                'ACID-транзакции — строгая консистентность',
                'Зрелая экосистема, широко известна разработчикам',
              ],
              cons: [
                'Вертикальное масштабирование ограничено (даже с Citus — сложнее, чем native sharding)',
                'Write throughput ниже, чем у LSM-tree баз при high write load',
                'Партиционирование + шардинг требуют ручной настройки',
              ],
              bestWhen:
                'Мессенджер до ~10M пользователей или как начальный вариант с планом миграции',
              impact: { latency: 0, scalability: -2, consistency: 2, complexity: -1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~50K/sec (single node limit)',
                  formula:
                    'Single PostgreSQL node tops out at ~50K writes/sec with B-tree indexes; need partitioning beyond that',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~1.5 PB (with MVCC overhead)',
                  formula:
                    '730 TB raw × ~2× MVCC bloat (dead tuples, TOAST) = ~1.5 PB; requires aggressive VACUUM',
                },
                {
                  label: 'Partitioning overhead',
                  value: '~14 600 partitions/year',
                  formula:
                    '1 partition per day × 365 days = 365 time partitions; with 40 shards (Citus) = 14 600 partitions',
                },
                {
                  label: 'Cluster size (messages)',
                  value: '~40 Citus shards',
                  formula:
                    '700K writes/sec ÷ ~18K writes/sec per shard ≈ 40 shards needed; each shard = separate PG instance',
                },
              ],
            },
            {
              id: 'cassandra',
              label: 'Apache Cassandra',
              description:
                'Wide-column NoSQL база. Discord использовал Cassandra для хранения триллионов сообщений. Eventual consistency, отлично пишет.',
              pros: [
                'Линейное горизонтальное масштабирование',
                'Оптимизирована для write-heavy нагрузки (LSM-tree)',
                'Нет single point of failure (masterless архитектура)',
              ],
              cons: [
                'GC-паузы JVM при больших партициях (проблема Discord)',
                'Eventual consistency — возможны аномалии чтения',
                'Ограниченная модель запросов (нужно проектировать под query patterns)',
              ],
              bestWhen:
                'Write-heavy чат с линейным масштабированием, если команда готова к JVM-тюнингу',
              impact: { latency: 0, scalability: 2, consistency: -1, complexity: 1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~700K/sec (with GC tuning)',
                  formula:
                    'Cassandra handles 700K writes/sec across ~40 nodes; GC pauses (100-500ms) can spike p99 latency',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~2.2 PB (with RF=3)',
                  formula:
                    '730 TB raw × RF=3 replication = ~2.2 PB; plus ~30% LSM compaction headroom = ~2.9 PB total disk',
                },
                {
                  label: 'Write throughput',
                  value: '~700K writes/sec',
                  formula:
                    'LSM-tree write path; but JVM GC pauses at large partition sizes (Discord hit this at >100MB partitions)',
                },
                {
                  label: 'Cluster size (messages)',
                  value: '~40 nodes',
                  formula:
                    '2.9 PB (with compaction headroom) / 72 TB per node ≈ 40 nodes; masterless ring topology',
                },
              ],
            },
            {
              id: 'scylladb',
              label: 'ScyllaDB',
              description:
                'Cassandra-совместимая БД на C++. Discord мигрировал с Cassandra на ScyllaDB. Нет GC-пауз, предсказуемый latency.',
              pros: [
                'Совместима с Cassandra API — лёгкая миграция',
                'Нет GC-пауз (C++ вместо JVM)',
                'Предсказуемый p99 latency даже под высокой нагрузкой',
              ],
              cons: [
                'Меньше сообщество, чем у Cassandra',
                'Операционная сложность при кластере в десятках нод',
                'Eventual consistency — те же ограничения модели данных, что у Cassandra',
              ],
              bestWhen:
                'Write-heavy чат на масштабе 100M+ пользователей с требованием предсказуемого latency',
              impact: { latency: 1, scalability: 2, consistency: -1, complexity: 1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~700K/sec (handled)',
                  formula:
                    'ScyllaDB handles 700K writes/sec across ~35 nodes (each node ~20K writes/sec sustained)',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~2.2 PB (with RF=3)',
                  formula:
                    '730 TB raw × RF=3 replication = ~2.2 PB total disk; ~35 nodes × 64 TB NVMe each',
                },
                {
                  label: 'Write throughput',
                  value: '~700K writes/sec',
                  formula:
                    'LSM-tree optimized for writes; no GC pauses (C++); p99 latency < 10ms even at peak',
                },
                {
                  label: 'Cluster size (messages)',
                  value: '~35 nodes',
                  formula:
                    '2.2 PB / 64 TB per node ≈ 35 nodes; 3 replicas ensure availability if 1 node fails',
                },
              ],
            },
            {
              id: 'hbase',
              label: 'HBase',
              description:
                'Wide-column store на базе HDFS. Используется в Facebook Messenger для хранения сообщений.',
              pros: [
                'Проверен на масштабе Facebook',
                'Сильная консистентность чтения (в отличие от Cassandra)',
                'Хорошо интегрируется с Hadoop-экосистемой для аналитики',
              ],
              cons: [
                'Требует HDFS + ZooKeeper + сложный ops-стек',
                'Высокий порог входа для команды',
                'Latency выше, чем у ScyllaDB/Cassandra для point queries',
              ],
              bestWhen:
                'Уже есть Hadoop-инфраструктура и нужна strong consistency для сообщений',
              impact: { latency: -1, scalability: 1, consistency: 1, complexity: 2, cost: 1 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~500K/sec',
                  formula:
                    'HBase write throughput limited by WAL + HDFS pipeline; ~500K writes/sec across ~50 region servers',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~4.4 PB (HDFS RF=3 + overhead)',
                  formula:
                    '730 TB raw × RF=3 (HDFS default) = 2.2 PB + ~100% HDFS block overhead (128MB blocks, WAL) ≈ 4.4 PB',
                },
                {
                  label: 'Minimum cluster size',
                  value: '~60 nodes',
                  formula:
                    '50 RegionServers + 3 HDFS NameNodes (HA) + 3 ZooKeeper nodes + 3 HBase Masters ≈ 60 nodes minimum',
                },
                {
                  label: 'Cluster size (messages)',
                  value: '~50 RegionServers',
                  formula:
                    '4.4 PB / 96 TB per node ≈ 46 nodes; round up to 50 for headroom and region balancing',
                },
              ],
            },
          ],
        },
        {
          id: 'chat-media-storage',
          category: 'Хранилище медиа',
          question: 'Где хранить медиа-файлы (фото, видео, документы)?',
          options: [
            {
              id: 'object-storage-cdn',
              label: 'Object Storage (S3/GCS) + CDN',
              description:
                'Медиа хранится в S3/GCS, раздаётся через CDN. Стандарт индустрии для медиа-контента.',
              pros: [
                'Практически неограниченная ёмкость',
                'CDN обеспечивает быструю доставку по всему миру',
                '11 nines durability (S3) — данные не теряются',
              ],
              cons: [
                'Стоимость egress-трафика через CDN при высоких объёмах',
                'Задержка при первом запросе (cache miss на CDN)',
                'Нужна логика генерации pre-signed URLs для приватного контента',
              ],
              bestWhen: 'Стандартное решение для любого мессенджера с медиа-контентом',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: 0, cost: 1 },
              capacityImpact: [
                {
                  label: 'Media storage (1 year)',
                  value: '~73 PB ($1.7M/mo)',
                  formula:
                    '73 PB on S3 Standard ≈ $0.023/GB × 73 000 TB = ~$1.7M/month; lifecycle policy to S3 IA after 90 days saves ~40%',
                },
                {
                  label: 'CDN egress bandwidth',
                  value: '~120 Gbps',
                  formula:
                    '500M users × 5% view media/hour × 200KB avg / 3600 = ~120 Gbps sustained; CDN absorbs ~95% of reads',
                },
                {
                  label: 'CDN cost (monthly)',
                  value: '~$3.5M/mo',
                  formula:
                    '120 Gbps × 2.6M sec/month ≈ 39 EB transferred; at $0.085/GB for first 10PB tier → ~$3.5M/month',
                },
              ],
            },
            {
              id: 'distributed-fs',
              label: 'Распределённая файловая система (HDFS)',
              description:
                'Хранение файлов в распределённой ФС. Facebook использовал собственную Haystack, потом f4.',
              pros: [
                'Полный контроль над хранением и репликацией',
                'Можно оптимизировать под конкретный паттерн доступа',
                'Нет зависимости от облачного провайдера',
              ],
              cons: [
                'Огромные затраты на ops и инфраструктуру',
                'Нужно строить CDN-слой самостоятельно',
                'Оправдано только на масштабе Facebook',
              ],
              bestWhen:
                'On-premise инфраструктура масштаба Facebook с выделенной storage-командой',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 2, cost: 2 },
            },
            {
              id: 'cdn-origin',
              label: 'CDN + Origin Storage (multi-tier)',
              description:
                'Горячие файлы на CDN, тёплые — на быстром origin storage, холодные — на дешёвом архивном хранилище (S3 Glacier).',
              pros: [
                'Оптимальная стоимость — горячее/холодное разделение',
                'Быстрый доступ к недавним медиа',
                'Экономия на хранении старого контента',
              ],
              cons: [
                'Сложная логика tiering и миграции между уровнями',
                'Задержка при доступе к холодным файлам',
                'Больше движущихся частей в инфраструктуре',
              ],
              bestWhen:
                'Оптимизация стоимости при большом объёме медиа с чётким hot/cold паттерном',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Media storage (1 year)',
                  value: '~73 PB ($0.9M/mo avg)',
                  formula:
                    'Hot tier (30 days): ~6 PB on S3 Standard; Warm (90 days): ~12 PB on S3 IA; Cold: ~55 PB on Glacier ≈ $0.9M/mo blended',
                },
                {
                  label: 'CDN egress bandwidth',
                  value: '~120 Gbps',
                  formula:
                    'Same total reads as S3+CDN, but edge cache hit rate ~98% (vs ~95%) due to tiered warm cache; reduces origin egress by ~60%',
                },
                {
                  label: 'Edge cache size',
                  value: '~50 TB across PoPs',
                  formula:
                    'Top 0.07% of media (hot set) cached at CDN edge; 73 PB × 0.07% ≈ 50 TB distributed across ~200 PoPs ≈ 250 GB/PoP',
                },
              ],
            },
          ],
        },
      ],
    },

    // ── Step 4: Message Delivery ────────────────────────────────────────
    {
      id: 'chat-delivery',
      title: 'Доставка сообщений',
      description:
        'Определите стратегию доставки сообщений в группы и механизм работы с офлайн-пользователями.',
      tip: 'WhatsApp использует fanout on write для групп до 256 участников — это позволяет каждому пользователю иметь единый inbox со всеми сообщениями. Для каналов с миллионами подписчиков fanout on read обязателен.',
      decisions: [
        {
          id: 'chat-fanout',
          category: 'Стратегия fanout',
          question: 'Какую стратегию доставки сообщений в группы использовать?',
          options: [
            {
              id: 'fanout-write',
              label: 'Fanout on write (запись в inbox каждого получателя)',
              description:
                'При отправке сообщения оно записывается в inbox каждого участника группы. Пользователь читает только свой inbox.',
              pros: [
                'Чтение максимально быстрое — один запрос к своему inbox',
                'Доставка офлайн-сообщений тривиальна — они уже в inbox',
                'Простая модель sync при переподключении',
              ],
              cons: [
                'Write amplification: 1 сообщение → N записей (по числу участников)',
                'Не масштабируется для каналов с миллионами подписчиков',
                'Дорого по хранению — N копий каждого сообщения',
              ],
              bestWhen: 'Группы ограничены (до 256 как в WhatsApp), приоритет — быстрое чтение',
              impact: { latency: 1, scalability: -1, consistency: 1, complexity: 0, cost: 1 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~18M writes/sec (after fanout)',
                  formula:
                    '700K original msgs/sec × avg 25 recipients (mix of 1:1 and groups) = ~18M inbox writes/sec',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~18 PB (inbox copies)',
                  formula:
                    '730 TB × 25× avg fanout = ~18 PB of inbox entries (pointers + metadata, not full message copies)',
                },
                {
                  label: 'Write amplification',
                  value: '25×',
                  formula:
                    'Avg group size ~50 × 40% group msgs + 1× for 60% 1:1 msgs ≈ 50×0.4 + 1×0.6 = 20.6 ≈ 25× with overhead',
                },
              ],
            },
            {
              id: 'fanout-read',
              label: 'Fanout on read (получатели читают из группы)',
              description:
                'Сообщение записывается один раз в ленту группы/канала. Каждый получатель читает из этой общей ленты.',
              pros: [
                'Одна запись на сообщение — минимальная write amplification',
                'Идеально для каналов с миллионами подписчиков',
                'Экономия хранения — одна копия сообщения',
              ],
              cons: [
                'Чтение медленнее — нужно мержить ленты из всех чатов пользователя',
                'Sync офлайн-сообщений — нужно проверить все чаты на новые сообщения',
                'Timeline merge на клиенте или сервере — дополнительная сложность',
              ],
              bestWhen:
                'Каналы/группы с тысячами и миллионами подписчиков, где write amplification критична',
              impact: { latency: -1, scalability: 2, consistency: 0, complexity: 1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~700K writes/sec (no amplification)',
                  formula:
                    '700K original msgs/sec; each written once to conversation log. No fanout writes at all',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~730 TB (single copy)',
                  formula:
                    'Exactly 1 copy per message; 20B/day × 365 × 100 bytes = ~730 TB. No inbox duplication',
                },
                {
                  label: 'Read amplification',
                  value: '~50 reads/user open',
                  formula:
                    'User in avg 50 chats → opening app requires querying 50 conversation logs to build unified inbox',
                },
                {
                  label: 'Compute at read time',
                  value: '~2.5B merge ops/sec',
                  formula:
                    '50M online users × avg 1 inbox refresh/sec × 50 conversations = 2.5B timeline merge operations/sec',
                },
              ],
            },
            {
              id: 'hybrid-fanout',
              label: 'Гибрид: fanout on write для малых групп, on read для каналов',
              description:
                'Малые группы (до 256) — fanout on write в inbox. Каналы с тысячами подписчиков — fanout on read. Именно так работает WhatsApp.',
              pros: [
                'Оптимальный баланс: быстрое чтение для групп, экономия для каналов',
                'Масштабируется от личных чатов до каналов-миллионников',
                'Проверенный подход в production (WhatsApp, Telegram)',
              ],
              cons: [
                'Две модели доставки — сложнее разрабатывать и поддерживать',
                'Порог переключения (256? 1000?) — дополнительный параметр',
                'Клиент должен поддерживать оба режима',
              ],
              bestWhen:
                'Мессенджер поддерживает и группы, и каналы на масштабе 100M+ пользователей',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: 1, cost: 0 },
              capacityImpact: [
                {
                  label: 'Peak messages/sec',
                  value: '~5M writes/sec (blended)',
                  formula:
                    'Groups ≤256: fanout-on-write ~4.5M writes/sec (90% of msgs × 7× avg fanout); channels: 700K × 10% = 70K writes/sec (single copy)',
                },
                {
                  label: 'Message storage (1 year)',
                  value: '~5.1 PB (blended)',
                  formula:
                    'Inbox copies for groups: 730 TB × 90% × 7× = 4.6 PB; channel messages: 730 TB × 10% × 1× = 73 TB; total ≈ 5.1 PB',
                },
                {
                  label: 'Write amplification',
                  value: '~7× (groups only)',
                  formula:
                    'Groups ≤256 avg fanout = 7× (weighted by group size distribution); channels = 1×; blended ≈ 7× for 90% of messages',
                },
              ],
            },
          ],
        },
        {
          id: 'chat-offline',
          category: 'Офлайн-доставка',
          question: 'Как доставлять сообщения офлайн-пользователям?',
          options: [
            {
              id: 'store-and-forward',
              label: 'Store and forward (очередь на пользователя)',
              description:
                'Сообщения для офлайн-пользователя накапливаются в очереди. При подключении клиент забирает все непрочитанные.',
              pros: [
                'Гарантия доставки — сообщения не теряются',
                'Простой sync: клиент запрашивает всё после last_seen_id',
                'Хорошо работает с fanout on write (inbox и есть очередь)',
              ],
              cons: [
                'Нужно хранить очередь для каждого пользователя',
                'При долгом отсутствии — большой объём sync при подключении',
                'TTL на сообщения в очереди нужно продумать',
              ],
              bestWhen: 'Гарантированная доставка важнее latency первого sync',
              impact: { latency: 0, scalability: 0, consistency: 2, complexity: 0, cost: 0 },
            },
            {
              id: 'push-lazy-sync',
              label: 'Push notification + lazy sync',
              description:
                'Отправляется push-уведомление. При открытии приложения клиент загружает сообщения лениво (по чатам).',
              pros: [
                'Push-уведомление приходит мгновенно даже без соединения',
                'Экономия трафика — загружаются только открытые чаты',
                'Снижает нагрузку на серверы при массовом reconnect',
              ],
              cons: [
                'Push не гарантирован (iOS/Android могут дропнуть)',
                'Задержка при открытии чата — нужно загрузить сообщения',
                'Зависимость от APNs/FCM — сторонние сервисы',
              ],
              bestWhen:
                'Мессенджер, где допустима ленивая загрузка и не все чаты одинаково важны',
              impact: { latency: -1, scalability: 1, consistency: -1, complexity: 0, cost: -1 },
            },
            {
              id: 'persistent-queue',
              label: 'Persistent queue (Kafka per user/group)',
              description:
                'Kafka-топик на группу или пользователя. Сообщения хранятся в логе, клиент читает с offset.',
              pros: [
                'Log-based архитектура — идеально для replay и sync',
                'Consumer offset даёт точный контроль: "прочитано до сообщения X"',
                'Kafka обеспечивает durability и high throughput',
              ],
              cons: [
                'Миллионы топиков (по одному на пользователя) — проблема для Kafka',
                'Operational сложность Kafka-кластера',
                'Overhead для простых 1-on-1 чатов',
              ],
              bestWhen:
                'Система с log-based архитектурой и потребностью в точном replay истории',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 2, cost: 1 },
            },
          ],
        },
      ],
    },

    // ── Step 5: Scaling ─────────────────────────────────────────────────
    {
      id: 'chat-scaling',
      title: 'Масштабирование',
      description:
        'Определите стратегии для online-статуса и партиционирования данных на масштабе 500M+ пользователей.',
      tip: 'WhatsApp обслуживал 2 миллиарда пользователей командой из ~50 инженеров благодаря Erlang/BEAM. Секрет — минимализм архитектуры и stateful серверы. Telegram не показывает точный online-статус для экономии ресурсов.',
      decisions: [
        {
          id: 'chat-presence',
          category: 'Presence (онлайн-статус)',
          question: 'Как реализовать отображение статуса онлайн (presence)?',
          options: [
            {
              id: 'heartbeat-redis',
              label: 'Heartbeat + централизованный store (Redis)',
              description:
                'Клиент шлёт heartbeat каждые 10-30 секунд. Статус хранится в Redis с TTL. Запрос presence — lookup в Redis.',
              pros: [
                'Простая и предсказуемая модель',
                'Redis обеспечивает быстрый lookup по user ID',
                'TTL автоматически очищает статус при disconnect',
              ],
              cons: [
                'Redis — потенциальный bottleneck при 500M пользователей',
                'Heartbeat-трафик: 500M users × 1 req/30s = ~17M req/s',
                'Нужен Redis Cluster с шардингом',
              ],
              bestWhen:
                'Нужен точный real-time presence с приемлемой нагрузкой (до ~100M online)',
              impact: { latency: 1, scalability: -1, consistency: 1, complexity: 0, cost: 1 },
              capacityImpact: [
                {
                  label: 'Redis memory (presence)',
                  value: '~50 GB',
                  formula:
                    '500M users × 100 bytes (user_id + status + last_seen + TTL metadata) = ~50 GB; fits in Redis Cluster with 10 shards',
                },
                {
                  label: 'Heartbeat RPS',
                  value: '~17M req/sec',
                  formula:
                    '500M users × 10% online × heartbeat every 30s = 50M / 30 ≈ 1.7M/sec; plus presence lookups ≈ 17M/sec total',
                },
                {
                  label: 'Redis cluster size',
                  value: '10 shards (20 nodes with replicas)',
                  formula:
                    '50 GB / 5 GB per shard = 10 shards; × 2 (1 replica each) = 20 Redis nodes; ~1.7M ops/sec per shard',
                },
              ],
            },
            {
              id: 'gossip-protocol',
              label: 'Gossip protocol между gateway серверами',
              description:
                'Gateway серверы обмениваются информацией о подключённых пользователях через gossip. Нет централизованного store.',
              pros: [
                'Нет single point of failure',
                'Масштабируется без централизованного bottleneck',
                'Gateway уже знает о своих соединениях — zero overhead на heartbeat',
              ],
              cons: [
                'Eventual consistency — статус может запаздывать на секунды',
                'Gossip-трафик растёт с количеством нод (O(N) per update)',
                'Сложная отладка несогласованного состояния',
              ],
              bestWhen:
                'Decentralized архитектура без зависимости от внешнего store для presence',
              impact: { latency: 0, scalability: 1, consistency: -1, complexity: 1, cost: -1 },
            },
            {
              id: 'lazy-presence',
              label: 'Ленивый presence (обновление только при отправке)',
              description:
                'Статус обновляется только при отправке сообщения или открытии чата. Нет постоянного heartbeat.',
              pros: [
                'Минимальная нагрузка на серверы — нет heartbeat-трафика',
                'Достаточно для большинства пользовательских сценариев',
                'Значительная экономия bandwidth на мобильных сетях',
              ],
              cons: [
                'Неточный статус — пользователь может быть online, но статус не обновлён',
                '"Последний раз онлайн" вместо real-time индикатора',
                'Не подходит для мессенджеров, где presence — ключевая фича',
              ],
              bestWhen:
                'Экономия ресурсов важнее точности presence (подход Telegram для приватности)',
              impact: { latency: 0, scalability: 2, consistency: -2, complexity: -1, cost: -1 },
            },
            {
              id: 'no-presence',
              label: 'Без presence',
              description:
                'Полный отказ от отображения онлайн-статуса. Telegram позволяет пользователям скрыть presence полностью.',
              pros: [
                'Нулевая нагрузка на инфраструктуру presence',
                'Максимальная приватность пользователей',
                'Проще архитектура — меньше движущихся частей',
              ],
              cons: [
                'Пользователи не видят, доступен ли собеседник',
                'Снижает engagement — нет стимула писать "прямо сейчас"',
                'Может восприниматься как недостаток функциональности',
              ],
              bestWhen:
                'Privacy-first мессенджер или канальная модель, где presence не важен',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: -2, cost: -2 },
              capacityImpact: [
                {
                  label: 'Redis memory (presence)',
                  value: '0 GB',
                  formula:
                    'No presence system needed; zero Redis memory, zero heartbeat traffic, zero infrastructure cost',
                },
                {
                  label: 'Heartbeat RPS',
                  value: '0 req/sec',
                  formula:
                    'No heartbeats; connection state tracked only at gateway level for message delivery',
                },
              ],
            },
          ],
        },
        {
          id: 'chat-partition',
          category: 'Партиционирование данных',
          question: 'Какую стратегию партиционирования данных использовать?',
          options: [
            {
              id: 'by-user-id',
              label: 'По user ID (consistent hashing)',
              description:
                'Все данные пользователя (inbox, настройки, контакты) на одном шарде. Consistent hashing для распределения.',
              pros: [
                'Все данные пользователя на одном шарде — быстрый sync',
                'Consistent hashing минимизирует перебалансировку',
                'Простая модель маршрутизации',
              ],
              cons: [
                'Групповые чаты разбросаны по шардам участников',
                'Hot spots — активные пользователи создают неравномерную нагрузку',
                'Перемещение пользователя между шардами — тяжёлая операция',
              ],
              bestWhen:
                'Преобладают личные чаты и важен быстрый доступ ко всем данным пользователя',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'by-conversation-id',
              label: 'По conversation ID',
              description:
                'Все сообщения одного чата хранятся на одном шарде. Шард определяется по ID беседы.',
              pros: [
                'Все сообщения чата на одном шарде — быстрый доступ к истории',
                'Sequence numbers в рамках шарда — гарантия порядка',
                'Хорошо для групповых чатов',
              ],
              cons: [
                'Inbox пользователя (все его чаты) разбросан по шардам',
                'Sync при подключении — нужно обратиться ко всем шардам',
                'Популярные группы — hot partitions',
              ],
              bestWhen:
                'Преобладают групповые чаты и важен быстрый доступ к истории конкретного чата',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'geographic',
              label: 'Географическое партиционирование',
              description:
                'Данные пользователя хранятся в ближайшем дата-центре. Сообщения между регионами — cross-region replication.',
              pros: [
                'Минимальный latency для локальных чатов',
                'Соответствие требованиям data residency (GDPR)',
                'Локальные сбои не затрагивают другие регионы',
              ],
              cons: [
                'Межрегиональные чаты — дополнительный latency',
                'Cross-region replication — сложность и стоимость',
                'Миграция пользователя при переезде — нетривиальна',
              ],
              bestWhen:
                'Регуляторные требования к локализации данных или распределённая пользовательская база',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 2, cost: 2 },
            },
            {
              id: 'hybrid-partition',
              label: 'Гибрид: user ID для inbox, conversation ID для сообщений',
              description:
                'Inbox пользователя (список чатов, статусы) шардируется по user ID. Сообщения — по conversation ID. Два слоя шардинга.',
              pros: [
                'Быстрый sync inbox (один шард для списка чатов пользователя)',
                'Быстрый доступ к истории чата (один шард для сообщений)',
                'Оптимальный баланс для обоих паттернов доступа',
              ],
              cons: [
                'Два уровня шардинга — операционная сложность',
                'Запись сообщения — два шарда (inbox получателя + conversation)',
                'Нужна координация между слоями',
              ],
              bestWhen:
                'Мессенджер с разнообразными паттернами доступа: и личные чаты, и группы, и каналы',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: 1, cost: 1 },
            },
          ],
        },
      ],
    },

    // ── Step 6: Reliability ─────────────────────────────────────────────
    {
      id: 'chat-reliability',
      title: 'Надёжность и безопасность',
      description:
        'Обеспечьте порядок сообщений и выберите стратегию шифрования.',
      tip: 'Порядок сообщений — одна из самых недооценённых проблем в мессенджерах. При concurrent отправке в группу сообщения могут прийти в разном порядке на разные устройства. Sequence number per conversation — самое простое и надёжное решение.',
      decisions: [
        {
          id: 'chat-ordering',
          category: 'Порядок сообщений',
          question: 'Как гарантировать правильный порядок сообщений?',
          options: [
            {
              id: 'sequence-numbers',
              label: 'Sequence numbers per conversation',
              description:
                'Каждому сообщению в чате присваивается монотонно возрастающий номер. Сервер — единственный источник правды для порядка в конкретном чате.',
              pros: [
                'Простая и надёжная модель — порядок всегда детерминирован',
                'Легко обнаружить пропуски (gap detection) для sync',
                'Клиент знает, если пропустил сообщение (seq 5 → seq 7)',
              ],
              cons: [
                'Сервер, назначающий sequence — потенциальный bottleneck для горячих групп',
                'Нужен атомарный increment per conversation (Redis INCR или DB sequence)',
                'При split-brain возможны дубликаты sequence numbers',
              ],
              bestWhen:
                'Стандартный выбор для большинства мессенджеров — простота и надёжность',
              impact: { latency: 0, scalability: 0, consistency: 2, complexity: -1, cost: 0 },
            },
            {
              id: 'lamport-timestamps',
              label: 'Lamport timestamps',
              description:
                'Логические часы: каждый узел увеличивает счётчик и обменивается значениями. Обеспечивает causal ordering.',
              pros: [
                'Не требует централизованного координатора',
                'Гарантирует happens-before отношение',
                'Работает в распределённой системе без синхронизации часов',
              ],
              cons: [
                'Не различает concurrent события — нужен tiebreaker',
                'Сложнее для понимания и отладки, чем простые sequence numbers',
                'Клиенты должны поддерживать логику Lamport clock',
              ],
              bestWhen:
                'Decentralized система без единой точки назначения порядка',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'vector-clocks',
              label: 'Vector clocks',
              description:
                'Расширение Lamport timestamps: вектор счётчиков для каждого участника. Позволяет обнаруживать concurrent события.',
              pros: [
                'Точное определение causal ordering и concurrency',
                'Можно обнаружить конфликты (concurrent edits)',
                'Теоретически идеальная модель для распределённых систем',
              ],
              cons: [
                'Размер вектора растёт с количеством участников (O(N) для группы из N)',
                'Для группы на 256 участников — 256 счётчиков на каждое сообщение',
                'Избыточная сложность для сценария чата',
              ],
              bestWhen:
                'Collaborative editing или CRDT-система, а не обычный мессенджер',
              impact: { latency: -1, scalability: -1, consistency: 2, complexity: 2, cost: 0 },
            },
            {
              id: 'server-timestamp',
              label: 'Server timestamp ordering',
              description:
                'Порядок определяется по серверному времени (wall clock). Простейший подход.',
              pros: [
                'Максимально простая реализация',
                'Не нужен дополнительный counter или координация',
                'Легко понять и отладить',
              ],
              cons: [
                'Clock skew между серверами — сообщения могут быть не в порядке отправки',
                'NTP drift: 10-100ms расхождение типично',
                'Два сообщения за одну миллисекунду — неопределённый порядок',
              ],
              bestWhen: 'Прототип или система, где порядок не критичен (ленты, комментарии)',
              impact: { latency: 1, scalability: 1, consistency: -2, complexity: -2, cost: 0 },
            },
          ],
        },
        {
          id: 'chat-encryption',
          category: 'Шифрование',
          question: 'Какую стратегию шифрования использовать?',
          options: [
            {
              id: 'tls-only',
              label: 'Только TLS (шифрование в транзите)',
              description:
                'Сообщения шифруются при передаче (TLS), но хранятся на сервере в открытом виде. Сервер может читать контент.',
              pros: [
                'Простейшая реализация — TLS из коробки',
                'Серверный поиск по сообщениям, модерация контента',
                'Бэкапы и восстановление аккаунта тривиальны',
              ],
              cons: [
                'Сервер — точка компрометации (взлом сервера = утечка всех сообщений)',
                'Государственные запросы на доступ к переписке',
                'Пользователи всё меньше доверяют такой модели',
              ],
              bestWhen:
                'Корпоративный мессенджер с требованиями compliance и аудита контента',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: -2, cost: -1 },
            },
            {
              id: 'e2e-signal',
              label: 'E2E шифрование (Signal Protocol)',
              description:
                'Signal Protocol (Double Ratchet + X3DH) — стандарт de facto. Используется в WhatsApp, Signal, Facebook Messenger (Secret Conversations).',
              pros: [
                'Сервер не может прочитать сообщения — максимальная приватность',
                'Forward secrecy — компрометация ключа не раскрывает старые сообщения',
                'Проверенный и аудированный протокол',
              ],
              cons: [
                'Multi-device: нужен протокол синхронизации ключей (Signal Sesame)',
                'Групповое шифрование: Sender Keys увеличивают сложность',
                'Серверный поиск и модерация контента невозможны',
              ],
              bestWhen:
                'Privacy-first мессенджер для личного общения (WhatsApp, Signal модель)',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'e2e-plus-server',
              label: 'E2E + server-side encryption at rest',
              description:
                'E2E для контента сообщений + серверное шифрование метаданных и хранимых данных (encryption at rest в БД).',
              pros: [
                'Двойной уровень защиты — контент и метаданные',
                'Даже при физическом доступе к дискам данные зашифрованы',
                'Соответствие самым строгим стандартам безопасности',
              ],
              cons: [
                'Максимальная сложность реализации и key management',
                'Производительность: два уровня шифрования/дешифрования',
                'Key rotation и management — отдельная инфраструктура (KMS)',
              ],
              bestWhen:
                'Мессенджер для чувствительных коммуникаций (медицина, финансы, государство)',
              impact: { latency: -2, scalability: -1, consistency: 0, complexity: 2, cost: 1 },
            },
          ],
        },
      ],
    },
  ],

  // ── Reference Solution ──────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'chat-type': ['one-on-one', 'group-chats'],
      'chat-features': ['text', 'media', 'read-receipts', 'e2e-encryption'],
      'chat-protocol': ['websocket'],
      'chat-connection': ['stateful-gateway'],
      'chat-message-db': ['scylladb'],
      'chat-media-storage': ['object-storage-cdn'],
      'chat-fanout': ['hybrid-fanout'],
      'chat-offline': ['store-and-forward'],
      'chat-presence': ['heartbeat-redis'],
      'chat-partition': ['hybrid-partition'],
      'chat-ordering': ['sequence-numbers'],
      'chat-encryption': ['e2e-signal'],
    },
    explanation:
      'Эта архитектура спроектирована для обслуживания 500M+ пользователей с real-time доставкой сообщений.\n\n' +
      '**Типы чатов и фичи:** Личные чаты и группы до 256 участников покрывают 95% сценариев использования. ' +
      'Текст + медиа + статусы прочтения + E2E шифрование — стандарт WhatsApp-уровня мессенджера.\n\n' +
      '**Real-time коммуникация:** WebSocket обеспечивает двунаправленную связь с минимальным overhead. ' +
      'Stateful gateway серверы (по модели WhatsApp Erlang-нод) держат миллионы соединений на сервер, ' +
      'обеспечивая мгновенную маршрутизацию сообщений к нужному сокету.\n\n' +
      '**Хранение:** ScyllaDB (Cassandra-совместимая, C++) — write-heavy нагрузка чата при предсказуемом p99 latency, ' +
      'без GC-пауз. Медиа — S3 + CDN: бесконечная ёмкость с быстрой глобальной раздачей.\n\n' +
      '**Доставка:** Гибридный fanout: write для групп ≤256 (быстрое чтение inbox), read для каналов. ' +
      'Store-and-forward для офлайн: сообщения в inbox ждут подключения пользователя.\n\n' +
      '**Масштабирование:** Redis Cluster для presence (heartbeat с TTL). ' +
      'Гибридное партиционирование: inbox по user ID, сообщения по conversation ID — оптимальный доступ для обоих паттернов.\n\n' +
      '**Надёжность:** Sequence numbers per conversation — простая гарантия порядка с gap detection. ' +
      'Signal Protocol для E2E шифрования — forward secrecy, проверенный стандарт индустрии.',
    diagram:
      '```\n' +
      '┌──────────┐     WebSocket      ┌─────────────────┐\n' +
      '│  Client  │◄──────────────────►│  WS Gateway     │\n' +
      '│(iOS/And/ │                    │  (stateful,     │\n' +
      '│ Web)     │                    │   ~2M conn/node)│\n' +
      '└──────────┘                    └────────┬────────┘\n' +
      '                                         │\n' +
      '                                         ▼\n' +
      '                               ┌─────────────────┐\n' +
      '                               │ Message Service  │\n' +
      '                               │ (routing,        │\n' +
      '                               │  validation,     │\n' +
      '                               │  seq numbers)    │\n' +
      '                               └────────┬────────┘\n' +
      '                                        │\n' +
      '                          ┌─────────────┼─────────────┐\n' +
      '                          ▼             ▼             ▼\n' +
      '                   ┌───────────┐ ┌───────────┐ ┌───────────┐\n' +
      '                   │   Kafka   │ │   Kafka   │ │   Kafka   │\n' +
      '                   │ (fanout)  │ │ (push)    │ │ (events)  │\n' +
      '                   └─────┬─────┘ └─────┬─────┘ └─────┬─────┘\n' +
      '                         │             │             │\n' +
      '                         ▼             ▼             ▼\n' +
      '                   ┌───────────┐ ┌───────────┐ ┌───────────┐\n' +
      '                   │  Fanout   │ │   Push    │ │  Presence │\n' +
      '                   │  Service  │ │  Service  │ │  Service  │\n' +
      '                   │(write/read│ │(APNs/FCM) │ │(heartbeat)│\n' +
      '                   │ hybrid)   │ │           │ │           │\n' +
      '                   └───────────┘ └───────────┘ └─────┬─────┘\n' +
      '                                                     │\n' +
      '         ┌───────────────────┬───────────────────┐   │\n' +
      '         ▼                   ▼                   ▼   ▼\n' +
      '  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐\n' +
      '  │  ScyllaDB   │   │  S3 + CDN    │   │    Redis     │\n' +
      '  │ (messages,  │   │ (media:      │   │  Cluster     │\n' +
      '  │  inbox,     │   │  photos,     │   │ (presence,   │\n' +
      '  │  metadata)  │   │  video,      │   │  sessions,   │\n' +
      '  │             │   │  files)      │   │  online TTL) │\n' +
      '  └─────────────┘   └──────────────┘   └──────────────┘\n' +
      '```',
  },
  capacityEstimates: {
    default: [
      {
        label: 'Concurrent connections',
        value: '50M',
        formula:
          '500M users × 10% online at any time = 50M WebSocket connections',
      },
      {
        label: 'Messages per day',
        value: '20B',
        formula: '500M users × avg 40 msgs/day = 20B messages/day',
      },
      {
        label: 'Peak messages/sec',
        value: '~700K/sec',
        formula:
          '20B / 86 400 ≈ 231K/sec × 3× peak factor ≈ 700K msgs/sec',
      },
      {
        label: 'Message storage (1 year)',
        value: '~730 TB',
        formula:
          '20B/day × 365 days × 100 bytes avg = ~730 TB/year',
      },
      {
        label: 'Media storage (1 year)',
        value: '~73 PB',
        formula:
          '20B msgs/day × 5% have media × 200 KB avg = ~73 PB/year',
      },
      {
        label: 'Bandwidth (messages only)',
        value: '~140 MB/s',
        formula:
          '700K/sec × 100 bytes × 2 (send + receive) = ~140 MB/s',
      },
    ],
  },
};
