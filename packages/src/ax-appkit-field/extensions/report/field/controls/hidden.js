ax.extensions.report.field.controls.hidden = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {},
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](controlTagOptions);
};
