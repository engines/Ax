ax.extension.form.field.components.controls.checkboxes = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    name: options.name,

    $value: function () {
      return this.$$('input:checked').value.$$;
    },

    $focus: function () {
      this.$('input').focus();
    },

    $controls: function () {
      return this.$$('|appkit-form-control').$$;
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

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        if (options.readonly) e.preventDefault();
      },
      'change: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](
    a['|appkit-form-control-checkboxes'](
      f.checkboxes(options),
      options.checkboxesTag
    ),
    controlTagOptions
  );
};
