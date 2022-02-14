ax.extensions.lib.form.data.objectify = function (data) {
  let x = ax.x;
  let object = {};

  for (var pair of data.entries()) {
    x.lib.object.assign(object, x.lib.name.dismantle(pair[0]), pair[1]);
  }

  return object;
};
