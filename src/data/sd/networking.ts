import type { Question } from '../types';

export const networkingQuestions: Question[] = [
  {
    id: 'sd-networking-001',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что происходит при DNS-резолвинге доменного имени?',
    options: [
      'Браузер отправляет запрос напрямую на веб-сервер по имени домена',
      'Иерархическая система DNS-серверов преобразует доменное имя в IP-адрес: локальный кэш → рекурсивный резолвер → root → TLD → authoritative DNS',
      'Доменное имя шифруется и используется как ключ маршрутизации в сети',
      'DNS-сервер загружает HTML-страницу и кэширует её для последующих запросов',
    ],
    correctIndex: 1,
    explanation:
      'DNS (Domain Name System) — иерархическая система, преобразующая доменные имена в IP-адреса. Процесс: 1) Браузер проверяет локальный кэш. 2) Запрос к рекурсивному DNS-резолверу (обычно провайдера). 3) Резолвер обращается к root DNS серверам (.), те направляют к TLD серверам (.com, .ru). 4) TLD серверы направляют к authoritative DNS серверу домена. 5) Authoritative сервер возвращает IP-адрес. Каждый уровень кэширует результат с учётом TTL.',
  },
  {
    id: 'sd-networking-002',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question: 'В чём основное различие между TCP и UDP?',
    options: [
      'TCP работает только в локальной сети, UDP — в глобальной',
      'TCP обеспечивает надёжную, упорядоченную доставку данных с установлением соединения, UDP — ненадёжную доставку без установления соединения, но с меньшей задержкой',
      'TCP быстрее UDP во всех сценариях использования',
      'UDP поддерживает шифрование по умолчанию, TCP — нет',
    ],
    correctIndex: 1,
    explanation:
      'TCP (Transmission Control Protocol): устанавливает соединение (3-way handshake), гарантирует доставку (retransmission), порядок пакетов (sequencing), контроль потока (flow control). Используется: HTTP, FTP, email. UDP (User Datagram Protocol): без установления соединения, не гарантирует доставку и порядок, минимальные накладные расходы. Используется: DNS, видео-стриминг, онлайн-игры, VoIP. UDP быстрее за счёт отсутствия overhead на установку соединения и подтверждения.',
  },
  {
    id: 'sd-networking-003',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое WebSocket и для чего он используется?',
    options: [
      'Протокол для передачи файлов между серверами',
      'Протокол полнодуплексной двунаправленной связи поверх TCP, позволяющий серверу и клиенту обмениваться данными в реальном времени',
      'Расширение HTTP для увеличения размера загружаемых файлов',
      'Механизм кэширования статических ресурсов в браузере',
    ],
    correctIndex: 1,
    explanation:
      'WebSocket — протокол, обеспечивающий постоянное двунаправленное соединение между клиентом и сервером. Инициируется HTTP Upgrade request, после чего соединение переходит на WebSocket-протокол. Преимущества: реальное время (низкая задержка), push от сервера (не нужен polling), меньший overhead (нет HTTP-заголовков в каждом сообщении). Используется: чаты, уведомления, live-данные (биржевые котировки), совместное редактирование, онлайн-игры.',
  },
  {
    id: 'sd-networking-004',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое reverse proxy?',
    options: [
      'Прокси, через который клиент анонимно подключается к серверам в интернете',
      'Сервер-посредник, стоящий перед backend-серверами, который принимает запросы от клиентов, перенаправляет их на backend и возвращает ответы',
      'Механизм инвертирования порядка пакетов для ускорения передачи',
      'Протокол, позволяющий серверу инициировать соединение с клиентом',
    ],
    correctIndex: 1,
    explanation:
      'Reverse proxy — сервер, стоящий между клиентами и backend-серверами. Клиент обращается к reverse proxy, который перенаправляет запрос на один из backend-серверов. Функции: балансировка нагрузки, SSL termination, кэширование, сжатие, защита от DDoS, сокрытие архитектуры backend. Примеры: Nginx, HAProxy, Envoy, Traefik. В отличие от forward proxy (который стоит на стороне клиента), reverse proxy стоит на стороне сервера.',
  },
  {
    id: 'sd-networking-005',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question:
      'Что такое SSL/TLS termination и зачем оно нужно?',
    options: [
      'Процесс создания SSL-сертификатов для каждого backend-сервера',
      'Расшифровка входящего HTTPS-трафика на reverse proxy или load balancer, чтобы backend-серверы работали с нешифрованным HTTP-трафиком',
      'Принудительное завершение всех SSL-соединений через определённый интервал времени',
      'Шифрование данных в базе данных с помощью TLS',
    ],
    correctIndex: 1,
    explanation:
      'SSL/TLS termination — процесс, при котором reverse proxy или load balancer расшифровывает входящий HTTPS-трафик и передаёт его backend-серверам по обычному HTTP. Преимущества: снижение нагрузки на backend (шифрование/расшифровка — CPU-интенсивная операция), централизованное управление сертификатами, упрощение конфигурации backend. Внутренний трафик может быть дополнительно защищён через mTLS (mutual TLS) в service mesh.',
  },
  {
    id: 'sd-networking-006',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'open',
    question:
      'Что такое keep-alive соединения в HTTP? Какую проблему они решают?',
    sampleAnswer:
      'HTTP Keep-Alive (persistent connections) — механизм, позволяющий переиспользовать одно TCP-соединение для нескольких HTTP-запросов вместо открытия нового соединения для каждого запроса. Проблема, которую решает: без keep-alive каждый HTTP-запрос требует нового TCP-соединения (3-way handshake + TLS handshake), что добавляет значительную задержку (100-300 мс). Для типичной веб-страницы с 50-100 ресурсами это неприемлемо. В HTTP/1.1 keep-alive включён по умолчанию (заголовок Connection: keep-alive). Соединение закрывается по timeout или при явном Connection: close. Ограничение HTTP/1.1: head-of-line blocking — один медленный запрос блокирует всю очередь.',
    explanation:
      'Keep-alive — фундаментальная оптимизация HTTP. В HTTP/2 концепция развилась дальше: одно соединение с мультиплексированием множества потоков (streams), полностью устраняя необходимость в нескольких TCP-соединениях к одному серверу.',
  },
  {
    id: 'sd-networking-007',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Какое ключевое улучшение HTTP/2 решает проблему head-of-line blocking на уровне HTTP?',
    options: [
      'Сжатие заголовков с помощью HPACK',
      'Мультиплексирование — несколько потоков (streams) в одном TCP-соединении, позволяющее передавать запросы и ответы параллельно',
      'Server Push — отправка ресурсов до того, как клиент их запросит',
      'Бинарный формат фреймов вместо текстового',
    ],
    correctIndex: 1,
    explanation:
      'HTTP/2 multiplexing — ключевое нововведение. В HTTP/1.1 запросы в одном соединении обрабатываются последовательно (HOL blocking): медленный ответ блокирует все последующие. HTTP/2 делит соединение на независимые потоки (streams), каждый из которых передаёт данные параллельно через единое TCP-соединение. Это устраняет HTTP-level HOL blocking. Однако TCP-level HOL blocking остаётся: потеря одного TCP-пакета блокирует все потоки. Эту проблему решает HTTP/3 с QUIC (поверх UDP).',
  },
  {
    id: 'sd-networking-008',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Что такое gRPC и какие преимущества он даёт по сравнению с REST/JSON?',
    options: [
      'Графовый API для запросов к базам данных',
      'Фреймворк удалённых вызовов процедур от Google, использующий HTTP/2 и Protocol Buffers для высокопроизводительной типизированной коммуникации между сервисами',
      'Протокол для передачи файлов большого размера',
      'JavaScript-фреймворк для создания RESTful API',
    ],
    correctIndex: 1,
    explanation:
      'gRPC — фреймворк RPC (Remote Procedure Call), созданный Google. Использует HTTP/2 (мультиплексирование, streaming) и Protocol Buffers (бинарная сериализация). Преимущества над REST/JSON: 1) Высокая производительность — бинарный формат в 5-10x компактнее JSON. 2) Строгая типизация — schema в .proto файлах, автогенерация клиентов. 3) Streaming — unary, server-streaming, client-streaming, bidirectional. 4) Deadlines/timeouts встроены в протокол. Недостатки: сложнее отладка (бинарный формат), хуже поддержка браузерами (нужен gRPC-Web), менее читаем для человека.',
  },
  {
    id: 'sd-networking-009',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Как работает TLS handshake при установке HTTPS-соединения?',
    options: [
      'Клиент отправляет пароль серверу, сервер проверяет его по базе данных',
      'Клиент и сервер обмениваются поддерживаемыми шифрами и сертификатами, генерируют общий сеансовый ключ через асимметричное шифрование, затем переходят на симметричное шифрование',
      'Сервер отправляет клиенту предварительно зашифрованный ключ по отдельному каналу',
      'DNS-сервер генерирует ключ шифрования и передаёт его обеим сторонам',
    ],
    correctIndex: 1,
    explanation:
      'TLS handshake (упрощённо для TLS 1.3): 1) ClientHello — клиент отправляет поддерживаемые шифры и версии TLS. 2) ServerHello — сервер выбирает шифр, отправляет свой сертификат (содержащий публичный ключ). 3) Клиент проверяет сертификат через цепочку доверия (CA). 4) Key Exchange — генерация общего секрета через ECDHE (Elliptic Curve Diffie-Hellman). 5) Переход на симметричное шифрование (AES) с сеансовым ключом. TLS 1.3 занимает 1 RTT (round-trip time) вместо 2 RTT в TLS 1.2. 0-RTT возможен при повторном соединении.',
  },
  {
    id: 'sd-networking-010',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Что такое connection pooling и зачем он нужен?',
    options: [
      'Механизм создания новых соединений для каждого запроса',
      'Повторное использование заранее установленных соединений из пула вместо создания нового соединения для каждого запроса, что снижает overhead на установку соединений',
      'Метод балансировки нагрузки между несколькими серверами',
      'Шифрование нескольких соединений одним ключом для экономии ресурсов',
    ],
    correctIndex: 1,
    explanation:
      'Connection pooling — паттерн, при котором приложение поддерживает пул предварительно установленных соединений (к БД, к другим сервисам) и переиспользует их вместо создания нового для каждого запроса. Установка TCP + TLS соединения стоит 1-3 RTT (50-200 мс). Для БД: установка соединения с PostgreSQL включает аутентификацию, согласование параметров и может занимать 50-100 мс. При 1000 RPS это неприемлемо. Пул: min/max connections, idle timeout, max lifetime. Инструменты: PgBouncer (PostgreSQL), ProxySQL (MySQL), HikariCP (Java).',
  },
  {
    id: 'sd-networking-011',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Какую проблему HTTP/2 решает HTTP/3 (QUIC)?',
    options: [
      'Отсутствие сжатия заголовков в HTTP/2',
      'TCP head-of-line blocking: потеря одного TCP-пакета блокирует все мультиплексированные потоки, QUIC решает это, работая поверх UDP с независимыми потоками',
      'Невозможность использования HTTP/2 без TLS',
      'Ограничение на количество одновременных соединений в HTTP/2',
    ],
    correctIndex: 1,
    explanation:
      'HTTP/2 мультиплексирует потоки внутри одного TCP-соединения. Если TCP-пакет потерян, ВСЕ потоки блокируются до его ретрансмиссии (TCP HOL blocking). HTTP/3 использует QUIC — транспортный протокол поверх UDP, разработанный Google. Каждый QUIC-поток независим: потеря пакета в одном потоке не блокирует другие. Дополнительные преимущества: 0-RTT connection establishment (при повторном подключении), встроенный TLS 1.3, миграция соединений при смене IP (connection ID вместо IP:port). Поддерживается Chrome, Firefox, Nginx, Cloudflare.',
  },
  {
    id: 'sd-networking-012',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'open',
    question:
      'Сравните REST, gRPC и GraphQL. Когда следует использовать каждый подход?',
    sampleAnswer:
      'REST: ресурсо-ориентированный, использует HTTP-методы (GET/POST/PUT/DELETE), JSON. Прост, широко поддерживается, хорош для публичных API и CRUD-операций. Недостатки: over-fetching/under-fetching, N+1 запросов. gRPC: RPC-ориентированный, HTTP/2 + Protobuf. Высокая производительность, строгий контракт, streaming. Идеален для межсервисной коммуникации (service-to-service), low-latency систем, IoT. Недостатки: сложнее для браузеров, менее читаем. GraphQL: query language для API, клиент указывает нужные поля. Решает проблему over/under-fetching, один endpoint. Хорош для мобильных клиентов с разными потребностями, BFF (Backend for Frontend). Недостатки: сложность кэширования (нет URL-based кэша), возможность тяжёлых запросов (N+1 на стороне сервера), сложнее мониторинг. Рекомендации: публичный API → REST, inter-service → gRPC, клиенты с разными потребностями → GraphQL.',
    explanation:
      'Выбор протокола — одно из ключевых архитектурных решений. Многие компании используют комбинацию: REST для public API, gRPC для внутренних сервисов, GraphQL как BFF-слой. Важно учитывать экосистему, tooling и компетенции команды.',
  },
  {
    id: 'sd-networking-013',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'open',
    question:
      'Объясните, что такое DNS-based load balancing. Какие у него ограничения?',
    sampleAnswer:
      'DNS-based load balancing — метод распределения нагрузки через DNS: один домен разрешается в несколько IP-адресов (Round Robin DNS). DNS-сервер возвращает разные IP в ответ на запросы, распределяя клиентов между серверами. Варианты: Round Robin (циклически), Weighted (с весами), Geo-based (по географии клиента), Latency-based (по задержке). Ограничения: 1) Кэширование DNS — клиенты и промежуточные резолверы кэшируют записи; изменения вступают в силу не сразу (TTL). 2) Нет health checks — DNS не знает, жив ли сервер. 3) Грубая гранулярность — на уровне IP, не на уровне запроса. 4) Неравномерность — один резолвер кэширует один IP для всех своих клиентов. Решение: комбинация DNS-based + L4/L7 load balancer (AWS Route 53 + ALB).',
    explanation:
      'DNS-based load balancing — первый уровень распределения нагрузки. AWS Route 53, Cloudflare DNS, Google Cloud DNS предоставляют advanced routing policies (geo, latency, failover). Но для быстрого failover и fine-grained балансировки необходим дополнительный уровень — L4/L7 load balancer.',
  },
  {
    id: 'sd-networking-014',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Что такое Service Mesh и какую роль в нём играет sidecar proxy?',
    options: [
      'Service Mesh — это фреймворк для мониторинга, а sidecar — агент сбора метрик',
      'Service Mesh — инфраструктурный слой для управления межсервисной коммуникацией; sidecar proxy (Envoy) перехватывает весь трафик сервиса, обеспечивая mTLS, retry, circuit breaking, observability без изменения кода приложения',
      'Service Mesh — это DNS-сервер для микросервисов, sidecar — клиент DNS',
      'Service Mesh — это API Gateway для внутренних сервисов, sidecar — его локальная копия',
    ],
    correctIndex: 1,
    explanation:
      'Service Mesh (Istio, Linkerd, Consul Connect) — инфраструктурный слой, который управляет всей межсервисной коммуникацией. Sidecar proxy (обычно Envoy) развёртывается рядом с каждым сервисом и прозрачно перехватывает весь входящий и исходящий трафик. Функции: mTLS (шифрование между сервисами), service discovery, load balancing (L7), circuit breaking, retry/timeout, rate limiting, distributed tracing, canary deployments, traffic splitting. Control plane (Istiod) управляет конфигурацией sidecar-ов. Data plane — это сеть sidecar proxy.',
  },
  {
    id: 'sd-networking-015',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Какой механизм QUIC позволяет сохранять соединение при смене сети (например, с Wi-Fi на мобильную)?',
    options: [
      'TCP Fast Open',
      'Connection ID — QUIC идентифицирует соединение по уникальному ID вместо пары IP:port, что позволяет мигрировать соединение при смене IP-адреса',
      'Multipath TCP',
      'DNS rebinding',
    ],
    correctIndex: 1,
    explanation:
      'В TCP соединение идентифицируется четвёркой (source IP, source port, dest IP, dest port). При смене сети (Wi-Fi → 4G) меняется IP, и TCP-соединение разрывается. QUIC идентифицирует соединение через Connection ID — 64-битный идентификатор, не привязанный к IP. При смене IP клиент продолжает отправлять пакеты с тем же Connection ID, и сервер распознаёт их как продолжение существующего соединения. Это критически важно для мобильных пользователей и улучшает UX при нестабильном соединении.',
  },
  {
    id: 'sd-networking-016',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'quiz',
    question:
      'Что такое mTLS (mutual TLS) и зачем он используется в микросервисной архитектуре?',
    options: [
      'Ускоренная версия TLS с меньшим числом round-trip',
      'Взаимная аутентификация, при которой не только сервер предъявляет сертификат клиенту, но и клиент предъявляет сертификат серверу, обеспечивая двустороннюю проверку подлинности',
      'Метод шифрования данных в базе данных с помощью TLS',
      'Протокол для мультиплексирования TLS-соединений',
    ],
    correctIndex: 1,
    explanation:
      'В обычном TLS только сервер предъявляет сертификат — клиент убеждается, что сервер тот, за кого себя выдаёт. В mTLS (mutual TLS) обе стороны предъявляют сертификаты и проверяют друг друга. В микросервисной архитектуре mTLS обеспечивает: 1) Аутентификацию сервисов (zero-trust network). 2) Шифрование всего межсервисного трафика. 3) Авторизацию на уровне сервиса (RBAC по certificate identity). Service Mesh (Istio) автоматизирует управление сертификатами и mTLS: автоматическая ротация, выдача и проверка сертификатов через sidecar proxy.',
  },
  {
    id: 'sd-networking-017',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question:
      'Опишите полный путь HTTP-запроса от момента ввода URL в браузер до получения ответа. Укажите все сетевые этапы.',
    sampleAnswer:
      '1) Парсинг URL: протокол, домен, путь. 2) DNS resolution: локальный кэш → рекурсивный резолвер → root → TLD → authoritative DNS → IP-адрес. 3) TCP handshake: SYN → SYN-ACK → ACK (3-way handshake, ~1 RTT). 4) TLS handshake (для HTTPS): ClientHello → ServerHello + Certificate → Key Exchange → Finished (~1-2 RTT для TLS 1.2, ~1 RTT для TLS 1.3). 5) HTTP-запрос: отправка GET/POST с заголовками. 6) Прохождение через инфраструктуру: CDN → Load Balancer (SSL termination) → Reverse Proxy → Application Server. 7) Обработка на сервере: маршрутизация, бизнес-логика, запрос к БД/кэшу. 8) HTTP-ответ: status code, headers, body. 9) Рендеринг в браузере: парсинг HTML → CSSOM → DOM → render tree → layout → paint. 10) Загрузка дополнительных ресурсов (CSS, JS, images) — повторение с шага 2 (или из кэша/через keep-alive).',
    explanation:
      'Понимание полного пути запроса — фундаментальное знание для системного дизайна. Каждый этап может быть оптимизирован: DNS prefetch, TCP fast open, TLS 1.3, HTTP/2 multiplexing, CDN, кэширование, connection pooling, lazy loading ресурсов. Типичная задержка: DNS ~50мс, TCP ~20мс, TLS ~40мс, server processing ~100мс, total ~200-500мс.',
  },
  {
    id: 'sd-networking-018',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question:
      'Как устроен Service Mesh на примере Istio? Опишите архитектуру (control plane, data plane) и основные возможности.',
    sampleAnswer:
      'Архитектура Istio: Data Plane: Envoy sidecar proxy внедряется в каждый pod (Kubernetes). Весь входящий и исходящий трафик проходит через Envoy. Envoy выполняет: L7 load balancing, circuit breaking, retry, timeout, rate limiting, сбор метрик (Prometheus), распределённый трейсинг (Jaeger), mTLS шифрование. Control Plane (Istiod): Pilot — конфигурация маршрутизации (VirtualService, DestinationRule), service discovery. Citadel — управление сертификатами, mTLS, RBAC. Galley — валидация конфигурации. Возможности: 1) Traffic management: canary releases (90/10 split), A/B testing, fault injection. 2) Security: mTLS everywhere, AuthorizationPolicy, JWT validation. 3) Observability: автоматические метрики (RED — Rate, Errors, Duration), трейсинг без изменения кода. 4) Resilience: retry, timeout, circuit breaker через конфигурацию.',
    explanation:
      'Service Mesh решает cross-cutting concerns (безопасность, observability, resilience) на уровне инфраструктуры, без изменения кода приложений. Это идеальный подход для полиглотных микросервисных систем. Однако sidecar proxy добавляет latency (~1-2мс) и потребляет ресурсы. Альтернативы: eBPF-based mesh (Cilium), proxyless gRPC mesh.',
  },
  {
    id: 'sd-networking-019',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question:
      'Что такое Server-Sent Events (SSE) и чем они отличаются от WebSocket и Long Polling? Когда следует использовать каждый подход?',
    sampleAnswer:
      'Server-Sent Events (SSE): однонаправленный канал от сервера к клиенту поверх HTTP. Клиент открывает соединение, сервер отправляет события в формате text/event-stream. Автоматическое переподключение, event ID для восстановления после разрыва. Простая реализация, работает через стандартный HTTP. Long Polling: клиент отправляет HTTP-запрос, сервер «держит» его открытым до появления данных или timeout, затем клиент отправляет новый запрос. Простой, но неэффективный (overhead на каждый запрос). WebSocket: полнодуплексный, оба направления, низкий overhead после handshake, но сложнее в реализации. Рекомендации: SSE — уведомления, live feeds, дашборды (сервер → клиент). WebSocket — чаты, игры, совместное редактирование (двунаправленное). Long Polling — fallback для сред без WebSocket/SSE, простые случаи с редкими обновлениями.',
    explanation:
      'SSE часто недооценивается. Для большинства real-time сценариев, где сервер push-ит данные клиенту (уведомления, обновление цен, лента событий), SSE проще и надёжнее WebSocket: автоматическое переподключение, работа через HTTP/2, нативная поддержка браузерами (EventSource API), совместимость с прокси и CDN.',
  },
  {
    id: 'sd-networking-020',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question:
      'Какой уровень балансировки нагрузки работает на транспортном уровне (L4) и не анализирует содержимое HTTP-запросов?',
    options: [
      'L7 load balancer (Application layer) — маршрутизирует на основе URL, заголовков, cookies',
      'L4 load balancer (Transport layer) — маршрутизирует на основе IP-адреса и TCP/UDP порта без анализа содержимого пакетов',
      'DNS load balancer — маршрутизирует на основе доменного имени',
      'L2 load balancer (Data link layer) — маршрутизирует на основе MAC-адресов',
    ],
    correctIndex: 1,
    explanation:
      'L4 load balancer работает на транспортном уровне (TCP/UDP). Он принимает решения о маршрутизации на основе IP-адресов и портов источника/назначения, не анализируя содержимое (HTTP-заголовки, URL, cookies). Преимущества: очень высокая производительность (обработка пакетов без парсинга), низкая задержка, простота. Недостатки: невозможность маршрутизации по содержимому запроса. Примеры: AWS NLB, HAProxy (L4 mode), IPVS. L7 load balancer (AWS ALB, Nginx) анализирует HTTP и может маршрутизировать по URL, заголовкам, методу.',
  },
  {
    id: 'sd-networking-021',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое CDN (Content Delivery Network)?',
    options: [
      'Протокол шифрования данных',
      'Географически распределённая сеть серверов для кэширования и доставки контента пользователям из ближайшей точки',
      'База данных для хранения медиафайлов',
      'Сервис для управления DNS-записями',
    ],
    correctIndex: 1,
    explanation:
      'CDN (Content Delivery Network) — сеть edge-серверов по всему миру. Контент (статика, видео, API-ответы) кэшируется на edge, пользователь получает данные из ближайшей точки присутствия (PoP). Преимущества: снижение latency (географическая близость), разгрузка origin-серверов, защита от DDoS, высокая доступность. Примеры: Cloudflare, AWS CloudFront, Akamai, Fastly. CDN может кэшировать не только статику: edge computing позволяет выполнять логику на edge (Cloudflare Workers).',
  },
  {
    id: 'sd-networking-022',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое NAT (Network Address Translation)?',
    options: [
      'Протокол синхронизации времени',
      'Механизм преобразования IP-адресов, позволяющий устройствам с приватными IP выходить в интернет через один публичный IP',
      'Метод шифрования трафика',
      'Протокол автоматической настройки сети',
    ],
    correctIndex: 1,
    explanation:
      'NAT преобразует IP-адреса при прохождении пакетов через маршрутизатор. Типичное использование: устройства в локальной сети имеют приватные IP (192.168.x.x), NAT заменяет их на публичный IP роутера при выходе в интернет. Типы: SNAT (Source NAT) — изменение source IP, DNAT (Destination NAT) — изменение destination IP (port forwarding). PAT (Port Address Translation) — множество приватных IP → один публичный с разными портами. NAT создаёт проблемы для P2P, WebRTC (нужен STUN/TURN для NAT traversal).',
  },
  {
    id: 'sd-networking-023',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'open',
    question: 'Что такое latency и throughput? Как они связаны и чем отличаются?',
    sampleAnswer:
      'Latency (задержка) — время от отправки запроса до получения ответа. Измеряется в миллисекундах. Компоненты: propagation delay (физическое расстояние), transmission delay (размер данных / bandwidth), processing delay (обработка), queueing delay (ожидание в очередях). Throughput (пропускная способность) — количество данных, передаваемых за единицу времени. Измеряется в Mbps, RPS. Отличие: система может иметь высокий throughput, но высокий latency (много параллельных запросов, каждый медленный), или низкий latency, но низкий throughput (быстрые, но редкие запросы). Связь через Little\'s Law: L = λ * W (среднее число запросов в системе = arrival rate * среднее время в системе). Оптимизация разная: latency — кэширование, edge, CDN; throughput — параллелизм, batching.',
    explanation:
      'Latency и throughput — две ключевые метрики производительности. Для пользователя важен latency (отзывчивость), для системы — throughput (ёмкость). Bandwidth ≠ throughput: bandwidth — максимальная пропускная способность канала.',
  },
  {
    id: 'sd-networking-024',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое IP-адрес и чем IPv4 отличается от IPv6?',
    options: [
      'IP-адрес — идентификатор порта приложения',
      'IP-адрес — уникальный идентификатор устройства в сети; IPv4 — 32-битный (4 млрд адресов), IPv6 — 128-битный (практически неограниченно)',
      'IPv6 медленнее IPv4',
      'IPv4 и IPv6 несовместимы на уровне приложений',
    ],
    correctIndex: 1,
    explanation:
      'IP-адрес идентифицирует устройство в сети. IPv4: 32 бита, формат X.X.X.X (0-255), ~4.3 миллиарда адресов (исчерпаны). IPv6: 128 бит, формат X:X:X:X:X:X:X:X (hex), 3.4×10^38 адресов. Отличия: IPv6 убирает NAT (каждое устройство имеет публичный IP), встроенный IPsec, упрощённый header, auto-configuration (SLAAC). Transition: dual-stack (оба протокола), tunneling (IPv6 через IPv4), NAT64/DNS64. Большинство систем поддерживают оба, AWS VPC поддерживает dual-stack.',
  },
  {
    id: 'sd-networking-025',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое Envoy и какую роль он играет в современных архитектурах?',
    options: [
      'Система мониторинга сети',
      'High-performance proxy, используемый как sidecar в service mesh, API gateway, предоставляющий L7 routing, observability, resilience из коробки',
      'DNS-сервер для микросервисов',
      'Система оркестрации контейнеров',
    ],
    correctIndex: 1,
    explanation:
      'Envoy — open-source L7 proxy от Lyft, ключевой компонент cloud-native networking. Возможности: L7 load balancing (HTTP/2, gRPC), service discovery, health checking, circuit breaker, rate limiting, observability (stats, tracing, logging), TLS termination, WebSocket, HTTP/3. Используется: как sidecar в service mesh (Istio data plane), standalone proxy, API gateway. xDS API позволяет динамически конфигурировать Envoy (control plane как Istio управляет через xDS). Envoy стал стандартом де-факто для service mesh proxy.',
  },
  {
    id: 'sd-networking-026',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое circuit breaker на сетевом уровне?',
    options: [
      'Физический предохранитель в сетевом оборудовании',
      'Паттерн, при котором proxy прекращает отправку запросов к failing сервису, возвращая ошибку немедленно, предотвращая каскадные сбои',
      'Метод шифрования трафика',
      'Алгоритм балансировки нагрузки',
    ],
    correctIndex: 1,
    explanation:
      'Circuit breaker — паттерн resilience, реализуемый в proxy/service mesh. Состояния: Closed (нормальная работа, запросы проходят), Open (сервис failing, все запросы fail-fast без отправки), Half-Open (пробные запросы для проверки восстановления). Triggering: процент ошибок, количество consecutive failures, latency threshold. Envoy: outlier detection — автоматическое исключение failing hosts из load balancing. Istio: DestinationRule с outlierDetection. Circuit breaker предотвращает cascading failures, снижает нагрузку на failing сервис, ускоряет recovery.',
  },
  {
    id: 'sd-networking-027',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'open',
    question: 'Объясните концепцию Zero Trust Networking. Как она реализуется на практике?',
    sampleAnswer:
      'Zero Trust Networking — модель безопасности, отвергающая implicit trust на основе network location. Принципы: 1) Verify explicitly — аутентификация и авторизация каждого запроса. 2) Least privilege — минимальные права доступа. 3) Assume breach — проектирование с учётом компрометации. Реализация: 1) mTLS везде — шифрование и аутентификация межсервисного трафика. Service mesh (Istio) автоматизирует. 2) Identity-based access — решения на основе identity (service account), не IP/network. 3) Micro-segmentation — granular network policies (Kubernetes NetworkPolicy, Calico). 4) Continuous verification — проверка при каждом запросе, не только при установке соединения. 5) No VPN для cloud — BeyondCorp model (Google) — доступ через identity-aware proxy. Инструменты: Istio (mTLS, AuthorizationPolicy), HashiCorp Boundary, Cloudflare Access.',
    explanation:
      'Zero Trust — ответ на размытие периметра (cloud, remote work). Google BeyondCorp — пионер: сотрудники работают без VPN, доступ через identity-aware proxy с device trust. NIST SP 800-207 — стандарт Zero Trust Architecture.',
  },
  {
    id: 'sd-networking-028',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'open',
    question: 'Как работает TCP congestion control? Почему это важно для распределённых систем?',
    sampleAnswer:
      'TCP congestion control управляет скоростью отправки данных, чтобы не перегружать сеть. Механизмы: 1) Slow start — начинаем с малого congestion window (cwnd), удваиваем каждый RTT до threshold. 2) Congestion avoidance — после threshold линейный рост cwnd. 3) Fast retransmit/recovery — при получении duplicate ACKs retransmit без ожидания timeout. 4) Loss detection — packet loss = сигнал congestion, cwnd резко уменьшается. Алгоритмы: Reno (классический), CUBIC (Linux default, aggressive recovery), BBR (Google, bandwidth-based, не loss-based). Важность: неправильный congestion control вызывает bufferbloat (высокая latency), unfairness (один поток забирает bandwidth), network collapse. Для datacenter: специальные алгоритмы (DCTCP) с меньшей latency. QUIC реализует congestion control в userspace, проще экспериментировать.',
    explanation:
      'Congestion control — «невидимый герой» интернета. BBR от Google значительно улучшает throughput на long-distance links. Понимание congestion control важно для tuning high-performance systems.',
  },
  {
    id: 'sd-networking-029',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое sticky sessions и когда они нужны?',
    options: [
      'Сессии с высоким приоритетом',
      'Механизм, при котором load balancer направляет все запросы одного клиента на один backend сервер, сохраняя session affinity',
      'Шифрование данных сессии',
      'Сжатие данных сессии',
    ],
    correctIndex: 1,
    explanation:
      'Sticky sessions (session affinity) — все запросы от одного клиента направляются на один сервер. Реализация: cookie-based (LB устанавливает cookie с server ID), IP-based (hash(client IP) → server). Когда нужны: stateful applications (session state хранится в памяти сервера), WebSocket connections, кэш на сервере. Проблемы: неравномерное распределение нагрузки, потеря сессии при падении сервера, сложность масштабирования. Лучшая альтернатива: stateless backends + external session store (Redis), но sticky sessions иногда необходимы (legacy, WebSocket).',
  },
  {
    id: 'sd-networking-030',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое eBPF и как он применяется в networking?',
    options: [
      'Формат сетевых пакетов',
      'Технология Linux kernel, позволяющая выполнять программы в kernel space для high-performance networking, observability, security без модификации kernel',
      'Протокол маршрутизации',
      'Метод сжатия сетевого трафика',
    ],
    correctIndex: 1,
    explanation:
      'eBPF (extended Berkeley Packet Filter) — революционная технология Linux. Позволяет загружать безопасные программы в kernel, выполняющиеся при определённых событиях (network packets, syscalls, tracepoints). Networking use cases: Cilium — CNI для Kubernetes с eBPF-based networking (no iptables), высокая производительность, network policies, load balancing. Katran (Facebook) — L4 load balancer на eBPF. XDP (eXpress Data Path) — обработка пакетов до network stack, минимальная latency. Observability: Pixie — auto-instrumentation без sidecar. Security: Falco, Tracee — runtime security через eBPF syscall monitoring.',
  },
  {
    id: 'sd-networking-031',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое Anycast и как он используется для DNS и CDN?',
    options: [
      'Метод multicast рассылки',
      'Техника, при которой один IP-адрес объявляется из нескольких географических точек, запрос роутится к ближайшей',
      'Протокол point-to-point связи',
      'Метод шифрования DNS-запросов',
    ],
    correctIndex: 1,
    explanation:
      'Anycast — routing technique: один IP объявляется (через BGP) из нескольких locations. Роутеры направляют пакеты к ближайшему (по метрикам) origin. Использование: DNS root servers — один anycast IP, физически сотни серверов по миру. CDN — edge servers share anycast IP, пользователь автоматически получает ближайший. DDoS mitigation — атака распределяется между всеми locations. Ограничения: работает для stateless protocols (UDP/DNS); для TCP требуется BGP stability (иначе connection breaks при route change). Cloudflare, AWS Route 53, Google Cloud DNS используют anycast.',
  },
  {
    id: 'sd-networking-032',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите архитектуру Kubernetes networking. Как работает Service, Ingress, NetworkPolicy?',
    sampleAnswer:
      'Kubernetes networking model: каждый Pod имеет уникальный IP, Pods общаются без NAT. Реализация через CNI plugins (Calico, Cilium, Flannel). Service: абстракция для доступа к Pods. ClusterIP — виртуальный IP внутри кластера, kube-proxy (iptables/IPVS) распределяет трафик. NodePort — открывает port на всех nodes. LoadBalancer — создаёт cloud LB. Headless Service (ClusterIP: None) — возвращает Pod IPs напрямую (для stateful workloads). Ingress: L7 routing для HTTP/HTTPS. Ingress Controller (Nginx, Traefik, Envoy) реализует rules. Path-based routing, TLS termination, virtual hosts. NetworkPolicy: firewall rules на уровне Pod. Specify ingress/egress rules по labels, namespaces, IP blocks. По умолчанию allow all, после создания policy — deny all кроме явно разрешённого. Реализуется CNI (Calico, Cilium).',
    explanation:
      'Kubernetes networking — обширная тема. CNI выбор влияет на performance (Cilium eBPF vs iptables), features (NetworkPolicy support). Ingress evolves: Gateway API — новый стандарт с более богатыми возможностями.',
  },
  {
    id: 'sd-networking-033',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question: 'Как оптимизировать сетевую производительность для high-throughput систем?',
    sampleAnswer:
      'Network performance optimization: 1) Protocol level: HTTP/2 multiplexing (eliminate HOL blocking), HTTP/3 QUIC (eliminate TCP HOL), gRPC для inter-service (binary, streaming). 2) Connection management: connection pooling (reuse connections), keep-alive, HTTP/2 single connection multiplexing. 3) Data optimization: compression (gzip, brotli), Protocol Buffers / FlatBuffers вместо JSON, pagination/streaming для large responses. 4) Caching: CDN для static, HTTP caching headers (Cache-Control, ETag), application-level caching (Redis). 5) Kernel tuning: TCP buffer sizes (tcp_rmem, tcp_wmem), congestion algorithm (BBR), backlog queue (somaxconn). 6) Hardware: DPDK/XDP для bypass kernel stack, SR-IOV для VMs, RDMA для datacenter. 7) Geographic: edge computing, geo-routing, data locality. Measurement: p99 latency, throughput, packet loss. Tools: iperf, netperf, wrk for benchmarking.',
    explanation:
      'High-performance networking требует optimization на всех уровнях. Google, Facebook инвестируют в custom hardware и protocols (QUIC). Для большинства приложений: HTTP/2, connection pooling, proper caching — достаточно.',
  },
  {
    id: 'sd-networking-034',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое port и зачем он нужен?',
    options: [
      'Физический разъём для подключения кабеля',
      'Числовой идентификатор (0-65535), определяющий конкретное приложение или службу на устройстве для multiplexing сетевых соединений',
      'Версия сетевого протокола',
      'Скорость сетевого соединения',
    ],
    correctIndex: 1,
    explanation:
      'Port — 16-битное число, идентифицирующее application endpoint на устройстве. IP-адрес определяет устройство, port — приложение на нём. Well-known ports (0-1023): HTTP=80, HTTPS=443, SSH=22, DNS=53. Registered (1024-49151): MySQL=3306, Redis=6379, PostgreSQL=5432. Dynamic/private (49152-65535): ephemeral ports для клиентских соединений. TCP и UDP имеют независимые port namespaces. Socket = IP:port — уникальный endpoint для connection.',
  },
  {
    id: 'sd-networking-035',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое DNS over HTTPS (DoH) и зачем он нужен?',
    options: [
      'Метод хостинга веб-сайтов',
      'Протокол, шифрующий DNS-запросы через HTTPS, защищая от перехвата и манипуляции DNS-трафика',
      'Способ ускорения DNS-резолвинга',
      'DNS-сервер, работающий по HTTPS',
    ],
    correctIndex: 1,
    explanation:
      'DNS over HTTPS (DoH) — протокол (RFC 8484), передающий DNS-запросы через HTTPS. Проблема классического DNS: запросы передаются в открытом виде — ISP/attackers видят какие домены вы посещаете, могут манипулировать ответами. DoH решает: шифрование скрывает запросы, HTTPS port (443) сложнее заблокировать, integrity protection. Альтернатива: DNS over TLS (DoT) — порт 853, отдельный от HTTPS. Поддержка: Chrome, Firefox, iOS/macOS, Cloudflare 1.1.1.1, Google 8.8.8.8. Controversy: централизация DNS у крупных провайдеров, обход enterprise/parental controls.',
  },
  {
    id: 'sd-networking-036',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'open',
    question: 'Сравните алгоритмы балансировки нагрузки: Round Robin, Least Connections, IP Hash.',
    sampleAnswer:
      'Round Robin: запросы распределяются циклически между серверами (1, 2, 3, 1, 2, 3...). Pros: простой, равномерное распределение. Cons: не учитывает нагрузку сервера, медленный сервер получает столько же запросов. Weighted Round Robin: серверы с разными весами. Least Connections: запрос направляется на сервер с наименьшим числом активных соединений. Pros: адаптируется к нагрузке, учитывает «длинные» запросы. Cons: overhead на tracking connections. Weighted Least Connections: с учётом capacity серверов. IP Hash: hash(client IP) → consistent server. Pros: session affinity без cookies, кэш на сервере эффективен. Cons: неравномерность при skewed IP distribution, проблемы при изменении числа серверов (consistent hashing помогает). Другие: Random, Least Response Time, Resource-based. Выбор зависит от workload: stateless → Least Connections, sticky sessions → IP Hash, simple/legacy → Round Robin.',
    explanation:
      'Выбор алгоритма существенно влияет на распределение нагрузки. Nginx, HAProxy, Envoy поддерживают все основные алгоритмы. Least Connections — хороший default для HTTP APIs.',
  },
  {
    id: 'sd-networking-037',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое DPDK (Data Plane Development Kit)?',
    options: [
      'Инструмент разработки мобильных приложений',
      'Набор библиотек для high-performance packet processing, позволяющий обрабатывать пакеты в userspace минуя kernel network stack',
      'Фреймворк для разработки APIs',
      'Протокол защиты данных',
    ],
    correctIndex: 1,
    explanation:
      'DPDK — набор библиотек от Intel для high-performance packet processing. Суть: bypass kernel network stack, обработка пакетов напрямую из NIC в userspace через polling (вместо interrupts). Производительность: миллионы packets per second на commodity hardware. Использование: software load balancers, virtual switches (OVS-DPDK), NFV (Network Function Virtualization), high-frequency trading. Требует: dedicated CPU cores, hugepages, compatible NICs. Альтернативы: XDP/eBPF (kernel-based, проще интеграция), AF_XDP (socket-based access to XDP). Для большинства приложений overkill, но критичен для network-intensive workloads.',
  },
  {
    id: 'sd-networking-038',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question: 'Как защитить API от DDoS-атак на сетевом уровне? Опишите многоуровневую защиту.',
    sampleAnswer:
      'DDoS protection layers: 1) Network edge (ISP/upstream): blackholing очевидно вредоносного трафика, BGP FlowSpec для filtering. 2) DDoS mitigation service (Cloudflare, AWS Shield, Akamai): anycast распределяет атаку по PoPs, scrubbing centers фильтруют volumetric attacks (L3/L4). 3) CDN/Edge: absorb traffic через caching, rate limiting по IP, geo-blocking, challenge pages (CAPTCHA, JS challenge). 4) WAF (L7): signature-based detection (SQL injection patterns), rate limiting по API key/user, bot detection (fingerprinting, behavioral). 5) Load Balancer: connection limits, SYN cookies, rate limiting. 6) Application: graceful degradation, queue-based processing, circuit breakers. Конкретные атаки: SYN flood → SYN cookies; HTTP flood → rate limiting + CAPTCHA; Slowloris → connection timeouts; Amplification → ingress filtering, BCP38. Важно: over-provision capacity, auto-scaling, incident response plan.',
    explanation:
      'DDoS protection — defense in depth. Cloud-based mitigation (Cloudflare, AWS Shield) — первая линия для volumetric attacks. Application-layer attacks (L7) сложнее — требуют behavioral analysis. Cost: DDoS can be expensive to mitigate — pricing models matter.',
  },
  {
    id: 'sd-networking-039',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите архитектуру edge computing. Как она снижает latency?',
    sampleAnswer:
      'Edge computing — выполнение вычислений ближе к пользователям, на edge of the network. Архитектура: 1) Edge locations: CDN PoPs, regional data centers, on-premise, IoT devices. 2) Compute на edge: Cloudflare Workers (V8 isolates), AWS Lambda@Edge, Fastly Compute@Edge. Код выполняется в <50 edge locations vs 1-3 cloud regions. 3) Data на edge: кэширование, key-value stores (Cloudflare KV, Durable Objects), read replicas. Use cases: 1) Персонализация: A/B testing, geo-specific content без round-trip к origin. 2) Auth: JWT validation на edge. 3) API gateway: rate limiting, transformation, caching. 4) Real-time: gaming, video streaming, IoT. Снижение latency: физическая близость (light speed matters: 100ms cross-Atlantic), reduce round-trips (вычисления локальны). Trade-offs: limited compute/storage, eventual consistency, development complexity.',
    explanation:
      'Edge computing — тренд 2020s. Cloudflare Workers позволяет запустить код в 300+ locations за milliseconds. Для latency-critical приложений (gaming, real-time collaboration) edge computing критичен.',
  },
  {
    id: 'sd-networking-040',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое VPC (Virtual Private Cloud)?',
    options: [
      'Технология шифрования данных',
      'Логически изолированная сеть в облаке с контролем над IP addressing, subnets, routing, security groups',
      'Сервис виртуальных машин',
      'Протокол VPN-подключения',
    ],
    correctIndex: 1,
    explanation:
      'VPC (Virtual Private Cloud) — изолированная сеть в облаке. Компоненты AWS VPC: CIDR block (IP range, например 10.0.0.0/16), Subnets (public с Internet Gateway, private), Route Tables (правила маршрутизации), Internet Gateway (доступ в интернет), NAT Gateway (outbound интернет для private subnets), Security Groups (stateful firewall на instance), Network ACLs (stateless firewall на subnet), VPC Peering (связь между VPCs), VPN/Direct Connect (связь с on-premise). Аналоги: GCP VPC Network, Azure VNet. VPC — фундамент cloud networking.',
  },
  {
    id: 'sd-networking-041',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Что такое HTTP status codes? Назовите основные категории.',
    options: [
      'Идентификаторы версий HTTP протокола',
      'Трёхзначные коды ответа сервера: 1xx (informational), 2xx (success), 3xx (redirection), 4xx (client error), 5xx (server error)',
      'Коды шифрования HTTP-трафика',
      'Номера портов для HTTP-соединений',
    ],
    correctIndex: 1,
    explanation:
      'HTTP status codes указывают результат запроса. 1xx Informational: 101 Switching Protocols (WebSocket upgrade). 2xx Success: 200 OK, 201 Created, 204 No Content. 3xx Redirection: 301 Moved Permanently, 302 Found (temporary), 304 Not Modified (caching). 4xx Client Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests. 5xx Server Error: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout. Правильное использование кодов важно для API design, caching, monitoring.',
  },
  {
    id: 'sd-networking-042',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'open',
    question: 'Как работает health checking в load balancers? Какие типы проверок существуют?',
    sampleAnswer:
      'Health checking позволяет load balancer определить, какие backends healthy для routing трафика. Типы: 1) TCP check: попытка установить TCP connection на port. Простой, проверяет что процесс слушает. 2) HTTP check: отправка HTTP запроса (GET /health), ожидание 2xx response. Более надёжный — проверяет что приложение отвечает. 3) gRPC check: gRPC health checking protocol (grpc.health.v1.Health). 4) Custom script: выполнение скрипта, проверяющего dependencies (DB connection, etc). Параметры: interval (как часто проверять), timeout (максимальное ожидание), threshold (сколько failures до unhealthy, сколько successes до healthy). Passive checks: анализ реального трафика (error rates, latency) вместо/вместе с active probes. Envoy: active health checking + outlier detection (passive). Важно: health endpoint должен быть быстрым и надёжным, проверять critical dependencies.',
    explanation:
      'Health checking — критический компонент high availability. Без него traffic routes к failing backends. Слишком агрессивные checks (short interval, low threshold) вызывают flapping. Balance: достаточно быстрое обнаружение, но stable.',
  },
  {
    id: 'sd-networking-043',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое BGP и почему он важен для интернета?',
    options: [
      'Протокол передачи файлов',
      'Border Gateway Protocol — протокол маршрутизации между автономными системами, определяющий как трафик передаётся между сетями в интернете',
      'Протокол шифрования данных',
      'Балансировщик нагрузки',
    ],
    correctIndex: 1,
    explanation:
      'BGP (Border Gateway Protocol) — протокол маршрутизации между Autonomous Systems (AS) — сетями под единым административным контролем. BGP определяет path selection для трафика через интернет. AS объявляет свои IP prefixes через BGP, соседние AS распространяют информацию. Атрибуты: AS_PATH, LOCAL_PREF, MED влияют на выбор пути. BGP важен: весь inter-domain routing в интернете, CDN/DDoS mitigation используют BGP для anycast и traffic engineering. Риски: BGP hijacking (неправомерное объявление чужих prefixes), misconfigurations вызывают outages (Facebook 2021). RPKI (Resource Public Key Infrastructure) защищает от hijacking.',
  },
  {
    id: 'sd-networking-044',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question: 'Как реализовать API versioning? Сравните подходы: URL path, header, query parameter.',
    sampleAnswer:
      'API versioning approaches: 1) URL path: /api/v1/users, /api/v2/users. Pros: явный, легко кэшировать, просто тестировать (разные URLs). Cons: изменение URL при версионировании, routing complexity. Наиболее распространённый подход. 2) Header: Accept: application/vnd.api+json; version=2 или X-API-Version: 2. Pros: URL не меняется (ресурс тот же), cleaner REST semantics. Cons: сложнее тестировать (нужно указывать header), caching challenges. 3) Query parameter: /api/users?version=2. Pros: простой. Cons: optional parameter может быть забыт, caching issues, не RESTful. Рекомендации: URL path для major versions (breaking changes), header/query для minor. Semantic versioning: MAJOR.MINOR.PATCH. Deprecation: announce заранее, sunset header, документация. Backwards compatibility: добавление fields OK, удаление/изменение — breaking.',
    explanation:
      'Versioning — balance между API evolution и backwards compatibility. Stripe использует date-based versioning (2023-10-16), позволяя постепенную миграцию. GraphQL избегает versioning через additive-only changes.',
  },
  {
    id: 'sd-networking-045',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое GraphQL и чем он отличается от REST?',
    options: [
      'База данных для графов',
      'Query language для API, позволяющий клиенту запрашивать точно те данные, которые нужны, в одном запросе',
      'Протокол шифрования',
      'Система мониторинга API',
    ],
    correctIndex: 1,
    explanation:
      'GraphQL — query language и runtime для APIs, разработанный Facebook. Отличия от REST: 1) Single endpoint vs multiple endpoints. 2) Client specifies exact fields vs server determines response shape. 3) Strongly typed schema vs implicit contract. Преимущества: решает over-fetching (получаем только нужные поля) и under-fetching (один запрос вместо нескольких), introspection (self-documenting), type safety. Недостатки: complexity, caching сложнее (POST запросы, no URL-based cache), N+1 problems на сервере (DataLoader решает), security (complex queries). Use cases: mobile clients с разными потребностями, BFF pattern.',
  },
  {
    id: 'sd-networking-046',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'junior',
    type: 'open',
    question: 'Что такое HTTPS и как он защищает данные?',
    sampleAnswer:
      'HTTPS = HTTP + TLS (Transport Layer Security). Защита: 1) Encryption: данные шифруются, перехват бесполезен. Symmetric encryption (AES) для данных, asymmetric (RSA/ECDH) для key exchange. 2) Authentication: сервер предъявляет certificate, подписанный trusted CA. Клиент проверяет цепочку доверия, убеждается что сервер — тот, за кого себя выдаёт. 3) Integrity: MAC (Message Authentication Code) защищает от tampering — изменённые данные будут отвергнуты. Процесс: TLS handshake (обмен сертификатами, согласование шифров, key exchange) → encrypted channel. TLS 1.3: 1-RTT handshake, безопаснее (removed insecure ciphers), поддержка 0-RTT resumption. HTTPS обязателен: браузеры помечают HTTP как unsafe, SEO penalty, required для HTTP/2 и многих Web APIs.',
    explanation:
      'HTTPS — обязательный стандарт. Let\'s Encrypt сделал бесплатные сертификаты доступными. HSTS (HTTP Strict Transport Security) header заставляет браузеры всегда использовать HTTPS.',
  },
  {
    id: 'sd-networking-047',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'quiz',
    question: 'Что такое network policies в Kubernetes и как они обеспечивают zero trust?',
    options: [
      'Правила маршрутизации между кластерами',
      'Firewall rules на уровне Pod, определяющие разрешённый ingress/egress трафик на основе labels, namespaces, IP ranges',
      'Квоты на сетевой трафик',
      'Правила DNS-резолвинга',
    ],
    correctIndex: 1,
    explanation:
      'NetworkPolicy — Kubernetes resource для network segmentation. По умолчанию: all pods can communicate. После применения NetworkPolicy к pod: deny all except explicitly allowed. Selectors: podSelector (к каким pods применяется), ingress/egress rules (from/to какие pods/namespaces/IPs). Реализация: CNI plugin (Calico, Cilium) — Kubernetes API не enforce сам. Zero trust: deny by default, explicitly allow only required communication. Пример: web pods могут получать traffic только от ingress, backend pods — только от web и cron jobs. Cilium добавляет L7 policies (HTTP path-based). Best practice: namespace isolation, principle of least privilege.',
  },
  {
    id: 'sd-networking-048',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'middle',
    type: 'quiz',
    question: 'Что такое retry и backoff стратегии в distributed systems?',
    options: [
      'Методы сжатия данных',
      'Повторение неудачных запросов с экспоненциально увеличивающимися интервалами для graceful recovery от временных сбоев',
      'Способы балансировки нагрузки',
      'Протоколы шифрования',
    ],
    correctIndex: 1,
    explanation:
      'Retry: повторение запроса при transient failure (network timeout, 503). Backoff: увеличение интервала между retries. Exponential backoff: delay = base * 2^attempt (1s, 2s, 4s, 8s...). Jitter: random component к delay для избежания thundering herd (все retry одновременно). Idempotency: retry безопасен только для idempotent операций (GET, PUT с idempotency key). Retry budget: ограничение % retries во избежание retry storms. Circuit breaker: прекращение retries к failing service. Важно: retry без backoff/jitter ухудшает ситуацию при overload. gRPC, AWS SDK, Envoy имеют built-in retry с configurable policies.',
  },
  {
    id: 'sd-networking-049',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question: 'Как работает service discovery в микросервисной архитектуре? Сравните подходы.',
    sampleAnswer:
      'Service discovery: как сервисы находят друг друга в динамической среде (instances появляются/исчезают). Подходы: 1) Client-side discovery: клиент запрашивает service registry (Consul, Eureka), получает список instances, сам выбирает (load balancing). Pros: гибкий routing. Cons: client complexity, language-specific SDKs. 2) Server-side discovery: клиент обращается к load balancer/proxy, который знает о instances. Pros: простой client. Cons: дополнительный hop. 3) DNS-based: service name → DNS query → IP addresses. Kubernetes Services: ClusterIP creates virtual IP, kube-dns resolves service names. Cons: DNS caching, limited load balancing. 4) Service mesh: sidecar proxy (Envoy) handles discovery transparently. Registries: Consul (HashiCorp), Eureka (Netflix), etcd, Kubernetes Services (built-in). Kubernetes: Service + Endpoints/EndpointSlices + kube-proxy/CNI. Health checking важен для removal of failing instances.',
    explanation:
      'Service discovery — фундамент microservices. Kubernetes делает service discovery built-in через DNS. Для complex routing (canary, A/B) service mesh добавляет capabilities.',
  },
  {
    id: 'sd-networking-050',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Сети и протоколы',
    difficulty: 'senior',
    type: 'open',
    question: 'Опишите сетевую архитектуру для multi-region deployment. Какие компоненты и patterns использовать?',
    sampleAnswer:
      'Multi-region networking: 1) Global Load Balancing: DNS-based (Route 53, Cloud DNS) с latency/geo routing направляет users к ближайшему региону. Anycast для edge. 2) Inter-region connectivity: VPC Peering / Transit Gateway (AWS) для private connectivity между regions. Dedicated links для critical traffic. 3) Regional architecture: каждый region — полный stack (LB, app, DB). Self-sufficient для fault isolation. 4) Database replication: async cross-region replication, или globally distributed DB (Spanner, CockroachDB). Primary region для writes или multi-master. 5) Caching: региональные caches (Redis/ElastiCache per region), CDN для static content. 6) Service mesh: multi-cluster mesh (Istio) для unified traffic management. 7) DNS failover: health checks trigger DNS failover при region outage. 8) Data locality: routing users/data к «домашнему» региону для compliance (GDPR). Challenges: latency (cross-region ~100ms), consistency, cost (cross-region traffic expensive).',
    explanation:
      'Multi-region — значительная complexity и cost. Необходим для: disaster recovery, global user base, compliance. Start simple: active-passive → active-active. Netflix, Google — примеры global-scale architectures.',
  },
];
