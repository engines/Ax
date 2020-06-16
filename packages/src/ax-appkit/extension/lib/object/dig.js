ax.extension.lib.object.dig = function (
  object,
  keys = [],
  defaultValue = null
) {
  let result = object;

  for (let key in keys) {
    if (result == null) {
      return defaultValue;
    } else {
      result = result[keys[key]] || null;
    }
  }

  return result || defaultValue;
};
