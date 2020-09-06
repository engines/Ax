ax.extension.easymde.form.shim = {
  controls: {
    easymde: (f, target) => (options = {}) => (a, x) =>
      x.easymde.form.control(f, options),
  },
};
