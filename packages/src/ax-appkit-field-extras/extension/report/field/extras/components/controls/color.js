ax.extension.report.field.extras.components.controls.color = (
  r,
  options = {}
) => {
  let a = ax.a;

  let value = options.value;
  let component;

  if (value) {
    component = a.div(null, {
      style: {
        backgroundColor: options.value,
        height: '100%',
      },
    });
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
      a['|appkit-report-color'](component, options.colorTag),
      r.validation(options),
    ],
    controlTagOptions
  );
};
