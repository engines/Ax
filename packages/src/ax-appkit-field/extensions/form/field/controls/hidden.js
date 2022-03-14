ax.extensions.form.field.controls.hidden = (f, options = {}) => {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {},
    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('input').setAttribute('disabled', 'disabled');
    },
    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        el.$('input').removeAttribute('disabled');
      }
    },
    ...options.controlTag,
  };

  return a['ax-appkit-form-control.ax-appkit-form-control-not-focusable'](
    f.input({
      name: options.name,
      value: options.value,
      type: 'hidden',
      ...options.inputTag,
    }),
    controlTagOptions
  );
};
