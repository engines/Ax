ax.extensions.form.field.controls.select = function (f, options) {
  let controlTagOptions = {
    $value: (el) => () => {
      return el.$('select').value;
    },

    $focus: (el) => () => {
      el.$('select').focus();
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        el.$('select').removeAttribute('disabled');
      }
    },

    $validity: (el) => () => {
      return el.$('select').validity;
    },

    $valid: (el) => () => {
      el.$('select').setCustomValidity('');
      if (el.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(el.$value, el.$validity);
            if (invalidMessage) {
              el.$('select').setCustomValidity(invalidMessage);
            }
          } else {
            el.$('select').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        let el = e.currentTarget;
        if (options.readonly) e.preventDefault();
      },
      'change: check validity': (e) => {
        let el = e.currentTarget;
        el.$valid();
      },
      'change: send control change event': (e) => {
        let el = e.currentTarget;
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.select(options), controlTagOptions);
};
