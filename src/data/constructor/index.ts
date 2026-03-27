export type { Scenario, Step, Decision, Option, Impact, ReferenceSolution, MetricKey, CapacityEstimate } from './types';

export { urlShortenerScenario } from './url-shortener';
export { rateLimiterScenario } from './rate-limiter';
export { notificationSystemScenario } from './notification-system';
export { chatMessengerScenario } from './chat-messenger';
export { newsFeedScenario } from './news-feed';
export { videoStreamingScenario } from './video-streaming';
export { collaborativeEditorScenario } from './collaborative-editor';
export { rideSharingScenario } from './ride-sharing';

import { urlShortenerScenario } from './url-shortener';
import { rateLimiterScenario } from './rate-limiter';
import { notificationSystemScenario } from './notification-system';
import { chatMessengerScenario } from './chat-messenger';
import { newsFeedScenario } from './news-feed';
import { videoStreamingScenario } from './video-streaming';
import { collaborativeEditorScenario } from './collaborative-editor';
import { rideSharingScenario } from './ride-sharing';
import type { Scenario } from './types';

export const allScenarios: Scenario[] = [
  urlShortenerScenario,
  rateLimiterScenario,
  notificationSystemScenario,
  chatMessengerScenario,
  newsFeedScenario,
  videoStreamingScenario,
  collaborativeEditorScenario,
  rideSharingScenario,
];
