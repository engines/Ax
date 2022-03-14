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

const a = ax.a,
      x = ax.x,
      is = ax.is;

ax.extensions.xtermjs = (options = {}) => a['ax-appkit-xtermjs'](
    [
      ax.is.false(options.toolbar) ? '' : x.xtermjs.toolbar(options),
      a.div({
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
    $: {
      display: 'block',
    },
    '&.fullscreen': {
      $: {
        height: 'calc( 100vh - 1.5rem )',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
      },
      'ax-appkit-xtermjs-toolbar': {
        $: {
          zIndex: '257',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
        },
        'ax-appkit-xtermjs-label': {
          $: {
            display: 'block',
            maxHeight: '1.8rem',
          },
        },
      },
      '& > div': {
        $: {
          height: '100% !important',
        },
        '.xterm-screen': {
          $: {
            marginTop: 'calc(1.8rem + 1px)',
          },
        },
      },
    },
    '& > div': {
      $: {
        display: 'block',
        height: '300px',
      },
    },
    '.terminal.xterm': {
      $: {
        border: '1px solid #ccc',
        padding: '1px',
      },
    },
  },
  'ax-appkit-xtermjs-toolbar': {
    $: {
      display: 'block',
      overflow: 'auto',
      backgroundColor: 'white',
      border: '1px solid #e6e6e6',
      borderBottom: 'none',
    },
    button: {
      $: {
        padding: '0px 5px',
        margin: '1px',
        fontSize: '1.2rem',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
    },
    'ax-appkit-xtermjs-label': {
      $: {
        display: 'block',
        padding: '4px 4px',
      },
    },
    'ax-appkit-xtermjs-toolbar-right': {
      $: {
        float: 'right',
      },
    },
  },
});

ax.extensions.xtermjs.Terminal = dependencies.Terminal || window.Terminal;
// The FitAddon module exports an object, bit Xterm expects a constructor function.
let plugin = dependencies.FitAddon || window.FitAddon || {};
if (ax.is.object(plugin)) {
  ax.extensions.xtermjs.FitAddon = plugin.FitAddon;
} else {
  ax.extensions.xtermjs.FitAddon = plugin;
}

ax.extensions.xtermjs.icons = {}

ax.extensions.xtermjs.report = {};

ax.extensions.xtermjs.toolbar = (options = {}) => a['ax-appkit-xtermjs-toolbar'](
    [
      a['ax-appkit-xtermjs-toolbar-right'](
        a['ax-appkit-xtermjs-fullscreen'](
          a.button({
            $nodes: ax.extensions.xtermjs.icons.maximize(),
            type: 'button',
            // style: {padding: '2px'},
            $on: {
              'click: toggle full screen': (e, el) => {
                let wrapper = el.$('^ax-appkit-xtermjs');
                let div = wrapper.$('div');
                div.$fullscreen = !div.$fullscreen;
                if (div.$fullscreen) {
                  el.$nodes = ax.extensions.xtermjs.icons.restore(),
                  el.$('^body').style.overflowY = 'hidden';
                  wrapper.classList.add('fullscreen');
                } else {
                  el.$nodes = ax.extensions.xtermjs.icons.maximize(),
                  el.$('^body').style.overflowY = 'unset';
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

ax.extensions.xtermjs.icons.maximize = () => a({
  $tag: ['http://www.w3.org/2000/svg', 'svg'],
  height: 22,
  width: 22,
  viewBox: "0 0 22 22",
  $nodes: [
    a({
      $tag: ['http://www.w3.org/2000/svg', 'g'],
      transform: "scale(0.04)",
      $nodes: [
        a({
          $tag: ['http://www.w3.org/2000/svg', 'path'],
          style: {fill: '#333'},
          d: `M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V192h416v234z`,
        })
      ]
    }),
  ]
})

ax.extensions.xtermjs.icons.restore = () => a({
  $tag: ['http://www.w3.org/2000/svg', 'svg'],
  height: 22,
  width: 22,
  viewBox: "0 0 22 22",
  $nodes: [
    a({
      $tag: ['http://www.w3.org/2000/svg', 'g'],
      transform: "scale(0.04)",
      $nodes: [
        a({
          $tag: ['http://www.w3.org/2000/svg', 'path'],
          style: {fill: '#333'},
          d: `M464 0H144c-26.5 0-48 21.5-48 48v48H48c-26.5 0-48 21.5-48 48v320c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48h48c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-96 464H48V256h320v208zm96-96h-48V144c0-26.5-21.5-48-48-48H144V48h320v320z`,
        })
      ]
    }),

  ]
})

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

ax.extensions.xtermjs.report.shim = {
  controls: {
    xtermjs: (r, target) => (options = {}) =>
      ax.x.xtermjs.report.control(r, options),
  },
};

}));
