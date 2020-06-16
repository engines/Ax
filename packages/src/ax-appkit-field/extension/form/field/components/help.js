ax.extension.form.field.components.help = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return options.help
    ? a['|appkit-form-field-help-wrapper'](
        a['|appkit-form-field-help'](options.help, {
          $toggle: function () {
            x.lib.animate.fade.toggle(this);
          },
          ...options.helpTag,
          style: {
            display: 'none',
            ...(options.helpTag || {}).style,
          },
        }),
        options.helpWrapper
      )
    : null;
};
