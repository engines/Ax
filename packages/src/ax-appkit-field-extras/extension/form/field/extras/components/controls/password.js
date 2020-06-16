ax.extension.form.field.extras.components.controls.password = function (
  f,
  options
) {
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
      $valid: function () {
        this.setCustomValidity('');
        if (this.validity.valid) {
          return true;
        } else {
          if (options.invalid) {
            if (ax.is.function(options.invalid)) {
              let invalidMessage = options.invalid(this.value, this.validity);
              if (invalidMessage) {
                this.setCustomValidity(invalidMessage);
              }
            } else {
              this.setCustomValidity(options.invalid);
            }
          }
          return false;
        }
      },

      ...(options.input || {}).inputTag,
    },
  };

  let confirmation = function () {
    let confirmationInputOptions = {
      value: options.value,
      disabled: options.disabled,
      readonly: options.readonly,
      autocomplete: 'off',
      ...options.confirmation,
      inputTag: {
        $valid: function () {
          let input = this.$('^').$('input');
          if (input.value == this.value) {
            this.setCustomValidity('');
          } else {
            this.setCustomValidity('Passwords must match.');
          }
        },

        ...(options.confirmation || {}).inputTag,
      },
    };

    return f.input(confirmationInputOptions);
  };

  let controlTagOptions = {
    $init: function () {
      for (let input of this.$inputs()) {
        secure(input);
        input.$valid();
      }
    },

    $inputs: function () {
      return this.$$('input').$$;
    },

    $value: function () {
      return this.$inputs()[0].value;
    },

    $focus: function () {
      this.$inputs()[0].focus();
    },

    $disable: function () {
      for (let input of this.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: function () {
      if (!inputOptions.disabled) {
        for (let input of this.$inputs()) {
          input.removeAttribute('disabled');
        }
      }
    },

    ...options.controlTag,

    $on: {
      'input: secure text': function () {
        for (let input of this.$inputs()) {
          secure(input);
        }
      },
      'input: check validity': function () {
        for (let input of this.$inputs()) {
          input.$valid();
        }
      },
      'input: send control change event': function () {
        this.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](
    [f.input(inputOptions), options.confirmation ? confirmation() : null],
    controlTagOptions
  );
};
