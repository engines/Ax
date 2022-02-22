ax.extensions.report.field.controls.hidden = (r, options = {}) => {
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
