ax.extension.form.async.shim = {
  form: (f, target) => (options = {}) => ax.x.form.async(target, options),
};
