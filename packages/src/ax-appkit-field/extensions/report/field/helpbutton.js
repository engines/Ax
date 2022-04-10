ax.extensions.report.field.helpbutton = function (options = {}) {
  return a['ax-appkit-report-field-helpbutton']({
    $showHelp: false,
    $nodes: (el) => {
      return a['ax-appkit-report-field-helpbutton-text'](
        el.$showHelp ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    $on: {
      'click: toggle help': (e) => {
        let el = e.currentTarget;
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
