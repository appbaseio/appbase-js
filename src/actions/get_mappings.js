export default function getMappingsService(client) {
  return client.performFetchRequest({
    method: 'GET',
    path: '_mapping',
  });
}
