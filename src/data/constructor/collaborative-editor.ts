import type { Scenario } from './types';

export const collaborativeEditorScenario: Scenario = {
  id: 'collaborative-editor',
  title: 'Collaborative Editor (Google Docs)',
  difficulty: 'senior',
  description:
    'Спроектируйте real-time collaborative document editor, аналогичный Google Docs, поддерживающий миллионы одновременно редактируемых документов. Система должна обеспечивать совместное редактирование в реальном времени, разрешение конфликтов, версионирование и работу при нестабильном соединении.',

  steps: [
    // ── Step 1: Requirements ──────────────────────────────────────────
    {
      id: 'ce-requirements',
      title: 'Требования к редактору',
      description:
        'Определите типы контента и модель совместной работы. Эти решения влияют на сложность алгоритмов конфликтов и архитектуру хранения.',
      decisions: [
        {
          id: 'ce-doc-type',
          category: 'Тип контента',
          question: 'Какой тип документов должен поддерживать редактор?',
          multiSelect: true,
          options: [
            {
              id: 'rich-text',
              label: 'Rich text (форматирование)',
              description:
                'Текст с форматированием: жирный, курсив, заголовки, списки. Базовый тип для документов.',
              pros: [
                'Покрывает основной use-case документов',
                'Хорошо изученные алгоритмы OT/CRDT для текста',
                'Относительно простая модель данных',
              ],
              cons: [
                'Форматирование усложняет операции (не просто вставка/удаление символов)',
                'Нужна нормализация разметки при слиянии',
              ],
              bestWhen: 'Основной сценарий — текстовые документы с форматированием',
              impact: { latency: 0, scalability: 0, consistency: -1, complexity: 1, cost: 0 },
            },
            {
              id: 'tables',
              label: 'Tables / spreadsheets',
              description:
                'Таблицы с ячейками, формулами и сортировкой. Требуют отдельной модели конфликтов для двумерной структуры.',
              pros: [
                'Расширяет функциональность для бизнес-пользователей',
                'Можно переиспользовать spreadsheet-движок',
              ],
              cons: [
                'Существенно усложняет модель конфликтов (строки, столбцы, ячейки)',
                'Формулы создают зависимости между ячейками',
                'Увеличивает размер операций и нагрузку на синхронизацию',
              ],
              bestWhen: 'Пользователям нужны таблицы внутри документов',
              impact: { latency: -1, scalability: -1, consistency: -1, complexity: -2, cost: -1 },
            },
            {
              id: 'media',
              label: 'Embedded media (images, drawings)',
              description:
                'Встроенные изображения, рисунки, диаграммы. Медиа хранятся отдельно, в документе — ссылки.',
              pros: [
                'Делает документы более выразительными',
                'Медиа можно хранить в object storage (S3) отдельно от текста',
              ],
              cons: [
                'Увеличивает размер документа и время загрузки',
                'Нужна отдельная система хранения бинарных данных',
                'Рисунки (canvas) требуют собственного CRDT/OT',
              ],
              bestWhen: 'Документы содержат визуальный контент, диаграммы',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: -1, cost: -2 },
            },
            {
              id: 'comments',
              label: 'Comments / suggestions',
              description:
                'Комментарии, привязанные к фрагментам текста, и режим suggestions (предложения правок).',
              pros: [
                'Критически важно для командной работы и review-процесса',
                'Комментарии проще синхронизировать, чем основной текст',
              ],
              cons: [
                'Привязка к позициям в тексте усложняется при конкурентных правках',
                'Suggestions — по сути вторая ветка документа',
                'Нужна система уведомлений',
              ],
              bestWhen: 'Документ используется в review/approval workflow',
              impact: { latency: 0, scalability: 0, consistency: -1, complexity: -1, cost: -1 },
            },
          ],
        },
        {
          id: 'ce-collab-mode',
          category: 'Режим совместной работы',
          question: 'Какой режим совместной работы над документами?',
          options: [
            {
              id: 'real-time',
              label: 'Real-time co-editing (Google Docs)',
              description:
                'Все пользователи видят изменения друг друга в реальном времени. Курсоры и выделения других пользователей отображаются мгновенно.',
              pros: [
                'Лучший UX — пользователи видят друг друга в реальном времени',
                'Стандарт индустрии (Google Docs, Notion, Figma)',
                'Минимизирует конфликты за счёт awareness',
              ],
              cons: [
                'Требует постоянного соединения (WebSocket)',
                'Сложные алгоритмы разрешения конфликтов (OT/CRDT)',
                'Высокая нагрузка на сервер при большом числе соавторов',
              ],
              bestWhen: 'Основной сценарий — совместная работа команды в реальном времени',
              impact: { latency: 2, scalability: -1, consistency: -1, complexity: -2, cost: -1 },
            },
            {
              id: 'turn-based',
              label: 'Turn-based locking (classic)',
              description:
                'Документ или его секция блокируется на время редактирования одним пользователем. Классический подход SharePoint/Word.',
              pros: [
                'Простая реализация — нет конфликтов по определению',
                'Гарантированная консистентность',
                'Минимальная нагрузка на сервер',
              ],
              cons: [
                'Плохой UX — пользователи ждут разблокировки',
                'Проблема «забытых блокировок» (lock timeout)',
                'Не масштабируется для больших команд',
              ],
              bestWhen: 'Документы редактируются последовательно, совместная работа минимальна',
              impact: { latency: 0, scalability: 1, consistency: 2, complexity: 2, cost: 1 },
            },
            {
              id: 'branching',
              label: 'Branching / merging (Git-like)',
              description:
                'Каждый пользователь работает в своей ветке, затем изменения мержатся. Подход Git/Notion для некоторых сценариев.',
              pros: [
                'Полная свобода — каждый работает независимо',
                'Хорошо работает для offline-сценариев',
                'Полная история изменений',
              ],
              cons: [
                'Merge-конфликты требуют ручного разрешения',
                'Сложный UX для нетехнических пользователей',
                'Нет real-time awareness (не видно, что делают другие)',
              ],
              bestWhen: 'Документы с длинными циклами правок, техническая аудитория',
              impact: { latency: 1, scalability: 2, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
      ],
      tip: 'Google Docs использует real-time co-editing. Notion — near-real-time с блочной моделью. Выбор режима определяет всю дальнейшую архитектуру.',
    },

    // ── Step 2: Conflict Resolution ───────────────────────────────────
    {
      id: 'ce-conflicts',
      title: 'Разрешение конфликтов',
      description:
        'Ключевое архитектурное решение: как разрешать конфликты при одновременном редактировании. OT и CRDT — два фундаментально разных подхода.',
      decisions: [
        {
          id: 'ce-algorithm',
          category: 'Алгоритм конфликтов',
          question: 'Какой алгоритм разрешения конфликтов использовать?',
          options: [
            {
              id: 'ot',
              label: 'Operational Transformation (OT)',
              description:
                'Каждая правка — операция (insert/delete). Сервер трансформирует операции относительно друг друга. Используется Google Docs с 2006 года.',
              pros: [
                'Проверен в продакшене Google Docs (миллиарды документов)',
                'Компактные операции — малый overhead по сети',
                'Гарантирует convergence при наличии центрального сервера',
                'Хорошо работает с форматированием (rich text OT)',
              ],
              cons: [
                'Требует центрального сервера для координации (single point)',
                'Сложная математика трансформаций, трудно реализовать корректно',
                'Не работает в P2P-режиме без дополнительных протоколов',
                'Порядок операций критичен — сервер должен сериализовать все правки',
              ],
              bestWhen: 'Серверная архитектура, нужна проверенная технология для rich text',
              impact: { latency: 1, scalability: -1, consistency: 2, complexity: -2, cost: 0 },
              capacityImpact: [
                {
                  label: 'Operation log storage/day',
                  value: '~43 TB/day',
                  formula: '10M ops/sec × 86 400 sec × 50 bytes per OT op = ~43.2 TB/day (compact operations)',
                },
                {
                  label: 'Bandwidth',
                  value: '~1 GB/s',
                  formula: '10M ops/sec × 50 bytes × 2 (broadcast) = ~1 GB/s',
                },
              ],
            },
            {
              id: 'crdt',
              label: 'CRDT (Conflict-free Replicated Data Types)',
              description:
                'Структура данных, которая гарантирует convergence без центрального сервера. Используется Figma, Yjs, Automerge.',
              pros: [
                'Работает в P2P-режиме — не нужен центральный сервер',
                'Нативная поддержка offline editing',
                'Математически доказанная convergence',
                'Отличные open-source библиотеки (Yjs, Automerge)',
              ],
              cons: [
                'Больший metadata overhead (vector clocks, tombstones)',
                'Документ растёт со временем — нужна garbage collection',
                'Сложнее реализовать undo/redo корректно',
                'Порядок символов может быть неинтуитивным при конфликтах',
              ],
              bestWhen: 'Нужен offline-first, P2P или используете Yjs/Automerge',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -2, cost: 1 },
              capacityImpact: [
                {
                  label: 'Operation log storage/day',
                  value: '~172 TB/day',
                  formula: '10M ops/sec × 86 400 sec × 200 bytes per CRDT op (vector clocks + tombstones) = ~172.8 TB/day (4× OT)',
                },
                {
                  label: 'Bandwidth',
                  value: '~4 GB/s',
                  formula: '10M ops/sec × 200 bytes × 2 (broadcast) = ~4 GB/s',
                },
                {
                  label: 'Document storage',
                  value: '~25 TB',
                  formula: '50M docs × avg 500 KB (CRDT metadata: tombstones, vector clocks inflate doc 5×) = ~25 TB',
                },
              ],
            },
            {
              id: 'lww',
              label: 'Last-write-wins (LWW)',
              description:
                'Последняя запись побеждает. Простейший подход — по таймстампу определяется победитель.',
              pros: [
                'Тривиальная реализация',
                'Не требует сложных алгоритмов',
                'Минимальный overhead по сети и хранению',
              ],
              cons: [
                'Теряет данные — правки одного пользователя просто перезаписываются',
                'Непредсказуемый результат при конкурентных правках',
                'Не подходит для реального совместного редактирования',
                'Зависит от синхронизации часов между клиентами',
              ],
              bestWhen: 'Простые формы или конфигурации, где конфликты редки',
              impact: { latency: 2, scalability: 2, consistency: -2, complexity: 2, cost: 2 },
            },
            {
              id: 'manual',
              label: 'Manual conflict resolution',
              description:
                'При конфликте пользователю показываются обе версии для ручного разрешения (как Git merge conflicts).',
              pros: [
                'Пользователь контролирует результат — нет потери данных',
                'Простая серверная реализация',
                'Подходит для сложных структурных конфликтов',
              ],
              cons: [
                'Ужасный UX — прерывает работу для разрешения конфликтов',
                'Не масштабируется при частых правках',
                'Требует понимания от пользователя (diff/merge)',
                'Не работает в real-time сценарии',
              ],
              bestWhen: 'Редкие конфликты, техническая аудитория (Git-like workflow)',
              impact: { latency: -1, scalability: 0, consistency: 1, complexity: 1, cost: 1 },
            },
          ],
        },
        {
          id: 'ce-granularity',
          category: 'Гранулярность операций',
          question: 'На каком уровне гранулярности работают операции?',
          options: [
            {
              id: 'character-level',
              label: 'Character-level (посимвольно)',
              description:
                'Каждый символ — отдельная операция insert/delete. Максимальная точность, используется в Google Docs.',
              pros: [
                'Максимальная точность — никогда не теряются символы',
                'Плавное отображение набора текста другими пользователями',
                'Минимальные конфликты (два человека редко правят один символ)',
              ],
              cons: [
                'Большое количество операций (каждая буква = операция)',
                'Высокая нагрузка на сеть при быстром наборе',
                'Нужна оптимизация: batching, компрессия операций',
              ],
              bestWhen: 'Real-time редактирование rich text документов',
              impact: { latency: -1, scalability: -1, consistency: 2, complexity: -1, cost: -1 },
              capacityImpact: [
                {
                  label: 'Operations per second',
                  value: '50M ops/sec',
                  formula: '5M active docs × avg 5 keystrokes/sec per active user × 2 users/doc = 50M ops/sec (5× base)',
                },
                {
                  label: 'Operation log storage/day',
                  value: '~216 TB/day',
                  formula: '50M ops/sec × 86 400 sec × 50 bytes = ~216 TB/day',
                },
                {
                  label: 'Bandwidth',
                  value: '~5 GB/s',
                  formula: '50M ops/sec × 50 bytes × 2 (broadcast) = ~5 GB/s',
                },
              ],
            },
            {
              id: 'word-level',
              label: 'Word-level (пословно)',
              description:
                'Операции на уровне слов. Баланс между точностью и количеством операций.',
              pros: [
                'Меньше операций, чем character-level',
                'Достаточная точность для большинства сценариев',
                'Проще реализовать diff/merge',
              ],
              cons: [
                'Менее плавное отображение (текст появляется пословно)',
                'Конфликты при одновременном редактировании одного слова',
                'Нужна чёткая определение границ слов (пробелы, пунктуация)',
              ],
              bestWhen: 'Редактирование с умеренной конкурентностью',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'block-level',
              label: 'Block-level (параграфы)',
              description:
                'Операции на уровне параграфов или блоков. Подход Notion — каждый блок редактируется независимо.',
              pros: [
                'Минимальное количество операций',
                'Хорошо ложится на блочные редакторы (Notion, Confluence)',
                'Простая модель конфликтов',
              ],
              cons: [
                'Два пользователя не могут одновременно редактировать один параграф',
                'Потеря данных при конкурентных правках одного блока',
                'Менее гранулярное отображение чужих правок',
              ],
              bestWhen: 'Блочные редакторы типа Notion, где каждый блок — независимая единица',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 1, cost: 1 },
              capacityImpact: [
                {
                  label: 'Operations per second',
                  value: '1M ops/sec',
                  formula: '5M active docs × avg 0.1 block ops/sec per user × 2 users/doc = 1M ops/sec (10× fewer than character-level)',
                },
                {
                  label: 'Operation log storage/day',
                  value: '~17 TB/day',
                  formula: '1M ops/sec × 86 400 sec × 200 bytes per block op (includes block content) = ~17.3 TB/day',
                },
                {
                  label: 'Bandwidth',
                  value: '~400 MB/s',
                  formula: '1M ops/sec × 200 bytes × 2 (broadcast) = ~400 MB/s',
                },
              ],
            },
          ],
        },
      ],
      tip: 'Это ключевое решение всего проекта. Google Docs использует OT на уровне символов. Figma — CRDT. Notion — блочный подход. OT требует центрального сервера, CRDT допускает P2P. Если вы не пишете свою библиотеку — рассмотрите Yjs (CRDT).',
    },

    // ── Step 3: Real-time Communication ───────────────────────────────
    {
      id: 'ce-realtime',
      title: 'Real-time коммуникация',
      description:
        'Выберите транспорт и модель синхронизации для передачи операций между клиентами. Это определяет задержку, масштабируемость и архитектуру серверов.',
      decisions: [
        {
          id: 'ce-transport',
          category: 'Транспорт',
          question: 'Какой транспорт для real-time синхронизации?',
          options: [
            {
              id: 'websocket',
              label: 'WebSocket',
              description:
                'Полнодуплексное соединение поверх TCP. Стандарт для real-time приложений: Google Docs, Slack, Figma.',
              pros: [
                'Низкая задержка — full-duplex, нет HTTP overhead',
                'Поддерживается всеми браузерами и платформами',
                'Хорошая экосистема (Socket.IO, ws, uWebSockets)',
                'Поддержка binary frames для компактных операций',
              ],
              cons: [
                'Stateful-соединения — усложняет балансировку нагрузки',
                'Нужна обработка reconnect, heartbeat, backpressure',
                'Sticky sessions или Redis pub/sub для горизонтального масштабирования',
              ],
              bestWhen: 'Серверная архитектура с real-time co-editing',
              impact: { latency: 2, scalability: -1, consistency: 1, complexity: 0, cost: 0 },
            },
            {
              id: 'webrtc',
              label: 'WebRTC (peer-to-peer)',
              description:
                'Прямое P2P-соединение между браузерами. Используется в некоторых CRDT-реализациях (Yjs WebRTC provider).',
              pros: [
                'Минимальная задержка (нет промежуточного сервера)',
                'Снижает нагрузку на серверы',
                'Работает без бэкенда (с signaling-сервером для начального соединения)',
              ],
              cons: [
                'NAT traversal — не всегда удаётся установить P2P-соединение',
                'Не масштабируется на много участников (mesh topology)',
                'Нет центральной точки для persistence и авторизации',
                'Сложная отладка сетевых проблем',
              ],
              bestWhen: 'CRDT-based редактор с малым числом участников, P2P-first',
              impact: { latency: 2, scalability: -2, consistency: -1, complexity: -2, cost: 2 },
            },
            {
              id: 'sse-rest',
              label: 'Server-Sent Events + REST',
              description:
                'SSE для пуш-обновлений от сервера, REST для отправки операций. Однонаправленный поток + запросы.',
              pros: [
                'Простая реализация — HTTP-based, работает через CDN/proxy',
                'Автоматический reconnect в SSE',
                'Совместим с существующей HTTP-инфраструктурой',
              ],
              cons: [
                'Полудуплекс — каждая операция клиента = HTTP-запрос',
                'Выше задержка из-за HTTP overhead на отправку',
                'Ограничение на количество SSE-соединений в браузере (6 на домен)',
                'Не подходит для высокочастотных операций (быстрый набор)',
              ],
              bestWhen: 'Простой редактор с умеренной частотой правок, нет WebSocket-инфраструктуры',
              impact: { latency: -1, scalability: 0, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'grpc-streaming',
              label: 'gRPC streaming',
              description:
                'Bidirectional streaming через gRPC (HTTP/2). Подходит для server-to-server коммуникации.',
              pros: [
                'Эффективная сериализация (Protobuf)',
                'Полнодуплексный стриминг',
                'Строгая типизация контрактов',
                'Мультиплексирование через HTTP/2',
              ],
              cons: [
                'Ограниченная поддержка в браузерах (нужен gRPC-Web прокси)',
                'Более сложная инфраструктура',
                'Менее зрелая экосистема для real-time в браузере',
                'Envoy/grpc-web proxy добавляет точку отказа',
              ],
              bestWhen: 'Внутренние сервисы, мобильные клиенты с gRPC, server-to-server sync',
              impact: { latency: 1, scalability: 0, consistency: 1, complexity: -1, cost: -1 },
            },
          ],
        },
        {
          id: 'ce-sync-model',
          category: 'Модель синхронизации',
          question: 'Какая модель синхронизации между клиентами?',
          options: [
            {
              id: 'client-server',
              label: 'Client-server (все операции через сервер)',
              description:
                'Все операции отправляются на сервер, который трансформирует/мержит и рассылает результат. Подход Google Docs.',
              pros: [
                'Сервер — единая точка правды (consistency)',
                'Легко реализовать авторизацию и аудит',
                'Проще дебажить — все операции проходят через одну точку',
                'Гарантированная персистентность',
              ],
              cons: [
                'Сервер — bottleneck и single point of failure',
                'Задержка минимум RTT до сервера',
                'Нужно масштабировать серверную инфраструктуру',
              ],
              bestWhen: 'OT-based редактор, нужна строгая авторизация и аудит',
              impact: { latency: 0, scalability: -1, consistency: 2, complexity: 0, cost: -1 },
            },
            {
              id: 'peer-to-peer',
              label: 'Peer-to-peer (прямая синхронизация)',
              description:
                'Клиенты синхронизируются напрямую, без центрального сервера. Требует CRDT.',
              pros: [
                'Минимальная задержка (нет сервера в цепочке)',
                'Нет серверных расходов на синхронизацию',
                'Работает offline и в локальной сети',
              ],
              cons: [
                'Нет центральной персистентности — данные у клиентов',
                'Сложная авторизация (нет точки контроля)',
                'Масштабирование: mesh из N клиентов = O(N^2) соединений',
                'Потеря данных если все клиенты offline одновременно',
              ],
              bestWhen: 'Локальные инструменты, offline-first, малые команды',
              impact: { latency: 2, scalability: -2, consistency: -1, complexity: -1, cost: 2 },
            },
            {
              id: 'hybrid',
              label: 'Hybrid (P2P + server for persistence)',
              description:
                'Клиенты синхронизируются P2P внутри сессии, сервер отвечает за persistence и долгосрочное хранение.',
              pros: [
                'Низкая задержка в рамках сессии (P2P)',
                'Данные не теряются (сервер для persistence)',
                'Работает при отключении сервера (P2P продолжает)',
              ],
              cons: [
                'Двойная сложность: и P2P, и серверная синхронизация',
                'Нужно разрешать конфликты при reconnect к серверу',
                'Тестирование значительно усложняется',
                'Два канала синхронизации нужно координировать',
              ],
              bestWhen: 'CRDT-редактор, нужна и низкая задержка, и persistence',
              impact: { latency: 1, scalability: 0, consistency: 0, complexity: -2, cost: 0 },
            },
          ],
        },
      ],
      tip: 'WebSocket + client-server — стандартный и проверенный подход (Google Docs). WebRTC + P2P хорош для CRDT, но усложняет авторизацию и persistence. Yjs поддерживает оба варианта через providers.',
    },

    // ── Step 4: Storage & Persistence ─────────────────────────────────
    {
      id: 'ce-storage',
      title: 'Хранение и персистентность',
      description:
        'Как хранить документы и их историю. Баланс между скоростью загрузки, объёмом хранения и полнотой истории.',
      decisions: [
        {
          id: 'ce-doc-storage',
          category: 'Хранение документов',
          question: 'Как хранить документы?',
          options: [
            {
              id: 'full-snapshots',
              label: 'Full document snapshots (периодические)',
              description:
                'Документ сохраняется целиком при каждом изменении или периодически. Простой подход.',
              pros: [
                'Простая реализация — просто сохраняем JSON/HTML',
                'Быстрая загрузка — читаем последний snapshot',
                'Легко делать бэкапы',
              ],
              cons: [
                'Огромный объём хранения (каждая версия = полная копия)',
                'Нет гранулярной истории изменений',
                'Потеря данных между snapshots при сбое',
                'Конфликты при одновременной записи snapshot',
              ],
              bestWhen: 'Простой редактор без real-time, редкие правки',
              impact: { latency: 1, scalability: -1, consistency: 0, complexity: 2, cost: -2 },
            },
            {
              id: 'oplog',
              label: 'Operation log (append-only)',
              description:
                'Хранится только лог операций. Документ восстанавливается путём replay всех операций от начала.',
              pros: [
                'Полная история: каждая правка записана',
                'Append-only — быстрая запись, нет конфликтов',
                'Можно восстановить документ на любой момент времени',
                'Естественный формат для OT/CRDT операций',
              ],
              cons: [
                'Медленная загрузка — replay всех операций от начала',
                'Лог растёт бесконечно без compaction',
                'Восстановление длинного документа может занять секунды',
              ],
              bestWhen: 'Нужна полная история, допустима медленная первая загрузка',
              impact: { latency: -1, scalability: 0, consistency: 2, complexity: -1, cost: -1 },
            },
            {
              id: 'snapshot-plus-oplog',
              label: 'Snapshot + operation log (hybrid)',
              description:
                'Периодические snapshots + operation log между ними. При загрузке: последний snapshot + replay недавних операций. Подход Google Docs.',
              pros: [
                'Быстрая загрузка (snapshot + малый oplog)',
                'Полная история (из oplog)',
                'Bounded время восстановления',
                'Compaction через создание нового snapshot',
              ],
              cons: [
                'Сложнее реализовать — два механизма хранения',
                'Нужна стратегия создания snapshots (по времени, по числу операций)',
                'Snapshot и oplog нужно держать консистентными',
              ],
              bestWhen: 'Продакшен-система: баланс между скоростью и полнотой истории',
              impact: { latency: 1, scalability: 1, consistency: 1, complexity: -1, cost: -1 },
            },
            {
              id: 'crdt-state',
              label: 'CRDT state serialization',
              description:
                'Сериализация полного CRDT-состояния (включая метаданные: vector clocks, tombstones). Формат Yjs/Automerge.',
              pros: [
                'Нативный формат для CRDT — загрузка/сохранение без конвертации',
                'Включает всю метаинформацию для merge',
                'Поддерживается из коробки в Yjs/Automerge',
              ],
              cons: [
                'Размер: CRDT-метаданные могут быть больше самого документа',
                'Привязка к конкретной CRDT-библиотеке',
                'Нужна garbage collection для tombstones',
                'Сложно мигрировать на другую CRDT-реализацию',
              ],
              bestWhen: 'Используется Yjs/Automerge, нужна нативная поддержка merge',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: 0, cost: -1 },
            },
          ],
        },
        {
          id: 'ce-versioning',
          category: 'Версионирование',
          question: 'Какая система версионирования документов?',
          options: [
            {
              id: 'no-versioning',
              label: 'Без версионирования (только последняя версия)',
              description:
                'Хранится только актуальная версия документа. Нет истории изменений.',
              pros: [
                'Минимальный объём хранения',
                'Простая реализация',
                'Быстрые операции чтения/записи',
              ],
              cons: [
                'Невозможно откатить изменения',
                'Нет аудита — кто что менял',
                'Потеря данных при ошибочных правках необратима',
              ],
              bestWhen: 'Простые заметки, черновики, где версионирование не нужно',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 2, cost: 2 },
            },
            {
              id: 'auto-version-history',
              label: 'Автоматическая версионная история (Google Docs)',
              description:
                'Система автоматически сохраняет версии с определённым интервалом. Пользователь может просматривать и восстанавливать прошлые версии.',
              pros: [
                'Прозрачно для пользователя — не нужно думать о сохранении',
                'Аудит: видно кто, когда и что менял',
                'Возможность восстановления на любой момент',
                'Стандарт индустрии (Google Docs, Notion)',
              ],
              cons: [
                'Растёт объём хранения со временем',
                'Нужна политика retention (сколько хранить старые версии)',
                'UI для просмотра истории требует diff-визуализации',
              ],
              bestWhen: 'Продакшен-документы, нужен аудит и возможность отката',
              impact: { latency: 0, scalability: -1, consistency: 1, complexity: -1, cost: -1 },
            },
            {
              id: 'named-versions',
              label: 'Named versions / checkpoints',
              description:
                'Пользователь вручную создаёт именованные версии (checkpoints). Как «Save As» в классических редакторах.',
              pros: [
                'Пользователь контролирует, какие версии важны',
                'Меньше версий — меньше хранения',
                'Понятная навигация по именованным точкам',
              ],
              cons: [
                'Нет автоматической истории между checkpoints',
                'Пользователь может забыть создать checkpoint',
                'Менее привычно в эпоху auto-save',
              ],
              bestWhen: 'Документы с чёткими milestone (релизы, ревью)',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: 0, cost: 0 },
            },
            {
              id: 'git-like-branching',
              label: 'Git-like branching (полное ветвление)',
              description:
                'Полная система ветвлений и мержей, как в Git. Каждый пользователь может создать ветку.',
              pros: [
                'Максимальная гибкость — параллельные версии',
                'Знакомая модель для разработчиков',
                'Поддержка сложных workflow (review, approval)',
              ],
              cons: [
                'Очень сложная реализация для rich-text документов',
                'Merge-конфликты требуют UI для разрешения',
                'Непонятно для нетехнических пользователей',
                'Значительный overhead хранения',
              ],
              bestWhen: 'Техническая документация, юридические документы с параллельными правками',
              impact: { latency: 0, scalability: -1, consistency: 1, complexity: -2, cost: -2 },
            },
          ],
        },
      ],
      tip: 'Google Docs использует snapshot + operation log с автоматической версионной историей. Snapshots создаются при достижении порога операций (обычно несколько сотен). Это даёт и быструю загрузку, и полную историю.',
    },

    // ── Step 5: Scaling ───────────────────────────────────────────────
    {
      id: 'ce-scaling',
      title: 'Масштабирование',
      description:
        'Как масштабировать систему на миллионы документов и тысячи одновременных сессий. Управление stateful WebSocket-соединениями — ключевая проблема.',
      decisions: [
        {
          id: 'ce-session-mgmt',
          category: 'Управление сессиями',
          question: 'Как управлять editing sessions?',
          options: [
            {
              id: 'sticky-sessions',
              label: 'Sticky sessions (один сервер на документ)',
              description:
                'Все пользователи, редактирующие один документ, подключаются к одному серверу. Сервер держит OT/CRDT-состояние в памяти.',
              pros: [
                'Все операции для документа на одном сервере — быстрые трансформации',
                'Не нужна распределённая координация для OT',
                'Простая модель: один сервер = одна правда для документа',
                'Низкая задержка — нет round-trip между серверами',
              ],
              cons: [
                'Hot-spot: популярный документ перегружает один сервер',
                'При падении сервера все сессии теряются (нужен failover)',
                'Нужен consistent hashing для маршрутизации',
                'Сложнее горизонтальное масштабирование',
              ],
              bestWhen: 'OT-архитектура, серверное состояние обязательно',
              impact: { latency: 1, scalability: -1, consistency: 2, complexity: 0, cost: 0 },
            },
            {
              id: 'session-service',
              label: 'Session service с координацией',
              description:
                'Отдельный сервис управляет сессиями. Состояние документа хранится в распределённом хранилище (Redis). Любой сервер может обслуживать любой документ.',
              pros: [
                'Горизонтальное масштабирование — нет привязки к серверу',
                'Failover: при падении сервера клиент переключается на другой',
                'Равномерное распределение нагрузки',
              ],
              cons: [
                'Задержка: каждая операция = round-trip к Redis/хранилищу',
                'Распределённая координация — risk of split-brain',
                'Сложнее гарантировать порядок операций для OT',
                'Выше стоимость инфраструктуры (Redis cluster)',
              ],
              bestWhen: 'Нужна высокая доступность и горизонтальное масштабирование',
              impact: { latency: -1, scalability: 2, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'serverless',
              label: 'Serverless (каждая операция — функция)',
              description:
                'Каждая операция обрабатывается независимой serverless-функцией. Состояние документа в базе.',
              pros: [
                'Автоматическое масштабирование до нуля и обратно',
                'Платите только за реальные операции',
                'Нет управления серверами',
              ],
              cons: [
                'Cold start — непредсказуемая задержка (десятки-сотни мс)',
                'Нет долгоживущих соединений (WebSocket требует gateway)',
                'Stateless — нет серверного OT-состояния в памяти',
                'Не подходит для real-time co-editing с OT',
              ],
              bestWhen: 'CRDT-архитектура, низкий трафик, cost-sensitive',
              impact: { latency: -2, scalability: 2, consistency: -1, complexity: 1, cost: 2 },
            },
          ],
        },
        {
          id: 'ce-large-docs',
          category: 'Большие документы',
          question: 'Как обрабатывать большие документы?',
          options: [
            {
              id: 'full-load',
              label: 'Загрузка полного документа',
              description:
                'Весь документ загружается в память клиента при открытии. Простой, но не масштабируется.',
              pros: [
                'Простая реализация — один fetch, весь документ',
                'Мгновенный скролл и поиск (всё в памяти)',
                'Нет сложностей с partial loading',
              ],
              cons: [
                'Медленная начальная загрузка для больших документов',
                'Высокое потребление памяти на клиенте',
                'Не работает для документов на сотни страниц',
              ],
              bestWhen: 'Небольшие документы (до 10-20 страниц)',
              impact: { latency: -1, scalability: -2, consistency: 1, complexity: 2, cost: 0 },
            },
            {
              id: 'lazy-loading',
              label: 'Lazy loading (viewport-based)',
              description:
                'Загружается только видимая часть документа + буфер. Остальное подгружается при скролле. Подход Google Docs.',
              pros: [
                'Быстрая начальная загрузка — только видимая область',
                'Работает с документами любого размера',
                'Экономия памяти на клиенте',
              ],
              cons: [
                'Сложная реализация: отслеживание viewport, prefetch',
                'Задержка при быстром скролле (подгрузка)',
                'Поиск по документу требует серверного индекса',
                'Операции OT/CRDT нужно применять и к незагруженным частям',
              ],
              bestWhen: 'Продакшен-система, документы разного размера',
              impact: { latency: 1, scalability: 1, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'chunking',
              label: 'Document chunking / pagination',
              description:
                'Документ разбивается на фиксированные чанки (по страницам). Каждый чанк — независимая единица.',
              pros: [
                'Предсказуемый размер загрузки (фиксированные чанки)',
                'Чанки можно кэшировать независимо',
                'Параллельная загрузка чанков',
              ],
              cons: [
                'Элементы на границе чанков (таблицы, изображения)',
                'Менее плавный UX, чем lazy loading',
                'Нумерация страниц может не совпадать с чанками',
              ],
              bestWhen: 'Структурированные документы с чёткими границами (страницы)',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: -1, cost: 0 },
            },
            {
              id: 'virtualized',
              label: 'Virtualized rendering (VS Code-style)',
              description:
                'Весь документ в памяти, но рендерятся только видимые элементы. Подход VS Code, используется в Google Docs для длинных документов.',
              pros: [
                'Плавный скролл — DOM содержит только видимые элементы',
                'Быстрый поиск — весь документ в памяти',
                'Нет задержек при скролле (данные уже загружены)',
              ],
              cons: [
                'Полная загрузка документа — медленный старт',
                'Высокое потребление памяти (данные в памяти, но не в DOM)',
                'Сложная реализация виртуализации для rich text',
                'Не решает проблему начальной загрузки',
              ],
              bestWhen: 'Документы средней длины, нужен быстрый скролл и поиск',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
      ],
      tip: 'Google Docs использует sticky sessions для OT (один сервер координирует все операции документа) и lazy loading + virtualized rendering для больших документов. При CRDT-архитектуре sticky sessions менее критичны.',
    },

    // ── Step 6: Reliability ───────────────────────────────────────────
    {
      id: 'ce-reliability',
      title: 'Надёжность и права доступа',
      description:
        'Обеспечение работы при сбоях, поддержка offline и модель прав доступа. Критично для enterprise-использования.',
      decisions: [
        {
          id: 'ce-offline',
          category: 'Offline поддержка',
          question: 'Какой уровень поддержки offline editing?',
          options: [
            {
              id: 'online-only',
              label: 'Только online (no offline)',
              description:
                'Редактирование только при наличии соединения. При потере — блокировка UI.',
              pros: [
                'Простая реализация — нет проблем с синхронизацией',
                'Сервер всегда имеет актуальное состояние',
                'Нет конфликтов при reconnect',
              ],
              cons: [
                'Плохой UX при нестабильном интернете',
                'Потеря набранного текста при разрыве соединения',
                'Не работает в поездках, самолётах, метро',
              ],
              bestWhen: 'Внутренний инструмент в офисе со стабильным интернетом',
              impact: { latency: 0, scalability: 1, consistency: 2, complexity: 2, cost: 1 },
            },
            {
              id: 'local-cache-sync',
              label: 'Local cache + sync on reconnect',
              description:
                'Операции кэшируются локально (IndexedDB/Service Worker) и синхронизируются при восстановлении соединения. Подход Google Docs Offline.',
              pros: [
                'Пользователь продолжает работать при кратковременных разрывах',
                'Нет потери данных при разрыве соединения',
                'Автоматическая синхронизация при reconnect',
                'Service Worker кэширует приложение для быстрого запуска',
              ],
              cons: [
                'Возможны конфликты при reconnect (нужен merge)',
                'Ограниченное время offline (размер кэша)',
                'Нужна индикация offline-статуса для пользователя',
                'Тестирование offline-сценариев сложно',
              ],
              bestWhen: 'Продакшен-система: покрытие кратковременных сбоев, мобильные пользователи',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'full-offline-crdt',
              label: 'Full offline с CRDT merge',
              description:
                'Полноценное offline-редактирование. CRDT гарантирует бесконфликтный merge при любом времени offline.',
              pros: [
                'Полная работа без интернета (дни, недели)',
                'Автоматический merge без конфликтов (свойство CRDT)',
                'Отличный UX — пользователь не знает про online/offline',
              ],
              cons: [
                'Требует CRDT — не работает с OT-архитектурой',
                'Результат merge может быть неинтуитивным после долгого offline',
                'Большой объём данных для синхронизации после долгого offline',
                'Нужна стратегия для прав доступа (что если права изменились offline)',
              ],
              bestWhen: 'CRDT-архитектура, пользователи часто offline (мобильные, полевые работники)',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: -2, cost: 0 },
              capacityImpact: [
                {
                  label: 'Document storage',
                  value: '~50 TB',
                  formula: '50M docs × avg 1 MB (full CRDT state with offline branches and tombstones, 10× base) = ~50 TB',
                },
                {
                  label: 'Snapshot storage',
                  value: '~600 TB',
                  formula: '50M docs × 24 snapshots × 500 KB (CRDT snapshots 5× larger) = ~600 TB',
                },
              ],
            },
            {
              id: 'offline-conflict-markers',
              label: 'Offline с маркерами конфликтов',
              description:
                'Работа offline, но при reconnect конфликты показываются пользователю для ручного разрешения (как Git conflict markers).',
              pros: [
                'Пользователь контролирует результат merge',
                'Не теряются данные ни одного пользователя',
                'Работает с любой архитектурой (не только CRDT)',
              ],
              cons: [
                'Прерывает работу для разрешения конфликтов',
                'Плохой UX для нетехнических пользователей',
                'Сложный UI для diff/merge rich text',
                'Может быть много конфликтов после долгого offline',
              ],
              bestWhen: 'Критически важные документы, где автоматический merge неприемлем',
              impact: { latency: 0, scalability: 0, consistency: 1, complexity: -1, cost: 0 },
            },
          ],
        },
        {
          id: 'ce-permissions',
          category: 'Права доступа',
          question: 'Какая модель прав доступа к документам?',
          options: [
            {
              id: 'simple',
              label: 'Simple (owner / editor / viewer)',
              description:
                'Три роли: владелец (полный контроль), редактор (правки), зритель (только чтение). Базовая модель.',
              pros: [
                'Простая и понятная для пользователей',
                'Легко реализовать и проверять',
                'Достаточна для большинства сценариев',
              ],
              cons: [
                'Нет гранулярности — нельзя ограничить доступ к секции',
                'Нет кастомных ролей (commenter, suggester)',
                'Одинаковые права на весь документ',
              ],
              bestWhen: 'Простые документы с небольшой командой',
              impact: { latency: 0, scalability: 1, consistency: 0, complexity: 1, cost: 1 },
            },
            {
              id: 'role-based',
              label: 'Role-based (кастомные роли)',
              description:
                'Настраиваемые роли с произвольным набором разрешений. Администратор создаёт роли под нужды организации.',
              pros: [
                'Гибкость — роли под конкретные workflow',
                'Стандартный RBAC-подход, знакомый администраторам',
                'Масштабируется на большие организации',
              ],
              cons: [
                'Сложнее управление — нужен admin-интерфейс',
                'Роли могут разрастись и стать неуправляемыми',
                'Overhead проверки прав при каждой операции',
              ],
              bestWhen: 'Enterprise с кастомными workflow и организационной структурой',
              impact: { latency: 0, scalability: 0, consistency: 0, complexity: -1, cost: -1 },
            },
            {
              id: 'fine-grained',
              label: 'Fine-grained (per-section / per-element)',
              description:
                'Права на уровне секций, параграфов или отдельных элементов документа. Максимальная гранулярность.',
              pros: [
                'Максимальный контроль — разные части документа для разных людей',
                'Подходит для конфиденциальных документов',
                'Можно скрыть чувствительные секции',
              ],
              cons: [
                'Очень сложная реализация — проверка прав на каждую операцию',
                'Привязка прав к позициям в документе (позиции меняются)',
                'Сложный UX — как показать пользователю, что можно и нельзя',
                'Высокая нагрузка на проверку авторизации',
              ],
              bestWhen: 'Юридические документы, конфиденциальные разделы',
              impact: { latency: -1, scalability: -1, consistency: 0, complexity: -2, cost: -1 },
            },
            {
              id: 'capability-based',
              label: 'Capability-based (share links)',
              description:
                'Доступ через ссылки с встроенными правами. Любой с ссылкой получает указанный доступ. Подход Google Docs share link.',
              pros: [
                'Простой шеринг — достаточно отправить ссылку',
                'Не нужна регистрация для просмотра/редактирования',
                'Гибкость: ссылки с разными правами (view/edit/comment)',
              ],
              cons: [
                'Безопасность: ссылку можно переслать третьим лицам',
                'Сложно отозвать доступ (нужно менять ссылку)',
                'Нет аудита: кто именно редактирует — неизвестно',
                'Не подходит для enterprise с строгими требованиями',
              ],
              bestWhen: 'Публичное или полупубличное использование, быстрый шеринг',
              impact: { latency: 1, scalability: 1, consistency: -1, complexity: 0, cost: 0 },
            },
          ],
        },
      ],
      tip: 'Google Docs комбинирует simple roles (owner/editor/viewer/commenter) с capability-based share links. Это покрывает и enterprise, и casual use-cases. Offline реализован через Service Worker + local cache.',
    },
  ],

  // ── Reference Solution ────────────────────────────────────────────
  referenceSolution: {
    decisions: {
      'ce-doc-type': ['rich-text', 'tables', 'media', 'comments'],
      'ce-collab-mode': ['real-time'],
      'ce-algorithm': ['ot'],
      'ce-granularity': ['character-level'],
      'ce-transport': ['websocket'],
      'ce-sync-model': ['client-server'],
      'ce-doc-storage': ['snapshot-plus-oplog'],
      'ce-versioning': ['auto-version-history'],
      'ce-session-mgmt': ['sticky-sessions'],
      'ce-large-docs': ['lazy-loading'],
      'ce-offline': ['local-cache-sync'],
      'ce-permissions': ['simple', 'capability-based'],
    },
    explanation:
      'Референсное решение повторяет архитектуру Google Docs — самого масштабного collaborative editor в мире.\n\n' +
      '**Почему OT, а не CRDT?** Google Docs использует Operational Transformation с 2006 года. ' +
      'OT требует центрального сервера, но это совпадает с client-server архитектурой, которая нужна для авторизации, ' +
      'персистентности и аудита. Сервер сериализует все операции, гарантируя строгий порядок и convergence. ' +
      'CRDT (Yjs, Automerge) — отличная альтернатива для P2P и offline-first сценариев (Figma использует CRDT), ' +
      'но для server-mediated архитектуры OT проще и компактнее.\n\n' +
      '**Почему WebSocket + client-server?** WebSocket обеспечивает full-duplex с минимальной задержкой. ' +
      'Client-server модель даёт единую точку правды: сервер принимает операцию, трансформирует относительно ' +
      'конкурентных, сохраняет в operation log и рассылает остальным клиентам. Задержка ~ 1 RTT.\n\n' +
      '**Почему snapshot + oplog?** Operation log обеспечивает полную историю и append-only запись (быстро, надёжно). ' +
      'Периодические snapshots (каждые ~500 операций) обеспечивают быструю загрузку: загружаем последний snapshot, ' +
      'replay последних операций. Это же используется для version history.\n\n' +
      '**Sticky sessions** — необходимость для OT: все операции документа обрабатываются одним сервером, ' +
      'который держит OT-состояние в памяти. Consistent hashing по document ID маршрутизирует клиентов. ' +
      'При падении сервера — failover на другой, восстановление из snapshot + oplog.\n\n' +
      '**Lazy loading** решает проблему больших документов: загружаем видимую часть + буфер, ' +
      'остальное подгружаем при скролле. В комбинации с virtualized rendering — плавный UX даже для документов на сотни страниц.\n\n' +
      '**Local cache + sync** покрывает кратковременные разрывы соединения. Service Worker кэширует приложение, ' +
      'IndexedDB — pending операции. При reconnect операции отправляются на сервер и трансформируются штатным OT-механизмом.\n\n' +
      '**Simple + capability permissions** — комбинация, которая работает для всех: owner/editor/viewer/commenter для ' +
      'прямого шеринга, capability-ссылки для быстрого доступа без регистрации.',

    diagram:
      '┌─────────────────────────────────────────────────────────────────────┐\n' +
      '│                        COLLABORATIVE EDITOR                        │\n' +
      '├─────────────────────────────────────────────────────────────────────┤\n' +
      '│                                                                     │\n' +
      '│  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │\n' +
      '│  │ Client A │  │ Client B │  │ Client C │  (браузеры)              │\n' +
      '│  │ Local OT │  │ Local OT │  │ Local OT │                          │\n' +
      '│  │ + Cache  │  │ + Cache  │  │ + Cache  │                          │\n' +
      '│  └────┬─────┘  └────┬─────┘  └────┬─────┘                          │\n' +
      '│       │ WS          │ WS          │ WS                             │\n' +
      '│       └─────────────┼─────────────┘                                │\n' +
      '│                     ▼                                               │\n' +
      '│  ┌──────────────────────────────────────┐                          │\n' +
      '│  │      Load Balancer (consistent       │                          │\n' +
      '│  │      hashing by document ID)         │                          │\n' +
      '│  └──────────────────┬───────────────────┘                          │\n' +
      '│                     │ sticky session                               │\n' +
      '│                     ▼                                               │\n' +
      '│  ┌──────────────────────────────────────┐                          │\n' +
      '│  │     Collaboration Server              │                          │\n' +
      '│  │  ┌─────────────────────────────────┐  │                          │\n' +
      '│  │  │  OT Engine (transform + apply)  │  │                          │\n' +
      '│  │  │  In-memory document state        │  │                          │\n' +
      '│  │  │  Connected clients registry      │  │                          │\n' +
      '│  │  └─────────────────────────────────┘  │                          │\n' +
      '│  └───────┬──────────┬───────────┬────────┘                          │\n' +
      '│          │          │           │                                    │\n' +
      '│          ▼          ▼           ▼                                    │\n' +
      '│  ┌────────────┐ ┌────────┐ ┌──────────────┐                        │\n' +
      '│  │ Operation  │ │Snapshot│ │  Permission   │                        │\n' +
      '│  │    Log     │ │ Store  │ │   Service     │                        │\n' +
      '│  │ (append-   │ │(~500   │ │ (owner/editor │                        │\n' +
      '│  │  only DB)  │ │ ops →  │ │  /viewer +    │                        │\n' +
      '│  │            │ │snapshot│ │  share links) │                        │\n' +
      '│  └────────────┘ └───┬────┘ └──────────────┘                        │\n' +
      '│                     │                                               │\n' +
      '│                     ▼                                               │\n' +
      '│           ┌──────────────────┐                                      │\n' +
      '│           │ Document Storage  │                                      │\n' +
      '│           │ + Version History │                                      │\n' +
      '│           │   (PostgreSQL /   │                                      │\n' +
      '│           │    S3 for media)  │                                      │\n' +
      '│           └──────────────────┘                                      │\n' +
      '│                                                                     │\n' +
      '│  Поток операции:                                                    │\n' +
      '│  Client A печатает → WS → Collab Server → OT transform →           │\n' +
      '│  → append to OpLog → broadcast to B, C → periodic snapshot          │\n' +
      '│                                                                     │\n' +
      '└─────────────────────────────────────────────────────────────────────┘',
  },

  capacityEstimates: {
    default: [
      {
        label: 'Concurrent open documents',
        value: '5M documents',
        formula: '50M DAU × 10% actively editing at any moment = 5M concurrent documents',
      },
      {
        label: 'Operations per second',
        value: '10M ops/sec',
        formula: '5M active docs × avg 2 ops/sec per document = 10M ops/sec',
      },
      {
        label: 'WebSocket connections',
        value: '10M connections',
        formula: '5M active docs × avg 2 collaborators per doc = 10M WebSocket connections',
      },
      {
        label: 'Operation log storage/day',
        value: '~43 TB/day',
        formula: '10M ops/sec × 86 400 sec/day × 50 bytes per op = ~43.2 TB/day',
      },
      {
        label: 'Document storage',
        value: '~5 TB',
        formula: '50M total documents × avg 100 KB per document = ~5 TB',
      },
      {
        label: 'Snapshot storage',
        value: '~120 TB',
        formula: '50M docs × 24 hourly snapshots × 100 KB = ~120 TB',
      },
      {
        label: 'Bandwidth',
        value: '~1 GB/s',
        formula: '10M ops/sec × 50 bytes × 2 (broadcast to collaborators) = ~1 GB/s',
      },
    ],
  },
};
