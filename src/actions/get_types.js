import Stream from 'stream';

export default function getTypesService(client) {
  const stream = new Stream();

  client
    .performFetchRequest({
      method: 'GET',
      path: '_mapping',
    })
    .on('data', (data) => {
      const types = Object.keys(data[client.appname].mappings).filter(
        type => type !== '_default_',
      );
      stream.emit('data', types);
    })
    .on('error', (error) => {
      stream.emit('error', error);
    })
    .on('end', () => {
      stream.emit('end');
    });

  return stream;
}
