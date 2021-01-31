import axios from 'axios';

import { Config } from '@/types';

export default (config: Config) => {
  const runtimeAxios = axios.create({
    baseURL: config.GENERAL_RUNTIME_ENDPOINT,
  });

  const messengerAxios = axios.create({
    baseURL: config.MESSENGER_API_ENDPOINT,
  });
  return {
    runtimeAxios,
    messengerAxios,
  };
};
