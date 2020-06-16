ax.extension.form.field.components.controls.radios = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: function () {
      this.$valid();
    },

    $value: function () {
      return this.$('input:checked').value;
    },

    $focus: function () {
      this.$('input').focus();
    },

    $inputs: function () {
      return this.$$('input').$$;
    },

    $disable: function () {
      for (let input of this.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: function () {
      if (!options.disabled) {
        for (let input of this.$inputs()) {
          if (!input.$ax.disabled) {
            input.removeAttribute('disabled');
          }
        }
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
      'click: do nothing when readonly': (e) => {
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

  return a['|appkit-form-control'](f.radios(options), controlTagOptions);
};
