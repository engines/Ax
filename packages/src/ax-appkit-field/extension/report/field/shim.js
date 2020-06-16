ax.extension.report.field.shim = {
  field: (r, target) => (options = {}) =>
    ax.x.report.field.components.field(r, options),
  fieldset: (f, target) => (options = {}) =>
    ax.x.form.field.components.fieldset(f, options),
  label: (r, target) => (options = {}) =>
    ax.x.report.field.components.label(options),
  help: (r, target) => (options = {}) =>
    ax.x.report.field.components.help(options),
  helpbutton: (r, target) => (options = {}) =>
    ax.x.report.field.components.helpbutton(options),
  hint: (r, target) => (options = {}) =>
    ax.x.report.field.components.hint(options),
  validation: (r, target) => (options = {}) =>
    ax.x.report.field.components.validation(options),
  control: (r, target) => (options = {}) =>
    ax.x.report.field.components.control(r, options),
  controls: {
    checkbox: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.checkbox(r, options),
    checkboxes: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.checkboxes(r, options),
    string: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.string(r, options),
    select: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.select(r, options),
    radios: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.radios(r, options),
    text: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.text(r, options),
    output: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.output(r, options),
    hidden: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.hidden(r, options),
  },
};
