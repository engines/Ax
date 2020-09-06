ax.extension.report.field.helpbutton = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['ax-appkit-report-field-helpbutton'](null, {
    $state: false,
    $nodes: (el) => {
      return a['ax-appkit-report-field-helpbutton-text'](
        el.$state ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    $on: {
      'click: toggle help': (e, el) => {
        el.$state = !el.$state;
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
