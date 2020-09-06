ax.extension.report.field.nest.prefab.shim = {
  controls: {
    table: (r) => (options) =>
      ax.x.report.field.nest.prefab.controls.table(r, options),
    many: (r) => (options) =>
      ax.x.report.field.nest.prefab.controls.many(r, options),
    one: (r) => (options) => r.controls.nest(options),
  },
};
