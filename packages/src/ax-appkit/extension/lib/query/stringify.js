ax.extension.lib.query.stringify = function (object, options = {}) {
  var queryString = [];
  var property;

  for (property in object) {
    if (object.hasOwnProperty(property)) {
      var k = options.prefix ? options.prefix + '[' + property + ']' : property,
        v = object[property];
      queryString.push(
        v !== null && ax.is.object(v)
          ? this.stringify(v, {
              prefix: k,
            })
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      );
    }
  }
  return queryString.join('&');
};
