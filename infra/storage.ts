export function createStorage() {
  return new sst.aws.Dynamo('Submissions', {
    fields: { id: 'string' },
    primaryIndex: { hashKey: 'id' },
    transform: {
      table: {
        serverSideEncryption: { enabled: true },
      },
    },
  });
}
