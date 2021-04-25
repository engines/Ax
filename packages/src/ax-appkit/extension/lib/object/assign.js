ax.extension.lib.object.assign = function (object, keys, value) {
  if (keys.length) {
    let key = keys.shift();
    object[key] = this.assign(object[key] || {}, keys, value);
    return object;
  } else {
    return value;
  }
};
