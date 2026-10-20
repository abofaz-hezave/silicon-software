import * as aws from '@pulumi/aws';
import type { Input } from '@pulumi/pulumi';

export interface AlarmSources {
  submissionsFunctionName: Input<string>;
  webFunctionName: Input<string>;
  apiId: Input<string>;
  tableName: Input<string>;
  alarmTopicArn?: string;
}

interface AlarmMetric {
  namespace: string;
  metricName: string;
  dimensions: Record<string, Input<string>>;
}

export function createAlarms(sources: AlarmSources) {
  const alarmActions = sources.alarmTopicArn ? [sources.alarmTopicArn] : [];

  const alarm = (logicalName: string, metric: AlarmMetric) =>
    new aws.cloudwatch.MetricAlarm(logicalName, {
      namespace: metric.namespace,
      metricName: metric.metricName,
      dimensions: metric.dimensions,
      statistic: 'Sum',
      period: 300,
      evaluationPeriods: 1,
      threshold: 0,
      comparisonOperator: 'GreaterThanThreshold',
      treatMissingData: 'notBreaching',
      alarmActions,
    });

  const lambdaMetrics = (logicalName: string, functionName: Input<string>) => [
    alarm(`${logicalName}Errors`, {
      namespace: 'AWS/Lambda',
      metricName: 'Errors',
      dimensions: { FunctionName: functionName },
    }),
    alarm(`${logicalName}Throttles`, {
      namespace: 'AWS/Lambda',
      metricName: 'Throttles',
      dimensions: { FunctionName: functionName },
    }),
  ];

  return [
    ...lambdaMetrics('SubmissionsFunction', sources.submissionsFunctionName),
    ...lambdaMetrics('WebFunction', sources.webFunctionName),
    alarm('SubmissionsApi5xx', {
      namespace: 'AWS/ApiGateway',
      metricName: '5xx',
      dimensions: { ApiId: sources.apiId, Stage: '$default' },
    }),
    alarm('SubmissionsTableWriteThrottleEvents', {
      namespace: 'AWS/DynamoDB',
      metricName: 'WriteThrottleEvents',
      dimensions: { TableName: sources.tableName },
    }),
  ];
}
