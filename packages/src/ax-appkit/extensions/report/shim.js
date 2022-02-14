ax.extensions.report.shim = {
  report: (r) => (options) => ax.x.report.factory.report(r, options),
  button: (r) => (options) => ax.x.report.factory.button(options),
  checkbox: (r) => (options) => ax.x.report.factory.checkbox(options),
  checkboxes: (r) => (options) => ax.x.report.factory.checkboxes(options),
  output: (r) => (options) => ax.x.report.factory.output(options),
  radios: (r) => (options) => ax.x.report.factory.radios(options),
  select: (r) => (options) => ax.x.report.factory.select(options),
  string: (r) => (options) => ax.x.report.factory.string(options),
  text: (r) => (options) => ax.x.report.factory.text(options),
};
