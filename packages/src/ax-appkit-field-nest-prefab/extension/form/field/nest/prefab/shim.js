ax.extension.form.field.nest.prefab.shim = {
  field: (f, target) => (options = {}) => {
    if (options.collection) {
      if (
        options.as == 'one' ||
        options.control == 'one' ||
        options.as == 'many' ||
        options.control == 'many' ||
        options.as == 'table' ||
        options.control == 'table' ||
        options.as == 'nest' ||
        options.control == 'nest'
      ) {
        options.collection = false;
      }
      options.unindexed = true;
    }
    return target(options);
  },

  controls: {
    table: (f) => (options) =>
      ax.x.form.field.nest.prefab.components.table(f, options),
    many: (f) => (options) =>
      ax.x.form.field.nest.prefab.components.many(f, options),
    one: (f) => (options) => f.controls.nest(options),
  },
};
