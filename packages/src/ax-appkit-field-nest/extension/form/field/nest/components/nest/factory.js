ax.extension.form.field.nest.components.nest.factory = function (options) {
  let x = ax.x;

  let ff = x.form.factory({
    items: (options = {}) => this.items(ff, options),
    add: (options = {}) => this.add(ff, options),
    ...options,
  });

  return ff;
};
