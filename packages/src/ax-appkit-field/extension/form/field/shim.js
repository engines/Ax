ax.extension.form.field.shim = {
  button: (f, target) => (options = {}) =>
    ax.x.form.field.components.button(target, options),
  field: (f, target) => (options = {}) =>
    ax.x.form.field.components.field(f, options),
  fieldset: (f, target) => (options = {}) =>
    ax.x.form.field.components.fieldset(f, options),
  label: (f, target) => (options = {}) =>
    ax.x.form.field.components.label(options),
  help: (f, target) => (options = {}) =>
    ax.x.form.field.components.help(options),
  helpbutton: (f, target) => (options = {}) =>
    ax.x.form.field.components.helpbutton(options),
  hint: (f, target) => (options = {}) =>
    ax.x.form.field.components.hint(options),
  control: (f, target) => (options = {}) =>
    ax.x.form.field.components.control(f, options),
  controls: {
    input: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.input(f, options),
    select: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.select(f, options),
    textarea: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.textarea(f, options),
    checkbox: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.checkbox(f, options),
    checkboxes: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.checkboxes(f, options),
    radios: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.radios(f, options),
    hidden: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.hidden(f, options),
  },
};
