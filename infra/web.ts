import type { InfraConfig } from './config';

export const OPEN_NEXT_VERSION = '4.1.9';

export function createWeb(api: sst.aws.ApiGatewayV2, config: InfraConfig) {
  return new sst.aws.Nextjs('Web', {
    path: 'apps/web',
    openNextVersion: OPEN_NEXT_VERSION,
    environment: { SUBMISSIONS_API_URL: api.url },
    domain: config.domainName ? { name: config.domainName, dns: sst.aws.dns() } : undefined,
    transform: {
      server: {
        logging: { retention: '1 month' },
      },
    },
  });
}
