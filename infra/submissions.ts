export function createSubmissionsApi(table: sst.aws.Dynamo) {
  const api = new sst.aws.ApiGatewayV2('SubmissionsApi', {
    accessLog: { retention: '1 month' },
    transform: {
      stage: {
        defaultRouteSettings: {
          throttlingBurstLimit: 10,
          throttlingRateLimit: 5,
        },
      },
    },
  });

  const route = api.route('POST /submissions', {
    handler: 'infra/functions/submissions.handler',
    runtime: 'nodejs24.x',
    environment: { SUBMISSIONS_TABLE_NAME: table.name },
    permissions: [{ actions: ['dynamodb:PutItem'], resources: [table.arn] }],
    logging: { retention: '1 month', format: 'json' },
  });

  return { api, route };
}
