ax.extension.form.field.extras.controls.password = function (f, options) {
  let a = ax.a;

  if (options.confirmation == true) {
    options.confirmation = {};
  }

  let secure = function (element) {
    if (element.value) {
      element.style.fontFamily = 'text-security-disc';
    } else {
      element.style.fontFamily = 'unset';
    }
  };

  let inputOptions = {
    name: options.name,
    value: options.value,
    placeholder: options.placeholder,
    disabled: options.disabled,
    readonly: options.readonly,
    required: options.required,
    pattern: options.pattern,
    autocomplete: 'off',
    ...options.input,
    inputTag: {
      $valid: (el) => () => {
        el.setCustomValidity('');
        if (el.validity.valid) {
          return true;
        } else {
          if (options.invalid) {
            if (ax.is.function(options.invalid)) {
              let invalidMessage = options.invalid(el.value, el.validity);
              if (invalidMessage) {
                el.setCustomValidity(invalidMessage);
              }
            } else {
              el.setCustomValidity(options.invalid);
            }
          }
          return false;
        }
      },

      ...(options.input || {}).inputTag,
    },
  };

  let confirmation = () => {
    let confirmationInputOptions = {
      value: options.value,
      disabled: options.disabled,
      readonly: options.readonly,
      autocomplete: 'off',
      ...options.confirmation,
      inputTag: {
        $valid: (el) => () => {
          let input = el.$('^ax-appkit-form-control').$('input');
          if (input.value == el.value) {
            el.setCustomValidity('');
          } else {
            el.setCustomValidity('Passwords must match.');
          }
        },

        ...(options.confirmation || {}).inputTag,
      },
    };

    return f.input(confirmationInputOptions);
  };

  let controlTagOptions = {
    $init: (el) => {
      for (let input of el.$inputs()) {
        secure(input);
        input.$valid();
      }
    },

    $inputs: (el) => () => {
      return el.$$('input').$$;
    },

    $value: (el) => () => {
      return el.$inputs()[0].value;
    },

    $focus: (el) => () => {
      el.$inputs()[0].focus();
    },

    $enabled: !inputOptions.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      for (let input of el.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: (el) => () => {
      if (!inputOptions.disabled) {
        el.$enabled = true;
        for (let input of el.$inputs()) {
          input.removeAttribute('disabled');
        }
      }
    },

    ...options.controlTag,

    $on: {
      'input: secure text': (e, el) => {
        for (let input of el.$inputs()) {
          secure(input);
        }
      },
      'input: check validity': (e, el) => {
        for (let input of el.$inputs()) {
          input.$valid();
        }
      },
      'input: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-password'](
      [f.input(inputOptions), options.confirmation ? confirmation() : null],
      options.passwordTag
    ),
    controlTagOptions
  );
};
