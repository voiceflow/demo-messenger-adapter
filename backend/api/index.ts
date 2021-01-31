import express from 'express';

import { ControllerMap, MiddlewareMap } from '@/lib';

import WebhookRouter from './routers/webhook';

export default (middlewares: MiddlewareMap, controllers: ControllerMap) => {
  const router = express.Router();

  router.get('/health', (_, res) => res.send('Healthy'));
  router.use('/webhook', WebhookRouter(middlewares, controllers));

  return router;
};
