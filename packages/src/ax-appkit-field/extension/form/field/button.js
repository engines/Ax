ax.extension.form.field.button = (target, options = {}) =>
  target({
    ...options,
    buttonTag: {
      $disable: (el) => () => {
        el.disabled = 'disabled';
      },
      $enable: (el) => () => {
        el.removeAttribute('disabled');
      },
      ...options.buttonTag,
    },
  });
