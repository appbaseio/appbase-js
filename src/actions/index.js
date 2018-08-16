import { validate } from '../helpers';

export default function indexService(client, args) {
  const valid = validate(args, {
    type: 'string',
    body: 'object',
  });
  if (valid !== true) {
    throw valid;
  }

  const { type, id, body } = args;

  // eslint-disable-next-line
  delete args.type;
  // eslint-disable-next-line
  delete args.body;
  // eslint-disable-next-line
  delete args.id;

  let path;
  if (id) {
    path = `${type}/${encodeURIComponent(id)}`;
  } else {
    path = type;
  }

  return client.performFetchRequest({
    method: 'POST',
    path,
    params: args,
    body,
  });
}
