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
            'click: toggle full screen': (el) => (e) => {
              let wrapper = el.$('^ax-appkit-codemirror');
              let codemirror = wrapper.$('textarea').$codemirror;
              if (wrapper.classList.contains('fullscreen')) {
                el.$text = '🗖';
                el.$('^body').style.overflowY = 'unset';
                wrapper.classList.remove('fullscreen');
                codemirror.focus();
              } else {
                el.$text = '🗗';
                el.$('^body').style.overflowY = 'hidden';
                wrapper.classList.add('fullscreen');
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
