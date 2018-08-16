import { validate } from '../helpers';

export default function streamSearchService(client, args) {
  const valid = validate(args, {
    body: 'object',
  });
  if (valid !== true) {
    throw valid;
  }

  if (args.type === undefined || (Array.isArray(args.type) && args.type.length === 0)) {
    throw new Error('Missing fields: type');
  }

  let type;
  if (Array.isArray(args.type)) {
    type = args.type.join();
  } else {
    // eslint-disable-next-line
    type = args.type;
  }

  const { body } = args;

  /* eslint-disable */
  delete args.type;
  delete args.body;
  delete args.stream;

  args.streamonly = 'true';
  /* eslint-enable */
  return client.performWsRequest({
    method: 'POST',
    path: `${type}/_search`,
    params: args,
    body,
  });
}
