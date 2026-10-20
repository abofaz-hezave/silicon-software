import { describe, expect, it } from 'vitest';

import { readInfraConfig } from './config';

const baseEnv = { AWS_REGION: 'eu-west-1', OWNER: 'paul' };

describe('readInfraConfig', () => {
  it('allows non-production stages without a custom domain', () => {
    const config = readInfraConfig(baseEnv, 'dev-paul');

    expect(config).toMatchObject({ awsRegion: 'eu-west-1', owner: 'paul', stage: 'dev-paul' });
    expect(config.domainName).toBeUndefined();
    expect(config.hostedZoneName).toBeUndefined();
  });

  it('requires a domain for production', () => {
    expect(() => readInfraConfig(baseEnv, 'production')).toThrow(/production/);
  });

  it('requires the hosted zone and domain together', () => {
    expect(() => readInfraConfig({ ...baseEnv, DOMAIN_NAME: 'www.example.com' }, 'dev')).toThrow(
      /set together/,
    );
  });

  it('requires the domain to belong to the hosted zone', () => {
    expect(() =>
      readInfraConfig(
        { ...baseEnv, HOSTED_ZONE_NAME: 'example.com', DOMAIN_NAME: 'www.example.org' },
        'dev',
      ),
    ).toThrow(/subdomain/);
  });

  it('accepts a domain within the hosted zone', () => {
    const config = readInfraConfig(
      { ...baseEnv, HOSTED_ZONE_NAME: 'example.com', DOMAIN_NAME: 'www.example.com' },
      'production',
    );

    expect(config.domainName).toBe('www.example.com');
  });

  it('rejects a malformed alarm topic ARN', () => {
    expect(() => readInfraConfig({ ...baseEnv, ALARM_TOPIC_ARN: 'not-an-arn' }, 'dev')).toThrow(
      /ALARM_TOPIC_ARN/,
    );
  });

  it('requires OWNER and AWS_REGION', () => {
    expect(() => readInfraConfig({ AWS_REGION: 'eu-west-1' }, 'dev')).toThrow(/OWNER/);
    expect(() => readInfraConfig({ OWNER: 'paul' }, 'dev')).toThrow(/AWS_REGION/);
  });
});
