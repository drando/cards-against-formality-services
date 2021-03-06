import { ServiceBroker } from 'moleculer';
import HealthMiddleware from '@cards-against-formality/health-check-mixin';

import Service from './rooms-service';

const registry = {
  strategy: 'CpuUsage'
};

const circuitBreaker = {
  enabled: true,
  halfOpenTime: 10 * 1000,
};

const retryPolicy = {
  enabled: true,
  retries: 5,
  delay: 100,
  maxDelay: 2000,
  factor: 2,
  check: err => err && !!(err as any).retryable
};

const broker = new ServiceBroker({
  logger: true,
  middlewares: [HealthMiddleware()],
  logLevel: 'info',
  logFormatter: 'short',
  metrics: false,
  cacher: {
    type: 'Redis',
    options: {
      prefix: 'ROOMS-MOL',
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      }
    }
  },
  transporter: process.env.TRANSPORTER_URI,
  circuitBreaker,
  retryPolicy,
  registry
});

new Service(broker);

broker.start();
