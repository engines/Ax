ax.extension.report.field.components.controls.select = function (r, options) {
  let a = ax.a;

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
    [r.select(options), r.validation(options)],
    controlTagOptions
  );
};
