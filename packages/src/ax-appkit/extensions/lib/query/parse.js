ax.extensions.lib.query.parse = function (queryString) {
  var result = {};

  if (queryString) {
    queryString.split('&').map(function (pair) {
      pair = pair.split('=');
      let keys = x.lib.name.dismantle(decodeURIComponent(pair[0]));
      x.lib.object.assign(result, keys, decodeURIComponent(pair[1]));
    });
  }

  return result;
};
