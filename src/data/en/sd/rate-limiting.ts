import type { Question } from '@/data/types';

export const rateLimitingQuestions: Question[] = [
  {
    id: 'sd-rate-limiting-001',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting and API Protection',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is rate limiting and why is it needed?',
    options: [
      'Limiting HTTP request size for traffic conservation',
      'Limiting request quantity client can send per period, protecting service from overload and abuse',
      'Limiting data transmission speed between servers',
      'Mechanism for prioritizing requests from VIP clients',
    ],
    correctIndex: 1,
    explanation:
      'Rate limiting is mechanism controlling request frequency to API or service. Goals: 1) Overload protection—preventing service refusal at traffic peaks. 2) Abuse protection—preventing DDoS, brute-force, scraping. 3) Fair resource distribution—one client shouldn\'t consume all resources. 4) Cost control—limiting expensive downstream usage. Rate limiting returns HTTP 429 (Too Many Requests) on limit exceeded.',
  },
  {
    id: 'sd-rate-limiting-002',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting and API Protection',
    difficulty: 'junior',
    type: 'quiz',
    question: 'How does Token Bucket algorithm work?',
    options: [
      'Bucket filled with tokens at fixed rate; each request takes token; if bucket empty—request rejected; bucket has max capacity',
      'Each request creates new token, all deleted at limit',
      'Tokens distributed equally to users hourly',
      'Requests queued and processed strictly in order',
    ],
    correctIndex: 0,
    explanation:
      'Token Bucket is popular rate limiting algorithm. Principle: 1) Bucket has max capacity (burst size). 2) Tokens added at fixed rate (rate). 3) Each request takes one token. 4) No tokens—request rejected or queued. Advantage: allows "bursts"—if bucket full, client can send multiple requests. Parameters: rate (tokens/sec) and burst (max capacity). Used: AWS API Gateway, Nginx, Stripe API.',
  },
  {
    id: 'sd-rate-limiting-003',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting and API Protection',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Which HTTP code is returned when request limit exceeded?',
    options: [
      '403 Forbidden',
      '429 Too Many Requests',
      '503 Service Unavailable',
      '408 Request Timeout',
    ],
    correctIndex: 1,
    explanation:
      'HTTP 429 Too Many Requests is standard code (RFC 6585) indicating client sent too many requests per period. Response usually includes Retry-After header (wait seconds) and X-RateLimit-* headers (limit, remaining, reset). Important: distinguish from 503 Service Unavailable (server overloaded overall) and 403 Forbidden (access denied for other reasons).',
  },
  {
    id: 'sd-rate-limiting-004',
    block: 'sd',
    topic: 'rate-limiting',
    topicLabel: 'Rate Limiting and API Protection',
    difficulty: 'junior',
    type: 'quiz',
    question: 'Which infrastructure component usually handles rate limiting in microservice architecture?',
    options: [
      'Each microservice implements own rate limiter',
      'API Gateway—single entry point with centralized rate limiting policies',
      'Database limits its own query requests',
      'CDN performs rate limiting for all request types',
    ],
    correctIndex: 1,
    explanation:
      'API Gateway—standard rate limiting place. It\'s single entry point for external requests with different policies: global limits, per-user (API key), per-IP, per-endpoint. Examples: Kong, AWS API Gateway, Apigee, Envoy. However, rate limiting can apply elsewhere: load balancer (L4), CDN (static), service (specific logic), middleware.',
  },
];
