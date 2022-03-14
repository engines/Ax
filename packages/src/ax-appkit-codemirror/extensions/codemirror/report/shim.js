ax.extensions.codemirror.report.shim = {
  controls: {
    codemirror: (f, target) => (options = {}) =>
      ax.x.codemirror.report.control(f, options),
  },
};
