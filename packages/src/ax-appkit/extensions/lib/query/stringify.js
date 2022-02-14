ax.extensions.lib.query.stringify = function (object, options = {}) {
  let queryString = [];
  let property;

  for (property in object) {
    if (object.hasOwnProperty(property)) {
      let k = options.prefix ? options.prefix + '[' + property + ']' : property,
        v = object[property];
      queryString.push(
        v !== null && ax.is.object(v)
          ? this.stringify(v, {
              prefix: k,
            })
          : `${k}=${encodeURIComponent(v)}`
      );
    }
  }
  return queryString.join('&');
};
