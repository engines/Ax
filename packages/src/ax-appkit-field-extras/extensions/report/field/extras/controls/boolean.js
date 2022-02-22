ax.extensions.report.field.extras.controls.boolean = (r, options = {}) => {
  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('ax-appkit-report-boolean').focus();
    },

    ...options.controlTag,
  };

  let label = options.label || {};

  let trueLabel = label.true || '✔ True';
  let falseLabel = label.false || '❌ False';

  return a['ax-appkit-report-control'](
    [
      a['ax-appkit-report-boolean'](options.value ? trueLabel : falseLabel, {
        tabindex: 0,
        ...options.booleanTag,
      }),
      r.validation(options),
    ],
    controlTagOptions
  );
};
