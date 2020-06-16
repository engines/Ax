ax.extension.form.field.components.controls.hidden = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },
    $disable: () => {},

    $enable: () => {},
    ...options.controlTag,
  };

  return a['|appkit-form-control'](null, controlTagOptions);
};
