ax.extensions.lib.object.pick = function (obj, keys) {
  return keys
    .filter((key) => key in obj)
    .reduce((result, key) => ((result[key] = obj[key]), result));
};
