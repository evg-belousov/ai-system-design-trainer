import type { Scenario } from './types';

export const newsFeedScenario: Scenario = {
  id: 'news-feed',
  title: 'News Feed (Instagram)',
  difficulty: 'senior',
  description:
    'Спроектируйте систему новостной ленты, аналогичную Instagram, для 1B+ пользователей. ' +
    'Система должна поддерживать публикацию фото, видео, stories, формирование персонализированной ленты ' +
    'и доставку контента с минимальной задержкой по всему миру.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'nf-requirements',
      title: 'Требования к системе',
      description:
        'Определите типы контента и алгоритм ранжирования ленты. ' +
        'Эти решения определяют сложность всей остальной архитектуры.',
      decisions: [
        {
          id: 'nf-content',
          category: 'Контент',
          question: 'Какой контент в ленте?',
          multiSelect: true,
          options: [
            {
              id: 'photos',
              label: 'Фотографии',
              description: 'Статичные изображения — основной формат Instagram.',
              pros: [
                'Простая обработка и хранение',
                'Быстрая загрузка и отображение',
                'Хорошо кэшируется на CDN',
              ],
              cons: [
                'Ограниченная вовлечённость по сравнению с видео',
                'Требуется обработка разных разрешений и форматов',
              ],
              bestWhen: 'Основной формат контента — статичные изображения',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'videos',
              label: 'Видео (short-form, Reels)',
              description:
                'Короткие видеоролики (15-90 сек) — ключевой драйвер вовлечённости.',
              pros: [
                'Высокая вовлечённость пользователей',
                'Основной тренд социальных сетей',
                'Возможность монетизации через рекламу',
              ],
              cons: [
                'Огромные объёмы хранилища',
                'Сложный пайплайн транскодирования',
                'Высокая стоимость CDN-трафика',
              ],
              bestWhen: 'Критична вовлечённость и конкуренция с TikTok/YouTube Shorts',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: 2, cost: -2 },
              capacityImpact: [
                { label: 'Media storage (1 year)', value: '~15 PB/year', formula: 'Video: 10M posts/day × 30% video × 365 × avg 50MB = ~15 PB/year (on top of photo storage)' },
                { label: 'CDN bandwidth (peak)', value: '~145 GB/s', formula: '58K RPS × 30% video × avg 5MB stream chunk × 0.3 concurrency ≈ 145 GB/s peak' },
                { label: 'Transcode compute', value: '~35K jobs/hr', formula: '10M × 30% = 3M videos/day ÷ 24h ÷ 3.5 min avg encode ≈ 35K concurrent transcode jobs' },
              ],
            },
            {
              id: 'text-posts',
              label: 'Текстовые посты',
              description: 'Текстовые публикации без обязательного медиа.',
              pros: [
                'Минимальная нагрузка на хранилище',
                'Простая индексация и поиск',
                'Быстрая доставка',
              ],
              cons: [
                'Низкая визуальная привлекательность',
                'Меньшая вовлечённость в визуальной соцсети',
              ],
              bestWhen: 'Платформа ориентирована на текстовый контент (Twitter/Threads)',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'stories',
              label: 'Stories (эфемерный контент 24ч)',
              description:
                'Временный контент, исчезающий через 24 часа. Отображается отдельно от основной ленты.',
              pros: [
                'Стимулирует ежедневную активность',
                'Автоматическая очистка экономит хранилище',
                'Высокая вовлечённость (FOMO-эффект)',
              ],
              cons: [
                'Отдельный пайплайн хранения и TTL-логика',
                'Сложная синхронизация состояния просмотра',
                'Требует отдельного UI-потока',
              ],
              bestWhen: 'Нужно стимулировать ежедневные возвраты пользователей',
              impact: { latency: 0, scalability: -1, consistency: -1, complexity: 1, cost: -1 },
              capacityImpact: [
                { label: 'Stories storage (ephemeral)', value: '~200 TB live', formula: '500M DAU × 5% post stories × avg 3 stories × 1MB = 75 TB/day, 24h TTL ≈ ~200 TB peak' },
                { label: 'Stories read RPS', value: '~35K RPS', formula: '500M DAU × 6 story views/day / 86400 ≈ 35K additional read RPS' },
              ],
            },
          ],
        },
        {
          id: 'nf-ranking',
          category: 'Ранжирование',
          question: 'Алгоритм ранжирования ленты?',
          options: [
            {
              id: 'chronological',
              label: 'Хронологический (reverse time)',
              description:
                'Посты отображаются в обратном хронологическом порядке. Простейшая модель.',
              pros: [
                'Простая реализация (ORDER BY created_at DESC)',
                'Предсказуемость для пользователя',
                'Нет необходимости в ML-инфраструктуре',
              ],
              cons: [
                'Пользователь пропускает важный контент',
                'Спам и низкокачественный контент не фильтруется',
                'Снижение вовлечённости при масштабе',
              ],
              bestWhen: 'Небольшая платформа или MVP без ML-команды',
              impact: { latency: 2, scalability: 1, consistency: 1, complexity: -2, cost: 2 },
            },
            {
              id: 'ml-ranking',
              label: 'ML-ранжирование (relevance)',
              description:
                'Модель машинного обучения ранжирует контент по предсказанной релевантности. ' +
                'Instagram перешёл на ML-ранжирование в 2016 году.',
              pros: [
                'Максимальная вовлечённость пользователей',
                'Персонализация под интересы',
                'Фильтрация низкокачественного контента',
              ],
              cons: [
                'Сложная ML-инфраструктура (обучение, инференс)',
                'Проблема «filter bubble» — информационных пузырей',
                'Непредсказуемость результата для авторов контента',
              ],
              bestWhen: 'Масштабная платформа с ML-командой и данными для обучения',
              impact: { latency: -1, scalability: -1, consistency: -1, complexity: 2, cost: -2 },
            },
            {
              id: 'hybrid-ranking',
              label: 'Гибрид (ML + хронологический toggle)',
              description:
                'ML-ранжирование по умолчанию с возможностью переключения на хронологическую ленту. ' +
                'Реальный подход Instagram с 2022 года.',
              pros: [
                'Баланс вовлечённости и контроля пользователя',
                'Возможность A/B-тестирования алгоритмов',
                'Снижение критики «алгоритмической ленты»',
              ],
              cons: [
                'Двойная сложность: два режима ленты',
                'Хронологический режим может снижать метрики',
                'Усложнение кэширования (разные ленты)',
              ],
              bestWhen: 'Зрелая платформа, желающая дать пользователю выбор',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: 1, cost: -1 },
            },
          ],
        },
      ],
      tip:
        'Instagram поддерживает фото, видео (Reels) и Stories. ML-ранжирование — стандарт индустрии с 2016 года, ' +
        'но после критики в 2022 Instagram добавил переключатель на хронологическую ленту.',
    },

    // ── Step 2: Feed Generation ───────────────────────────────────────
    {
      id: 'nf-generation',
      title: 'Генерация ленты',
      description:
        'Ключевое архитектурное решение: когда и как формируется лента для пользователя. ' +
        'Выбор стратегии fanout определяет всю дальнейшую архитектуру.',
      decisions: [
        {
          id: 'nf-fanout',
          category: 'Fanout-стратегия',
          question: 'Стратегия генерации ленты?',
          options: [
            {
              id: 'fanout-on-write',
              label: 'Fanout on Write (push model)',
              description:
                'При публикации поста он сразу записывается в ленты всех подписчиков автора. ' +
                'Предварительный расчёт — чтение ленты мгновенное.',
              pros: [
                'Мгновенное чтение ленты (данные уже готовы)',
                'Простая логика на стороне клиента',
                'Предсказуемая latency чтения',
              ],
              cons: [
                'Проблема «знаменитостей» (celebrity problem): пост от аккаунта с 100M подписчиков = 100M записей',
                'Высокая нагрузка на запись и хранилище',
                'Задержка публикации для авторов с большим числом подписчиков',
              ],
              bestWhen: 'Все пользователи имеют примерно одинаковое число подписчиков',
              impact: { latency: 2, scalability: -2, consistency: 1, complexity: 0, cost: -2 },
              capacityImpact: [
                { label: 'Fanout writes', value: '~2B/day', formula: '10M posts × avg 200 followers = 2B feed inserts/day' },
                { label: 'Feed write RPS', value: '~23K', formula: '2B / 86400 ≈ 23K writes/sec to feed cache' },
                { label: 'Feed cache (Redis)', value: '~4 TB', formula: '500M users × 500 post IDs × 8 bytes × 2 (sorted set overhead) ≈ 4 TB RAM' },
              ],
            },
            {
              id: 'fanout-on-read',
              label: 'Fanout on Read (pull model)',
              description:
                'Лента формируется в момент запроса: система собирает последние посты от всех подписок пользователя.',
              pros: [
                'Нет проблемы знаменитостей',
                'Экономия на хранилище (нет дублирования)',
                'Мгновенная публикация',
              ],
              cons: [
                'Медленное чтение ленты (агрегация в реальном времени)',
                'Высокая нагрузка на БД при каждом запросе',
                'Сложно применить ML-ранжирование в реальном времени',
              ],
              bestWhen: 'Платформа с небольшим числом пользователей или без знаменитостей',
              impact: { latency: -2, scalability: 1, consistency: 1, complexity: 0, cost: 1 },
              capacityImpact: [
                { label: 'Fanout writes', value: '0', formula: 'No pre-computation — feed assembled at read time' },
                { label: 'Feed read compute', value: '~58K queries/sec', formula: 'Each feed open queries N followed users, merges + ranks' },
                { label: 'Feed cache (Redis)', value: '~0', formula: 'No pre-computed feed cache needed — saves RAM cost' },
              ],
            },
            {
              id: 'hybrid-fanout',
              label: 'Гибридный (push для обычных, pull для знаменитостей)',
              description:
                'Push-модель для пользователей с <N подписчиков, pull для знаменитостей. ' +
                'Реальный подход Facebook/Instagram. Решает «Justin Bieber problem».',
              pros: [
                'Решает проблему знаменитостей',
                'Быстрое чтение для большинства пользователей',
                'Масштабируется до миллиардов пользователей',
              ],
              cons: [
                'Сложная логика: два пути генерации ленты',
                'Определение порога «знаменитости» требует тюнинга',
                'Merge на чтении для объединения push и pull частей',
              ],
              bestWhen: 'Крупная платформа с неравномерным распределением подписчиков (Instagram, Facebook)',
              impact: { latency: 1, scalability: 2, consistency: 0, complexity: 1, cost: -1 },
              capacityImpact: [
                { label: 'Fanout writes', value: '~1.6B/day', formula: '~80% users have <10K followers → push path: 8M posts × 200 avg followers = 1.6B inserts/day' },
                { label: 'Feed write RPS', value: '~18.5K', formula: '1.6B / 86400 ≈ 18.5K writes/sec (20% less than pure push)' },
                { label: 'Feed read compute', value: '~5.8K queries/sec', formula: '~10% of feed reads need pull merge for celebrity posts: 58K × 10% ≈ 5.8K extra queries/sec' },
              ],
            },
          ],
        },
        {
          id: 'nf-feed-storage',
          category: 'Хранение ленты',
          question: 'Где хранить предрассчитанную ленту?',
          options: [
            {
              id: 'redis-sorted-sets',
              label: 'Redis (Sorted Sets)',
              description:
                'Sorted Set для каждого пользователя: score = timestamp, member = post_id. ' +
                'Стандартный подход Facebook для feed timeline.',
              pros: [
                'Сверхбыстрое чтение (O(log N) + O(K) для диапазона)',
                'Встроенная сортировка по timestamp',
                'Атомарные операции добавления/удаления',
              ],
              cons: [
                'Хранение в RAM — дорого при масштабе',
                'Потеря данных при падении без persistence',
                'Ограничение по размеру одного экземпляра',
              ],
              bestWhen: 'Нужна минимальная latency чтения ленты и бюджет позволяет in-memory хранение',
              impact: { latency: 2, scalability: 0, consistency: -1, complexity: 0, cost: -2 },
              capacityImpact: [
                { label: 'Feed cache (Redis)', value: '~4 TB RAM', formula: '500M users × 500 post IDs × 8 bytes = 2 TB data + sorted set overhead ≈ 4 TB' },
                { label: 'Redis cluster nodes', value: '~130 nodes', formula: '4 TB / 32 GB per node ≈ 125 nodes + replicas' },
                { label: 'Redis cost estimate', value: '~$200K/mo', formula: '130 nodes × r6g.xlarge ($0.25/hr) × 730 hrs/mo ≈ $24K + replication ≈ $200K/mo for HA cluster' },
              ],
            },
            {
              id: 'cassandra-feed',
              label: 'Cassandra',
              description:
                'Wide-column хранилище с partition key = user_id, clustering key = timestamp.',
              pros: [
                'Линейное горизонтальное масштабирование',
                'Высокая доступность (multi-datacenter)',
                'Экономичнее RAM-хранения',
              ],
              cons: [
                'Более высокая latency, чем Redis (диск vs RAM)',
                'Сложная эксплуатация (compaction, repair)',
                'Eventual consistency по умолчанию',
              ],
              bestWhen: 'Огромные объёмы данных ленты, где Redis слишком дорог',
              impact: { latency: 0, scalability: 2, consistency: -1, complexity: 1, cost: 0 },
              capacityImpact: [
                { label: 'Feed cache (Redis)', value: '~6 TB on disk', formula: '2 TB data × RF=3 = 6 TB with Cassandra replication' },
                { label: 'Cassandra nodes', value: '~30 nodes', formula: '6 TB / 200 GB per node ≈ 30 nodes (i3.xlarge with local SSD)' },
                { label: 'Feed read latency', value: '~5-10 ms', formula: 'SSD read vs Redis sub-ms — 10× slower but 5× cheaper per GB' },
              ],
            },
            {
              id: 'dynamodb-feed',
              label: 'DynamoDB',
              description:
                'Managed NoSQL от AWS с partition key = user_id и sort key = timestamp.',
              pros: [
                'Fully managed — минимум эксплуатации',
                'Автоматическое масштабирование',
                'DAX (in-memory cache) для ускорения',
              ],
              cons: [
                'Vendor lock-in (AWS)',
                'Стоимость растёт непредсказуемо при масштабе',
                'Ограничения на размер item (400KB)',
              ],
              bestWhen: 'Инфраструктура на AWS и приоритет — минимум эксплуатации',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: -1 },
              capacityImpact: [
                { label: 'DynamoDB RCU', value: '~58K RCU', formula: '58K feed reads/sec × 1 RCU per 4KB eventually consistent read' },
                { label: 'DynamoDB cost', value: '~$150K/mo', formula: '58K RCU on-demand ($0.25/M reads) + 23K WCU ($1.25/M writes) + 2 TB storage ($0.25/GB)' },
              ],
            },
          ],
        },
      ],
      tip:
        'Гибридный fanout — стандарт индустрии для платформ масштаба Instagram. ' +
        'Порог «знаменитости» обычно определяется динамически (например, >10K подписчиков). ' +
        'Redis sorted sets — де-факто стандарт для хранения предрассчитанной ленты.',
    },

    // ── Step 3: Data Model & Storage ──────────────────────────────────
    {
      id: 'nf-storage',
      title: 'Модель данных и хранилище',
      description:
        'Определите, где хранить посты, метаданные и медиафайлы. ' +
        'Разделение «горячих» метаданных и «тяжёлых» медиа — ключевой паттерн.',
      decisions: [
        {
          id: 'nf-post-db',
          category: 'База данных постов',
          question: 'Где хранить посты/метаданные?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL',
              description:
                'Мощная реляционная СУБД с поддержкой JSON, полнотекстового поиска и расширений.',
              pros: [
                'Богатый набор типов данных и индексов',
                'ACID-транзакции для целостности данных',
                'Сильная экосистема расширений (PostGIS, pg_partman)',
              ],
              cons: [
                'Сложнее шардировать нативно, чем MySQL',
                'Вертикальное масштабирование имеет предел',
                'Репликация менее зрелая, чем у MySQL',
              ],
              bestWhen: 'Нужны сложные запросы и типы данных, масштаб до миллионов пользователей',
              impact: { latency: 0, scalability: -1, consistency: 2, complexity: 0, cost: 0 },
            },
            {
              id: 'mysql-sharded',
              label: 'MySQL (шардированный)',
              description:
                'MySQL с шардированием — исторический выбор Facebook. ' +
                'Facebook разработал TAO — кэш-слой поверх шардированного MySQL.',
              pros: [
                'Проверено на масштабе Facebook (миллиарды пользователей)',
                'Зрелая экосистема шардирования (Vitess, ProxySQL)',
                'Простая и предсказуемая модель данных',
              ],
              cons: [
                'Cross-shard запросы дорогие',
                'Кэш-слой (TAO) обязателен при масштабе',
                'Ограниченные типы данных по сравнению с PostgreSQL',
              ],
              bestWhen: 'Масштаб миллиардов пользователей, готовность инвестировать в инфраструктуру шардирования',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'cassandra-posts',
              label: 'Cassandra',
              description:
                'Распределённое NoSQL-хранилище для write-heavy нагрузок.',
              pros: [
                'Линейное масштабирование записи',
                'Высокая доступность без single point of failure',
                'Оптимальна для append-only данных (посты)',
              ],
              cons: [
                'Ограниченная модель запросов (нужно знать partition key)',
                'Eventual consistency усложняет бизнес-логику',
                'Нет вторичных индексов в привычном смысле',
              ],
              bestWhen: 'Write-heavy нагрузка и простая модель доступа по ключу',
              impact: { latency: 0, scalability: 2, consistency: -2, complexity: 1, cost: 0 },
            },
            {
              id: 'dynamodb-posts',
              label: 'DynamoDB',
              description:
                'Managed NoSQL с предсказуемой производительностью.',
              pros: [
                'Fully managed — нулевая эксплуатация',
                'Предсказуемая latency на любом масштабе',
                'Встроенные бэкапы и point-in-time recovery',
              ],
              cons: [
                'Vendor lock-in (AWS)',
                'Сложная и дорогая модель ценообразования',
                'Ограничения на размер item и запросы',
              ],
              bestWhen: 'Команда на AWS без желания управлять БД',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: -1 },
            },
          ],
        },
        {
          id: 'nf-media',
          category: 'Медиа-хранилище',
          question: 'Хранение и доставка медиа?',
          options: [
            {
              id: 's3-cdn',
              label: 'S3 + CloudFront CDN',
              description:
                'Object storage (S3) для хранения + CDN для глобальной доставки. Стандартный паттерн индустрии.',
              pros: [
                'Практически безлимитное хранилище',
                'Глобальная доставка через CDN с низкой latency',
                'Высокая durability (11 девяток)',
              ],
              cons: [
                'Стоимость egress-трафика при масштабе',
                'Зависимость от одного облачного провайдера',
                'Инвалидация CDN-кэша не мгновенная',
              ],
              bestWhen: 'Стандартный выбор для большинства проектов',
              impact: { latency: 1, scalability: 2, consistency: 0, complexity: -1, cost: -1 },
              capacityImpact: [
                { label: 'S3 storage cost', value: '~$170K/mo', formula: '7.3 PB × $0.023/GB = ~$170K/mo for S3 Standard' },
                { label: 'CDN egress cost', value: '~$2.2M/mo', formula: '29 GB/s × 86400 × 30 × $0.085/GB ≈ $2.2M/mo CloudFront egress' },
                { label: 'CDN bandwidth (peak)', value: '~29 GB/s', formula: '58K RPS × avg 500 KB media payload = ~29 GB/s peak' },
              ],
            },
            {
              id: 'custom-blob-cdn',
              label: 'Custom blob storage + CDN',
              description:
                'Собственное хранилище больших объектов (как Haystack от Facebook) + собственный CDN.',
              pros: [
                'Полный контроль над стоимостью и производительностью',
                'Оптимизация под конкретные паттерны доступа',
                'Нет vendor lock-in',
              ],
              cons: [
                'Огромные затраты на разработку и эксплуатацию',
                'Требуется команда инфраструктуры',
                'Риск потери данных при ошибках в реализации',
              ],
              bestWhen: 'Масштаб Facebook/Google, где стоимость облака неприемлема',
              impact: { latency: 1, scalability: 2, consistency: 0, complexity: 2, cost: 1 },
            },
            {
              id: 'multi-tier-storage',
              label: 'Multi-tier storage (hot/warm/cold)',
              description:
                'Горячие данные на SSD/CDN, тёплые — на стандартном S3, холодные — на Glacier/архивном хранилище.',
              pros: [
                'Оптимизация стоимости хранения',
                'Горячий контент обслуживается быстро',
                'Автоматическая миграция по lifecycle-правилам',
              ],
              cons: [
                'Сложная логика tier-миграции',
                'Задержка при доступе к холодным данным',
                'Необходимость мониторинга паттернов доступа',
              ],
              bestWhen: 'Огромный архив контента с неравномерным паттерном доступа',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 1, cost: 1 },
              capacityImpact: [
                { label: 'S3 storage cost', value: '~$65K/mo', formula: 'Hot 10%: 730 TB × $0.023 = $17K; Warm 30%: 2.2 PB × $0.0125 = $28K; Cold 60%: 4.4 PB × $0.004 = $18K ≈ $65K/mo' },
                { label: 'Storage savings vs S3', value: '~60%', formula: '$65K vs $170K for flat S3 Standard = ~60% savings on storage costs' },
              ],
            },
          ],
        },
      ],
      tip:
        'Facebook исторически использует шардированный MySQL + TAO (кэш-слой для социального графа). ' +
        'Для медиа Facebook разработал Haystack (custom blob storage), но S3 + CDN — разумный выбор для большинства.',
    },

    // ── Step 4: Architecture ──────────────────────────────────────────
    {
      id: 'nf-architecture',
      title: 'Архитектура сервисов',
      description:
        'Выберите архитектурный стиль и способ обработки асинхронных задач. ' +
        'Правильная декомпозиция сервисов — залог независимого масштабирования.',
      decisions: [
        {
          id: 'nf-services',
          category: 'Архитектура',
          question: 'Архитектура сервисов?',
          options: [
            {
              id: 'monolith',
              label: 'Монолит',
              description:
                'Единое приложение со всей бизнес-логикой. Instagram начинал как Django-монолит.',
              pros: [
                'Быстрый старт разработки',
                'Простой деплой и отладка',
                'Нет сетевых вызовов между компонентами',
              ],
              cons: [
                'Невозможно масштабировать компоненты независимо',
                'Единая точка отказа',
                'Сложность растёт экспоненциально с размером команды',
              ],
              bestWhen: 'Стартап / MVP с командой до 10 разработчиков',
              impact: { latency: 1, scalability: -2, consistency: 1, complexity: -2, cost: 1 },
            },
            {
              id: 'microservices',
              label: 'Микросервисы (Post, Feed, User, Media)',
              description:
                'Декомпозиция на независимые сервисы: Post Service, Feed Service, User Service, Media Service. ' +
                'Каждый масштабируется и деплоится независимо.',
              pros: [
                'Независимое масштабирование сервисов',
                'Изоляция отказов (отказ Media не влияет на Feed)',
                'Параллельная разработка командами',
              ],
              cons: [
                'Сложность распределённых систем (сеть, согласованность)',
                'Overhead на межсервисные вызовы',
                'Сложный мониторинг и отладка',
              ],
              bestWhen: 'Крупная команда (50+ разработчиков), разные паттерны нагрузки у компонентов',
              impact: { latency: -1, scalability: 2, consistency: -1, complexity: 1, cost: -1 },
            },
            {
              id: 'service-mesh',
              label: 'Service Mesh + микросервисы',
              description:
                'Микросервисы с service mesh (Istio, Envoy) для управления трафиком, безопасностью и наблюдаемостью.',
              pros: [
                'Централизованное управление трафиком (retries, circuit breakers)',
                'mTLS между сервисами «из коробки»',
                'Расширенная наблюдаемость (distributed tracing)',
              ],
              cons: [
                'Значительный overhead на инфраструктуру',
                'Дополнительная latency от sidecar-прокси',
                'Крутая кривая обучения',
              ],
              bestWhen: 'Зрелая платформа с сотнями микросервисов и выделенной platform-командой',
              impact: { latency: -1, scalability: 2, consistency: 0, complexity: 2, cost: -2 },
            },
          ],
        },
        {
          id: 'nf-async',
          category: 'Асинхронная обработка',
          question: 'Обработка асинхронных задач?',
          options: [
            {
              id: 'celery-sidekiq',
              label: 'Celery / Sidekiq (task queue)',
              description:
                'Очереди задач с воркерами. Instagram изначально использовал Celery + RabbitMQ.',
              pros: [
                'Простая модель «задача → воркер»',
                'Retry/backoff из коробки',
                'Зрелые библиотеки для Python/Ruby',
              ],
              cons: [
                'Ограниченная пропускная способность при масштабе',
                'Нет гарантии порядка обработки',
                'Сложно масштабировать очередь задач горизонтально',
              ],
              bestWhen: 'Средний масштаб, Python/Ruby стек, до миллионов задач в день',
              impact: { latency: 0, scalability: -1, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'kafka',
              label: 'Kafka (event streaming)',
              description:
                'Распределённая платформа потоковой обработки событий. ' +
                'Instagram мигрировал с Celery на Kafka для масштабирования.',
              pros: [
                'Огромная пропускная способность (миллионы msg/sec)',
                'Гарантия порядка внутри partition',
                'Возможность повторного чтения (replay) событий',
              ],
              cons: [
                'Сложная эксплуатация (partition rebalancing, consumer groups)',
                'Latency выше, чем у прямых вызовов',
                'Eventual consistency — нужно учитывать при проектировании',
              ],
              bestWhen: 'Масштаб миллиардов событий, event-driven архитектура',
              impact: { latency: 0, scalability: 2, consistency: -1, complexity: 1, cost: -1 },
            },
            {
              id: 'sqs-lambda',
              label: 'SQS + Lambda (serverless)',
              description:
                'Managed очередь + serverless-обработка. Автомасштабирование без управления серверами.',
              pros: [
                'Нулевая эксплуатация инфраструктуры',
                'Автоматическое масштабирование от нуля',
                'Оплата по факту использования',
              ],
              cons: [
                'Cold start добавляет latency',
                'Vendor lock-in (AWS)',
                'Ограничения Lambda (timeout 15min, memory)',
              ],
              bestWhen: 'Команда на AWS, спорадическая нагрузка, приоритет — минимум ops',
              impact: { latency: -1, scalability: 1, consistency: 0, complexity: -1, cost: 0 },
            },
          ],
        },
      ],
      tip:
        'Instagram начинал как Django-монолит, затем перешёл на микросервисы. ' +
        'Для асинхронных задач (fanout, транскодирование, уведомления) Kafka — стандарт при масштабе Instagram.',
    },

    // ── Step 5: Scaling & Performance ─────────────────────────────────
    {
      id: 'nf-scaling',
      title: 'Масштабирование и производительность',
      description:
        'Определите стратегию кэширования и масштабирования базы данных. ' +
        'При 1B+ пользователей многоуровневое кэширование — не оптимизация, а необходимость.',
      decisions: [
        {
          id: 'nf-cache',
          category: 'Кэширование',
          question: 'Стратегия кэширования?',
          multiSelect: true,
          options: [
            {
              id: 'cdn-cache',
              label: 'CDN edge cache (медиа)',
              description:
                'Кэширование изображений и видео на edge-серверах CDN ближе к пользователю.',
              pros: [
                'Минимальная latency для медиа (ближайший PoP)',
                'Снижение нагрузки на origin-сервер',
                'Глобальная доступность',
              ],
              cons: [
                'Стоимость CDN-трафика при масштабе',
                'Сложная инвалидация при обновлении медиа',
                'Cache miss на непопулярном контенте',
              ],
              bestWhen: 'Любая платформа с медиа-контентом — обязательный слой',
              impact: { latency: 2, scalability: 2, consistency: -1, complexity: 0, cost: -1 },
            },
            {
              id: 'app-cache',
              label: 'Application cache (Redis/Memcached)',
              description:
                'Кэширование профилей пользователей, метаданных постов, социального графа.',
              pros: [
                'Снижение нагрузки на БД в 10-100x',
                'Микросекундная latency на кэш-хиты',
                'Гибкие стратегии инвалидации',
              ],
              cons: [
                'Дополнительная инфраструктура для управления',
                'Проблема cache stampede при массовой инвалидации',
                'Стоимость RAM при масштабе',
              ],
              bestWhen: 'Любая платформа масштаба — обязательный слой',
              impact: { latency: 2, scalability: 1, consistency: -1, complexity: 0, cost: -1 },
            },
            {
              id: 'feed-cache',
              label: 'Feed cache (предрассчитанные ленты)',
              description:
                'Кэширование готовых лент пользователей (результат fanout on write).',
              pros: [
                'Мгновенное отображение ленты',
                'Предсказуемая latency независимо от числа подписок',
                'Разгрузка feed-generation сервиса',
              ],
              cons: [
                'Огромный объём данных (лента на каждого пользователя)',
                'Сложная синхронизация при удалении/редактировании постов',
                'Дорогое хранение в RAM',
              ],
              bestWhen: 'Используется fanout on write или гибридная стратегия',
              impact: { latency: 2, scalability: 0, consistency: -1, complexity: 1, cost: -2 },
            },
            {
              id: 'db-query-cache',
              label: 'Database query cache',
              description:
                'Кэширование результатов частых SQL-запросов на уровне БД или ORM.',
              pros: [
                'Прозрачен для приложения',
                'Снижение нагрузки на БД',
                'Простая реализация',
              ],
              cons: [
                'Низкий hit rate для персонализированных запросов',
                'Инвалидация при обновлении данных',
                'Не заменяет application cache при масштабе',
              ],
              bestWhen: 'Дополнительная оптимизация поверх основных слоёв кэширования',
              impact: { latency: 1, scalability: 0, consistency: -1, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'nf-db-scaling',
          category: 'Масштабирование БД',
          question: 'Масштабирование БД?',
          options: [
            {
              id: 'read-replicas',
              label: 'Read replicas',
              description:
                'Мастер для записи, реплики для чтения. Простейший способ масштабировать read-heavy нагрузку.',
              pros: [
                'Простая настройка и эксплуатация',
                'Линейное масштабирование чтения',
                'Реплики как hot standby для failover',
              ],
              cons: [
                'Не решает проблему масштабирования записи',
                'Replication lag — устаревшие данные на чтении',
                'Предел числа реплик (обычно 5-15)',
              ],
              bestWhen: 'Read-heavy нагрузка с умеренным объёмом записей',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: -1, cost: -1 },
              capacityImpact: [
                { label: 'Read capacity', value: '×4-8', formula: '4-8 read replicas, each handles ~10K RPS → total ~40-80K read RPS' },
                { label: 'Replication lag', value: '~100-500 ms', formula: 'Async replication lag depends on write load; at ~10K writes/sec expect 100-500 ms' },
              ],
            },
            {
              id: 'sharding-by-user',
              label: 'Шардирование по user ID',
              description:
                'Данные пользователя хранятся на одном шарде, определяемом хэшем user_id.',
              pros: [
                'Масштабирование и чтения, и записи',
                'Данные пользователя локальны (один шард)',
                'Предсказуемая latency',
              ],
              cons: [
                'Cross-shard запросы (лента из постов разных шардов)',
                'Ребалансировка шардов при добавлении узлов',
                'Hot shards при неравномерном распределении',
              ],
              bestWhen: 'Масштаб сотен миллионов пользователей, нужно масштабировать запись',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: 1, cost: 0 },
              capacityImpact: [
                { label: 'Number of shards', value: '~64-256', formula: '1B users × 5KB avg row × 10 rows avg = 50 TB data ÷ 200-800 GB per shard ≈ 64-256 shards' },
                { label: 'Write RPS per shard', value: '~40-160', formula: '~10K total write RPS ÷ 64-256 shards ≈ 40-160 writes/sec per shard' },
              ],
            },
            {
              id: 'vitess',
              label: 'Vitess (MySQL sharding layer)',
              description:
                'Слой горизонтального шардирования для MySQL. Разработан YouTube, используется в Slack, GitHub.',
              pros: [
                'Прозрачное шардирование для приложения',
                'Автоматическая ребалансировка',
                'Проверено на масштабе YouTube',
              ],
              cons: [
                'Сложная инфраструктура (VTGate, VTTablet, topology)',
                'Ограничения на типы SQL-запросов',
                'Небольшое сообщество по сравнению с нативными решениями',
              ],
              bestWhen: 'MySQL-стек, нужен managed sharding без полной переписки приложения',
              impact: { latency: 0, scalability: 2, consistency: 0, complexity: 1, cost: 0 },
            },
            {
              id: 'sharding-replicas',
              label: 'Шардирование + read replicas',
              description:
                'Комбинация шардирования для масштабирования записи и реплик для масштабирования чтения. ' +
                'Реальный подход Facebook (шардированный MySQL + реплики на каждый шард).',
              pros: [
                'Масштабирование и чтения, и записи',
                'Реплики для failover каждого шарда',
                'Проверено на масштабе Facebook',
              ],
              cons: [
                'Максимальная сложность эксплуатации',
                'Большое количество серверов БД',
                'Сложная топология для мониторинга',
              ],
              bestWhen: 'Масштаб миллиардов пользователей (Facebook, Instagram)',
              impact: { latency: 1, scalability: 2, consistency: 0, complexity: 2, cost: -2 },
              capacityImpact: [
                { label: 'Total DB nodes', value: '~384-768', formula: '128 shards × 3-6 replicas per shard = 384-768 DB instances' },
                { label: 'Read capacity', value: '~500K+ RPS', formula: '128 shards × 4 replicas × 1K RPS each ≈ 512K total read RPS' },
                { label: 'Write capacity', value: '~128K RPS', formula: '128 shards × ~1K write RPS each = 128K total write RPS' },
              ],
            },
          ],
        },
      ],
      tip:
        'При масштабе Instagram многоуровневое кэширование обязательно: CDN для медиа, Redis/Memcached для метаданных, ' +
        'предрассчитанные ленты в Redis. Facebook использует шардированный MySQL с репликами и TAO как кэш-слой.',
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'nf-reliability',
      title: 'Надёжность и отказоустойчивость',
      description:
        'Определите модель консистентности и стратегию деградации. ' +
        'При масштабе 1B+ пользователей отказы неизбежны — вопрос в том, как система их переживает.',
      decisions: [
        {
          id: 'nf-consistency',
          category: 'Консистентность',
          question: 'Модель консистентности ленты?',
          options: [
            {
              id: 'strong-consistency',
              label: 'Strong consistency',
              description:
                'Все пользователи видят одинаковое состояние ленты в любой момент.',
              pros: [
                'Предсказуемое поведение — пост виден сразу всем',
                'Нет проблемы «призрачных» постов',
                'Простая ментальная модель для разработки',
              ],
              cons: [
                'Значительно снижает доступность (CAP-теорема)',
                'Высокая latency из-за синхронной репликации',
                'Не масштабируется до миллиардов пользователей',
              ],
              bestWhen: 'Критичная целостность данных (финансы), не соцсеть',
              impact: { latency: -2, scalability: -2, consistency: 2, complexity: 1, cost: -1 },
            },
            {
              id: 'eventual-consistency',
              label: 'Eventual consistency',
              description:
                'Данные распространяются асинхронно — все реплики сойдутся «в конечном счёте».',
              pros: [
                'Максимальная доступность и скорость',
                'Простая реализация с асинхронной репликацией',
                'Хорошо масштабируется',
              ],
              cons: [
                'Пользователь может не видеть свой же пост сразу',
                'Возможны конфликты при одновременных обновлениях',
                'Сложная отладка аномалий',
              ],
              bestWhen: 'Некритичные данные, где задержка допустима (лайки, счётчики)',
              impact: { latency: 2, scalability: 2, consistency: -2, complexity: -1, cost: 1 },
            },
            {
              id: 'read-your-writes',
              label: 'Read-your-writes consistency',
              description:
                'Пользователь всегда видит свои собственные действия (посты, лайки), ' +
                'а остальные подписчики получают обновления с небольшой задержкой. ' +
                'Стандарт для социальных сетей.',
              pros: [
                'Пользователь видит свой пост мгновенно',
                'Подписчики видят пост с допустимой задержкой (секунды)',
                'Баланс между UX и масштабированием',
              ],
              cons: [
                'Необходимо маршрутизировать чтения на мастер для «своих» данных',
                'Sticky sessions или версионирование для корректной работы',
                'Сложнее, чем чистая eventual consistency',
              ],
              bestWhen: 'Социальные сети, блоги, любые UGC-платформы',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
          ],
        },
        {
          id: 'nf-degradation',
          category: 'Деградация',
          question: 'Стратегия деградации при нагрузке?',
          options: [
            {
              id: 'show-cached-feed',
              label: 'Показывать кэшированную/устаревшую ленту',
              description:
                'При перегрузке отдавать последнюю кэшированную версию ленты, даже если она не актуальна.',
              pros: [
                'Пользователь видит контент (лучше устаревший, чем ошибку)',
                'Минимальная нагрузка на backend',
                'Мгновенное переключение без дополнительной логики',
              ],
              cons: [
                'Пользователь может видеть уже удалённый контент',
                'Пропуск свежих постов',
                'Нужен механизм определения «свежести» кэша',
              ],
              bestWhen: 'Первая линия обороны — всегда показать хоть что-то',
              impact: { latency: 2, scalability: 2, consistency: -2, complexity: -1, cost: 1 },
            },
            {
              id: 'reduce-ranking',
              label: 'Упростить ранжирование (chrono fallback)',
              description:
                'Переключение с тяжёлого ML-ранжирования на простую хронологическую сортировку.',
              pros: [
                'Значительное снижение нагрузки на ML-inference',
                'Лента остаётся актуальной',
                'Пользователь может не заметить изменение',
              ],
              cons: [
                'Снижение релевантности ленты',
                'Падение метрик вовлечённости',
                'Нужна реализация двух pipeline ранжирования',
              ],
              bestWhen: 'ML-ранжирование — основной потребитель ресурсов',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: 0, cost: 1 },
            },
            {
              id: 'limit-feed-depth',
              label: 'Ограничить глубину ленты (top-N)',
              description:
                'Показывать только N последних/лучших постов вместо полной ленты.',
              pros: [
                'Предсказуемая нагрузка на обслуживание запроса',
                'Снижение объёма данных в ответе',
                'Пользователь обычно не скроллит дальше 50-100 постов',
              ],
              cons: [
                'Пользователь не может дойти до старого контента',
                'Проблема для power users, привыкших к глубокому скроллу',
                'Нужно уведомлять пользователя об ограничении',
              ],
              bestWhen: 'Нужно ограничить нагрузку при сохранении актуальности',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'circuit-breaker',
              label: 'Circuit breaker на некритичных фичах',
              description:
                'Отключение некритичных функций (рекомендации, аналитика, stories) для защиты core feed.',
              pros: [
                'Защита основной функциональности (лента)',
                'Высвобождение ресурсов для critical path',
                'Автоматическое восстановление при нормализации нагрузки',
              ],
              cons: [
                'Необходимость приоритизации всех фич (что отключать первым)',
                'Потеря части функциональности для пользователя',
                'Сложная конфигурация порогов срабатывания',
              ],
              bestWhen: 'Система имеет чёткое разделение на критичные и некритичные компоненты',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: 1, cost: 0 },
            },
          ],
        },
      ],
      tip:
        'Read-your-writes consistency — стандарт для соцсетей: пользователь видит свой пост мгновенно, ' +
        'подписчики — через несколько секунд. Для деградации используйте комбинацию подходов: ' +
        'кэшированная лента → упрощённое ранжирование → circuit breaker.',
    },
  ],

  // ── Reference Solution ────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'nf-content': ['photos', 'videos', 'stories'],
      'nf-ranking': ['hybrid-ranking'],
      'nf-fanout': ['hybrid-fanout'],
      'nf-feed-storage': ['redis-sorted-sets'],
      'nf-post-db': ['mysql-sharded'],
      'nf-media': ['s3-cdn'],
      'nf-services': ['microservices'],
      'nf-async': ['kafka'],
      'nf-cache': ['cdn-cache', 'app-cache', 'feed-cache'],
      'nf-db-scaling': ['sharding-replicas'],
      'nf-consistency': ['read-your-writes'],
      'nf-degradation': ['show-cached-feed'],
    },
    explanation:
      'Гибридный fanout — ключевое решение для Instagram-масштаба. Обычные пользователи (<10K подписчиков) ' +
      'используют push-модель: при публикации пост записывается в Redis sorted sets всех подписчиков. ' +
      'Для знаменитостей (>10K подписчиков) используется pull-модель: их посты подтягиваются при чтении ленты ' +
      'и мёржатся с предрассчитанной частью. Это решает «Justin Bieber problem» — пост от аккаунта с 500M ' +
      'подписчиков не генерирует 500M записей.\n\n' +
      'Шардированный MySQL с read-репликами (как у Facebook) обеспечивает масштабирование метаданных. ' +
      'TAO-подобный кэш-слой снижает нагрузку на БД. Медиа хранится в S3 и раздаётся через CDN.\n\n' +
      'Kafka обеспечивает асинхронную обработку: fanout, транскодирование видео, отправку уведомлений. ' +
      'Многоуровневое кэширование (CDN → Redis/Memcached → Feed cache) обязательно при 1B+ пользователей.\n\n' +
      'Read-your-writes consistency гарантирует, что автор видит свой пост мгновенно, ' +
      'а подписчики получают его с допустимой задержкой в несколько секунд.',
    diagram:
      '┌─────────┐     ┌─────────────┐     ┌──────┐     ┌──────────────┐\n' +
      '│  Client │────▶│ CDN (media) │     │  LB  │────▶│ Feed Service │\n' +
      '└─────────┘     └─────────────┘     └──────┘     └──────┬───────┘\n' +
      '                                                        │\n' +
      '                                       ┌────────────────┼────────────────┐\n' +
      '                                       ▼                ▼                ▼\n' +
      '                                ┌─────────────┐  ┌─────────────┐  ┌───────────┐\n' +
      '                                │ Feed Cache  │  │Post Service │  │User Service│\n' +
      '                                │   (Redis)   │  └──────┬──────┘  └───────────┘\n' +
      '                                └─────────────┘         │\n' +
      '                                                        ▼\n' +
      '                                                 ┌─────────────┐\n' +
      '                                                 │  Post DB    │\n' +
      '                                                 │(MySQL shards│\n' +
      '                                                 │+ replicas)  │\n' +
      '                                                 └─────────────┘\n' +
      '\n' +
      '── Publish Flow ──────────────────────────────────────────────\n' +
      '\n' +
      '┌───────────┐     ┌──────────────┐     ┌───────┐     ┌──────────────────┐\n' +
      '│ Publisher │────▶│ Post Service │────▶│ Kafka │────▶│ Fanout Service   │\n' +
      '└───────────┘     └──────┬───────┘     └───────┘     └────────┬─────────┘\n' +
      '                         │                                    │\n' +
      '                         ▼                          ┌─────────┴─────────┐\n' +
      '                  ┌─────────────┐                   ▼                   ▼\n' +
      '                  │Media Service│          ┌──────────────┐   ┌─────────────────┐\n' +
      '                  └──────┬──────┘          │ Feed Cache   │   │ Skip for celebs │\n' +
      '                         │                 │(Redis sorted │   │ (pull on read)  │\n' +
      '                         ▼                 │   sets)      │   └─────────────────┘\n' +
      '                  ┌─────────────┐          └──────────────┘\n' +
      '                  │  S3 → CDN   │\n' +
      '                  └─────────────┘',
  },

  capacityEstimates: {
    default: [
      {
        label: 'DAU',
        value: '500M',
        formula: '1B registered users × ~50% daily active = 500M DAU',
      },
      {
        label: 'Feed reads/sec',
        value: '~58K RPS',
        formula: '500M DAU × 10 feed opens/day / 86 400 sec ≈ 57 870 ≈ ~58K RPS',
      },
      {
        label: 'Posts per day',
        value: '10M posts/day',
        formula: '500M DAU × 2% post daily = 10M new posts/day',
      },
      {
        label: 'Fanout writes',
        value: '2B feed inserts/day',
        formula: '10M posts/day × avg 200 followers = 2B feed inserts/day',
      },
      {
        label: 'Media storage (1 year)',
        value: '~7.3 PB/year',
        formula: '10M posts/day × 365 days × avg 2 MB (compressed photo) = 7.3 PB/year',
      },
      {
        label: 'Feed cache (Redis)',
        value: '~2 TB',
        formula: '500M users × 500 post IDs × 8 bytes per ID = 2 TB',
      },
      {
        label: 'CDN bandwidth (peak)',
        value: '~29 GB/s',
        formula: '58K RPS × avg 500 KB media payload = ~29 GB/s peak',
      },
    ],
  },
};
