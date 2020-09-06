ax.extension.lib.form.data.stringify = function (data) {
  let x = ax.x;
  return JSON.stringify(x.lib.form.data.objectify(data));
};
