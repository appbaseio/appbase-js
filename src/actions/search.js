import { validate } from '../helpers';

export default function searchService(client, args) {
  const valid = validate(args, {
    body: 'object',
  });
  if (valid !== true) {
    throw valid;
  }

  let type;
  if (Array.isArray(args.type)) {
    type = args.type.join();
  } else {
    // eslint-disable-next-line
    type = args.type;
  }

  const { body } = args;

  // eslint-disable-next-line
  delete args.type;
  // eslint-disable-next-line
  delete args.body;

  let path;
  if (type) {
    path = `${type}/_search`;
  } else {
    path = '_search';
  }

  return client.performFetchRequest({
    method: 'POST',
    path,
    params: args,
    body,
  });
}
