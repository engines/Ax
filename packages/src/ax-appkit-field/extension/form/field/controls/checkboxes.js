ax.extension.form.field.controls.checkboxes = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    name: options.name,

    $value: (el) => () => {
      return el.$$('input:checked').value.$$;
    },

    $focus: (el) => () => {
      el.$('input').focus();
    },

    $controls: (el) => () => {
      return el.$$('ax-appkit-form-control').$$;
    },

    $inputs: (el) => () => {
      return el.$$('input').$$;
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      for (let input of el.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        for (let input of el.$inputs()) {
          if (!input.$ax.disabled) {
            input.removeAttribute('disabled');
          }
        }
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (el) => (e) => {
        if (options.readonly) e.preventDefault();
      },
      'change: send control change event': (el) => (e) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](f.checkboxes(options), controlTagOptions);
};
