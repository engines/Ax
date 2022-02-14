ax.extensions.codemirror.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['ax-appkit-report-control'](
    a['ax-appkit-codemirror-control']([
      x.codemirror({
        readOnly: true,
        ...options,
        codemirrorTag: {
          $on: {
            'keydown: check for exit': (el) => (e) => {
              let control = el.$('^ax-appkit-codemirror-control');

              if (control.classList.contains('fullscreen')) {
                if (e.keyCode == 27) {
                  // ESC pressed - close full screen
                  control.$('ax-appkit-codemirror-fullscreen button').click();
                }
              } else {
                if (e.keyCode == 9 && e.shiftKey) {
                  // shift+TAB pressed - move focus backward
                  ax.x.lib.tabable.previous(e.target).focus();
                } else if (e.keyCode == 9) {
                  // TAB pressed - move focus forward
                  ax.x.lib.tabable.next(e.target).focus();
                }
              }
            },
            ...(options.codemirrorTag || {}).$on,
          },
          ...options.codemirrorTag,
        },
      }),
    ]),
    {
      'data-name': options.name,
      $value: (el) => () => {
        return options.value;
      },
      $focus: (el) => () => {
        el.$('textarea').$codemirror.focus();
      },
      ...options.controlTag,
    }
  );
};
