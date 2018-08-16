import { validate } from '../helpers';

export default function deleteService(client, args) {
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

  const path = `${type}/${encodeURIComponent(id)}`;

  return client.performFetchRequest({
    method: 'DELETE',
    path,
    params: args,
  });
}
