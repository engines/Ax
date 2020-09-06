ax.extension.form.field.extras.controls.country = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('select').value;
    },
    $focus: (el) => () => {
      el.$('select').focus();
    },

    $disable: (el) => () => {
      el.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!selectOptions.disabled) {
        el.$('select').removeAttribute('disabled');
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e, el) => {
        if (selectOptions.readonly) e.preventDefault();
      },
      'change:': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  let selectOptions = {
    ...options,
    value: options.value,
    selections: x.lib.locale.countries,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-country'](f.select(selectOptions), options.countryTag),
    controlTagOptions
  );
};
