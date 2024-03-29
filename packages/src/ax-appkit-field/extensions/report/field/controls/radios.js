ax.extensions.report.field.controls.radios = function (r, options) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-radios').focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.radios(options), r.validation(options)],
    controlTagOptions
  );
};
