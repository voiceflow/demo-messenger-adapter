import axios from 'axios';

import { Config } from '@/types';

export default (config: Config) => {
  axios.defaults.baseURL = config.GENERAL_RUNTIME_ENDPOINT;
  return {
    axios,
  };
};
