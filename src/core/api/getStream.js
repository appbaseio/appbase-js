import { removeUndefined, validate } from '../../utils/index';

/**
 * Stream Service
 * @param {Object} args
 * @param {String} args.type
 * @param {Boolean} args.stream
 * @param {String} args.id
 * @param {Function} onData
 * @param {Function} onError
 * @param {Function} onClose
 */
function getStream(args, ...rest) {
  const parsedArgs = removeUndefined(args);
  // Validate arguments
  const valid = validate(parsedArgs, {
    type: 'string',
    id: 'string|number',
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

  return this.performWsRequest(
    {
      method: 'GET',
      path: `${type}/${encodeURIComponent(id)}`,
      params: parsedArgs,
    },
    ...rest,
  );
}
export default getStream;
