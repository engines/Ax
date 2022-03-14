ax.extensions.codemirror.form.shim = {
  controls: {
    codemirror: (f, target) => (options = {}) => {
      return ax.x.codemirror.form.control(f, options);
    },
  },
};
