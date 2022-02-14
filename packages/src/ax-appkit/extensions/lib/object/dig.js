ax.extensions.lib.object.dig = function (
  object,
  keys = [],
  defaultValue = undefined
) {
  let result = object;

  for (let key in keys) {
    if (result == undefined) {
      return defaultValue;
    } else {
      result = result[keys[key]] || undefined;
    }
  }

  return result || defaultValue;
};
