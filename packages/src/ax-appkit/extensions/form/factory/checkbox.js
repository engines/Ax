ax.extensions.form.factory.checkbox = function (options = {}) {
  return a['ax-appkit-form-checkbox'](
    x.check({
      name: options.name,
      value: options.value,
      type: options.type,
      label: options.label,
      checked: options.checked,
      required: options.required,
      readonly: options.readonly,
      inputTag: options.inputTag,
      labelTag: options.labelTag,
      checkTag: options.checkTag,
    }),
    options.checkboxTag || {}
  );
};
