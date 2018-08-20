/**
 * To get mappings
 */
function getMappings() {
  return this.performFetchRequest({
    method: 'GET',
    path: '_mapping',
  });
}
export default getMappings;
