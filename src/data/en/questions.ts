import type { Question } from '@/data/types';

import { modelingQuestions } from '@/data/en/sa/modeling';
import { architectureQuestions } from '@/data/en/sa/architecture';
import { databasesQuestions } from '@/data/en/sa/databases';
import { securityQuestions } from '@/data/en/sa/security';
import { questions as requirementsQuestions } from '@/data/en/sa/requirements';
import { questions as bpmnQuestions } from '@/data/en/sa/bpmn';
import { questions as dataModelingQuestions } from '@/data/en/sa/data-modeling';

import { scalabilityQuestions } from '@/data/en/sd/scalability';
import { loadBalancingQuestions } from '@/data/en/sd/load-balancing';
import { cachingQuestions } from '@/data/en/sd/caching';
import { sdDatabasesQuestions } from '@/data/en/sd/databases';
import { messageQueuesQuestions } from '@/data/en/sd/message-queues';
import { cdnQuestions } from '@/data/en/sd/cdn';
import { apiDesignQuestions } from '@/data/en/sd/api-design';
import { microservicesQuestions } from '@/data/en/sd/microservices';
import { capTheoremQuestions } from '@/data/en/sd/cap-theorem';
import { resilienceQuestions } from '@/data/en/sd/resilience';
import { observabilityQuestions } from '@/data/en/sd/observability';
import { authQuestions } from '@/data/en/sd/auth';
import { eventDrivenQuestions } from '@/data/en/sd/event-driven';
import { replicationQuestions } from '@/data/en/sd/replication';
import { networkingQuestions } from '@/data/en/sd/networking';
import { rateLimitingQuestions } from '@/data/en/sd/rate-limiting';

import { mlFundamentalsQuestions } from '@/data/en/ai/ml-fundamentals';
import { neuralNetworksQuestions } from '@/data/en/ai/neural-networks';
import { transformersQuestions } from '@/data/en/ai/transformers';
import { llmFundamentalsQuestions } from '@/data/en/ai/llm-fundamentals';
import { llmInferenceQuestions } from '@/data/en/ai/llm-inference';
import { ragQuestions } from '@/data/en/ai/rag';
import { agentsQuestions } from '@/data/en/ai/agents';
import { promptEngineeringQuestions } from '@/data/en/ai/prompt-engineering';
import { vectorDatabasesQuestions } from '@/data/en/ai/vector-databases';
import { mlopsQuestions } from '@/data/en/ai/mlops';
import { aiSafetyQuestions } from '@/data/en/ai/ai-safety';
import { evaluationQuestions } from '@/data/en/ai/evaluation';

export const enQuestions: Question[] = [
  ...modelingQuestions,
  ...architectureQuestions,
  ...databasesQuestions,
  ...securityQuestions,
  ...requirementsQuestions,
  ...bpmnQuestions,
  ...dataModelingQuestions,
  ...scalabilityQuestions,
  ...loadBalancingQuestions,
  ...cachingQuestions,
  ...sdDatabasesQuestions,
  ...messageQueuesQuestions,
  ...cdnQuestions,
  ...apiDesignQuestions,
  ...microservicesQuestions,
  ...capTheoremQuestions,
  ...resilienceQuestions,
  ...observabilityQuestions,
  ...authQuestions,
  ...eventDrivenQuestions,
  ...replicationQuestions,
  ...networkingQuestions,
  ...rateLimitingQuestions,
  ...mlFundamentalsQuestions,
  ...neuralNetworksQuestions,
  ...transformersQuestions,
  ...llmFundamentalsQuestions,
  ...llmInferenceQuestions,
  ...ragQuestions,
  ...agentsQuestions,
  ...promptEngineeringQuestions,
  ...vectorDatabasesQuestions,
  ...mlopsQuestions,
  ...aiSafetyQuestions,
  ...evaluationQuestions,
];
