import { removeUndefined, validate } from '../../utils/index';

/**
 * Bulk Service
 * @param {Object} args
 * @param {String} args.type
 * @param {Object} args.body
 */
function bulkApi(args) {
  const parsedArgs = removeUndefined(args);
  // Validate arguments
  const valid = validate(parsedArgs, {
    body: 'object',
  });
  if (valid !== true) {
    throw valid;
  }

  const { type, body } = parsedArgs;

  delete parsedArgs.type;
  delete parsedArgs.body;

  let path;
  if (type) {
    path = `${type}/_bulk`;
  } else {
    path = '/_bulk';
  }

  return this.performFetchRequest({
    method: 'POST',
    path,
    params: parsedArgs,
    body,
  });
}
export default bulkApi;
