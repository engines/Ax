ax.extensions.report.field.extras.shim = {
  controls: {
    boolean: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.boolean(r, options),
    language: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.language(r, options),
    timezone: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.timezone(r, options),
    country: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.country(r, options),
    color: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.color(r, options),
    datetime: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.datetime(r, options),
    email: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.email(r, options),
    tel: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.tel(r, options),
    url: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.url(r, options),
    number: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.number(r, options),
    password: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.password(r, options),
    preformatted: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.preformatted(r, options),
    json: (r, target) => (options = {}) =>
      ax.x.report.field.extras.controls.json(r, options),
  },
};
