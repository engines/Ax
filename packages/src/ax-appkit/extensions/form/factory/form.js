ax.extensions.form.factory.form = (f, options = {}) => {
  let form = options.form || (() => '');

  let formTag = {
    id: options.id,
    method: options.method || 'POST',
    action: options.url || options.action,
    $formData: (el) => () => {
      return new FormData(el);
    },
    ...options.formTag,
  };

  return a.form(form(f), formTag);
};
