ax.extensions.report.field.controls.string = function (r, options) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-string').focus();
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.string(options), r.validation(options)],
    controlTagOptions
  );
};
