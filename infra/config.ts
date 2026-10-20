import { z } from 'zod';

const APP_NAME = 'silicon-software';

const envSchema = z.object({
  AWS_REGION: z.string().min(1),
  OWNER: z.string().min(1),
  HOSTED_ZONE_NAME: z.hostname().optional(),
  DOMAIN_NAME: z.hostname().optional(),
  ALARM_TOPIC_ARN: z
    .string()
    .regex(/^arn:aws[\w-]*:sns:[\w-]+:\d{12}:[\w-]+$/)
    .optional(),
});

export interface InfraConfig {
  appName: string;
  stage: string;
  awsRegion: string;
  owner: string;
  hostedZoneName?: string;
  domainName?: string;
  alarmTopicArn?: string;
}

export function readInfraConfig(
  env: Record<string, string | undefined>,
  stage: string,
): InfraConfig {
  const values = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [key, value === '' ? undefined : value]),
  );
  const parsed = envSchema.safeParse(values);
  if (!parsed.success) {
    const problems = parsed.error.issues.map(
      (issue) => `${issue.path.join('.')}: ${issue.message}`,
    );
    throw new Error(`Invalid infrastructure configuration: ${problems.join('; ')}`);
  }

  const { HOSTED_ZONE_NAME: hostedZoneName, DOMAIN_NAME: domainName } = parsed.data;
  if (Boolean(hostedZoneName) !== Boolean(domainName)) {
    throw new Error('HOSTED_ZONE_NAME and DOMAIN_NAME must be set together or both omitted');
  }
  if (
    domainName &&
    hostedZoneName &&
    domainName !== hostedZoneName &&
    !domainName.endsWith(`.${hostedZoneName}`)
  ) {
    throw new Error('DOMAIN_NAME must be HOSTED_ZONE_NAME or a subdomain of it');
  }
  if (stage === 'production' && !domainName) {
    throw new Error('HOSTED_ZONE_NAME and DOMAIN_NAME are required for the production stage');
  }

  return {
    appName: APP_NAME,
    stage,
    awsRegion: parsed.data.AWS_REGION,
    owner: parsed.data.OWNER,
    hostedZoneName,
    domainName,
    alarmTopicArn: parsed.data.ALARM_TOPIC_ARN,
  };
}
