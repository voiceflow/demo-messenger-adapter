import { Config } from '@/types';

import KVStoreClient from './kvstore';
import Static from './static';

/**
 * Build all clients
 */
const buildClients = (config: Config) => {
  const kvstore = KVStoreClient(config);
  const statics = Static(config);
  return {
    ...statics,
    kvstore,
  };
};

export default buildClients;

export type ClientMap = ReturnType<typeof buildClients>;
