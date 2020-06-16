ax.extension.form.field.nest.components.nest.items.factory = function (
  options = {}
) {
  let x = ax.x;

  let f = x.form.factory({
    scope: options.scope,
    object: options.object,
    formOptions: options.formOptions,
    index: options.index,
    unindexed: options.unindexed,
    singular: options.singular,
    remove: (options) => this.remove(f, options),
    up: (options) => this.up(f, options),
    down: (options) => this.down(f, options),
  });

  return f;
};
