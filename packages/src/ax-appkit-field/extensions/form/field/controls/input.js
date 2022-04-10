ax.extensions.form.field.controls.input = function (f, options) {
  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('input').value;
    },

    $focus: (el) => () => {
      el.$('input').focus();
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('input').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        el.$('input').removeAttribute('disabled');
      }
    },

    $validity: (el) => () => {
      return el.$('input').validity;
    },

    $valid: (el) => () => {
      el.$('input').setCustomValidity('');
      let validity = el.$validity();
      if (validity.valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(el.$value(), validity, el);
            if (invalidMessage) {
              el.$('input').setCustomValidity(invalidMessage);
            }
          } else {
            el.$('input').setCustomValidity(options.invalid);
          }
        }
        el.$('input').reportValidity();
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'input: check validity': (e) => {
        let el = e.currentTarget;
        el.$valid();
      },
      'input: send control change event': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.input(options), controlTagOptions);
};
