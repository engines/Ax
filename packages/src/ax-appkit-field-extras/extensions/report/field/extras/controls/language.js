ax.extensions.report.field.extras.controls.language = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    let label = x.lib.locale.languages[value];
    if (label) {
      component = `${value} - ${label}`;
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
      el.$('ax-appkit-report-language').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-language'](component, {
        tabindex: 0,
        ...options.languageTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};
