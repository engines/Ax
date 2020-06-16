ax.extension.codemirror.report.shim = {
  controls: {
    code: (f, target) => (options = {}) =>
      ax.x.codemirror.report.control(f, options),
  },
};
