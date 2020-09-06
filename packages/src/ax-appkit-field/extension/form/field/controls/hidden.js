ax.extension.form.field.controls.hidden = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.focus();
    },
    $disable: (el) => () => {},

    $enable: (el) => () => {},
    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    f.input({
      name: options.name,
      value: options.value,
      type: 'hidden',
      ...options.inputTag,
    }),
    controlTagOptions
  );
};
