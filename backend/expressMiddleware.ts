import bodyParser from 'body-parser';
import compression from 'compression';
import timeout from 'connect-timeout';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as Express from 'express';
import helmet from 'helmet';
import _ from 'lodash';

import { ControllerMap, MiddlewareMap } from '@/lib';
import log from '@/logger';

import api from './api';
import { ERROR_RESPONSE_MS } from './constants';
/**
 * @class
 */
class ExpressMiddleware {
  /**
   * Attach express middleware to app
   */
  static attach(app: Express.Application, middlewares: MiddlewareMap, controllers: ControllerMap) {
    if (!_.isObject(app) || !_.isObject(middlewares) || !_.isObject(controllers)) {
      throw new Error('must have app, middlewares, and controllers');
    }

    // Reflect requested object for effectively a wildcard CORS setting
    const corsOptions = {
      origin: true,
      credentials: true,
    };

    app.use(cors(corsOptions));
    app.use(helmet());

    app.use(compression());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
      })
    );
    app.use(cookieParser());
    app.enable('trust proxy');
    app.disable('x-powered-by');

    app.use(log.logMiddleware());
    app.use(timeout(String(ERROR_RESPONSE_MS)));
    app.use((req, _res, next) => !req.timedout && next());

    // All valid routes handled here
    app.use(api(middlewares, controllers));
  }
}

export default ExpressMiddleware;
