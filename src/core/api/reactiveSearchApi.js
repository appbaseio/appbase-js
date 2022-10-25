import {
  getTelemetryHeaders,
  getMongoRequest,
  removeUndefined,
  validateRSQuery,
} from '../../utils/index';

/**
 * ReactiveSearch API Service for v3
 * @param {Array<Object>} query
 * @param {Object} settings
 * @param {boolean} settings.recordAnalytics
 * @param {boolean} settings.userId
 * @param {boolean} settings.enableQueryRules
 * @param {boolean} settings.customEvents
 */
function reactiveSearchApi(query, settings, params) {
  const parsedSettings = removeUndefined(settings);

  // Validate query
  const valid = validateRSQuery(query);

  if (valid !== true) {
    throw valid;
  }

  const body = {
    settings: parsedSettings,
    query,
  };

  if (this.mongodb) {
    Object.assign(body, { mongodb: getMongoRequest(this.app, this.mongodb) });
  }
  return this.performFetchRequest({
    method: 'POST',
    path: '_reactivesearch',
    body,
    headers: getTelemetryHeaders(this.enableTelemetry, !this.mongodb),
    isRSAPI: true,
    isMongoRequest: !!this.mongodb,
    params,
  });
}
export default reactiveSearchApi;
