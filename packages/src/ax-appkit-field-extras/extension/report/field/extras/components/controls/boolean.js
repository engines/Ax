ax.extension.report.field.extras.components.controls.boolean = (
  r,
  options = {}
) => {
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

  let label = options.label || {};

  let trueLabel = label.true || '✔ True';
  let falseLabel = label.false || '❌ False';

  return a['|appkit-report-control'](
    [
      a['|appkit-report-boolean'](
        options.value ? trueLabel : falseLabel,
        options.booleanTag
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};
