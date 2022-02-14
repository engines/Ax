ax.extensions.form.field.shim = {
  button: (f, target) => (options = {}) =>
    ax.x.form.field.button(target, options),
  field: (f, target) => (options = {}) => ax.x.form.field.field(f, options),
  fieldset: (f, target) => (options = {}) =>
    ax.x.form.field.fieldset(f, options),
  label: (f, target) => (options = {}) => ax.x.form.field.label(options),
  help: (f, target) => (options = {}) => ax.x.form.field.help(options),
  helpbutton: (f, target) => (options = {}) =>
    ax.x.form.field.helpbutton(options),
  hint: (f, target) => (options = {}) => ax.x.form.field.hint(options),
  control: (f, target) => (options = {}) => ax.x.form.field.control(f, options),
  controls: {
    input: (f, target) => (options = {}) =>
      ax.x.form.field.controls.input(f, options),
    select: (f, target) => (options = {}) =>
      ax.x.form.field.controls.select(f, options),
    textarea: (f, target) => (options = {}) =>
      ax.x.form.field.controls.textarea(f, options),
    checkbox: (f, target) => (options = {}) =>
      ax.x.form.field.controls.checkbox(f, options),
    checkboxes: (f, target) => (options = {}) =>
      ax.x.form.field.controls.checkboxes(f, options),
    radios: (f, target) => (options = {}) =>
      ax.x.form.field.controls.radios(f, options),
    hidden: (f, target) => (options = {}) =>
      ax.x.form.field.controls.hidden(f, options),
  },
};
