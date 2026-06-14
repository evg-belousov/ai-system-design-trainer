import { urlShortenerScenario } from '@/data/en/constructor/url-shortener';
import { rateLimiterScenario } from '@/data/en/constructor/rate-limiter';
import { notificationSystemScenario } from '@/data/en/constructor/notification-system';
import { chatMessengerScenario } from '@/data/en/constructor/chat-messenger';
import { newsFeedScenario } from '@/data/en/constructor/news-feed';
import { videoStreamingScenario } from '@/data/en/constructor/video-streaming';
import { collaborativeEditorScenario } from '@/data/en/constructor/collaborative-editor';
import { rideSharingScenario } from '@/data/en/constructor/ride-sharing';
import type { Scenario } from '@/data/constructor/types';

export const enScenarios: Scenario[] = [
  urlShortenerScenario,
  rateLimiterScenario,
  notificationSystemScenario,
  chatMessengerScenario,
  newsFeedScenario,
  videoStreamingScenario,
  collaborativeEditorScenario,
  rideSharingScenario,
];
