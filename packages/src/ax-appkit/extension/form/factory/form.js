ax.extension.form.factory.form = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let form = options.form || (() => null);

  let formTagOptions = {
    id: options.id,
    method: options.method || 'POST',
    action: options.url || options.action,
    $formData: (el) => () => {
      return new FormData(el);
    },
    $data: (el) => () => {
      return x.lib.form.data.objectify(el.$formData());
    },
    ...options.formTag,
  };

  return a.form(form(f), formTagOptions);
};
