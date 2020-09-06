ax.extension.form.field.nest.prefab.shim = {
  field: (f, target) => (options = {}) => {
    if (options.collection) {
      if (
        options.as == 'one' ||
        options.as == 'many' ||
        options.as == 'table' ||
        options.as == 'nest'
      ) {
        options.collection = false;
      }
      options.unindexed = true;
    }
    return target(options);
  },

  controls: {
    table: (f) => (options) =>
      ax.x.form.field.nest.prefab.controls.table(f, options),
    many: (f) => (options) =>
      ax.x.form.field.nest.prefab.controls.many(f, options),
    one: (f) => (options) => f.controls.nest(options),
  },
};
