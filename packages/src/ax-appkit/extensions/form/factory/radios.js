ax.extensions.form.factory.radios = function (options = {}) {
  let value = options.value || '';

  let selections = x.lib.form.selections(options.selections);

  return a['ax-appkit-form-radios'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        type: 'radio',
        name: options.name,
        value: value,
        label: label,
        checked: selection.value,
        required: options.required,
        readonly: options.readonly,
        inputTag: {
          ...(options.disabled || selection.disabled
            ? {
                disabled: 'disabled',
              }
            : {}),
          ...options.inputTag,
        },
        labelTag: options.labelTag,
        checkTag: options.checkTag,
      });
    }),
    options.radiosTag || {}
  );
};
