ax.extension.codemirror.form.shim = {
  controls: {
    code: (f, target) => (options = {}) =>
      ax.x.codemirror.form.control(f, options),
  },
};
