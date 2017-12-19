import * as _ from 'lodash';

export function sortObject(object: object): object {
  return _(object)
    .keys()
    .sort()
    .reduce((sorted: object, key: string) => {
      if (_.isPlainObject(object[key])) {
        sorted[key] = sortObject(object[key]);
      } else {
        sorted[key] = object[key];
      }

      return sorted;
    }, {});
}
