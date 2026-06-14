import type { Question } from '@/data/types';

export const networkingQuestions: Question[] = [
  {
    id: 'sd-networking-001',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Networks and Protocols',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What happens during DNS resolution of a domain name?',
    options: [
      'Browser sends request directly to web server by domain name',
      'Hierarchical DNS system transforms domain name to IP: local cache → recursive resolver → root → TLD → authoritative DNS',
      'Domain name is encrypted and used as routing key',
      'DNS server loads HTML page and caches it',
    ],
    correctIndex: 1,
    explanation:
      'DNS (Domain Name System) is hierarchical system transforming domain names to IP addresses. Process: 1) Browser checks local cache. 2) Request to recursive DNS resolver (usually ISP). 3) Resolver queries root DNS servers (.), directed to TLD servers (.com, .ru). 4) TLD servers direct to authoritative DNS server. 5) Authoritative server returns IP address. Each level caches result per TTL.',
  },
  {
    id: 'sd-networking-002',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Networks and Protocols',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is the main difference between TCP and UDP?',
    options: [
      'TCP works only in local networks, UDP in global',
      'TCP ensures reliable ordered delivery with connection setup, UDP unreliable delivery without connection but lower latency',
      'TCP faster than UDP in all scenarios',
      'UDP supports encryption by default, TCP does not',
    ],
    correctIndex: 1,
    explanation:
      'TCP (Transmission Control Protocol): establishes connection (3-way handshake), guarantees delivery (retransmission), packet order (sequencing), flow control. Used: HTTP, FTP, email. UDP (User Datagram Protocol): no connection setup, no delivery guarantee or order, minimal overhead. Used: DNS, video streaming, online games, VoIP. UDP faster due to no connection overhead.',
  },
  {
    id: 'sd-networking-003',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Networks and Protocols',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is WebSocket and what is it used for?',
    options: [
      'Protocol for file transmission between servers',
      'Full-duplex bidirectional protocol over TCP allowing server and client real-time data exchange',
      'HTTP extension for larger file download',
      'Browser static resource caching mechanism',
    ],
    correctIndex: 1,
    explanation:
      'WebSocket is protocol providing persistent bidirectional connection. Initiated with HTTP Upgrade request, then connection transitions to WebSocket protocol. Advantages: real-time (low latency), server push (no polling needed), lower overhead (no HTTP headers per message). Used: chats, notifications, live data (stock quotes), collaborative editing, online games.',
  },
  {
    id: 'sd-networking-004',
    block: 'sd',
    topic: 'networking',
    topicLabel: 'Networks and Protocols',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is a reverse proxy?',
    options: [
      'Proxy where client anonymously connects to servers',
      'Intermediary server standing before backend servers, accepting client requests and forwarding to backend, returning responses',
      'Mechanism inverting packet order for faster transmission',
      'Protocol allowing server to initiate connection with client',
    ],
    correctIndex: 1,
    explanation:
      'Reverse proxy stands between clients and backend servers. Client requests reverse proxy, which forwards to one backend server. Functions: load balancing, SSL termination, caching, compression, DDoS protection, hiding backend architecture. Examples: Nginx, HAProxy, Envoy, Traefik. Unlike forward proxy (client side), reverse proxy is server side.',
  },
];
