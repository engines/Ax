ax.extension.form.field.components.controls.input = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: function () {
      this.$valid();
    },

    $value: function () {
      return this.$('input').value;
    },

    $focus: function () {
      this.$('input').focus();
    },

    $disable: function () {
      this.$('input').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!options.disabled) {
        this.$('input').removeAttribute('disabled');
      }
    },

    $validity: function () {
      return this.$('input').validity;
    },

    $valid: function () {
      this.$('input').setCustomValidity('');
      if (this.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(this.$value, this.$validity());
            if (invalidMessage) {
              this.$('input').setCustomValidity(invalidMessage);
            }
          } else {
            this.$('input').setCustomValidity(options.invalid);
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

  return a['|appkit-form-control'](f.input(options), controlTagOptions);
};
