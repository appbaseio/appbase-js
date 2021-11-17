import { dataTypes } from '../index';

export default {
  url: {
    type: dataTypes.STRING,
    required: true,
  },
  app: {
    type: dataTypes.STRING,
    required: true,
  },
  credentials: {
    type: dataTypes.STRING,
    required: false,
  },
  enableTelemetry: {
    type: dataTypes.BOOLEAN,
    required: false,
  },
  username: {
    type: dataTypes.STRING,
    required: false,
  },
  password: {
    type: dataTypes.STRING,
    required: false,
  },
};
