ax.extension.report.field.extras.shim = {
  controls: {
    boolean: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.boolean(r, options),
    language: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.language(r, options),
    timezone: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.timezone(r, options),
    country: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.country(r, options),
    color: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.color(r, options),
    datetime: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.datetime(r, options),
    email: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.email(r, options),
    tel: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.tel(r, options),
    url: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.url(r, options),
    number: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.number(r, options),
    password: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.password(r, options),
    preformatted: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.preformatted(r, options),
    json: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.json(r, options),
  },
};
