ax.extensions.form.factory.textarea = function (options = {}) {
  let value = options.value || '';

  let textareaTagOptions = {
    name: options.name,
    required: options.required,
    readonly: options.readonly,
    placeholder: options.placeholder,
    ...options.textareaTag,
  };

  return a['ax-appkit-form-textarea-wrapper'](
    a.textarea(value, textareaTagOptions),
    options.wrapperTag || {}
  );
};
