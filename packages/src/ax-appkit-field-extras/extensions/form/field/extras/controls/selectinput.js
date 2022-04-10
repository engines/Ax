ax.extensions.form.field.extras.controls.selectinput = (f, options = {}) => {
  let selections = x.lib.form.selections(options.selections);
  selections.push({
    disabled: 'hr',
  });
  selections.push({
    value: '__USE_INPUT__',
    label: options.customValueLabel || '⬇ Enter a value',
  });

  let selectValue;
  let inputValue;

  if (options.value) {
    let valueInselections = selections.some(
      (option) => option.value == options.value
    );
    selectValue = valueInselections ? options.value : '__USE_INPUT__';
    inputValue = valueInselections ? '' : options.value;
  } else {
    // If no value and no placeholder then show the input
    selectValue = options.placeholder ? '' : '__USE_INPUT__';
  }

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('ax-appkit-control-selectinput-hiddeninput input').value;
    },
    $focus: (el) => () => {
      let select = el.$('select');
      if (select.value === '__USE_INPUT__') {
        el.$('ax-appkit-control-selectinput-input input').focus();
      } else {
        select.focus();
      }
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      let select = el.$('ax-appkit-control-selectinput-select select');
      let input = el.$('ax-appkit-control-selectinput-input input');
      let hiddeninput = el.$('ax-appkit-control-selectinput-hiddeninput input');
      select.disabled = 'disabled';
      input.disabled = 'disabled';
      hiddeninput.disabled = 'disabled';
    },
    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        let select = el.$('ax-appkit-control-selectinput-select select');
        let input = el.$('ax-appkit-control-selectinput-input input');
        let hiddeninput = el.$(
          'ax-appkit-control-selectinput-hiddeninput input'
        );
        select.removeAttribute('disabled');
        input.removeAttribute('disabled');
        hiddeninput.removeAttribute('disabled');
      }
    },
    $on: {
      change: (e) => {
        let el = e.currentTarget
        let select = el.$('select');
        let input = el.$('ax-appkit-control-selectinput-input input');
        let hiddeninput = el.$(
          'ax-appkit-control-selectinput-hiddeninput input'
        );
        if (select.value === '__USE_INPUT__') {
          input.style.display = '';
          hiddeninput.value = input.value;
          if (options.required) {
            select.removeAttribute('required');
            input.required = 'required';
          }
          if (select == window.document.activeElement) {
            input.focus();
          }
        } else {
          input.style.display = 'none';
          hiddeninput.value = select.value;
          if (options.required) {
            input.removeAttribute('required');
            select.required = 'required';
          }
        }
      },
    },

    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-selectinput'](
      [
        a['ax-appkit-control-selectinput-hiddeninput'](
          f.input({
            name: options.name,
            value: options.value,
            type: 'hidden',
            ...options.hiddeninput,
          })
        ),
        a['ax-appkit-control-selectinput-select'](
          f.select({
            value: selectValue,
            selections: selections,
            placeholder: options.placeholder,
            disabled: options.disabled,
            required: options.required,
            ...options.select,
          })
        ),
        a['ax-appkit-control-selectinput-input'](
          f.input({
            value: inputValue,
            disabled: options.disabled,
            ...options.input,
            inputTag: {
              style:
                selectValue == '__USE_INPUT__'
                  ? {}
                  : {
                      display: 'none',
                    },
              ...(options.input || {}).inputTag,
            },
          })
        ),
      ],
      options.selectinputTag || {}
    ),
    controlTagOptions
  );
};
