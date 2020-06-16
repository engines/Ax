ax.extension.report.field.extras.components.controls.number = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = Number(value);
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-number'](component, options.numberTag),
      r.validation({
        controlPattern: /^[+-]?([0-9]*[.])?[0-9]+$/,
        controlInvalid: 'Not a number',
        ...options,
      }),
    ],
    controlTagOptions
  );
};
