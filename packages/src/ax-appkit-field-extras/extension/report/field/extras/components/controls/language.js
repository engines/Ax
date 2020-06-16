ax.extension.report.field.extras.components.controls.language = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

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
      a['|appkit-report-language'](component, options.languageTag),
      r.validation(options),
    ],
    controlTagOptions
  );
};
