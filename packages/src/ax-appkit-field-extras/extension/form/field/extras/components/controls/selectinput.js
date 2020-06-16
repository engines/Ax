ax.extension.form.field.extras.components.controls.selectinput = (
  f,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

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
    $value: function () {
      return this.$('|appkit-form-selectinput-hiddeninput input').value;
    },
    $focus: function () {
      let select = this.$('select');
      if (select.value === '__USE_INPUT__') {
        this.$('|appkit-form-selectinput-input input').focus();
      } else {
        select.focus();
      }
    },

    $disable: function () {
      let select = this.$('|appkit-form-selectinput-select select');
      let input = this.$('|appkit-form-selectinput-input input');
      let hiddeninput = this.$('|appkit-form-selectinput-hiddeninput input');
      select.disabled = 'disabled';
      input.disabled = 'disabled';
      hiddeninput.disabled = 'disabled';
    },
    $enable: function () {
      if (!options.disabled) {
        let select = this.$('|appkit-form-selectinput-select select');
        let input = this.$('|appkit-form-selectinput-input input');
        let hiddeninput = this.$('|appkit-form-selectinput-hiddeninput input');
        select.removeAttribute('disabled');
        input.removeAttribute('disabled');
        hiddeninput.removeAttribute('disabled');
      }
    },
    $on: {
      change: function () {
        let select = this.$('select');
        let input = this.$('|appkit-form-selectinput-input input');
        let hiddeninput = this.$('|appkit-form-selectinput-hiddeninput input');
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

  return a['|appkit-form-control'](
    [
      a['|appkit-form-selectinput-hiddeninput'](
        f.input({
          name: options.name,
          value: options.value,
          type: 'hidden',
          ...options.hiddeninput,
        })
      ),
      a['|appkit-form-selectinput-select'](
        f.select({
          value: selectValue,
          selections: selections,
          placeholder: options.placeholder,
          disabled: options.disabled,
          ...options.select,
        })
      ),
      a['|appkit-form-selectinput-input'](
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
    controlTagOptions
  );
};
