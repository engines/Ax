ax.extension.form.field.components.controls.select = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: function () {
      this.$valid();
    },

    $value: function () {
      return this.$('select').value;
    },

    $focus: function () {
      this.$('select').focus();
    },

    $disable: function () {
      this.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!options.disabled) {
        this.$('select').removeAttribute('disabled');
      }
    },

    $validity: function () {
      return this.$('select').validity;
    },

    $valid: function () {
      this.$('select').setCustomValidity('');
      if (this.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(this.$value, this.$validity);
            if (invalidMessage) {
              this.$('select').setCustomValidity(invalidMessage);
            }
          } else {
            this.$('select').setCustomValidity(options.invalid);
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
      'change: check validity': (e, el) => {
        el.$valid();
      },
      'change: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](f.select(options), controlTagOptions);
};
