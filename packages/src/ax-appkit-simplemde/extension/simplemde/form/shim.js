ax.extension.simplemde.form.shim = {
  controls: {
    markdown: (f, target) => (options = {}) => (a, x) =>
      x.simplemde.form.control(f, options),
  },
};
