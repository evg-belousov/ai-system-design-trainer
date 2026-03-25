import type { Question } from '../types';

export const replicationQuestions: Question[] = [
  {
    id: 'sd-replication-001',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое репликация базы данных?',
    options: [
      'Разделение данных на несколько серверов по определённому ключу',
      'Создание и поддержание копий данных на нескольких серверах для повышения доступности и отказоустойчивости',
      'Процесс миграции данных из одной СУБД в другую',
      'Автоматическое резервное копирование базы данных по расписанию',
    ],
    correctIndex: 1,
    explanation:
      'Репликация (replication) — это процесс копирования и синхронизации данных между несколькими серверами баз данных (репликами). Цели: повышение доступности (при падении одного сервера другие продолжают работу), отказоустойчивость, масштабирование чтения (распределение read-запросов между репликами), снижение задержки (реплика ближе к пользователю).',
  },
  {
    id: 'sd-replication-002',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'Как работает схема репликации master-slave (primary-replica)?',
    options: [
      'Все узлы равноправны и принимают как записи, так и чтения',
      'Один узел (master) принимает все записи и реплицирует изменения на slave-узлы, которые обслуживают чтения',
      'Данные разделяются поровну между master и slave, каждый хранит свою половину',
      'Slave-узел автоматически заменяет master при любом изменении конфигурации',
    ],
    correctIndex: 1,
    explanation:
      'В схеме master-slave (primary-replica) один узел (master/primary) принимает все операции записи. Изменения затем реплицируются на один или несколько slave-узлов (replica). Slave-узлы обслуживают операции чтения, разгружая master. При сбое master может быть выполнен failover — один из slave-ов промоутится до master. Эта схема хорошо подходит для read-heavy нагрузок.',
  },
  {
    id: 'sd-replication-003',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое шардирование (sharding) базы данных?',
    options: [
      'Создание нескольких копий одних и тех же данных на разных серверах',
      'Разделение данных на части (шарды), каждая из которых хранится на отдельном сервере',
      'Сжатие данных для экономии дискового пространства',
      'Вертикальное масштабирование базы данных путём добавления ресурсов на один сервер',
    ],
    correctIndex: 1,
    explanation:
      'Шардирование (sharding) — это горизонтальное разделение данных между несколькими серверами (шардами). Каждый шард содержит подмножество данных. Например, пользователи с ID 1–1000000 на шарде 1, 1000001–2000000 на шарде 2. Шардирование позволяет масштабировать как запись, так и чтение, распределяя нагрузку между серверами. Ключевой вызов — выбор ключа шардирования (shard key), который обеспечит равномерное распределение.',
  },
  {
    id: 'sd-replication-004',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'Чем синхронная репликация отличается от асинхронной?',
    options: [
      'Синхронная репликация быстрее асинхронной',
      'При синхронной репликации master ждёт подтверждения от реплик перед подтверждением записи клиенту, при асинхронной — не ждёт',
      'Синхронная репликация работает только в пределах одного дата-центра',
      'Асинхронная репликация гарантирует отсутствие потери данных при сбое master',
    ],
    correctIndex: 1,
    explanation:
      'Синхронная репликация: master отправляет изменения на реплики и ждёт подтверждения от одной или нескольких реплик перед тем, как подтвердить запись клиенту. Гарантирует, что данные не потеряются при сбое master, но увеличивает задержку записи. Асинхронная репликация: master подтверждает запись клиенту сразу после локальной записи, реплики обновляются позже. Ниже задержка записи, но при сбое master возможна потеря последних изменений (replication lag).',
  },
  {
    id: 'sd-replication-005',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'Что такое read replica и для чего она используется?',
    options: [
      'Резервная копия базы данных, которая активируется только при сбое',
      'Копия базы данных, предназначенная для обслуживания запросов на чтение, разгружающая master от read-нагрузки',
      'Специальная таблица в БД для кэширования результатов частых запросов',
      'Отдельная база данных, хранящая только индексы для быстрого поиска',
    ],
    correctIndex: 1,
    explanation:
      'Read replica — это реплика базы данных, оптимизированная для обслуживания запросов на чтение. Все записи идут на master, а read replica получает изменения через репликацию. Это позволяет: масштабировать чтение горизонтально (добавляя больше реплик), разгрузить master для операций записи, обеспечить географическую локальность (реплика ближе к пользователям). AWS RDS, Google Cloud SQL, Azure SQL — все поддерживают read replicas.',
  },
  {
    id: 'sd-replication-006',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'open',
    question:
      'Объясните разницу между вертикальным и горизонтальным масштабированием баз данных. Когда следует применять шардирование?',
    sampleAnswer:
      'Вертикальное масштабирование (scale up) — увеличение мощности одного сервера: больше CPU, RAM, SSD. Просто, не требует изменений в архитектуре, но имеет потолок (физические ограничения) и высокую стоимость. Горизонтальное масштабирование (scale out) — добавление новых серверов. Шардирование — основной метод горизонтального масштабирования БД. Шардирование следует применять, когда: 1) Объём данных превышает ёмкость одного сервера. 2) Нагрузка на запись слишком высока для одного master. 3) Требования к задержке не позволяют использовать один сервер для всех пользователей. Перед шардированием стоит рассмотреть оптимизацию запросов, кэширование, read replicas.',
    explanation:
      'Шардирование — это крайняя мера масштабирования, которая вносит значительную сложность: cross-shard запросы, распределённые транзакции, ребалансировка данных. Рекомендуется исчерпать возможности вертикального масштабирования, кэширования и read replica перед переходом к шардированию.',
  },
  {
    id: 'sd-replication-007',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Что такое consistent hashing и какую проблему шардирования он решает?',
    options: [
      'Метод шифрования данных при передаче между шардами',
      'Алгоритм распределения данных по шардам, минимизирующий перемещение данных при добавлении или удалении узлов',
      'Способ обеспечения консистентности данных между master и slave',
      'Алгоритм обнаружения конфликтов при multi-master репликации',
    ],
    correctIndex: 1,
    explanation:
      'Consistent hashing — алгоритм, при котором данные и узлы отображаются на кольцо (hash ring). Каждый ключ направляется к ближайшему узлу по кольцу. При добавлении/удалении узла перемещается только часть данных (примерно 1/N, где N — число узлов), а не все данные, как при обычном hash % N. Это решает проблему массовой перебалансировки. Виртуальные узлы (vnodes) обеспечивают равномерное распределение. Используется в DynamoDB, Cassandra, Riak, кэшах (Memcached).',
  },
  {
    id: 'sd-replication-008',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Чем range-based шардирование отличается от hash-based шардирования?',
    options: [
      'Range-based распределяет данные по диапазону ключей, hash-based — по хешу ключа; range поддерживает range-запросы, hash — более равномерное распределение',
      'Range-based работает только с числовыми ключами, hash-based — только со строковыми',
      'Range-based медленнее при записи, hash-based — при чтении',
      'Они идентичны по производительности, различаются только синтаксисом',
    ],
    correctIndex: 0,
    explanation:
      'Range-based шардирование: данные делятся по диапазонам ключа (A-F на шард 1, G-L на шард 2, и т.д.). Преимущество: поддержка range-запросов (все заказы за последний месяц). Недостаток: неравномерное распределение (hotspots) — если данные концентрируются в одном диапазоне. Hash-based шардирование: ключ хешируется, шард определяется по хешу. Преимущество: равномерное распределение. Недостаток: range-запросы требуют обращения ко всем шардам (scatter-gather). MongoDB и PostgreSQL поддерживают оба типа.',
  },
  {
    id: 'sd-replication-009',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Что означает кворумная формула W + R > N в распределённых системах?',
    options: [
      'Минимальное количество узлов для работы системы',
      'Формула, гарантирующая, что при чтении (R узлов) и записи (W узлов) из N реплик хотя бы один узел содержит актуальные данные',
      'Количество реплик, необходимое для синхронной репликации',
      'Максимальное число одновременных подключений к базе данных',
    ],
    correctIndex: 1,
    explanation:
      'В системах с кворумом (quorum) данные записываются на W узлов и читаются с R узлов из N реплик. Если W + R > N, то множества узлов записи и чтения обязательно пересекаются — хотя бы один узел содержит самую свежую версию данных. Примеры: N=3, W=2, R=2 — строгая консистентность. N=3, W=1, R=1 — высокая доступность, но возможно чтение устаревших данных. N=3, W=3, R=1 — быстрое чтение, медленная запись. Этот подход используется в Cassandra, DynamoDB, Riak.',
  },
  {
    id: 'sd-replication-010',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Какая главная проблема multi-master (active-active) репликации?',
    options: [
      'Невозможность масштабирования чтения',
      'Конфликты записи: два мастера могут одновременно изменить одни и те же данные, требуя механизмов разрешения конфликтов',
      'Каждый master должен хранить полную копию всех данных',
      'Multi-master репликация не поддерживает транзакции',
    ],
    correctIndex: 1,
    explanation:
      'При multi-master репликации несколько узлов принимают запись. Если два мастера одновременно изменяют одну и ту же запись, возникает конфликт записи (write conflict). Стратегии разрешения: Last Writer Wins (LWW) — побеждает последняя запись по timestamp (просто, но возможна потеря данных), merge на уровне приложения, CRDT (Conflict-free Replicated Data Types) — структуры данных, автоматически разрешающие конфликты, custom conflict resolution. Multi-master используется для geo-distributed систем (пользователь пишет в ближайший master).',
  },
  {
    id: 'sd-replication-011',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Что такое rebalancing и когда оно необходимо при шардировании?',
    options: [
      'Процесс удаления устаревших данных из шардов для экономии места',
      'Перераспределение данных между шардами при добавлении/удалении узлов или возникновении неравномерной нагрузки (hotspot)',
      'Синхронизация индексов между шардами',
      'Переключение с hash-based на range-based шардирование',
    ],
    correctIndex: 1,
    explanation:
      'Rebalancing — процесс перемещения данных между шардами для восстановления равномерного распределения. Необходимо при: добавлении нового шарда (scale out), удалении шарда, возникновении hotspot (один шард перегружен). Подходы: hash mod N — меняет размещение почти всех ключей (плохо), consistent hashing — перемещает минимум данных, fixed partitions — предварительно нарезанные партиции переназначаются между узлами (Cassandra, Elasticsearch). Rebalancing должен быть online — система продолжает работу во время перебалансировки.',
  },
  {
    id: 'sd-replication-012',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'open',
    question:
      'Что такое replication lag? Какие проблемы он вызывает и как их минимизировать?',
    sampleAnswer:
      'Replication lag — задержка между записью на master и появлением данных на replica при асинхронной репликации. Проблемы: 1) Read-after-write inconsistency: пользователь создаёт запись, читает с реплики и не видит своих данных. 2) Monotonic reads violation: последовательные чтения возвращают данные из разных моментов времени. 3) Phantom reads: данные то появляются, то исчезают. Решения: 1) Read-your-writes: после записи читать с master или ждать синхронизации. 2) Monotonic reads: привязать пользователя к одной реплике (sticky sessions). 3) Semi-synchronous replication: хотя бы одна реплика подтверждает запись синхронно. 4) Мониторинг lag и алертинг при превышении порога.',
    explanation:
      'Replication lag — фундаментальная проблема асинхронной репликации. Типичный lag: миллисекунды–секунды, но при пиковой нагрузке может достигать минут. В PostgreSQL lag мониторится через pg_stat_replication, в MySQL — через SHOW SLAVE STATUS (Seconds_Behind_Master). Проектирование приложений должно учитывать возможность lag.',
  },
  {
    id: 'sd-replication-013',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'open',
    question:
      'Как выбрать ключ шардирования (shard key)? Перечислите основные критерии и приведите примеры хорошего и плохого выбора.',
    sampleAnswer:
      'Критерии: 1) Высокая кардинальность — множество уникальных значений для равномерного распределения. 2) Равномерное распределение — данные распределяются поровну между шардами, без hotspots. 3) Учёт паттернов запросов — ключ должен позволять обращаться к одному шарду (а не scatter-gather по всем). 4) Стабильность — ключ не должен часто меняться. Хорошие примеры: user_id (равномерное распределение, запросы обычно по конкретному пользователю), order_id (высокая кардинальность). Плохие примеры: дата создания (все новые записи на одном шарде — hotspot), страна (неравномерное распределение — в одних странах миллионы пользователей, в других — тысячи), булево поле (2 значения = максимум 2 шарда).',
    explanation:
      'Выбор shard key — одно из самых критичных и сложно обратимых решений в архитектуре. Ошибка приводит к hotspots, cross-shard запросам и необходимости полной перебалансировки. Instagram выбрал user_id для шардирования, но пришлось решать проблему с timeline (который агрегирует данные нескольких пользователей).',
  },
  {
    id: 'sd-replication-014',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'open',
    question:
      'Сравните стратегии разрешения конфликтов при multi-master репликации: Last Writer Wins (LWW), merge-функции и CRDT. Когда какую использовать?',
    sampleAnswer:
      'Last Writer Wins (LWW): побеждает запись с более поздним timestamp. Просто, но возможна потеря данных. Зависит от синхронизации часов (clock skew). Подходит для некритичных данных (last seen, метрики). Merge-функции: приложение реализует логику слияния конфликтующих версий. Гибко, но сложно в реализации. Подходит для сложных бизнес-объектов, где нужна ручная или domain-specific логика. CRDT (Conflict-free Replicated Data Types): математически гарантированное автоматическое разрешение конфликтов. Примеры: G-Counter (счётчик), OR-Set (множество), LWW-Register. Ограничение: поддерживают только определённый набор операций. Подходят для счётчиков, корзин покупок, совместного редактирования. Riak использует CRDT, DynamoDB — LWW, CouchDB — хранит все конфликтующие версии для разрешения на уровне приложения.',
    explanation:
      'Разрешение конфликтов — одна из сложнейших задач в распределённых системах. Универсального решения нет. На практике системы часто комбинируют подходы: CRDT для структур данных, LWW для метаданных, application-level merge для бизнес-логики.',
  },
  {
    id: 'sd-replication-015',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Какой механизм в PostgreSQL используется для физической репликации?',
    options: [
      'Trigger-based replication — триггеры на каждую таблицу',
      'Streaming replication на основе WAL (Write-Ahead Log) — потоковая передача журнала предзаписи',
      'Statement-based replication — повторное выполнение SQL-запросов',
      'Snapshot replication — периодическая полная копия базы',
    ],
    correctIndex: 1,
    explanation:
      'PostgreSQL использует WAL-based streaming replication для физической репликации. WAL (Write-Ahead Log) — журнал, куда записываются все изменения данных перед их применением. Master потоково передаёт WAL-записи на реплики, которые применяют их к своей копии данных. Преимущества: низкая задержка, гарантия консистентности, воспроизведение всех изменений (включая DDL). PostgreSQL также поддерживает логическую репликацию (logical replication) для выборочной репликации отдельных таблиц.',
  },
  {
    id: 'sd-replication-016',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Какая стратегия cross-datacenter репликации обеспечивает наилучший баланс между задержкой записи и защитой от потери данных?',
    options: [
      'Полностью синхронная репликация между дата-центрами',
      'Semi-synchronous: синхронная репликация внутри дата-центра + асинхронная между дата-центрами с подтверждением хотя бы одной удалённой реплики',
      'Полностью асинхронная репликация с RPO = 0',
      'Ежечасная передача полного backup между дата-центрами',
    ],
    correctIndex: 1,
    explanation:
      'Cross-datacenter репликация — критический компонент disaster recovery. Полностью синхронная репликация даёт RPO=0, но задержка между дата-центрами (десятки мс) делает каждую запись медленной. Semi-synchronous подход: запись подтверждается локально синхронно и асинхронно реплицируется в удалённый DC с подтверждением (ack). Это даёт RPO ~ секунды при приемлемой задержке. MySQL Semi-Sync Replication, PostgreSQL synchronous_standby_names с FIRST 1 — примеры реализации. Для geo-active системы часто используют multi-master с eventual consistency.',
  },
  {
    id: 'sd-replication-017',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question:
      'Опишите, как работает автоматический failover в master-slave репликации. Какие проблемы могут возникнуть и как их решить?',
    sampleAnswer:
      'Автоматический failover: 1) Мониторинг — sentinel/orchestrator отслеживает heartbeat master. 2) Обнаружение сбоя — если heartbeat не получен в течение timeout, master считается недоступным. 3) Выборы — определяется лучший кандидат из slave (наименьший replication lag, приоритет). 4) Промоушен — выбранный slave становится новым master, остальные slave переключаются на него. 5) Обновление конфигурации — приложения узнают о новом master (через DNS, service discovery, proxy). Проблемы: 1) Split brain — старый master восстанавливается и принимает записи параллельно с новым → конфликты. Решение: fencing (STONITH — Shoot The Other Node In The Head), проверка lease. 2) Потеря данных — slave мог не получить последние транзакции master (replication lag). Решение: semi-synchronous replication. 3) Ложные срабатывания — сетевой сбой вместо падения master. Решение: consensus-based detection (несколько sentinel-ов голосуют).',
    explanation:
      'Failover — критически важный процесс для обеспечения высокой доступности. Redis Sentinel, MySQL Orchestrator, PostgreSQL Patroni — популярные решения. Правильная реализация failover требует тщательного тестирования (Chaos Engineering) и мониторинга.',
  },
  {
    id: 'sd-replication-018',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question:
      'Как спроектировать глобально распределённую систему с multi-region репликацией? Опишите архитектуру, компромиссы и стратегию обработки данных.',
    sampleAnswer:
      'Архитектура: каждый регион имеет полный стек (application servers, database). Данные классифицируются: 1) Региональные (user profile) — master в «домашнем» регионе пользователя, read replicas в других. 2) Глобальные (каталог продуктов) — один глобальный master, read replicas повсюду. 3) Региональные изолированные (GDPR данные) — только в одном регионе. Стратегия записи: пользователь пишет в «домашний» регион, запись реплицируется асинхронно. Cross-region запись через redirect или relay. Компромиссы: latency vs consistency (CAP), сложность операций, стоимость cross-region трафика. Подходы: CockroachDB/Spanner — distributed SQL с global consistency (Spanner TrueTime). DynamoDB Global Tables — multi-master, LWW. Vitess/Citus — шардированный PostgreSQL/MySQL. DNS-based routing направляет пользователей в ближайший регион.',
    explanation:
      'Multi-region — одна из сложнейших задач в распределённых системах. Google Spanner решает её через TrueTime (атомные часы + GPS), обеспечивая строгую консистентность. Для большинства компаний приемлемым решением является eventual consistency с read-your-writes гарантией в «домашнем» регионе.',
  },
  {
    id: 'sd-replication-019',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question:
      'Объясните проблему cross-shard запросов и распределённых транзакций при шардировании. Какие подходы к их решению существуют?',
    sampleAnswer:
      'Проблема: при шардировании данные одного запроса могут находиться на разных шардах. Например, JOIN таблиц orders и products, если они шардированы по-разному. Cross-shard запросы: scatter-gather — запрос отправляется на все шарды, результаты агрегируются. Проблемы: высокая задержка, нагрузка на сеть, сложность ORDER BY/LIMIT. Распределённые транзакции: 2PC (Two-Phase Commit) — координатор + участники, гарантирует ACID, но медленный и блокирующий. 3PC — улучшенный вариант, но более сложный. Saga — eventual consistency через компенсации. Подходы к решению: 1) Денормализация — хранить нужные данные вместе на одном шарде. 2) Co-location — связанные данные на одном шарде (tenant-based sharding). 3) Application-level join — агрегация на уровне приложения. 4) Специализированные решения: Vitess (для MySQL) автоматически маршрутизирует cross-shard запросы, CockroachDB — distributed SQL с поддержкой транзакций.',
    explanation:
      'Cross-shard операции — главная «цена» шардирования. Правильный выбор shard key и co-location данных может минимизировать необходимость в cross-shard запросах. На практике 2PC используется редко из-за его блокирующей природы; Saga и eventual consistency — более масштабируемые альтернативы.',
  },
  {
    id: 'sd-replication-020',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Что такое chain replication и какое преимущество она даёт по сравнению с классической master-slave?',
    options: [
      'Реплики расположены в цепочке: запись идёт на head, передаётся по цепочке, чтение — с tail; это обеспечивает строгую консистентность при высокой пропускной способности',
      'Каждая реплика хранит только часть данных, образуя цепочку ответственности',
      'Данные записываются параллельно на все узлы через multicast',
      'Реплики автоматически перестраиваются в цепочку при failover',
    ],
    correctIndex: 0,
    explanation:
      'Chain replication — модель, в которой узлы выстроены в цепочку. Запись направляется на head (голову) цепочки и последовательно передаётся через все узлы до tail (хвоста). Чтение обслуживается только tail-ом. Преимущества: строгая консистентность (tail содержит все подтверждённые записи), высокая пропускная способность (нагрузка записи распределяется по цепочке), простая семантика. Используется в Microsoft Azure Storage, HDFS (адаптированный вариант). Недостатки: задержка записи пропорциональна длине цепочки, один медленный узел замедляет всю цепочку.',
  },
  {
    id: 'sd-replication-021',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое geo-replication и зачем она нужна?',
    options: [
      'Репликация данных внутри одного дата-центра',
      'Репликация данных между географически распределёнными дата-центрами для снижения latency, обеспечения disaster recovery и локального соблюдения законодательства',
      'Шифрование данных при передаче между регионами',
      'Балансировка нагрузки между серверами в одном регионе',
    ],
    correctIndex: 1,
    explanation:
      'Geo-replication (cross-region replication) — репликация данных между дата-центрами в разных географических регионах. Цели: 1) Disaster Recovery — при потере одного региона данные доступны в другом. 2) Низкая latency — пользователи читают из ближайшего региона. 3) Data residency — данные хранятся в регионе согласно законодательству (GDPR). 4) High availability — regional outages не влияют на глобальную доступность. Примеры: AWS Global Tables (DynamoDB), Azure Cosmos DB multi-region, PostgreSQL с логической репликацией.',
  },
  {
    id: 'sd-replication-022',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое partition (партиция) в контексте распределённых баз данных?',
    options: [
      'Раздел диска для хранения данных',
      'Логическое разделение данных на части, каждая из которых может храниться и обрабатываться независимо на разных узлах',
      'Версия схемы базы данных',
      'Тип индекса для ускорения запросов',
    ],
    correctIndex: 1,
    explanation:
      'Partition (партиция) — логическое разделение данных. Каждая партиция содержит подмножество данных и может обслуживаться отдельным узлом. Partition vs Shard: часто синонимы, но partition может быть более общим термином (включая разделение внутри одного сервера). В Kafka: topic делится на partitions для параллельной обработки. В PostgreSQL: table partitioning для управления большими таблицами. В MongoDB: shard = набор partitions. Partition key определяет, в какую партицию попадут данные.',
  },
  {
    id: 'sd-replication-023',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'open',
    question: 'Что такое hot spot (горячая точка) при шардировании и как её избежать?',
    sampleAnswer:
      'Hot spot — ситуация, когда один шард получает непропорционально большую нагрузку по сравнению с другими. Причины: 1) Плохой shard key: шардирование по дате → все новые записи на одном шарде. 2) Celebrity problem: популярный пользователь/товар генерирует большинство запросов. 3) Sequential IDs: auto-increment ID при range sharding → все INSERT-ы на последний шард. Решения: 1) Выбор high-cardinality, равномерно распределённого shard key. 2) Hash-based sharding вместо range для sequential данных. 3) Salting: добавление random prefix к ключу (user_123 → shard_5_user_123). 4) Secondary sharding для hot entities. 5) Caching перед hot keys. Мониторинг: отслеживание нагрузки per shard, алерт на дисбаланс.',
    explanation:
      'Hot spots — одна из главных проблем шардирования. Instagram решал celebrity problem через отдельное кэширование hot users. Правильный shard key — ключевое архитектурное решение, сложно изменить позже.',
  },
  {
    id: 'sd-replication-024',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое RPO и RTO в контексте репликации и disaster recovery?',
    options: [
      'RPO — время простоя, RTO — объём потерянных данных',
      'RPO (Recovery Point Objective) — максимально допустимая потеря данных; RTO (Recovery Time Objective) — максимально допустимое время восстановления',
      'RPO и RTO — метрики производительности репликации',
      'RPO — количество реплик, RTO — время репликации',
    ],
    correctIndex: 1,
    explanation:
      'RPO (Recovery Point Objective) — сколько данных допустимо потерять. RPO = 0 означает zero data loss (требует синхронной репликации). RPO = 1 час — можно потерять до часа данных. RTO (Recovery Time Objective) — как быстро система должна восстановиться. RTO = 15 минут — failover должен завершиться за 15 минут. Эти метрики определяют стратегию DR: строгие RPO/RTO требуют синхронной geo-репликации и автоматического failover, что дорого. Баланс между cost и requirements.',
  },
  {
    id: 'sd-replication-025',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое logical replication в PostgreSQL и чем она отличается от физической?',
    options: [
      'Logical replication работает быстрее физической',
      'Logical replication реплицирует логические изменения (INSERT, UPDATE, DELETE) на уровне строк, позволяя выборочную репликацию таблиц и разные версии PostgreSQL',
      'Logical replication использует меньше дискового пространства',
      'Физическая репликация не поддерживает failover',
    ],
    correctIndex: 1,
    explanation:
      'Физическая репликация (streaming replication): передаёт WAL-записи byte-by-byte. Реплика — точная копия, только один master, все таблицы. Logical replication: передаёт логические изменения (row-level changes). Преимущества: выборочная репликация (отдельные таблицы), разные версии PostgreSQL (для upgrade), реплика writable (для reports), multiple publishers/subscribers. Недостатки: не реплицирует DDL (schema changes), sequences, large objects. Use cases: zero-downtime upgrade, cross-DC selective replication, OLTP → OLAP sync.',
  },
  {
    id: 'sd-replication-026',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое split-brain в контексте репликации и как его предотвратить?',
    options: [
      'Разделение данных между шардами',
      'Ситуация, когда два узла считают себя master-ом из-за network partition, что приводит к конфликтам и потере данных',
      'Метод оптимизации запросов в распределённой БД',
      'Техника балансировки нагрузки',
    ],
    correctIndex: 1,
    explanation:
      'Split-brain возникает при network partition: узлы не видят друг друга, каждый считает, что другой упал, и продвигает себя в master. Результат: два master-а принимают конфликтующие записи. Предотвращение: 1) Quorum-based: для продвижения в master нужно большинство голосов (при partition меньшинство не может стать master). 2) Fencing (STONITH): физическое отключение старого master-а перед продвижением нового. 3) Witness node: третий узел в другом DC для определения, какая сторона partition имеет majority. 4) Lease-based: master должен периодически обновлять lease, при partition lease истекает.',
  },
  {
    id: 'sd-replication-027',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'open',
    question: 'Сравните стратегии шардирования: по диапазону (range) и по хешу (hash). Приведите примеры use cases.',
    sampleAnswer:
      'Range-based sharding: данные делятся по диапазонам ключа. users A-M → shard 1, N-Z → shard 2. Или orders 2023-01 → shard 1, 2023-02 → shard 2. Pros: range queries эффективны (все данные за январь на одном шарде), логичная структура. Cons: неравномерное распределение (hot spots), необходимость manual rebalancing при росте. Use cases: time-series данные, географические данные. Hash-based sharding: shard = hash(key) % num_shards. Pros: равномерное распределение, автоматическое. Cons: range queries требуют scatter-gather (все шарды), rebalancing при добавлении шардов сложен (consistent hashing помогает). Use cases: user data, random access patterns. Hybrid: hash partition + range secondary. Directory-based: отдельная таблица mapping key → shard, гибко, но single point of failure.',
    explanation:
      'Выбор стратегии зависит от access patterns. Time-series — range по времени. User data с random access — hash. MongoDB, PostgreSQL, CockroachDB поддерживают оба типа.',
  },
  {
    id: 'sd-replication-028',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'open',
    question: 'Что такое data locality и как её обеспечить при geo-распределённой репликации?',
    sampleAnswer:
      "Data locality — размещение данных ближе к пользователям или приложениям, которые к ним обращаются. Цели: снижение latency, compliance (GDPR — данные EU в EU), снижение cross-region traffic costs. Стратегии: 1) Geo-partitioning: данные пользователя хранятся в его «домашнем» регионе. user.region определяет шард. 2) Follow-the-sun: активная реплика перемещается по часовым поясам. 3) Local reads: read replicas в каждом регионе, reads локальные, writes routing на master. 4) Multi-master с conflict resolution: writes в локальный region, async replication, merge conflicts. CockroachDB locality-aware partitioning: CREATE TABLE users (...) PARTITION BY LIST (country) (PARTITION eu VALUES IN ('DE', 'FR') LOCATE IN 'eu-west', ...). Spanner: placement policies для geo-distribution.",
    explanation:
      'Data locality критична для global-scale систем. Netflix, Uber используют region-aware routing. Trade-off: locality vs consistency — локальные reads могут быть stale при async replication.',
  },
  {
    id: 'sd-replication-029',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое Raft consensus алгоритм и где он используется?',
    options: [
      'Алгоритм шифрования данных при репликации',
      'Алгоритм распределённого консенсуса для выбора лидера и репликации log-а, обеспечивающий согласованность в distributed systems',
      'Метод сжатия данных в WAL',
      'Протокол балансировки нагрузки',
    ],
    correctIndex: 1,
    explanation:
      'Raft — алгоритм распределённого консенсуса, разработанный как понятная альтернатива Paxos. Компоненты: Leader Election (один leader, остальные followers), Log Replication (leader реплицирует entries на followers), Safety (committed entries не теряются). Leader heartbeat поддерживает leadership. При потере leader-а — новые выборы с quorum. Raft используется: etcd (Kubernetes), CockroachDB, TiDB, Consul, HashiCorp Vault. Raft обеспечивает strong consistency через replicated state machine.',
  },
  {
    id: 'sd-replication-030',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое Google Spanner и как он обеспечивает глобальную консистентность?',
    options: [
      'Облачный сервис для хранения файлов',
      'Глобально распределённая NewSQL база данных с external consistency, использующая TrueTime (атомные часы + GPS) для синхронизации времени',
      'Инструмент для миграции данных между регионами',
      'Кэширующий слой для PostgreSQL',
    ],
    correctIndex: 1,
    explanation:
      'Google Spanner — globally distributed, strongly consistent database. Уникальность: TrueTime API предоставляет bounded uncertainty interval для текущего времени (обычно < 7ms) через атомные часы и GPS в каждом дата-центре. Это позволяет Spanner реализовать external consistency (linearizability) глобально: транзакции получают timestamps, commit wait гарантирует ordering. Spanner: SQL interface, horizontal scaling, automatic sharding, synchronous replication. Trade-off: commit latency включает wait time для TrueTime uncertainty. Cloud Spanner — managed version в GCP.',
  },
  {
    id: 'sd-replication-031',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое CockroachDB и как он реализует distributed SQL без TrueTime?',
    options: [
      'NoSQL база данных для time-series',
      'Distributed SQL база с Raft-based репликацией и hybrid logical clocks (HLC) для ordering транзакций без специализированного hardware',
      'In-memory кэш для PostgreSQL',
      'Graph database для social networks',
    ],
    correctIndex: 1,
    explanation:
      'CockroachDB — open-source distributed SQL database, вдохновлённая Spanner. Отличие: вместо TrueTime использует Hybrid Logical Clocks (HLC) — комбинация physical clock и logical counter. HLC обеспечивает causality, но не bounded uncertainty как TrueTime. Результат: CockroachDB предоставляет serializable isolation, но с potential stale reads при clock skew. Архитектура: Raft для replication, automatic range splitting/merging для sharding, PostgreSQL-compatible SQL. Geo-partitioning, locality-aware queries. Deployment: any cloud, on-premise, Kubernetes.',
  },
  {
    id: 'sd-replication-032',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question: 'Как реализовать online schema migration в шардированной базе данных без downtime?',
    sampleAnswer:
      'Online schema migration в sharded DB — сложная задача. Подходы: 1) Ghost/pt-online-schema-change: создание shadow table с новой схемой, копирование данных порциями, CDC для новых изменений, atomic rename. Для sharded: выполнять на каждом шарде последовательно или параллельно. 2) Expand-Contract pattern: Phase 1 (Expand): добавить новые колонки/таблицы, приложение пишет в old + new. Phase 2: backfill старых данных в новую структуру. Phase 3 (Contract): приложение использует только new, удаление old. 3) Vitess для MySQL: online DDL через vreplication. 4) Blue-green deployment: новый кластер с новой схемой, миграция данных, переключение трафика. Challenges: foreign keys, constraints, triggers, long-running transactions. Важно: тестирование на copy of production, rollback plan.',
    explanation:
      'Schema migrations — одна из сложнейших операций в distributed systems. GitHub, Facebook используют ghost/pt-osc для MySQL. Zero-downtime migrations требуют careful planning и multiple deploys приложения.',
  },
  {
    id: 'sd-replication-033',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите стратегию resharding (перешардирования) при изменении количества шардов.',
    sampleAnswer:
      'Resharding необходим при: добавлении шардов (scale out), удалении (scale in), изменении shard key. Стратегии: 1) Hash-based с consistent hashing: при добавлении узла перемещается ~1/N данных (от соседних узлов на кольце). Virtual nodes улучшают балансировку. 2) Double-write период: пишем в old и new шарды одновременно, читаем с old, затем переключаем reads на new, отключаем writes в old. 3) Background migration: читаем с old, lazily migrate при access (копируем при read miss на new), background job для остальных. 4) New cluster approach: создаём новый кластер с новой схемой шардирования, stream данные через CDC, переключаем трафик. 5) Vitess для MySQL: vreplication для resharding. MongoDB: automatic balancer перемещает chunks. Challenges: maintaining consistency during migration, handling hotspots в процессе, rollback capability.',
    explanation:
      'Resharding — disruptive и resource-intensive. Правильное начальное проектирование (достаточное число шардов, хороший shard key) минимизирует необходимость resharding. Consistent hashing — best practice для систем с динамическим количеством узлов.',
  },
  {
    id: 'sd-replication-034',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое replica set в MongoDB?',
    options: [
      'Набор индексов для коллекции',
      'Группа MongoDB-инстансов, поддерживающих одинаковый набор данных: один primary для записи и несколько secondaries для репликации и read scaling',
      'Конфигурация шардирования',
      'Набор правил валидации документов',
    ],
    correctIndex: 1,
    explanation:
      'Replica Set в MongoDB — группа mongod процессов, обеспечивающих redundancy и high availability. Primary принимает все writes. Secondaries реплицируют данные с primary через oplog (operations log). При падении primary автоматические выборы нового (Raft-like). Read preferences: primary (default), primaryPreferred, secondary, secondaryPreferred, nearest. Arbiter — узел без данных, только для голосования. Минимум 3 узла для fault tolerance (quorum). Replica set — основа для sharded cluster в MongoDB.',
  },
  {
    id: 'sd-replication-035',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое read-your-writes consistency и как её обеспечить?',
    options: [
      'Гарантия, что данные никогда не устареют',
      'Гарантия, что после записи пользователь всегда увидит свои изменения при последующих чтениях',
      'Гарантия атомарности транзакций',
      'Гарантия уникальности primary key',
    ],
    correctIndex: 1,
    explanation:
      'Read-your-writes (RYW) consistency — гарантия, что если пользователь записал данные, его последующие чтения увидят эту запись (или более новую). Проблема при async replication: запись на master, чтение с replica → replica может не иметь записи. Решения: 1) После writes читать с master (sticky connection). 2) Передавать write timestamp, replica ждёт пока достигнет этого offset. 3) Session consistency: отслеживать последний write пользователя, читать с replica только если она синхронизирована. 4) Causal consistency tokens. DynamoDB, Cosmos DB предлагают session consistency для RYW.',
  },
  {
    id: 'sd-replication-036',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'open',
    question: 'Как мониторить здоровье репликации? Какие метрики отслеживать?',
    sampleAnswer:
      'Ключевые метрики репликации: 1) Replication lag: задержка replica от master (в секундах, байтах, или LSN). PostgreSQL: pg_stat_replication.replay_lag. MySQL: Seconds_Behind_Master. Алерт: lag > threshold. 2) Replica status: connected/disconnected, streaming/catching up. 3) Write throughput: transactions per second на master vs replay rate на replica. 4) Network bandwidth: между master и replicas. 5) Disk I/O: на replicas при replay. 6) Connection count: replication connections. 7) Failover metrics: time since last failover, failover success rate. 8) Quorum health: в Raft-based systems — leader election events, term changes. Инструменты: pg_stat_replication (PostgreSQL), SHOW SLAVE STATUS (MySQL), Prometheus exporters, Datadog/New Relic integrations. Dashboards: replica lag graph, cluster topology visualization. Алерты: replication broken, lag > SLA, replica count < minimum.',
    explanation:
      'Replication lag — «канарейка» здоровья репликации. Растущий lag сигнализирует о проблемах: недостаточная производительность replica, сетевые issues, heavy write load. Без мониторинга проблемы обнаруживаются только при failover (слишком поздно).',
  },
  {
    id: 'sd-replication-037',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое vector clock и для чего он используется в распределённых системах?',
    options: [
      'Алгоритм синхронизации времени через NTP',
      'Механизм отслеживания причинно-следственных связей между событиями для определения concurrent операций и разрешения конфликтов',
      'Метод измерения latency между узлами',
      'Структура данных для хранения timestamps',
    ],
    correctIndex: 1,
    explanation:
      'Vector clock — логические часы для отслеживания causality в distributed systems. Каждый узел поддерживает вектор счётчиков [N1: 5, N2: 3, N3: 7]. При локальном событии узел инкрементирует свой счётчик. При отправке сообщения — прикладывает vector clock. При получении — merge (max по каждому компоненту) + инкремент. Сравнение: V1 < V2 если все компоненты V1 <= V2 и хотя бы один <. Иначе — concurrent (конфликт). Используется в Amazon Dynamo, Riak для conflict detection. Проблема: размер вектора растёт с числом узлов. Dotted Version Vectors, Interval Tree Clocks — оптимизации.',
  },
  {
    id: 'sd-replication-038',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question: 'Сравните подходы к geo-replication: active-passive vs active-active. Когда какой использовать?',
    sampleAnswer:
      'Active-Passive: один регион (active) принимает все writes, другие (passive) — read replicas. Failover переключает writes на passive. Pros: простая модель, no write conflicts, strong consistency. Cons: writes имеют latency до active region, manual/automated failover при disaster. Use case: системы с read-heavy нагрузкой, где строгая consistency важнее latency. Active-Active (multi-master): все регионы принимают writes локально, асинхронная репликация между ними. Pros: low write latency (local writes), no single point of failure. Cons: write conflicts требуют resolution (LWW, CRDT, app-level merge), eventual consistency, complex operations. Use case: глобальные системы с geo-distributed users, где latency критична (social media, gaming). Hybrid: geo-partitioning — каждый пользователь «принадлежит» региону, его writes идут только туда, другие регионы — read replicas для этого пользователя.',
    explanation:
      'Выбор зависит от trade-off: consistency vs latency vs complexity. Banks часто используют active-passive (consistency). Social media — active-active (latency). CockroachDB, Spanner пытаются дать best of both worlds через global consensus.',
  },
  {
    id: 'sd-replication-039',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question: 'Как спроектировать sharding для multi-tenant SaaS приложения?',
    sampleAnswer:
      'Multi-tenant sharding strategies: 1) Tenant-per-shard: каждый tenant на отдельном шарде. Pros: полная изоляция, простые запросы. Cons: не масштабируется для миллионов small tenants, resource waste. Подходит для enterprise customers. 2) Shared sharding by tenant_id: shard = hash(tenant_id) % N. Tenants распределены по шардам. Pros: эффективное использование ресурсов, масштабируется. Cons: меньше изоляции, noisy neighbor возможен. 3) Hybrid: large tenants — dedicated shard, small tenants — shared. 4) Hierarchical: region → tenant → data sharding. Shard key: tenant_id обычно лучший выбор — все данные tenant-а на одном шарде, cross-tenant queries редки. Migrations: при росте tenant-а — выделить в dedicated shard. При добавлении шардов — consistent hashing минимизирует migration. Compliance: tenant в specific region для data residency.',
    explanation:
      'Multi-tenant sharding — balance между isolation, efficiency, и complexity. Salesforce, Shopify используют sophisticated tenant placement strategies. Noisy neighbor — главная проблема shared sharding.',
  },
  {
    id: 'sd-replication-040',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое partition tolerance в CAP-теореме?',
    options: [
      'Толерантность к потере данных при сбоях',
      'Способность системы продолжать работу при сетевых разделениях (network partitions) между узлами',
      'Устойчивость к изменению схемы данных',
      'Толерантность к высокой нагрузке на отдельные партиции',
    ],
    correctIndex: 1,
    explanation:
      'Partition Tolerance (P) в CAP: система продолжает работать при network partition — когда узлы не могут общаться друг с другом. В распределённой системе P практически обязателен (сеть unreliable). CAP говорит: при partition выбирай между C (consistency) и A (availability). CP systems (MongoDB, HBase): при partition отклоняют writes в minority partition, сохраняя consistency. AP systems (Cassandra, DynamoDB): при partition обе стороны продолжают работать, eventual consistency. PACELC расширяет CAP: даже без partition есть trade-off latency vs consistency.',
  },
  {
    id: 'sd-replication-041',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'open',
    question: 'Что такое failover и failback? Объясните процесс переключения при сбое master.',
    sampleAnswer:
      'Failover — процесс переключения на резервный узел при сбое primary. Этапы: 1) Detection: мониторинг обнаруживает недоступность master (heartbeat timeout). 2) Confirmation: множественные проверки во избежание ложных срабатываний. 3) Election: выбор лучшего кандидата из replicas (наименьший lag, highest priority). 4) Promotion: replica становится новым master (accepts writes). 5) Reconfiguration: остальные replicas переключаются на нового master, клиенты обновляют connection. Failback — возврат к исходному master после его восстановления. Опции: автоматический (рискованный — возможна потеря данных), ручной (safer). Восстановленный узел обычно становится replica, может быть promoted обратно planned maintenance window. Важно: fencing старого master для предотвращения split-brain.',
    explanation:
      'Failover критичен для HA. Автоматический failover (Redis Sentinel, PostgreSQL Patroni) снижает RTO, но требует тщательной настройки для избежания split-brain и data loss. Manual failback обычно safer.',
  },
  {
    id: 'sd-replication-042',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое shard proxy (router) и зачем он нужен?',
    options: [
      'Кэширующий слой перед шардами',
      'Компонент, маршрутизирующий запросы на нужный шард на основе shard key, абстрагируя клиента от топологии шардирования',
      'Резервный шард для failover',
      'Инструмент мониторинга шардов',
    ],
    correctIndex: 1,
    explanation:
      'Shard proxy (router) — middleware между клиентами и шардами. Функции: 1) Routing: определяет нужный шард по shard key. 2) Query distribution: scatter-gather для cross-shard queries. 3) Topology abstraction: клиент не знает о расположении шардов. 4) Connection pooling: уменьшает connections к шардам. 5) Failover handling: перенаправление при сбое шарда. Примеры: MongoDB mongos, Vitess vtgate, ProxySQL для MySQL sharding, pgpool для PostgreSQL. Без proxy клиент должен сам знать топологию и роутить запросы. Proxy может быть bottleneck — масштабируется через multiple instances.',
  },
  {
    id: 'sd-replication-043',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое CRDT (Conflict-free Replicated Data Types)?',
    options: [
      'Формат сериализации данных для репликации',
      'Структуры данных, которые математически гарантируют автоматическое бесконфликтное слияние при concurrent updates на разных репликах',
      'Протокол шифрования для репликации',
      'Метод сжатия данных при передаче',
    ],
    correctIndex: 1,
    explanation:
      'CRDT — data structures designed for eventual consistency. Примеры: G-Counter (grow-only counter) — каждый узел инкрементирует свой счётчик, merge = sum. PN-Counter — инкремент и декремент. G-Set — grow-only set, merge = union. OR-Set — set с add/remove через unique tags. LWW-Register — last-write-wins register. Свойства: commutativity, associativity, idempotence merge операции гарантируют convergence независимо от порядка. Используются: Riak (data types), Redis (CRDT replication), collaborative editing (Yjs, Automerge). Trade-off: ограниченный набор операций, storage overhead.',
  },
  {
    id: 'sd-replication-044',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question: 'Как обеспечить exactly-once delivery при репликации? Возможно ли это?',
    sampleAnswer:
      'True exactly-once delivery в распределённой системе невозможен (Two Generals Problem). Реально достижимо: at-least-once delivery + idempotent processing = effectively-once semantics. Стратегии: 1) Idempotency keys: каждая операция имеет unique ID, при retry проверяем — уже обработано? 2) Transactional outbox: atomic write to DB + outbox, separate publisher с deduplication. 3) Log sequence numbers (LSN): replica отслеживает последний применённый LSN, пропускает duplicates. 4) Two-phase commit: гарантирует atomic commit на multiple nodes, но блокирующий и медленный. 5) Kafka exactly-once: transactional producer + idempotent writes + consumer read_committed. Работает внутри Kafka экосистемы. При cross-system репликации: at-least-once с idempotent consumer — практический стандарт. Database CDC tools (Debezium) обеспечивают at-least-once, consumer deduplicates.',
    explanation:
      'Exactly-once — маркетинговый термин. В реальности: система обрабатывает duplicates так, что side effects происходят once. Idempotency — ключевой паттерн. Kafka Transactions обеспечивают exactly-once для read-process-write внутри Kafka.',
  },
  {
    id: 'sd-replication-045',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое replication factor и как его выбрать?',
    options: [
      'Скорость репликации данных',
      'Количество копий данных в системе: RF=3 означает три копии каждого данного',
      'Коэффициент сжатия при репликации',
      'Интервал между синхронизациями реплик',
    ],
    correctIndex: 1,
    explanation:
      'Replication Factor (RF) — количество копий данных. RF=3 — стандарт: переживает отказ двух узлов. RF=1 — нет redundancy, данные теряются при сбое. RF=5 — высокая durability для критичных данных. Trade-offs: выше RF → больше storage, выше write latency (при sync replication), лучше durability и read scalability. Формула: для переживания N сбоев нужен RF >= N+1. Для quorum (majority): RF >= 2F+1 где F — число допустимых сбоев. Kafka: replication.factor per topic. Cassandra: replication factor per keyspace. AWS S3: данные реплицируются across 3+ AZs автоматически.',
  },
  {
    id: 'sd-replication-046',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'open',
    question: 'Что такое materialized view и как она используется с репликацией для read scaling?',
    sampleAnswer:
      'Materialized view — предвычисленный и сохранённый результат запроса. В отличие от обычного view, данные физически хранятся, запросы читают из кэша без выполнения join-ов. Использование с репликацией: 1) CQRS pattern: writes идут в normalized model на master, materialized views (read models) на replicas оптимизированы для специфических запросов. 2) Refresh strategies: полный refresh (периодически пересоздаём), incremental refresh (применяем только изменения), on-demand (при запросе). 3) CDC-based: Debezium захватывает изменения → stream processing (Kafka Streams/Flink) → materialized view в Elasticsearch/Redis. 4) PostgreSQL: REFRESH MATERIALIZED VIEW [CONCURRENTLY]. 5) ClickHouse, Druid: автоматические materialized views для аналитики. Materialized views — форма денормализации для read performance, trade-off: storage и refresh complexity.',
    explanation:
      'Materialized views — ключевой паттерн для read scaling. Netflix, LinkedIn используют CDC + stream processing для real-time materialized views. Event Sourcing naturally produces materialized views через projections.',
  },
  {
    id: 'sd-replication-047',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое leaderless replication и где она используется?',
    options: [
      'Репликация без сетевого подключения',
      'Модель без выделенного leader-а: клиент отправляет writes на несколько реплик, reads с нескольких реплик, consistency через quorum',
      'Репликация только metadata без данных',
      'Асинхронная репликация с задержкой',
    ],
    correctIndex: 1,
    explanation:
      'Leaderless replication (Dynamo-style): нет single leader. Writes отправляются на W реплик, reads с R реплик. При R + W > N гарантирован overlap — хотя бы одна replica имеет последнюю версию. Read repair: при чтении обнаруживаем stale replica, обновляем её. Anti-entropy: background процесс синхронизирует реплики. Конфликты: vector clocks для detection, LWW или application merge для resolution. Примеры: Amazon DynamoDB, Apache Cassandra, Riak. Pros: no leader failover, writes always available. Cons: eventual consistency, conflict resolution complexity.',
  },
  {
    id: 'sd-replication-048',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите архитектуру Vitess для MySQL sharding. Какие компоненты и как они взаимодействуют?',
    sampleAnswer:
      'Vitess — open-source database clustering system для MySQL (YouTube, Slack). Компоненты: 1) VTGate: query router, принимает MySQL-протокол запросы, маршрутизирует на шарды, aggregates results. Stateless, масштабируется горизонтально. 2) VTTablet: sidecar к каждому MySQL instance. Connection pooling, query rewriting, health checking, replication management. 3) Topology Service: etcd/ZooKeeper/Consul хранит metadata кластера (topology, schema). 4) VTCtld: admin UI и CLI для управления кластером. 5) VReplication: stream-based data движение для resharding, schema changes. Sharding: keyspace → shards определяются по keyspace_id (hash или range). Vschema описывает routing rules. Queries: VTGate разбирает SQL, определяет target shards, выполняет scatter-gather. VTTablet управляет MySQL replication, healthcheck определяет master/replica.',
    explanation:
      'Vitess — production-proven решение для MySQL at scale. Используется PlanetScale (DBaaS), Slack, GitHub. Решает главные проблемы MySQL sharding: connection management, query routing, online schema changes (через VReplication).',
  },
  {
    id: 'sd-replication-049',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое binlog в MySQL и как он используется для репликации?',
    options: [
      'Лог ошибок MySQL',
      'Binary log — журнал всех изменений данных, используемый для репликации (replica читает и применяет) и point-in-time recovery',
      'Индекс для бинарных данных',
      'Кэш запросов MySQL',
    ],
    correctIndex: 1,
    explanation:
      'Binary log (binlog) — журнал всех событий, изменяющих данные (INSERT, UPDATE, DELETE, DDL). Форматы: Statement-based (SQL statements), Row-based (actual row changes), Mixed. Репликация: replica подключается к master, читает binlog через replication protocol, применяет события. Binlog position или GTID (Global Transaction ID) отслеживает прогресс. Point-in-time recovery: backup + replay binlog до нужного момента. CDC tools (Debezium) читают binlog для streaming changes. ROW format предпочтителен для репликации (детерминированный).',
  },
  {
    id: 'sd-replication-050',
    block: 'sd',
    topic: 'replication',
    topicLabel: 'Репликация и шардирование',
    difficulty: 'senior',
    type: 'open',
    question: 'Как тестировать отказоустойчивость репликации? Опишите подход chaos engineering.',
    sampleAnswer:
      'Chaos engineering для репликации: систематическое тестирование failure scenarios. Эксперименты: 1) Master failure: kill master process → проверить автоматический failover, RTO, data loss (RPO). 2) Replica failure: kill replica → проверить, что система продолжает работать, replica восстанавливается. 3) Network partition: iptables/tc для имитации partition между master и replicas → проверить split-brain prevention, quorum behavior. 4) High replication lag: throttle network → проверить алерты, read-your-writes handling. 5) Disk full на replica: → проверить graceful degradation. 6) Slow replica: inject latency → проверить, что не влияет на master performance. Инструменты: Chaos Monkey, Gremlin, LitmusChaos, tc/iptables (manual). Процесс: гипотеза → controlled experiment в staging → gradual rollout to production (с ограниченным blast radius). Game days: регулярные учения с failover.',
    explanation:
      'Chaos engineering — единственный способ убедиться в реальной отказоустойчивости. Netflix pioneered с Chaos Monkey. Важно: start small, have runbooks, ability to stop experiment. Проверять не только что система переживает failure, но и observability — что alerts срабатывают, dashboards показывают проблему.',
  },
];
