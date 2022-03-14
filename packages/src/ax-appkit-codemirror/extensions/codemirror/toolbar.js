ax.extensions.codemirror.toolbar = function (options = {}) {
  return a['ax-appkit-codemirror-toolbar']([
    a['ax-appkit-codemirror-toolbar-right']([
      ax.extensions.codemirror.toolbar.mode(options),
      ax.extensions.codemirror.toolbar.keymap(options),
      a['ax-appkit-codemirror-fullscreen'](
        a.button({
          $html: '&#128470;',
          type: 'button',
          $on: {
            'click: toggle full screen': (e, el) => {
              let wrapper = el.$('^ax-appkit-codemirror');
              let codemirror = wrapper.$('textarea').$codemirror;
              if (wrapper.classList.contains('fullscreen')) {
                el.$html = '&#128470;';
                el.$('^body').style.overflowY = 'unset';
                wrapper.classList.remove('fullscreen');
                codemirror.focus();
              } else {
                el.$html = '&#128471;';
                el.$('^body').style.overflowY = 'hidden';
                wrapper.classList.add('fullscreen');
                codemirror.focus();
              }
            },
          },
        })
      ),
    ]),
    a['ax-appkit-codemirror-label'](options.label || ''),
  ]);
};
