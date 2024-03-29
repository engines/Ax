ax.extensions.report.factory.radios = function (options = {}) {
  let value = options.value || '';

  let selections = x.lib.form.selections(options.selections);

  return a['ax-appkit-report-radios'](
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
        value: value == selection.value ? selection.value : '',
        label: label,
        checked: selection.value,
        tabindex: -1,
        readonly: 'readonly',
        inputTag: {
          tabindex: -1,
          disabled: 'disabled',
          ...options.inputTag,
        },
        labelTag: options.labelTag,
        checkTag: options.checkTag,
      });
    }),
    {
      tabindex: 0,
      ...options.radiosTag,
    }
  );
};
