ax.extensions.codemirror.toolbar = function (options = {}) {
  return a['ax-appkit-codemirror-toolbar']([
    a['ax-appkit-codemirror-toolbar-right']([
      ax.extensions.codemirror.toolbar.mode(options),
      ax.extensions.codemirror.toolbar.keymap(options),
      a['ax-appkit-codemirror-fullscreen'](
        a.button({
          $nodes: ax.extensions.codemirror.icons.maximize(),
          type: 'button',
          $on: {
            'click: toggle full screen': (e) => {
              let el = e.currentTarget;
              let wrapper = el.$('^ax-appkit-codemirror');
              let codemirror = wrapper.$('textarea').$codemirror;
              if (wrapper.classList.contains('fullscreen')) {
                el.$nodes = ax.extensions.codemirror.icons.maximize();
                el.$('^body').style.overflowY = 'unset';
                wrapper.classList.remove('fullscreen');
                codemirror.focus();
              } else {
                el.$nodes = ax.extensions.codemirror.icons.restore();
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
