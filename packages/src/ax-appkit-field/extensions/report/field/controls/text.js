ax.extensions.report.field.controls.text = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $init: (el) => {
      setTimeout(el.$resize, 0);
    },

    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      el.$('textarea').focus();
    },
    $resize: (el) => () => {
      x.form.field.controls.textarea.resize(el, options);
    },

    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    [r.text(options), r.validation(options)],
    controlTagOptions
  );
};
