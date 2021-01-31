import { Config } from '@/types';

class KVStore {
  private store: Map<string, any>;

  constructor() {
    this.store = new Map();
  }

  get = async (key: string): Promise<string | undefined> => {
    return this.store.get(key);
  };

  set = async (key: string, value: any) => {
    return this.store.set(key, value);
  };

  delete = async (key: string): Promise<boolean> => {
    return this.store.delete(key);
  };
}

const KVStoreClient = (_config: Config): KVStore => {
  return new KVStore();
};

export default KVStoreClient;
