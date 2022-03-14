ax.extensions.lib.object.omit = function (obj, keys) {
  return Object.keys(obj)
    .filter((key) => keys.indexOf(key) < 0)
    .reduce((result, key) => ((result[key] = obj[key]), result));
};
