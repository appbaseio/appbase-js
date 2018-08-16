import { validate } from '../helpers';

export default function bulkService(client, args) {
  const valid = validate(args, {
    body: 'object',
  });
  if (valid !== true) {
    throw valid;
  }

  const { type, body } = args;

  // eslint-disable-next-line
  delete args.type;
  // eslint-disable-next-line
  delete args.body;

  let path;
  if (type) {
    path = `${type}/_bulk`;
  } else {
    path = '/_bulk';
  }

  return client.performFetchRequest({
    method: 'POST',
    path,
    params: args,
    body,
  });
}
