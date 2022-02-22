ax.extensions.xtermjs.report.control = function (r, options = {}) {
  return a['ax-appkit-report-control'](
    a['ax-appkit-xtermjs-control']([
      x.xtermjs({
        text: options.value || '',
        ...options,
        xtermjsTag: {
          $on: {
            'keydown: check for exit': (e, el) => {
              let control = el.$('^ax-appkit-xtermjs-control');
              if (control.classList.contains('fullscreen')) {
                if (e.keyCode == 27) {
                  // ESC pressed - close full screen
                  el.$('ax-appkit-xtermjs-fullscreen button').click();
                }
              } else {
                if (e.keyCode == 9 && e.shiftKey) {
                  // shift+TAB pressed - move focus backward
                  ax.x.lib.tabable.previous(el).focus();
                } else if (e.keyCode == 9) {
                  // TAB pressed - move focus forward
                  x.lib.tabable.next(el).focus();
                }
              }
            },
            ...(options.xtermjsTag || {}).$on,
          },
          ...options.xtermjsTag,
        },
      }),
    ]),
    {
      'data-name': options.name,
      $value: (el) => () => {
        return options.value;
      },
      $focus: (el) => () => {
        el.$('textarea').focus();
      },
      ...options.controlTag,
    }
  );
};
