ax.extensions.form = function (options = {}) {
  let f = this.form.factory({
    scope: options.scope,
    object: options.object,
    formOptions: options,
  });

  return f.form(options);
};
