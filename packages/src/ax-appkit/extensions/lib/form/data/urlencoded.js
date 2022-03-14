ax.extensions.lib.form.data.urlencoded = function (data) {
  let parts = [];

  for (var pair of data.entries()) {
    parts.push(`${pair[0]}=${pair[1]}`);
  }

  return parts.join('&');
};
