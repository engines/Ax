ax.extension.report.field.components.help = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let help = options.help;

  return help
    ? a['|appkit-report-field-help-wrapper'](
        a['|appkit-report-field-help'](help, {
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
