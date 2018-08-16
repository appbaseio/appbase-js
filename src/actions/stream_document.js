import { validate } from '../helpers';

export default function streamDocumentService(client, args) {
  const valid = validate(args, {
    type: 'string',
    id: 'string',
  });
  if (valid !== true) {
    throw valid;
  }

  const { type, id } = args;

  // eslint-disable-next-line
  delete args.type;
  // eslint-disable-next-line
  delete args.id;
  // eslint-disable-next-line
  delete args.stream;

  if (args.stream === true || args.stream === 'true') {
    // eslint-disable-next-line
    args.stream = 'true';
  } else {
    // eslint-disable-next-line
    delete args.stream;
    // eslint-disable-next-line
    args.streamonly = 'true';
  }

  return client.performWsRequest({
    method: 'GET',
    path: `${type}/${encodeURIComponent(id)}`,
    params: args,
  });
}
