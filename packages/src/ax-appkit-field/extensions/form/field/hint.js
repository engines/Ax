ax.extensions.form.field.hint = function (options = {}) {
  return options.hint
    ? a['ax-appkit-form-field-hint'](a.small(options.hint), options.hintTag || {})
    : '';
};
