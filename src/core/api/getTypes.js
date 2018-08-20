/**
 * To get types
 */
function getTypesService() {
  return new Promise((resolve, reject) => {
    try {
      return this.performFetchRequest({
        method: 'GET',
        path: '_mapping',
      }).then((data) => {
        const types = Object.keys(data[this.appname].mappings).filter(type => type !== '_default_');
        return resolve(types);
      });
    } catch (e) {
      return reject(e);
    }
  });
}
export default getTypesService;
