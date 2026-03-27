import type { Scenario } from './types';

export const videoStreamingScenario: Scenario = {
  id: 'video-streaming',
  title: 'Video Streaming (YouTube)',
  difficulty: 'senior',
  description:
    'Спроектируйте платформу видеостриминга масштаба YouTube: 2B+ активных пользователей, 500+ часов видео загружается каждую минуту, миллионы одновременных просмотров. Система должна обеспечивать загрузку, транскодирование, хранение, доставку и рекомендации видео-контента с минимальным временем буферизации по всему миру.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'vs-requirements',
      title: 'Требования к платформе',
      description:
        'Определите тип контента и требования к качеству воспроизведения. Эти решения фундаментально влияют на архитектуру транскодирования, хранения и доставки.',
      tip: 'YouTube поддерживает VOD, прямые трансляции и Shorts — каждый тип требует отдельных оптимизаций в pipeline обработки.',
      decisions: [
        {
          id: 'vs-type',
          category: 'Контент',
          question: 'Тип видео-контента?',
          multiSelect: true,
          options: [
            {
              id: 'vod',
              label: 'VOD (Video on Demand)',
              description:
                'Предзаписанный контент, загружаемый авторами. Основной формат для YouTube, Vimeo.',
              pros: [
                'Можно транскодировать заранее во все нужные качества',
                'Эффективное кэширование — контент не меняется',
                'Простая CDN-стратегия',
              ],
              cons: [
                'Большие затраты на хранение всех версий качества',
                'Время от загрузки до публикации (transcoding delay)',
                'Необходимость поддержки огромного каталога',
              ],
              bestWhen: 'Основной use-case — просмотр предзаписанного контента (YouTube, Netflix)',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 0, cost: -1 },
            },
            {
              id: 'live',
              label: 'Live Streaming',
              description:
                'Прямые трансляции в реальном времени. Требует low-latency pipeline: ingest → transcode → deliver за секунды.',
              pros: [
                'Высокая вовлечённость аудитории (чат, реакции)',
                'Monetization через суперчаты и донаты',
                'Трендовый формат для gaming и событий',
              ],
              cons: [
                'Требует real-time транскодирования',
                'Сложная инфраструктура для low-latency доставки (<5с)',
                'Высокая стоимость egress трафика при пиковой нагрузке',
              ],
              bestWhen: 'Нужны прямые трансляции (Twitch, YouTube Live)',
              impact: { latency: -2, scalability: -1, consistency: -1, complexity: -2, cost: -2 },
            },
            {
              id: 'short-form',
              label: 'Short-form Video (Shorts/Reels)',
              description:
                'Короткие вертикальные видео до 60с. Агрессивное preloading, бесконечная лента.',
              pros: [
                'Маленький размер файлов — быстрая обработка',
                'Высокая вовлечённость через бесконечный скролл',
                'Проще кэшировать — популярный контент занимает мало места',
              ],
              cons: [
                'Огромный объём загрузок (низкий порог входа для авторов)',
                'Требует агрессивного preloading следующих видео',
                'Сложная система рекомендаций — ключ к retention',
              ],
              bestWhen: 'Нужен формат коротких видео для мобильных пользователей (TikTok, YouTube Shorts)',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'vs-quality',
          category: 'Качество',
          question: 'Поддержка качества видео?',
          options: [
            {
              id: 'single-quality',
              label: 'Single Quality (480p)',
              description:
                'Одно качество для всех пользователей. Минимальные затраты на транскодирование и хранение.',
              pros: [
                'Минимальные затраты на storage и transcoding',
                'Простейшая архитектура',
                'Быстрое время обработки',
              ],
              cons: [
                'Плохой UX на больших экранах',
                'Невозможно адаптироваться к скорости сети пользователя',
                'Неконкурентоспособно на рынке',
              ],
              bestWhen: 'MVP или внутренний сервис с ограниченными ресурсами',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 2, cost: 2 },
              capacityImpact: [
                {
                  label: 'Transcoded storage/day',
                  value: '~120 TB/day',
                  formula: '360 TB raw × 0.33 (single 480p rendition, ~3× compression) = ~120 TB/day',
                },
                {
                  label: 'CDN bandwidth (peak)',
                  value: '~23 Gbps',
                  formula: '46K concurrent streams × avg 0.5 Mbps (480p) = ~23 Gbps',
                },
                {
                  label: 'Transcoding compute',
                  value: '2.4M compute-min/day',
                  formula: '720K videos × avg 3.3 min (single quality encode) = 2.4M compute-minutes/day',
                },
              ],
            },
            {
              id: 'multi-quality',
              label: 'Multiple Qualities (360p-1080p)',
              description:
                'Фиксированный набор качеств. Пользователь выбирает вручную.',
              pros: [
                'Поддержка разных устройств и сетей',
                'Относительно простая реализация',
                'Пользователь контролирует качество',
              ],
              cons: [
                'Ручное переключение качества — плохой UX',
                'Буферизация при смене качества',
                'Не адаптируется к колебаниям сети в реальном времени',
              ],
              bestWhen: 'Платформа среднего размера без ресурсов на ABR',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'adaptive-bitrate',
              label: 'Adaptive Bitrate Streaming (ABR, 144p-4K)',
              description:
                'Автоматическое переключение качества на основе пропускной способности сети. Индустриальный стандарт (HLS/DASH).',
              pros: [
                'Оптимальный UX — автоматическая адаптация к сети',
                'Минимальная буферизация даже на нестабильных сетях',
                'Индустриальный стандарт, поддерживается всеми плеерами',
              ],
              cons: [
                'Каждое видео транскодируется в 6-10+ вариантов качества',
                'Кратно увеличивает объём хранения (5-10x)',
                'Сложная логика переключения битрейта в плеере',
              ],
              bestWhen: 'Production-платформа с глобальной аудиторией (YouTube, Netflix, Twitch)',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: -2 },
              capacityImpact: [
                {
                  label: 'Transcoded storage/day',
                  value: '~2.5 PB/day',
                  formula: '360 TB raw × 7 renditions (144p–4K) × avg 1× combined = ~2.5 PB/day',
                },
                {
                  label: 'CDN bandwidth (peak)',
                  value: '~230 Gbps',
                  formula: '46K concurrent streams × avg 5 Mbps (adaptive, mix of qualities) = ~230 Gbps',
                },
                {
                  label: 'Transcoding compute',
                  value: '50M compute-min/day',
                  formula: '720K videos × 7 renditions × avg 10 min per rendition = 50.4M compute-minutes/day',
                },
              ],
            },
          ],
        },
      ],
    },

    // ── Step 2: Upload & Processing Pipeline ──────────────────────────
    {
      id: 'vs-upload',
      title: 'Загрузка и обработка видео',
      description:
        'Архитектура pipeline загрузки и транскодирования. Видео файлы огромны (ГБ), обработка ресурсоёмкая — нужен надёжный и масштабируемый pipeline.',
      tip: 'YouTube использует resumable upload protocol и распараллеливает транскодирование: видео разбивается на сегменты, каждый кодируется параллельно на тысячах worker-ов.',
      decisions: [
        {
          id: 'vs-upload-method',
          category: 'Загрузка',
          question: 'Как загружать видео?',
          options: [
            {
              id: 'direct-upload',
              label: 'Direct upload на app server',
              description:
                'Клиент загружает файл напрямую на application server, который затем сохраняет в storage.',
              pros: [
                'Простая реализация',
                'Полный контроль над процессом загрузки',
                'Можно валидировать на лету',
              ],
              cons: [
                'App server становится bottleneck (I/O bound)',
                'Нет resumability — при обрыве нужно начинать заново',
                'Не масштабируется для больших файлов (ГБ)',
              ],
              bestWhen: 'Маленькие файлы, низкая нагрузка, MVP',
              impact: { latency: -1, scalability: -2, consistency: 0, complexity: 2, cost: 1 },
            },
            {
              id: 'resumable-upload',
              label: 'Resumable upload в object storage (pre-signed URLs)',
              description:
                'Клиент получает pre-signed URL и загружает напрямую в S3/GCS с поддержкой возобновления.',
              pros: [
                'App server не нагружается I/O — только metadata',
                'Возобновление при обрыве сети',
                'Нативная масштабируемость object storage',
              ],
              cons: [
                'Сложнее клиентская логика (отслеживание прогресса)',
                'Нужна обработка multipart upload callbacks',
                'Pre-signed URL требует управления TTL и безопасностью',
              ],
              bestWhen: 'Production-платформа с большими файлами (YouTube, Vimeo)',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'chunked-upload',
              label: 'Chunked upload с клиентским разбиением',
              description:
                'Клиент разбивает файл на чанки (5-25 МБ), загружает параллельно, сервер собирает.',
              pros: [
                'Параллельная загрузка чанков ускоряет upload',
                'Возможность ретрая отдельных чанков',
                'Прогресс-бар на уровне чанков',
              ],
              cons: [
                'Сложная клиентская и серверная логика сборки',
                'Нужен механизм отслеживания и сборки чанков',
                'Проблемы с ordering и дедупликацией',
              ],
              bestWhen: 'Очень большие файлы (10+ ГБ), нестабильная сеть',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -2, cost: 0 },
            },
          ],
        },
        {
          id: 'vs-transcoding',
          category: 'Транскодирование',
          question: 'Архитектура транскодирования?',
          options: [
            {
              id: 'single-ffmpeg',
              label: 'Single server FFmpeg',
              description:
                'Один сервер выполняет полное транскодирование каждого видео последовательно.',
              pros: [
                'Простейшая архитектура — один процесс FFmpeg',
                'Нет overhead на координацию',
                'Легко отлаживать',
              ],
              cons: [
                'Время обработки 1 час видео = 2-4 часа (зависит от hardware)',
                'Не масштабируется — один сервер = один файл',
                'Single point of failure',
              ],
              bestWhen: 'MVP, маленький объём загрузок (<100 видео/день)',
              impact: { latency: -2, scalability: -2, consistency: 1, complexity: 2, cost: 1 },
              capacityImpact: [
                {
                  label: 'Transcoding compute',
                  value: '~1.4M compute-hrs/day',
                  formula: '720K videos × avg 2.5 min video × 2–4× real-time encoding ≈ 1.4M compute-hours/day on single machines',
                },
              ],
            },
            {
              id: 'distributed-transcoding',
              label: 'Distributed transcoding (split + parallel encode + merge)',
              description:
                'Видео разбивается на сегменты по GOP boundaries, каждый кодируется параллельно на отдельных worker-ах, затем сегменты мержатся.',
              pros: [
                'Линейное ускорение: 100 worker-ов = ~100x быстрее',
                'Отказоустойчивость — ретрай отдельных сегментов',
                'Используется YouTube, Netflix в production',
              ],
              cons: [
                'Сложная координация (split, schedule, merge)',
                'Артефакты на стыках сегментов без правильного GOP splitting',
                'Нужна система оркестрации (Temporal, Airflow)',
              ],
              bestWhen: 'Платформа масштаба YouTube (500+ часов видео/минуту)',
              impact: { latency: 2, scalability: 2, consistency: 0, complexity: -2, cost: -1 },
              capacityImpact: [
                {
                  label: 'Transcoding compute',
                  value: '7.2M compute-min/day',
                  formula: '720K videos × 10 min avg, but parallelized across 100s of workers → wall-clock time ~6 sec per video; total compute stays 7.2M min',
                },
              ],
            },
            {
              id: 'serverless-transcoding',
              label: 'Serverless (AWS Lambda / MediaConvert)',
              description:
                'Managed-сервис для транскодирования. Автоскейлинг из коробки, оплата per-minute.',
              pros: [
                'Нулевое управление инфраструктурой',
                'Автоматический scaling',
                'Pay-per-use — нет idle затрат',
              ],
              cons: [
                'Высокая стоимость при больших объёмах ($0.024/мин HD)',
                'Ограниченный контроль над pipeline',
                'Vendor lock-in',
              ],
              bestWhen: 'Средняя нагрузка, нет команды для своей инфраструктуры',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 1, cost: -1 },
            },
            {
              id: 'cloud-managed',
              label: 'Cloud Managed (AWS Elemental, GCP Transcoder)',
              description:
                'Полностью управляемый облачный сервис транскодирования с API для настройки pipeline.',
              pros: [
                'Высокое качество кодирования (оптимизированные кодеки)',
                'Интеграция с облачной экосистемой',
                'SLA от облачного провайдера',
              ],
              cons: [
                'Значительный vendor lock-in',
                'Стоимость растёт линейно с объёмом',
                'Ограниченная кастомизация pipeline',
              ],
              bestWhen: 'Компания уже в облаке, нужен быстрый time-to-market',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 1, cost: -2 },
            },
          ],
        },
      ],
    },

    // ── Step 3: Storage ───────────────────────────────────────────────
    {
      id: 'vs-storage',
      title: 'Хранение данных',
      description:
        'Выбор хранилища для видео-файлов (петабайты) и метаданных (миллиарды записей). Разные паттерны доступа требуют разных решений.',
      tip: 'YouTube хранит exabytes видео в собственном хранилище (Colossus) и использует Vitess для шардирования MySQL — Vitess был создан командой YouTube.',
      decisions: [
        {
          id: 'vs-video-storage',
          category: 'Видео-файлы',
          question: 'Где хранить видео-файлы?',
          options: [
            {
              id: 'single-object-storage',
              label: 'Single object storage (S3)',
              description:
                'Все видео в одном бакете S3/GCS. Просто и надёжно (11 девяток durability).',
              pros: [
                'Простейшая архитектура хранения',
                '99.999999999% durability (S3)',
                'Неограниченная ёмкость',
              ],
              cons: [
                'Одинаковая стоимость для hot и cold контента',
                'Egress costs при высоком трафике',
                'Latency зависит от региона бакета',
              ],
              bestWhen: 'Начальный этап, когда весь контент примерно одинаково популярен',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 2, cost: 0 },
            },
            {
              id: 'tiered-storage',
              label: 'Tiered storage (hot/warm/cold)',
              description:
                'Горячее хранилище (SSD/S3 Standard) для популярного контента, тёплое (S3-IA) для среднего, холодное (Glacier) для архива.',
              pros: [
                'Оптимальная стоимость: 80% контента в дешёвом tier',
                'Горячий контент на быстром storage',
                'Lifecycle policies автоматизируют миграцию',
              ],
              cons: [
                'Сложность управления tier-переходами',
                'Latency при доступе к cold content (минуты для Glacier)',
                'Нужна аналитика для определения tier-а контента',
              ],
              bestWhen: 'Production-платформа с power-law распределением популярности (YouTube, Netflix)',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: 2 },
              capacityImpact: [
                {
                  label: 'Raw upload storage/day',
                  value: '~360 TB/day (hot: 36 TB, warm: 108 TB, cold: 216 TB)',
                  formula: '10% content hot (S3 Standard $0.023/GB), 30% warm (S3-IA $0.0125/GB), 60% cold (Glacier $0.004/GB) → ~60% cost savings vs single tier',
                },
              ],
            },
            {
              id: 'custom-blob-storage',
              label: 'Custom blob storage (Google Colossus)',
              description:
                'Собственная distributed file system, оптимизированная под видео-workload.',
              pros: [
                'Полный контроль над производительностью и стоимостью',
                'Оптимизация под конкретный workload',
                'Нет vendor lock-in',
              ],
              cons: [
                'Требует огромной команды инфраструктуры (50+ инженеров)',
                'Годы разработки до production-ready состояния',
                'Нужно обеспечить durability самостоятельно',
              ],
              bestWhen: 'Масштаб Google/Facebook, где экономия оправдывает инвестиции',
              impact: { latency: 2, scalability: 2, consistency: 0, complexity: -2, cost: 1 },
            },
            {
              id: 'hdfs',
              label: 'HDFS кластер',
              description:
                'Hadoop Distributed File System. Подходит для batch-обработки и аналитики.',
              pros: [
                'Хорошо интегрируется с Hadoop/Spark экосистемой',
                'Высокая пропускная способность для batch reads',
                'Встроенная репликация (3x по умолчанию)',
              ],
              cons: [
                'Плохо подходит для random access и streaming',
                'NameNode — single point of failure (без HA)',
                'Высокая стоимость хранения (3x репликация)',
              ],
              bestWhen: 'Аналитический pipeline, batch-обработка видео, но не для serving',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: -1, cost: -1 },
            },
          ],
        },
        {
          id: 'vs-metadata-db',
          category: 'Метаданные',
          question: 'Где хранить метаданные видео?',
          options: [
            {
              id: 'postgresql',
              label: 'PostgreSQL',
              description:
                'Мощная реляционная БД с rich query capabilities. Один инстанс или реплики.',
              pros: [
                'Богатый SQL и типы данных (JSONB, полнотекстовый поиск)',
                'ACID-транзакции',
                'Зрелая экосистема и инструменты',
              ],
              cons: [
                'Сложно шардировать нативно',
                'Лимит на одном сервере ~1-5 ТБ данных эффективно',
                'Вертикальное масштабирование ограничено',
              ],
              bestWhen: 'До ~100M видео, команда знает PostgreSQL',
              impact: { latency: 0, scalability: -1, consistency: 2, complexity: 1, cost: 1 },
            },
            {
              id: 'mysql-sharded',
              label: 'MySQL (sharded вручную)',
              description:
                'MySQL с ручным шардированием по video_id или user_id. Application-level routing.',
              pros: [
                'Хорошо изученная технология',
                'Предсказуемая производительность',
                'Можно начать с малого и расти',
              ],
              cons: [
                'Ручное управление шардами — операционная сложность',
                'Cross-shard queries очень дорогие',
                'Resharding при росте — болезненная процедура',
              ],
              bestWhen: 'Средний масштаб, команда с опытом MySQL sharding',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'vitess',
              label: 'Vitess (MySQL sharding layer)',
              description:
                'Прозрачный sharding поверх MySQL. Создан командой YouTube, используется в production.',
              pros: [
                'Автоматическое шардирование и resharding',
                'Совместим с MySQL протоколом',
                'Battle-tested в YouTube (триллионы строк)',
              ],
              cons: [
                'Операционная сложность deployment и мониторинга',
                'Не все MySQL-фичи поддерживаются (некоторые JOIN)',
                'Нужна экспертиза по Vitess-специфичной конфигурации',
              ],
              bestWhen: 'Масштаб YouTube — миллиарды видео, триллионы строк метаданных',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'dynamodb-bigtable',
              label: 'DynamoDB / Bigtable',
              description:
                'NoSQL wide-column store. Отлично для key-value доступа по video_id.',
              pros: [
                'Автоматическое масштабирование до любого объёма',
                'Предсказуемая low-latency (<10ms) при key-lookup',
                'Managed — нет операционной нагрузки',
              ],
              cons: [
                'Ограниченные возможности запросов (нет JOIN, сложных WHERE)',
                'Expensive для scan-heavy workloads',
                'Vendor lock-in (DynamoDB = AWS, Bigtable = GCP)',
              ],
              bestWhen: 'Простой access pattern (get by ID), cloud-native архитектура',
              impact: { latency: 2, scalability: 2, consistency: -1, complexity: 0, cost: -1 },
            },
          ],
        },
      ],
    },

    // ── Step 4: Content Delivery ──────────────────────────────────────
    {
      id: 'vs-delivery',
      title: 'Доставка контента',
      description:
        'CDN и протокол стриминга определяют качество просмотра. При 2B+ пользователей в 190+ странах доставка контента — ключевой элемент архитектуры.',
      tip: 'Netflix развернул Open Connect — собственную CDN с серверами в ~6000 локациях ISP. YouTube использует Google Global Cache. HLS покрывает ~80% интернет-видео.',
      decisions: [
        {
          id: 'vs-cdn',
          category: 'CDN',
          question: 'Стратегия доставки контента?',
          options: [
            {
              id: 'third-party-cdn',
              label: 'Third-party CDN (CloudFront / Akamai)',
              description:
                'Использование коммерческого CDN-провайдера. Быстрый старт, глобальное покрытие.',
              pros: [
                'Глобальное покрытие из коробки (300+ PoP)',
                'Нет инвестиций в инфраструктуру',
                'Managed DDoS protection и SSL',
              ],
              cons: [
                'Высокая стоимость egress при масштабе YouTube ($0.02-0.08/ГБ)',
                'Ограниченный контроль над кэшированием и routing',
                'Зависимость от провайдера',
              ],
              bestWhen: 'Стартап, до ~100 Тбит/с трафика',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 2, cost: -1 },
              capacityImpact: [
                {
                  label: 'CDN bandwidth (peak)',
                  value: '~230 Gbps @ $0.02–0.08/GB',
                  formula: '230 Gbps = ~2.5 PB/day egress × $0.04 avg/GB ≈ $100K/day CDN cost',
                },
              ],
            },
            {
              id: 'own-cdn',
              label: 'Собственная CDN (Netflix Open Connect / Google Edge)',
              description:
                'Собственные серверы в ISP и IX точках. Полный контроль, минимальная стоимость доставки при масштабе.',
              pros: [
                'Минимальная стоимость доставки при масштабе (<$0.01/ГБ)',
                'Полный контроль над latency и routing',
                'Серверы внутри ISP — минимальный hop count',
              ],
              cons: [
                'Огромные начальные инвестиции ($100M+)',
                'Нужна команда для управления hardware по всему миру',
                'Сложные договоры с ISP',
              ],
              bestWhen: 'Масштаб Netflix/YouTube (>30% интернет-трафика)',
              impact: { latency: 2, scalability: 2, consistency: 1, complexity: -2, cost: 2 },
              capacityImpact: [
                {
                  label: 'CDN bandwidth (peak)',
                  value: '~230 Gbps @ <$0.01/GB',
                  formula: '230 Gbps own edge servers in ISPs → ~2.5 PB/day × $0.005/GB ≈ $12.5K/day (8× cheaper than third-party)',
                },
              ],
            },
            {
              id: 'hybrid-cdn',
              label: 'Hybrid (own edge + third-party для long tail)',
              description:
                'Собственные edge-серверы в ключевых регионах + third-party CDN для остальных.',
              pros: [
                'Баланс стоимости и покрытия',
                'Own edge для 80% трафика (popular regions)',
                'Fallback на коммерческий CDN для edge cases',
              ],
              cons: [
                'Сложность управления двумя CDN-стратегиями',
                'Нужна умная routing-логика (GeoDNS + Anycast)',
                'Consistency кэширования между CDN-ами',
              ],
              bestWhen: 'Крупная платформа, растущая к масштабу YouTube',
              impact: { latency: 2, scalability: 2, consistency: 0, complexity: -1, cost: 1 },
            },
            {
              id: 'p2p-delivery',
              label: 'P2P доставка',
              description:
                'Зрители раздают контент друг другу (WebRTC-based). Снижает нагрузку на серверы.',
              pros: [
                'Значительное снижение серверного трафика (до 70%)',
                'Масштабируется сама по себе с ростом аудитории',
                'Дешевле при live-событиях с большой аудиторией',
              ],
              cons: [
                'Зависимость от upload-скорости зрителей',
                'Сложная NAT traversal (STUN/TURN)',
                'Нестабильное качество — зрители уходят непредсказуемо',
              ],
              bestWhen: 'Live-трансляции с огромной одновременной аудиторией, дополнение к CDN',
              impact: { latency: 0, scalability: 1, consistency: -2, complexity: -2, cost: 2 },
            },
          ],
        },
        {
          id: 'vs-streaming-protocol',
          category: 'Протокол',
          question: 'Протокол стриминга?',
          options: [
            {
              id: 'hls',
              label: 'HLS (HTTP Live Streaming, Apple)',
              description:
                'Самый распространённый протокол. ~80% интернет-видео. Нативная поддержка на всех Apple устройствах.',
              pros: [
                'Доминирующий стандарт (~80% рынка)',
                'Нативная поддержка iOS/macOS/Safari',
                'Отличная совместимость с CDN (обычный HTTP)',
              ],
              cons: [
                'Высокая latency для live (10-30с по умолчанию)',
                'Менее гибкий чем DASH (фиксированные сегменты)',
                'Apple-controlled стандарт',
              ],
              bestWhen: 'VOD-контент, широкая совместимость с устройствами',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 1, cost: 0 },
            },
            {
              id: 'dash',
              label: 'DASH (Dynamic Adaptive Streaming over HTTP)',
              description:
                'Открытый стандарт MPEG-DASH. Более гибкий, чем HLS. Основной конкурент.',
              pros: [
                'Открытый стандарт (ISO/IEC 23009)',
                'Гибкая конфигурация (segment length, codec switching)',
                'Лучшая поддержка DRM через EME',
              ],
              cons: [
                'Нет нативной поддержки в Safari/iOS (нужен MSE fallback)',
                'Меньшая экосистема плееров',
                'Более сложная реализация серверной части',
              ],
              bestWhen: 'Android/Web платформы, нужна гибкость в настройке ABR',
              impact: { latency: 0, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'hls-dash',
              label: 'HLS + DASH (оба протокола)',
              description:
                'Поддержка обоих протоколов. Один и тот же контент доступен в HLS и DASH форматах.',
              pros: [
                'Максимальная совместимость (все устройства и браузеры)',
                'Можно выбирать оптимальный протокол для каждого клиента',
                'Индустриальная практика (YouTube, Netflix)',
              ],
              cons: [
                'Двойной набор manifest-файлов (m3u8 + mpd)',
                'Сложнее тестирование и поддержка',
                'Чуть больше storage для manifest-ов',
              ],
              bestWhen: 'Глобальная платформа с разнородными клиентами (YouTube)',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'rtmp',
              label: 'RTMP (Real-Time Messaging Protocol)',
              description:
                'Legacy протокол для live ingest. Low-latency, но требует специальных серверов.',
              pros: [
                'Низкая latency для live streaming (1-3с)',
                'Зрелый протокол с широкой поддержкой encoder-ов (OBS)',
                'Хорошо подходит для ingest (стример → сервер)',
              ],
              cons: [
                'Не подходит для playback (Flash deprecated)',
                'Не работает через стандартные CDN (не HTTP)',
                'Не поддерживает ABR на стороне клиента',
              ],
              bestWhen: 'Только для live ingest (от стримера к серверу), не для доставки зрителям',
              impact: { latency: 2, scalability: -1, consistency: 0, complexity: 0, cost: 0 },
            },
          ],
        },
      ],
    },

    // ── Step 5: Scaling ───────────────────────────────────────────────
    {
      id: 'vs-scaling',
      title: 'Масштабирование',
      description:
        'Стратегии кэширования и рекомендаций для обслуживания миллионов одновременных просмотров с минимальной буферизацией.',
      tip: 'Распределение популярности видео следует закону Парето: ~10% видео генерируют ~90% просмотров. Multi-tier кэширование с origin shield — индустриальный стандарт.',
      decisions: [
        {
          id: 'vs-cache-strategy',
          category: 'Кэширование',
          question: 'Кэширование видео?',
          options: [
            {
              id: 'cdn-edge-only',
              label: 'CDN edge cache only',
              description:
                'Кэширование только на edge-серверах CDN. Cache miss идёт напрямую в origin storage.',
              pros: [
                'Простая архитектура — всё на стороне CDN',
                'Нет дополнительной инфраструктуры',
                'Хорошо работает для hot content',
              ],
              cons: [
                'Cache miss → прямой запрос в origin (высокая latency)',
                'Thundering herd при cache miss популярного видео',
                'Нет защиты origin от пиковых нагрузок',
              ],
              bestWhen: 'Маленькая платформа, контент умещается в edge cache',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 2, cost: 1 },
            },
            {
              id: 'cdn-origin-shield',
              label: 'CDN + origin shield',
              description:
                'Промежуточный cache layer (origin shield) между edge и origin. Защищает origin от cache stampede.',
              pros: [
                'Origin shield поглощает cache miss с множества edge PoP',
                'Защита origin от thundering herd',
                'Снижает egress из origin storage на 80-90%',
              ],
              cons: [
                'Дополнительный hop при cache miss (edge → shield → origin)',
                'Стоимость origin shield инфраструктуры',
                'Нужно правильно настроить TTL на каждом уровне',
              ],
              bestWhen: 'Средняя платформа с выраженным hot/cold распределением',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'multi-tier-cache',
              label: 'CDN + regional mid-tier cache + origin',
              description:
                'Трёхуровневое кэширование: edge → regional mid-tier → origin shield → storage. Индустриальный стандарт для видео.',
              pros: [
                'Минимальная нагрузка на origin (99%+ cache hit ratio)',
                'Regional cache снижает inter-region трафик',
                'Предсказуемая latency для пользователей',
              ],
              cons: [
                'Сложная инвалидация кэша через все уровни',
                'Высокая операционная сложность (мониторинг каждого tier)',
                'Значительные инвестиции в инфраструктуру',
              ],
              bestWhen: 'Глобальная платформа масштаба YouTube/Netflix',
              impact: { latency: 2, scalability: 2, consistency: 0, complexity: -2, cost: -1 },
            },
            {
              id: 'predictive-precache',
              label: 'Predictive pre-caching (популярный контент)',
              description:
                'ML-модель предсказывает будущую популярность и proactively кэширует контент на edge до запроса.',
              pros: [
                'Cache уже warm при вирусном контенте',
                'Минимальная latency для trending видео',
                'Оптимизация edge storage — кэш только нужного',
              ],
              cons: [
                'Нужна ML-инфраструктура для предсказаний',
                'Потраченный bandwidth на pre-cache промахов предсказаний',
                'Сложность обучения модели на паттернах viral-контента',
              ],
              bestWhen: 'Дополнение к multi-tier кэшированию для viral-контента',
              impact: { latency: 2, scalability: 1, consistency: 0, complexity: -2, cost: -1 },
            },
          ],
        },
        {
          id: 'vs-recommendations',
          category: 'Рекомендации',
          question: 'Система рекомендаций?',
          options: [
            {
              id: 'search-only',
              label: 'Без рекомендаций (только поиск)',
              description:
                'Пользователи находят контент только через поиск и подписки.',
              pros: [
                'Нет ML-инфраструктуры — экономия ресурсов',
                'Прозрачность для пользователей',
                'Простота реализации',
              ],
              cons: [
                'Низкий engagement и watch time',
                'Пользователи не открывают новый контент',
                'Неконкурентоспособно на рынке',
              ],
              bestWhen: 'Нишевая платформа с целевой аудиторией (корпоративное видео)',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 2, cost: 2 },
            },
            {
              id: 'collaborative-filtering',
              label: 'Collaborative filtering',
              description:
                'Рекомендации на основе поведения похожих пользователей (item-based и user-based CF).',
              pros: [
                'Проверенный подход, хорошо работает для mature каталогов',
                'Не требует понимания контента',
                'Относительно простая реализация (ALS, SVD)',
              ],
              cons: [
                'Cold start проблема для новых видео и пользователей',
                'Не учитывает контекст (время суток, устройство)',
                'Масштабирование матрицы user-item при миллиардах пользователей',
              ],
              bestWhen: 'Средняя платформа с устоявшимся каталогом',
              impact: { latency: 0, scalability: -1, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'deep-learning',
              label: 'Deep Learning (two-tower model, YouTube DNN 2016)',
              description:
                'Нейросеть для рекомендаций: candidate generation (two-tower) + ranking model. Архитектура YouTube DNN paper 2016.',
              pros: [
                'Лучшее качество рекомендаций в индустрии',
                'Учитывает сотни фичей (контекст, история, контент)',
                'Решает cold start через content features',
              ],
              cons: [
                'Огромная инфраструктура: GPU/TPU кластеры для training и serving',
                'Сложность feature engineering pipeline',
                'Высокая latency inference (нужен кэш embeddings)',
              ],
              bestWhen: 'Масштаб YouTube, есть ML-команда и GPU-инфраструктура',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: -2, cost: -2 },
            },
            {
              id: 'hybrid-ml',
              label: 'Hybrid (collaborative + content-based + deep learning)',
              description:
                'Комбинация подходов: CF для cold start fallback, content-based для new items, DL для основного ranking.',
              pros: [
                'Устойчивость: каждый подход компенсирует слабости другого',
                'Лучший cold start: content-based для новых видео',
                'Graceful degradation при сбое ML pipeline',
              ],
              cons: [
                'Максимальная сложность инфраструктуры',
                'Нужна оркестрация нескольких ML-моделей',
                'Сложность A/B тестирования и отладки',
              ],
              bestWhen: 'Production-платформа стремящаяся к лучшему engagement (Netflix, YouTube)',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: -2, cost: -2 },
            },
          ],
        },
      ],
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'vs-reliability',
      title: 'Надёжность и мониторинг',
      description:
        'Стратегия отказоустойчивости и метрики качества для платформы, обслуживающей миллиарды просмотров в день.',
      tip: 'Netflix использует multi-CDN fallback + multi-region active-active. Ключевая метрика — rebuffer ratio: каждый 1% увеличения rebuffering снижает engagement на 3%.',
      decisions: [
        {
          id: 'vs-redundancy',
          category: 'Отказоустойчивость',
          question: 'Стратегия отказоустойчивости?',
          options: [
            {
              id: 'multi-az',
              label: 'Multi-AZ deployment',
              description:
                'Развёртывание в нескольких Availability Zones внутри одного региона.',
              pros: [
                'Защита от сбоя отдельного датацентра',
                'Низкая latency между AZ (<2ms)',
                'Простая реализация (стандарт в облаках)',
              ],
              cons: [
                'Не защищает от регионального сбоя',
                'Не помогает при CDN outage',
                'Ограниченная geographical redundancy',
              ],
              bestWhen: 'Базовый уровень надёжности, одно-региональное развёртывание',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: -1 },
            },
            {
              id: 'multi-region',
              label: 'Multi-region active-active',
              description:
                'Полностью активные deployment-ы в нескольких регионах. Каждый регион может обслуживать весь трафик.',
              pros: [
                'Защита от регионального сбоя',
                'Пользователи маршрутизируются в ближайший регион',
                'Нет single point of failure на уровне региона',
              ],
              cons: [
                'Сложная синхронизация данных между регионами',
                'Высокая стоимость (2-3x инфраструктура)',
                'Конфликты при concurrent writes в разных регионах',
              ],
              bestWhen: 'Глобальная платформа с SLA 99.99%+',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: -2, cost: -2 },
            },
            {
              id: 'multi-cdn-fallback',
              label: 'Multi-CDN fallback',
              description:
                'Использование нескольких CDN-провайдеров с автоматическим переключением при сбое.',
              pros: [
                'Защита от CDN outage (бывает даже у CloudFront)',
                'Можно выбирать лучший CDN для каждого региона',
                'Leverage конкуренции CDN-ов для лучших цен',
              ],
              cons: [
                'Сложная DNS-логика переключения',
                'Нужен мониторинг здоровья каждого CDN',
                'Cache не shared между CDN-ами — cold start при failover',
              ],
              bestWhen: 'Критический video delivery, SLA на время просмотра',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'multi-region-multi-cdn',
              label: 'All of the above (multi-AZ + multi-region + multi-CDN)',
              description:
                'Максимальная отказоустойчивость: multi-AZ внутри каждого региона, multi-region active-active, multi-CDN fallback.',
              pros: [
                'Максимальная доступность (99.999%)',
                'Защита от любого уровня сбоя',
                'Netflix и YouTube используют этот подход',
              ],
              cons: [
                'Максимальная операционная сложность',
                'Требует dedicated SRE-команды',
                'Стоимость 3-5x от single-region deployment',
              ],
              bestWhen: 'Масштаб YouTube/Netflix — видео-платформа как critical infrastructure',
              impact: { latency: 2, scalability: 2, consistency: -1, complexity: -2, cost: -2 },
            },
          ],
        },
        {
          id: 'vs-monitoring',
          category: 'Мониторинг',
          question: 'Ключевые метрики?',
          multiSelect: true,
          options: [
            {
              id: 'video-start-time',
              label: 'Video Start Time (Time to First Byte)',
              description:
                'Время от клика Play до первого кадра. Критическая метрика UX: >2с — пользователи уходят.',
              pros: [
                'Прямо влияет на bounce rate (53% уходят при >3с)',
                'Легко измерить на клиентской стороне',
                'Хорошо коррелирует с user satisfaction',
              ],
              cons: [
                'Зависит от множества факторов (CDN, ISP, device)',
                'Сложно изолировать проблему (сервер vs клиент vs сеть)',
                'Разная норма для разных устройств и регионов',
              ],
              bestWhen: 'Всегда — базовая метрика для любой видео-платформы',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'rebuffer-ratio',
              label: 'Rebuffer Ratio',
              description:
                'Процент времени просмотра, потраченного на буферизацию. Главная метрика QoE: 1% рост rebuffering = 3% падение engagement.',
              pros: [
                'Наиболее сильная корреляция с engagement',
                'Объективная метрика качества доставки',
                'Можно отслеживать в реальном времени',
              ],
              cons: [
                'Требует client-side SDK для точного измерения',
                'Зависит от ABR алгоритма плеера',
                'Сложно сравнивать между разными типами контента',
              ],
              bestWhen: 'Всегда — ключевая метрика для оптимизации CDN и ABR',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'bitrate-quality',
              label: 'Bitrate Quality Score',
              description:
                'Средний битрейт воспроизведения относительно доступного максимума. Показывает, получают ли пользователи лучшее качество.',
              pros: [
                'Показывает реальное quality of experience',
                'Позволяет оценить эффективность ABR',
                'Можно сегментировать по регионам и ISP',
              ],
              cons: [
                'Не всегда коррелирует с субъективным качеством',
                'Зависит от доступных вариантов транскодирования',
                'Нужен контекст (мобильный vs TV — разные ожидания)',
              ],
              bestWhen: 'Платформа с ABR — для оптимизации алгоритма выбора качества',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
            {
              id: 'upload-success-rate',
              label: 'Upload Success Rate',
              description:
                'Процент успешно завершённых загрузок. Критично для creator experience: неудачная загрузка = потерянный контент.',
              pros: [
                'Напрямую влияет на retention авторов контента',
                'Легко измерить и отслеживать',
                'Позволяет быстро обнаружить проблемы upload pipeline',
              ],
              cons: [
                'Не отражает качество обработки (transcoding failures)',
                'Зависит от клиентской сети (не всегда серверная проблема)',
                'Нужно различать user-cancelled vs system-failed',
              ],
              bestWhen: 'Платформа с UGC — здоровье upload pipeline критично для supply side',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: 0 },
            },
          ],
        },
      ],
    },
  ],

  referenceSolution: {
    decisions: {
      'vs-type': ['vod', 'short-form'],
      'vs-quality': ['adaptive-bitrate'],
      'vs-upload-method': ['resumable-upload'],
      'vs-transcoding': ['distributed-transcoding'],
      'vs-video-storage': ['tiered-storage'],
      'vs-metadata-db': ['vitess'],
      'vs-cdn': ['hybrid-cdn'],
      'vs-streaming-protocol': ['hls-dash'],
      'vs-cache-strategy': ['multi-tier-cache'],
      'vs-recommendations': ['hybrid-ml'],
      'vs-redundancy': ['multi-region-multi-cdn'],
      'vs-monitoring': ['video-start-time', 'rebuffer-ratio', 'bitrate-quality', 'upload-success-rate'],
    },
    explanation:
      'Архитектура масштаба YouTube строится вокруг нескольких ключевых принципов:\n\n' +
      '1. **Distributed Transcoding** — видео разбивается на сегменты по GOP boundaries и кодируется параллельно на тысячах worker-ов. Это сокращает время обработки часового видео с 4 часов до минут. YouTube обрабатывает 500+ часов видео в минуту именно так.\n\n' +
      '2. **Tiered Storage** — закон Парето в действии: 10% видео генерируют 90% просмотров. Горячий контент на SSD/S3 Standard, тёплый на S3-IA, архив на Glacier. Экономия до 60% на хранении петабайт данных.\n\n' +
      '3. **Multi-tier CDN с Origin Shield** — трёхуровневое кэширование (edge → regional mid-tier → origin shield) обеспечивает 99%+ cache hit ratio. Hybrid CDN (собственные edge + third-party) оптимизирует стоимость и покрытие.\n\n' +
      '4. **Adaptive Bitrate Streaming (HLS + DASH)** — клиент автоматически переключается между качествами (144p-4K) на основе пропускной способности. HLS покрывает Apple-устройства, DASH — остальные.\n\n' +
      '5. **Vitess для метаданных** — создан командой YouTube для шардирования MySQL. Автоматический resharding, совместимость с MySQL протоколом, battle-tested на триллионах строк.\n\n' +
      '6. **Hybrid рекомендации** — комбинация collaborative filtering (для mature контента), content-based (для cold start новых видео) и deep learning (two-tower model для основного ranking) обеспечивает максимальный engagement.\n\n' +
      '7. **Multi-region + Multi-CDN** — полная отказоустойчивость на всех уровнях: multi-AZ внутри региона, active-active между регионами, multi-CDN fallback при сбое провайдера.',
    diagram:
      '┌─────────────────────────────────────────────────────────────────────────────┐\n' +
      '│                        VIDEO STREAMING PLATFORM                            │\n' +
      '├─────────────────────────────────────────────────────────────────────────────┤\n' +
      '│                                                                             │\n' +
      '│  UPLOAD PIPELINE:                                                           │\n' +
      '│  ┌────────┐   Resumable    ┌──────────────┐   Event    ┌────────────────┐  │\n' +
      '│  │ Client ├───Upload──────►│Object Storage├──────────►│ Transcoding    │  │\n' +
      '│  │(Creator)│  (pre-signed) │  (Raw video)  │  (S3/SQS) │ Pipeline       │  │\n' +
      '│  └────────┘               └──────────────┘           │                │  │\n' +
      '│                                                        │ ┌────────────┐│  │\n' +
      '│                                                        │ │   Split    ││  │\n' +
      '│                                                        │ │ (by GOP)   ││  │\n' +
      '│                                                        │ └─────┬──────┘│  │\n' +
      '│                                                        │       │       │  │\n' +
      '│                                                        │ ┌─────▼──────┐│  │\n' +
      '│                                                        │ │  Parallel  ││  │\n' +
      '│                                                        │ │  FFmpeg    ││  │\n' +
      '│                                                        │ │  Workers   ││  │\n' +
      '│                                                        │ │ (1000s)    ││  │\n' +
      '│                                                        │ └─────┬──────┘│  │\n' +
      '│                                                        │       │       │  │\n' +
      '│                                                        │ ┌─────▼──────┐│  │\n' +
      '│                                                        │ │   Merge    ││  │\n' +
      '│                                                        │ │ (per qual) ││  │\n' +
      '│                                                        │ └─────┬──────┘│  │\n' +
      '│                                                        └───────┼───────┘  │\n' +
      '│                                                                │          │\n' +
      '│                                                        ┌───────▼────────┐ │\n' +
      '│                                                        │ Tiered Storage │ │\n' +
      '│                                                        │ Hot:  SSD/S3   │ │\n' +
      '│                                                        │ Warm: S3-IA    │ │\n' +
      '│                                                        │ Cold: Glacier  │ │\n' +
      '│                                                        └───────┬────────┘ │\n' +
      '│                                                                │          │\n' +
      '│  PLAYBACK:                                                     │          │\n' +
      '│  ┌────────┐  ┌───────────┐  ┌──────────────┐  ┌──────────┐    │          │\n' +
      '│  │ Client ├─►│ CDN Edge  ├─►│ Origin Shield├─►│ Storage  │◄───┘          │\n' +
      '│  │(Viewer)│  │  (PoP)    │  │ (Mid-tier)   │  │ (Tiered) │               │\n' +
      '│  └────────┘  └───────────┘  └──────────────┘  └──────────┘               │\n' +
      '│       │       HLS/DASH        Cache 99%+                                  │\n' +
      '│       │       ABR 144p-4K     hit ratio                                   │\n' +
      '│       │                                                                    │\n' +
      '│  METADATA & RECOMMENDATIONS:                                              │\n' +
      '│  ┌────┴───┐  ┌────────────┐  ┌────────────────────────────────┐           │\n' +
      '│  │  App   ├─►│   Vitess   │  │      ML Pipeline               │           │\n' +
      '│  │ Server │  │(MySQL shards│  │ User Activity ──► Training     │           │\n' +
      '│  │        │◄─┤ auto-split) │  │ ──► Two-Tower Model           │           │\n' +
      '│  │        │  └────────────┘  │ ──► Candidate Gen + Ranking    │           │\n' +
      '│  │        │◄─────────────────┤ ──► Rec Service (cached)       │           │\n' +
      '│  └────────┘                  └────────────────────────────────┘           │\n' +
      '│                                                                             │\n' +
      '└─────────────────────────────────────────────────────────────────────────────┘',
  },

  capacityEstimates: {
    default: [
      {
        label: 'DAU',
        value: '800M',
        formula: '2B registered users × ~40% daily active = 800M DAU',
      },
      {
        label: 'Video watches/sec',
        value: '~46K RPS',
        formula: '800M DAU × 5 videos/day / 86 400 sec ≈ 46 296 ≈ ~46K RPS',
      },
      {
        label: 'Video uploads/day',
        value: '~720K videos/day',
        formula: '500 hours of video uploaded per minute × 60 min = 30K hours/day ≈ ~720K videos/day (avg ~2.5 min each)',
      },
      {
        label: 'Raw upload storage/day',
        value: '~360 TB/day',
        formula: '720K videos × avg 500 MB raw = ~360 TB/day',
      },
      {
        label: 'Transcoded storage/day',
        value: '~1 PB/day',
        formula: '360 TB raw × 3× (multiple quality renditions: 144p–4K) = ~1 PB/day',
      },
      {
        label: 'CDN bandwidth (peak)',
        value: '~230 Gbps',
        formula: '46K concurrent streams × avg 5 Mbps adaptive bitrate = ~230 Gbps',
      },
      {
        label: 'Transcoding compute',
        value: '7.2M compute-min/day',
        formula: '720K videos × avg 10 min to transcode = 7.2M compute-minutes/day',
      },
    ],
  },
};
