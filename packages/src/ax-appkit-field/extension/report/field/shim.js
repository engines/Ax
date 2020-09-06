ax.extension.report.field.shim = {
  field: (r, target) => (options = {}) => ax.x.report.field.field(r, options),
  fieldset: (f, target) => (options = {}) =>
    ax.x.report.field.fieldset(f, options),
  label: (r, target) => (options = {}) => ax.x.report.field.label(options),
  help: (r, target) => (options = {}) => ax.x.report.field.help(options),
  helpbutton: (r, target) => (options = {}) =>
    ax.x.report.field.helpbutton(options),
  hint: (r, target) => (options = {}) => ax.x.report.field.hint(options),
  validation: (r, target) => (options = {}) =>
    ax.x.report.field.validation(options),
  control: (r, target) => (options = {}) =>
    ax.x.report.field.control(r, options),
  controls: {
    checkbox: (r, target) => (options = {}) =>
      ax.x.report.field.controls.checkbox(r, options),
    checkboxes: (r, target) => (options = {}) =>
      ax.x.report.field.controls.checkboxes(r, options),
    string: (r, target) => (options = {}) =>
      ax.x.report.field.controls.string(r, options),
    select: (r, target) => (options = {}) =>
      ax.x.report.field.controls.select(r, options),
    radios: (r, target) => (options = {}) =>
      ax.x.report.field.controls.radios(r, options),
    text: (r, target) => (options = {}) =>
      ax.x.report.field.controls.text(r, options),
    output: (r, target) => (options = {}) =>
      ax.x.report.field.controls.output(r, options),
    hidden: (r, target) => (options = {}) =>
      ax.x.report.field.controls.hidden(r, options),
  },
};
