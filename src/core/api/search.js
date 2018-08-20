import { removeUndefined, validate } from '../../utils/index';

/**
 * Search Service
 * @param {Object} args
 * @param {String} args.type
 * @param {Object} args.body
 */
function searchApi(args) {
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
    // eslint-disable-next-line
    type = parsedArgs.type;
  }

  const { body } = parsedArgs;

  delete parsedArgs.type;
  delete parsedArgs.body;

  let path;
  if (type) {
    path = `${type}/_search`;
  } else {
    path = '_search';
  }

  return this.performFetchRequest({
    method: 'POST',
    path,
    params: parsedArgs,
    body,
  });
}
export default searchApi;
