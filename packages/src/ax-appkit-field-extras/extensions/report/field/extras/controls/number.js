ax.extensions.report.field.extras.controls.number = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = Number(value);
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-number').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-number'](component, {
        tabindex: 0,
        ...options.numberTag,
      }),
      r.validation({
        controlPattern: /^[+-]?([0-9]*[.])?[0-9]+$/,
        controlInvalid: 'Should be a number.',
        ...options,
      }),
    ],
    controlTagOptions
  );
};
