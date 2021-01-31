import * as ExpressCore from 'express-serve-static-core';

export interface Config {
  NODE_ENV: string;
  PORT: string;

  MESSENGER_API_ENDPOINT: string;
  GENERAL_RUNTIME_ENDPOINT: string;
  VERIFY_TOKEN: string;

  // Release information
  GIT_SHA: string | null;
  BUILD_NUM: string | null;
  SEM_VER: string | null;
  BUILD_URL: string | null;

  // Logging
  LOG_LEVEL: string | null;
  MIDDLEWARE_VERBOSITY: string | null;
}

export type Request<Params extends Record<string, any> = Record<string, any>, ResBody = any, ReqBody = any> = ExpressCore.Request<
  Params,
  ResBody,
  ReqBody
>;

export type Response<ResBody = any> = ExpressCore.Response<ResBody>;

export type Next = ExpressCore.NextFunction;

export type Middleware = (req: Request, res: Response, next: Next) => Promise<void>;

export type InstanceMap<T extends Record<string, new (...args: any[]) => any>> = {
  [K in keyof T]: InstanceType<T[K]>;
};
