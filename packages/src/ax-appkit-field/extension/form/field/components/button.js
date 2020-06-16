ax.extension.form.field.components.button = (target, options = {}) =>
  target({
    ...options,
    buttonTag: {
      $disable: function () {
        this.disabled = 'disabled';
      },
      $enable: function () {
        this.removeAttribute('disabled');
      },
      ...options.buttonTag,
    },
  });
