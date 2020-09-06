ax.extension.form.field.controls.input = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: (el) => {
      el.$valid();
    },

    $value: (el) => () => {
      return el.$('input').value;
    },

    $focus: (el) => () => {
      el.$('input').focus();
    },

    $disable: (el) => () => {
      el.$('input').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$('input').removeAttribute('disabled');
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
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'input: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.input(options), controlTagOptions);
};
