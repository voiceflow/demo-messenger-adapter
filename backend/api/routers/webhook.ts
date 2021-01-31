import express from 'express';

import { ControllerMap, MiddlewareMap } from '@/lib';

export default (_middlewares: MiddlewareMap, controllers: ControllerMap) => {
  const router = express.Router();

  router.get('/', controllers.webhook.get);
  router.post('/', controllers.webhook.post);

  return router;
};
