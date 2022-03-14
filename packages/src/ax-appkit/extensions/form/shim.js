ax.extensions.form.shim = {
  form: (f) => (options) => ax.x.form.factory.form(f, options),
  input: (f) => (options) => ax.x.form.factory.input(options),
  select: (f) => (options) => ax.x.form.factory.select(options),
  textarea: (f) => (options) => ax.x.form.factory.textarea(options),
  checkbox: (f) => (options) => ax.x.form.factory.checkbox(options),
  checkboxes: (f) => (options) => ax.x.form.factory.checkboxes(options),
  radios: (f) => (options) => ax.x.form.factory.radios(options),
  button: (f) => (options) => ax.x.form.factory.button(options),
  submit: (f) => (options) => ax.x.form.factory.submit(f, options),
  cancel: (f) => (options) => ax.x.form.factory.cancel(f, options),
};
