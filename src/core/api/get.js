import { removeUndefined, validate } from '../../utils/index';

/**
 * Get Service
 * @param {Object} args
 * @param {String} args.type
 * @param {String} args.id
 */
function getApi(args) {
  const parsedArgs = removeUndefined(args);
  // Validate arguments
  const valid = validate(parsedArgs, {
    type: 'string',
    id: 'string',
  });

  if (valid !== true) {
    throw valid;
  }

  const { type, id } = parsedArgs;

  delete parsedArgs.type;
  delete parsedArgs.id;

  const path = `${type}/${encodeURIComponent(id)}`;

  return this.performFetchRequest({
    method: 'GET',
    path,
    params: parsedArgs,
  });
}
export default getApi;
