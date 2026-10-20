/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  async app(input) {
    const { readInfraConfig } = await import('./infra/config');
    const config = readInfraConfig(process.env, input.stage);
    const production = input.stage === 'production';

    return {
      name: config.appName,
      removal: production ? 'retain' : 'remove',
      protect: production,
      home: 'aws',
      providers: {
        aws: {
          region: config.awsRegion,
          defaultTags: {
            tags: {
              application: config.appName,
              stage: input.stage,
              owner: config.owner,
              'cost-allocation': `${config.appName}-${input.stage}`,
            },
          },
        },
      },
    };
  },
  async run() {
    const { readInfraConfig } = await import('./infra/config');
    const { createStorage } = await import('./infra/storage');
    const { createSubmissionsApi } = await import('./infra/submissions');
    const { createWeb } = await import('./infra/web');
    const { createAlarms } = await import('./infra/alarms');

    const config = readInfraConfig(process.env, $app.stage);
    const table = createStorage();
    const { api, route } = createSubmissionsApi(table);
    const web = createWeb(api, config);
    const submissionsFunctionName = route.nodes.function.name;
    const webFunctionName = $util.output(web.nodes.server).apply((server) => {
      if (!server) throw new Error('The web server function was not created');
      return server.name;
    });

    createAlarms({
      submissionsFunctionName,
      webFunctionName,
      apiId: api.nodes.api.id,
      tableName: table.name,
      alarmTopicArn: config.alarmTopicArn,
    });

    return {
      siteUrl: web.url,
      apiUrl: api.url,
      tableName: table.name,
      submissionsFunctionLogGroup: submissionsFunctionName.apply((name) => `/aws/lambda/${name}`),
      webFunctionLogGroup: webFunctionName.apply((name) => `/aws/lambda/${name}`),
      apiAccessLogGroup: api.nodes.logGroup.name,
    };
  },
});
