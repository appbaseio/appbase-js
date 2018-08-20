import { removeUndefined, validate } from '../../utils/index';

/**
 * Search Stream
 * @param {Object} args
 * @param {String} args.type
 * @param {Object} args.body
 * @param {Boolean} args.stream
 */
function searchStreamApi(args) {
  const parsedArgs = removeUndefined(args);
  // Validate arguments
  const valid = validate(parsedArgs, {
    body: 'object',
  });
  if (valid !== true) {
    throw valid;
  }

  if (
    parsedArgs.type === undefined
    || (Array.isArray(parsedArgs.type) && parsedArgs.type.length === 0)
  ) {
    throw new Error('Missing fields: type');
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
  delete parsedArgs.stream;

  parsedArgs.streamonly = 'true';

  return this.performWsRequest({
    method: 'POST',
    path: `${type}/_search`,
    params: parsedArgs,
    body,
  });
}
export default searchStreamApi;
