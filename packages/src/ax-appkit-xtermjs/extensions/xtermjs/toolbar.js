ax.extensions.xtermjs.toolbar = (options = {}) =>
  a['ax-appkit-xtermjs-toolbar'](
    [
      a['ax-appkit-xtermjs-toolbar-right'](
        a['ax-appkit-xtermjs-fullscreen'](
          a.button({
            $nodes: ax.extensions.xtermjs.icons.maximize(),
            type: 'button',
            // style: {padding: '2px'},
            $on: {
              'click: toggle full screen': (e) => {
                let el = e.currentTarget
                let wrapper = el.$('^ax-appkit-xtermjs');
                let div = wrapper.$('div');
                div.$fullscreen = !div.$fullscreen;
                if (div.$fullscreen) {
                  (el.$nodes = ax.extensions.xtermjs.icons.restore()),
                    (el.$('^body').style.overflowY = 'hidden');
                  wrapper.classList.add('fullscreen');
                } else {
                  (el.$nodes = ax.extensions.xtermjs.icons.maximize()),
                    (el.$('^body').style.overflowY = 'unset');
                  wrapper.classList.remove('fullscreen');
                }
              },
            },
          })
        )
      ),
      a['ax-appkit-xtermjs-label'](options.label || ''),
    ],
    options.toolbarTag || {}
  );
