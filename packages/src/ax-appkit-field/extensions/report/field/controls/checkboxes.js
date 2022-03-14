ax.extensions.report.field.controls.checkboxes = function (r, options) {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-checkboxes').focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.checkboxes(options), r.validation(options)],
    controlTagOptions
  );
};
