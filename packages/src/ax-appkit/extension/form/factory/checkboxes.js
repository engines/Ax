ax.extension.form.factory.checkboxes = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = x.lib.form.collection.value(options.value);
  let selections = x.lib.form.selections(options.selections);

  return a['ax-appkit-form-checkboxes'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        name: `${options.name}[]`,
        value: value.includes(selection.value) ? selection.value : '',
        label: label,
        checked: selection.value,
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
    options.checkboxesTag
  );
};
