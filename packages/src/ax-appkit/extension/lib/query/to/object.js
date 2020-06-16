ax.extension.lib.query.to.object = function (queryString) {
  var result = {};

  if (queryString) {
    queryString.split('&').map(function (pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1]);
    });
  }

  return result;
};
