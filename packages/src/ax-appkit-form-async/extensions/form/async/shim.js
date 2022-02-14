ax.extensions.form.async.shim = {
  form: (f, target) => (options = {}) => ax.x.form.async(target, options),
};
