import { removeUndefined, validateRSQuery } from '../../utils/index';

/**
 * ReactiveSearch suggestions API for v3
 * @param {Array<Object>} query
 * @param {Object} settings
 * @param {boolean} settings.recordAnalytics
 * @param {boolean} settings.userId
 * @param {boolean} settings.enableQueryRules
 * @param {boolean} settings.customEvents
 */
function getSuggestionsv3Api(query, settings) {
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
  const headers = {};

  Object.assign(headers, {
    'X-Search-Client': 'Appbase JS',
  });
  if (this.enableTelemetry === false) {
    Object.assign(headers, {
      'X-Enable-Telemetry': this.enableTelemetry,
    });
  }

  return this.performFetchRequest({
    method: 'POST',
    path: '_reactivesearch.v3',
    body,
    headers,
    isRSAPI: true,
    isSuggestionsAPI: true,
  });
}

export default getSuggestionsv3Api;
