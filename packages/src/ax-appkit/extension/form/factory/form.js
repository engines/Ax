ax.extension.form.factory.form = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let form = options.form || (() => null);

  let formTagOptions = {
    method: options.method || 'POST',
    action: options.url || options.action,
    $formData: function () {
      return new FormData(this);
    },
    $data: function () {
      return x.lib.form.data.objectify(this.$formData());
    },
    ...options.formTag,
  };

  return a.form(form(f), formTagOptions);
};
