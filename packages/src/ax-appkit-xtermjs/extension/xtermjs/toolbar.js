ax.extension.xtermjs.toolbar = (options = {}) => (a, x) =>
  a['ax-appkit-xtermjs-toolbar'](
    [
      a['ax-appkit-xtermjs-toolbar-right'](
        a['ax-appkit-xtermjs-fullscreen'](
          a.button('🗖', {
            type: 'button',
            $on: {
              'click: toggle full screen': (el) => (e) => {
                let wrapper = el.$('^ax-appkit-xtermjs');
                let div = wrapper.$('div');
                div.$fullscreen = !div.$fullscreen;
                if (div.$fullscreen) {
                  el.$text = '🗗';
                  el.$('^body').style.overflowY = 'hidden';
                  wrapper.classList.add('fullscreen');
                } else {
                  el.$text = '🗖';
                  el.$('^body').style.overflowY = 'unset';
                  wrapper.classList.remove('fullscreen');
                }
              },
            },
          })
        )
      ),
      a['ax-appkit-xtermjs-label'](options.label || null),
    ],
    options.toolbarTag
  );
