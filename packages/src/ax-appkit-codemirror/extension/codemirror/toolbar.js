ax.extension.codemirror.toolbar = function (options = {}) {
  let a = ax.a;

  return a['ax-appkit-codemirror-toolbar']([
    a['ax-appkit-codemirror-toolbar-right']([
      ax.extension.codemirror.toolbar.mode(options),
      ax.extension.codemirror.toolbar.keymap(options),
      a['ax-appkit-codemirror-fullscreen'](
        a.button('🗖', {
          type: 'button',
          $on: {
            'click: toggle full screen': (e, el) => {
              let control = el.$('^ax-appkit-codemirror-control');
              let editor = control.$('ax-appkit-codemirror');
              let codemirror = editor.$('textarea').$codemirror;
              if (control.classList.contains('fullscreen')) {
                el.$text = '🗖';
                el.$('^body').style.overflowY = 'unset';
                control.classList.remove('fullscreen');
                editor.style.height = '';
                codemirror.focus();
              } else {
                el.$text = '🗗';
                el.$('^body').style.overflowY = 'hidden';
                control.classList.add('fullscreen');
                codemirror.focus();
              }
            },
          },
        })
      ),
    ]),
    a['ax-appkit-codemirror-label'](options.label || null),
  ]);
};
