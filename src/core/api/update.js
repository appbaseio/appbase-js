import { removeUndefined, validate } from '../../utils/index';

/**
 * Update Service
 * @param {Object} args
 * @param {String} args.type
 * @param {Object} args.body
 * @param {String} args.id
 */
function updateApi(args) {
  const parsedArgs = removeUndefined(args);
  // Validate arguments
  const valid = validate(parsedArgs, {
    type: 'string',
    id: 'string',
    body: 'object',
  });
  if (valid !== true) {
    throw valid;
  }

  const { type, id, body } = parsedArgs;
  delete parsedArgs.type;
  delete parsedArgs.id;
  delete parsedArgs.body;
  const path = `${type}/${encodeURIComponent(id)}/_update`;

  return this.performFetchRequest({
    method: 'POST',
    path,
    params: parsedArgs,
    body,
  });
}
export default updateApi;
