export const DEFAULT_PROJECT_PROMPTS = [
  {
    id: 'proj_arch_overview',
    title: 'Walk me through the high-level architecture of your project',
    subtopicId: 'proj_backend',
    category: 'Architecture',
    defaultNote: 'Key components, request lifecycle, APIs, services, and communication protocols used.'
  },
  {
    id: 'proj_db_choice',
    title: 'Why did you pick this specific Database over alternatives (e.g., Relational vs NoSQL)?',
    subtopicId: 'proj_backend',
    category: 'Database & Storage',
    defaultNote: 'Data access patterns, schema flexibility requirements, ACID vs eventual consistency trade-offs.'
  },
  {
    id: 'proj_scale_10x',
    title: 'What bottlenecks emerge if traffic/data scales by 10x tomorrow?',
    subtopicId: 'proj_scalability',
    category: 'Scalability',
    defaultNote: 'Database read/write limits, single point of failures, caching opportunities (Redis), queueing (Kafka/RabbitMQ).'
  },
  {
    id: 'proj_hardest_bug',
    title: 'What was the hardest bug or edge case you encountered, and how did you debug it?',
    subtopicId: 'proj_experience',
    category: 'Debugging & Problem Solving',
    defaultNote: 'Root cause analysis, debugging tools used (profilers, logs, distributed tracing), and long-term fix.'
  },
  {
    id: 'proj_auth_security',
    title: 'How is authentication, authorization, and security handled in your app?',
    subtopicId: 'proj_security',
    category: 'Security',
    defaultNote: 'JWT/OAuth flow, password hashing (bcrypt/Argon2), rate limiting, CORS, input sanitization.'
  },
  {
    id: 'proj_concurrency',
    title: 'How does your app handle race conditions or concurrent state updates?',
    subtopicId: 'proj_backend',
    category: 'Concurrency',
    defaultNote: 'Pessimistic/Optimistic locking, atomic operations, DB transactions, idempotent API endpoints.'
  },
  {
    id: 'proj_caching',
    title: 'Where do you use caching, and what cache invalidation strategy do you apply?',
    subtopicId: 'proj_scalability',
    category: 'Caching',
    defaultNote: 'Redis/Memcached keys, TTL settings, Write-through vs Cache-aside, cache stampede prevention.'
  },
  {
    id: 'proj_testing_ci',
    title: 'How do you ensure reliability? (Testing strategy & CI/CD pipeline)',
    subtopicId: 'proj_experience',
    category: 'DevOps & Quality',
    defaultNote: 'Unit tests, Integration testing, GitHub Actions pipeline, automated linting & staging deploys.'
  },
  {
    id: 'proj_tradeoffs',
    title: 'What feature or design decision did you have to compromise on, and why?',
    subtopicId: 'proj_experience',
    category: 'Trade-offs',
    defaultNote: 'Time constraints vs complexity, premature optimization vs velocity, technology stack trade-offs.'
  },
  {
    id: 'proj_observability',
    title: 'How do you monitor application health, errors, and performance metrics in production?',
    subtopicId: 'proj_scalability',
    category: 'Observability',
    defaultNote: 'Structured logging, APM tools (Sentry/Datadog), uptime alerts, metrics (latency, error rates, throughput).'
  },
  {
    id: 'proj_schema_migr',
    title: 'How do you execute zero-downtime database schema migrations?',
    subtopicId: 'proj_backend',
    category: 'Database & Storage',
    defaultNote: 'Expand-contract pattern, blue-green deployments, backward-compatible column migrations.'
  },
  {
    id: 'proj_failure_modes',
    title: 'What happens if a dependent third-party service/API goes down?',
    subtopicId: 'proj_scalability',
    category: 'Resilience',
    defaultNote: 'Circuit breaker pattern, retry backoff strategies, graceful degradation, fallback responses.'
  }
];
