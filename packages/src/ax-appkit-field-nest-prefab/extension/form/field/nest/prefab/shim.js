ax.extension.form.field.nest.prefab.shim = {
  controls: {
    table: (f) => (options) =>
      ax.x.form.field.nest.prefab.controls.table(f, options),
    many: (f) => (options) =>
      ax.x.form.field.nest.prefab.controls.many(f, options),
    one: (f) => (options) => f.controls.nest(options),
  },
};
