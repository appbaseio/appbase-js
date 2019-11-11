import { removeUndefined, validate } from '../../utils/index';

/**
 * Msearch Service
 * @param {Object} args
 * @param {String} args.type
 * @param {Object} args.body
 */
function msearchApi(args) {
  const parsedArgs = removeUndefined(args);
  // Validate arguments
  const valid = validate(parsedArgs, {
    body: 'object',
  });
  if (valid !== true) {
    throw valid;
  }

  let type;
  if (Array.isArray(parsedArgs.type)) {
    type = parsedArgs.type.join();
  } else {
    ({ type } = parsedArgs);
  }

  const { body } = parsedArgs;

  delete parsedArgs.type;
  delete parsedArgs.body;

  let path;
  if (type) {
    path = `${type}/_msearch`;
  } else {
    path = '_msearch';
  }

  return this.performFetchRequest({
    method: 'GET',
    path,
    params: parsedArgs,
    body,
  });
}
export default msearchApi;
