import { removeUndefined, validate } from '../../utils/index';

/**
 * Index Service
 * @param {Object} args
 * @param {String} args.type
 * @param {Object} args.body
 * @param {String} args.id
 */
function indexApi(args) {
  const parsedArgs = removeUndefined(args);
  // Validate arguments
  const valid = validate(parsedArgs, {
    body: 'object',
  });
  if (valid !== true) {
    throw valid;
  }
  const { type = '_doc', id, body } = parsedArgs;

  delete parsedArgs.type;
  delete parsedArgs.body;
  delete parsedArgs.id;

  let path;
  if (id) {
    path = type ? `${type}/${encodeURIComponent(id)}` : encodeURIComponent(id);
  } else {
    path = type;
  }
  return this.performFetchRequest({
    method: 'POST',
    path,
    params: parsedArgs,
    body,
  });
}
export default indexApi;
