ax.extensions.lib.compact.object = function (object) {
  for (const key in object) {
    object[key] = this(object[key]);
    if (
      object[key] === null ||
      (ax.is.object(object[key]) && Object.keys(object[key]).length === 0) ||
      (ax.is.array(object[key]) && object[key].length === 0)
    )
      delete object[key];
  }

  return object;
};
