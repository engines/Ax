ax.extensions.easymde.form.shim = {
  controls: {
    easymde: (f, target) => (options = {}) =>
      x.easymde.form.control(f, options),
  },
};
