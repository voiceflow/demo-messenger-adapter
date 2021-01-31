import './envSetup';

import * as Common from '@voiceflow/common';

import { Config } from './types';

const { getProcessEnv, hasProcessEnv } = Common.utils.general;

const optionalProcessEnv = (name: keyof Config) => (hasProcessEnv(name) ? getProcessEnv(name) : null);

const CONFIG: Config = {
  NODE_ENV: getProcessEnv('NODE_ENV'),
  PORT: getProcessEnv('PORT'),

  GENERAL_RUNTIME_ENDPOINT: getProcessEnv('GENERAL_RUNTIME_ENDPOINT'),
  VERIFY_TOKEN: getProcessEnv('VERIFY_TOKEN'),

  // Release information
  GIT_SHA: optionalProcessEnv('GIT_SHA'),
  BUILD_NUM: optionalProcessEnv('BUILD_NUM'),
  SEM_VER: optionalProcessEnv('SEM_VER'),
  BUILD_URL: optionalProcessEnv('BUILD_URL'),

  // Logging
  LOG_LEVEL: optionalProcessEnv('LOG_LEVEL'),
  MIDDLEWARE_VERBOSITY: optionalProcessEnv('MIDDLEWARE_VERBOSITY'),
};

export default CONFIG;
