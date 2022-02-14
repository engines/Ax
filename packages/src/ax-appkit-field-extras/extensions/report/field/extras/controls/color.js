ax.extensions.report.field.extras.controls.color = (r, options = {}) => {
  let a = ax.a;

  let value = options.value;
  let component;

  if (value) {
    component = a.div({
      style: {
        backgroundColor: options.value,
        height: '100%',
      },
    });
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
      el.$('ax-appkit-report-color').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-color'](component, {
        tabindex: 0,
        ...options.colorTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};
