ax.extensions.form.field.help = function (options = {}) {
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
