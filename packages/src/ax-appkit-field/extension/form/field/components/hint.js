ax.extension.form.field.components.hint = function (options = {}) {
  let a = ax.a;

  return options.hint
    ? a['small|appkit-form-field-hint'](options.hint, options.hintTag)
    : null;
};
