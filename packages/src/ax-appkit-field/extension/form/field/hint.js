ax.extension.form.field.hint = function (options = {}) {
  let a = ax.a;

  return options.hint
    ? a['ax-appkit-form-field-hint'](a.small(options.hint), options.hintTag)
    : a._;
};
