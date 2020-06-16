ax.extension.form.factory.select.options = function (options) {
  let a = ax.a;
  let x = ax.x;

  let selections = x.lib.form.selections(options.selections);

  if (options.placeholder) {
    selections.unshift({
      value: '',
      label: options.placeholder,
      class: 'placeholder',
    });
  }

  return selections.map(function (selection) {
    let optionsTagOptions = {
      ...options.optionTag,
      ...selection.optionTag,
    };

    if (selection.disabled == 'hr') {
      return a.option('—————', {
        value: selection.value,
        disabled: 'disabled',
        ...optionsTagOptions,
      });
    } else if (selection.disabled == 'br') {
      return a.option('', {
        value: selection.value,
        disabled: 'disabled',
        ...optionsTagOptions,
      });
    } else {
      let value = options.value;
      let selected;

      if (ax.is.array(value)) {
        selected = value.some(function (value) {
          return value == selection.value;
        });
      } else {
        selected = value == selection.value;
      }

      return a.option(selection.label, {
        value: selection.value,
        selected: selected || undefined,
        disabled: selection.disabled,
        class: selection.class,
        ...optionsTagOptions,
      });
    }
  });
};
