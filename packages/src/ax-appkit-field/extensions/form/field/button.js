ax.extensions.form.field.button = (target, options = {}) =>
  target({
    ...options,
    buttonTag: {
      $enabled: true,
      $disable: (el) => () => {
        el.$enabled = false;
        el.disabled = 'disabled';
      },
      $enable: (el) => () => {
        el.$enabled = true;
        el.removeAttribute('disabled');
      },
      ...options.buttonTag,
    },
  });
