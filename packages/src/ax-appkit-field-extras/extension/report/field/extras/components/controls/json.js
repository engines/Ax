ax.extension.report.field.extras.components.controls.json = function (
  r,
  options
) {
  let a = ax.a;

  let value = options.value;
  let component;

  if (value) {
    if (options.parse) {
      try {
        component = a.pre(
          JSON.stringify(JSON.parse(value), null, 2),
          options.preTag
        );
      } catch (error) {
        component = a['.error'](`⚠ ${error.message}`);
      }
    } else {
      component = a.pre(JSON.stringify(value, null, 2), options.preTag);
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
    a['|appkit-report-json'](component, options.jsonTag),
    controlTagOptions
  );
};
