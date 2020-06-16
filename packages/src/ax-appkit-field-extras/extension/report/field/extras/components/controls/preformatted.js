ax.extension.report.field.extras.components.controls.preformatted = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

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

  let component;

  if (options.value) {
    component = a.pre(options.value || '', options.preTag);
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-report-control'](
    [
      a['|appkit-report-preformatted'](component, options.preformattedTag),
      r.validation(options),
    ],
    controlTagOptions
  );
};
