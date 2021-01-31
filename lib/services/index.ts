import { Config, InstanceMap } from '@/types';

import { ClientMap } from '../clients';
import WebhookManager from './webhookManager';

const SERVICES = {
  webhookManager: WebhookManager,
} as const;

export type ServiceMap = InstanceMap<typeof SERVICES>;

/**
 * Build all services
 */

const buildServices = ({ config, clients }: { config: Config; clients: ClientMap }): ServiceMap => {
  return Object.entries(SERVICES).reduce<ServiceMap>(
    (acc, [key, Service]) => Object.assign(acc, { [key]: new Service({ clients, services: acc, config }) }),
    {} as any
  );
};

export default buildServices;
