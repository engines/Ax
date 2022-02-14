ax.extensions.report.field.help = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let help = options.help;

  return help
    ? a['ax-appkit-report-field-help-wrapper'](
        a['ax-appkit-report-field-help'](help, {
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
