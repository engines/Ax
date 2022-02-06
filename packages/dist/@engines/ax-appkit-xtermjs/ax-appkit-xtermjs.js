// Ax, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax, dependencies={}) => factory(ax, dependencies)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax, dependencies={}) {

ax.extension.xtermjs = (options = {}) => (a, x) =>
  a['ax-appkit-xtermjs'](
    [
      ax.is.false(options.toolbar) ? null : x.xtermjs.toolbar(options),
      a.div(null, {
        $init: (el) => {
          let intersection = new IntersectionObserver(() => {
            if (!el.$xterm) {
              el.$xterm = new x.xtermjs.Terminal({
                ...options,
                ...options.terminal,
              });
              el.$xtermFit = new x.xtermjs.FitAddon();
              el.$xterm.loadAddon(el.$xtermFit);
              el.$xterm.onKey((e) => {
                domEvent = e.domEvent;
                el.dispatchEvent(
                  new domEvent.constructor(domEvent.type, domEvent)
                );
              });
              el.$xterm.open(el);
              el.$('div.terminal').removeAttribute('tabindex'); // Don't tab into terminal wrapper
              el.$xterm.write(options.text || '');
              el.$resizer = new ResizeObserver(el.$fit);
              el.$resizer.observe(el);
              intersection.disconnect();
              intersection = null;
              el.$send('ax.appkit.xtermjs.ready');
            }
          });
          intersection.observe(el);
        },
        $exit: (el) => {
          el.$resizer.disconnect();
          el.$xtermFit.dispose();
          el.$xterm.dispose();
        },
        $fit: (el) => () => {
          if (x.lib.element.visible(el)) el.$xtermFit.fit();
        },
        $write: (el) => (text) => {
          el.$xterm.write(text);
        },
        ...options.divTag,
      }),
    ],
    {
      $fit: (el) => () => {
        el.$('div').$fit();
      },
      $write: (el) => (text) => {
        el.$('div').$write(text);
      },
      ...options.xtermjsTag,
    }
  );

ax.css({
  'ax-appkit-xtermjs': {
    display: 'block',
    '&.fullscreen': {
      height: 'calc( 100vh - 1.5rem )',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      'ax-appkit-xtermjs-toolbar': {
        zIndex: '257',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        'ax-appkit-xtermjs-label': {
          display: 'block',
          maxHeight: '1.8rem',
        },
      },
      '& > div': {
        height: '100% !important',
        '.xterm-screen': {
          marginTop: 'calc(1.8rem + 1px)',
        },
      },
    },
    '& > div': {
      display: 'block',
      height: '300px',
    },
    '.terminal.xterm': {
      border: '1px solid #ccc',
      padding: '1px',
    },
  },
  'ax-appkit-xtermjs-toolbar': {
    display: 'block',
    overflow: 'auto',
    backgroundColor: 'white',
    border: '1px solid #e6e6e6',
    borderBottom: 'none',
    button: {
      padding: '0px 5px',
      margin: '1px',
      fontSize: '1.2rem',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    'ax-appkit-xtermjs-label': {
      display: 'block',
      padding: '4px 4px',
    },
    'ax-appkit-xtermjs-toolbar-right': {
      float: 'right',
    },
  },
});

ax.extension.xtermjs.Terminal = dependencies.Terminal || window.Terminal;
// The FitAddon module exports an object, bit Xterm expects a constructor function.
let plugin = dependencies.FitAddon || window.FitAddon || {};
if (ax.is.object(plugin)) {
  ax.extension.xtermjs.FitAddon = plugin.FitAddon;
} else {
  ax.extension.xtermjs.FitAddon = plugin;
}

ax.extension.xtermjs.report = {};

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

ax.extension.xtermjs.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['ax-appkit-report-control'](
    a['ax-appkit-xtermjs-control']([
      x.xtermjs({
        text: options.value || '',
        ...options,
        xtermjsTag: {
          $on: {
            'keydown: check for exit': (el) => (e) => {
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

ax.extension.xtermjs.report.shim = {
  controls: {
    xtermjs: (r, target) => (options = {}) =>
      ax.x.xtermjs.report.control(r, options),
  },
};

}));
