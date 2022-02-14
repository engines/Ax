ax.extensions.form.field.help = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return options.help
    ? a['ax-appkit-form-field-help-wrapper'](
        a['ax-appkit-form-field-help'](options.help, {
          $toggle: (el) => () => {
            x.lib.animate.fade.toggle(el);
          },
          ...options.helpTag,
          style: {
            display: 'none',
            ...(options.helpTag || {}).style,
          },
        }),
        options.wrapperTag || {}
      )
    : '';
};
