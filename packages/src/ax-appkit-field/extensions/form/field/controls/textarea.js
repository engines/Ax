ax.extensions.form.field.controls.textarea = (f, options = {}) => {
  let controlTagOptions = {
    $init: (el) => {
      el.$valid();
      setTimeout(el.$resize, 0);
    },

    $value: (el) => () => {
      return el.$('textarea').value;
    },

    $focus: (el) => () => {
      el.$('textarea').focus();
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$('textarea').setAttribute('disabled', 'disabled');
    },

    $enable: (el) => () => {
      el.$enabled = true;
      if (!options.disabled) {
        el.$('textarea').removeAttribute('disabled');
      }
    },

    $validity: (el) => () => {
      return el.$('textarea').validity;
    },

    $valid: (el) => () => {
      el.$('textarea').setCustomValidity('');
      if (el.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(el.$value, el.$validity);
            if (invalidMessage) {
              el.$('textarea').setCustomValidity(invalidMessage);
            }
          } else {
            el.$('textarea').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    $resize: (el) => () => {
      x.form.field.controls.textarea.resize(el, options);
    },

    ...options.controlTag,

    $on: {
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'input: send control change event and resize': (e, el) => {
        el.$send('ax.appkit.form.control.change');
        el.$resize();
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.textarea(options), controlTagOptions);
};
