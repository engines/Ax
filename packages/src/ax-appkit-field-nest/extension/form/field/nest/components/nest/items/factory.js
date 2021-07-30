ax.extension.form.field.nest.components.nest.items.factory = function (
  options = {}
) {
  let x = ax.x;

  let f = x.form.factory({
    remove: (options) => this.remove(f, options),
    up: (options) => this.up(f, options),
    down: (options) => this.down(f, options),
    ...options,
  });

  return f;
};
