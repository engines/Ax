ax.extensions.report.field.helpbutton = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['ax-appkit-report-field-helpbutton']({
    $showHelp: false,
    $nodes: (el) => {
      return a['ax-appkit-report-field-helpbutton-text'](
        el.$showHelp ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    $on: {
      'click: toggle help': (el) => (e) => {
        el.$showHelp = !el.$showHelp;
        el.$render();
        el.$(
          '^ax-appkit-report-field',
          'ax-appkit-report-field-help'
        ).$toggle();
      },
    },
    ...options.helpbuttonTag,
    style: {
      cursor: 'help',
      ...(options.helpbuttonTag || {}).style,
    },
  });
};
