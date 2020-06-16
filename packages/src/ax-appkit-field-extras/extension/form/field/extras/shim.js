ax.extension.form.field.extras.shim = {
  controls: {
    language: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.language(f, options),
    timezone: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.timezone(f, options),
    country: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.country(f, options),
    multiselect: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.multiselect(f, options),
    selectinput: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.selectinput(f, options),
    password: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.password(f, options),
  },
};
