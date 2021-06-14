import { removeUndefined, validate } from '../../utils/index';

/**
 * Delete Service
 * @param {Object} args
 * @param {String} args.type
 * @param {String} args.id
 */
function deleteApi(args) {
  const parsedArgs = removeUndefined(args);
  // Validate arguments
  const valid = validate(parsedArgs, {
    id: 'string|number',
  });
  if (valid !== true) {
    throw valid;
  }

  const { type = '_doc', id } = parsedArgs;
  delete parsedArgs.type;
  delete parsedArgs.id;

  const path = `${type}/${encodeURIComponent(id)}`;

  return this.performFetchRequest({
    method: 'DELETE',
    path,
    params: parsedArgs,
  });
}
export default deleteApi;
