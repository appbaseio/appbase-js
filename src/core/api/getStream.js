import { removeUndefined, validate } from '../../utils/index';

/**
 * Stream Service
 * @param {Object} args
 * @param {String} args.type
 * @param {Boolean} args.stream
 * @param {String} args.id
 */
function getStream(args) {
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
  delete parsedArgs.stream;

  if (parsedArgs.stream === true) {
    parsedArgs.stream = 'true';
  } else {
    delete parsedArgs.stream;
    parsedArgs.streamonly = 'true';
  }

  return this.performWsRequest({
    method: 'GET',
    path: `${type}/${encodeURIComponent(id)}`,
    params: parsedArgs,
  });
}
export default getStream;
