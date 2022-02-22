ax.extensions.report.field.extras.controls.preformatted = (r, options = {}) => {
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

  let component;

  if (options.value) {
    component = options.value || '';
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-preformatted'](
        a.pre(component, {
          tabindex: 0,
          ...options.preTag,
        }),
        options.preformattedTag || {}
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};
