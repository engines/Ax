ax.extensions.report.field.extras.controls.datetime = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    if (options.only === 'time') {
      component = new Date(value).toTimeString();
    } else if (options.only === 'date') {
      component = new Date(value).toDateString();
    } else {
      component = new Date(value).toString();
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
      el.$('ax-appkit-report-datetime').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-datetime'](component, {
        tabindex: 0,
        ...options.datetimeTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};
