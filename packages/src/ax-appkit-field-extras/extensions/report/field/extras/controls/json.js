ax.extensions.report.field.extras.controls.json = function (r, options) {
  let value = options.value;
  let component;

  if (value) {
    if (options.parse) {
      try {
        component = JSON.stringify(JSON.parse(value), null, 2);
      } catch (error) {
        component = a['.error'](`⚠ ${error.message}`);
      }
    } else {
      component = JSON.stringify(value, null, 2);
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
      el.$('pre').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-json'](
        a.pre(component, {
          tabindex: 0,
          ...options.preTag,
        }),
        options.jsonTag || {}
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};
