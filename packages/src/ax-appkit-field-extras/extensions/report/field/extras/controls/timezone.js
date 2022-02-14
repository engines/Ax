ax.extensions.report.field.extras.controls.timezone = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    label = x.lib.locale.timezones[value];
    if (label) {
      component = label;
    } else {
      component = value;
    }
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
      el.$('ax-appkit-report-timezone').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-timezone'](component, {
        tabindex: 0,
        ...options.timezoneTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};
