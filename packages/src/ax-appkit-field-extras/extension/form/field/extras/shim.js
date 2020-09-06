ax.extension.form.field.extras.shim = {
  controls: {
    language: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.language(f, options),
    timezone: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.timezone(f, options),
    country: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.country(f, options),
    multiselect: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.multiselect(f, options),
    selectinput: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.selectinput(f, options),
    password: (f, target) => (options = {}) =>
      ax.x.form.field.extras.controls.password(f, options),
  },
};
