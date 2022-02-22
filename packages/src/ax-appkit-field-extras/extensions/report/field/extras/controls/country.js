ax.extensions.report.field.extras.controls.country = (r, options = {}) => {
  let value = options.value;
  let component;

  if (value) {
    label = x.lib.locale.countries[value];
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
      el.$('ax-appkit-report-country').focus();
    },

    ...options.controlTag,
  };

  let selectOptions = {
    ...options,
    selections: x.lib.locale.countries,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-country'](component, {
        tabindex: 0,
        ...options.countryTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};
