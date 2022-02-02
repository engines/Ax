ax.extension.form.field.extras.controls.country = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let selectOptions = {
    ...options,
    value: options.value,
    selections: x.lib.locale.countries,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('select').value;
    },
    $focus: (el) => () => {
      el.$('select').focus();
    },

    $enabled: !selectOptions.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!selectOptions.disabled) {
        el.$enabled = true;
        el.$('select').removeAttribute('disabled');
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (el) => (e) => {
        if (selectOptions.readonly) e.preventDefault();
      },
      'change:': (el) => (e) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-country'](f.select(selectOptions), options.countryTag),
    controlTagOptions
  );
};
