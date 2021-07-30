ax.extension.form.field.controls.radios = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: (el) => {
      el.$valid();
    },

    $value: (el) => () => {
      let checked = el.$('input:checked');
      return checked ? checked.value : '';
    },

    $focus: (el) => () => {
      el.$('input').focus();
    },

    $inputs: (el) => () => {
      return el.$$('input').$$;
    },

    $enabled: !options.disabled,

    $disable: (el) => () => {
      el.$enabled = false;
      for (let input of el.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        for (let input of el.$inputs()) {
          if (!input.$ax.disabled) {
            input.removeAttribute('disabled');
          }
        }
      }
    },

    $validity: (el) => () => {
      return el.$('input').validity;
    },

    $valid: (el) => () => {
      el.$('input').setCustomValidity('');
      if (el.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(el.$value, el.$validity());
            if (invalidMessage) {
              el.$('input').setCustomValidity(invalidMessage);
            }
          } else {
            el.$('input').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e, el) => {
        if (options.readonly) e.preventDefault();
      },
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'change: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.radios(options), controlTagOptions);
};
