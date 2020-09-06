ax.extension.lib.form.data.urlencoded = function (data) {
  let x = ax.x;
  let parts = [];

  for (var pair of data.entries()) {
    parts.push(`${pair[0]}=${pair[1]}`);
  }

  return parts.join('&');
};
