// Axf Framework, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax) => factory(ax)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax) {

ax.extension.xtermjs = (options = {}) => (a, x) =>
  a['|ax-xtermjs'](
    [
      a['|ax-xtermjs-toolbar'](
        [
          a['|ax-xtermjs-toolbar-left'](options.label || null),
          a['|ax-xtermjs-toolbar-right'](
            a['|ax-xtermjs-fullscreen'](
              a.button('🗖', {
                type: 'button',
                $on: {
                  'click: toggle full screen': function () {
                    let terminal = this.$('^|ax-xtermjs');
                    terminal.$fullscreen = !terminal.$fullscreen;
                    if (terminal.$fullscreen) {
                      this.$text = '🗗';
                      this.$('^body').style.overflowY = 'hidden';
                      this.$('^body')
                        .querySelectorAll('|ax-xtermjs')
                        .forEach((el) => {
                          if (el != this.$('^|ax-xtermjs'))
                            el.$('|ax-xtermjs-container').style.display =
                              'none';
                        });
                      terminal.$('^|ax-xtermjs').classList.add('fullscreen');
                    } else {
                      this.$text = '🗖';
                      this.$('^body').style.overflowY = 'auto';
                      this.$('^body')
                        .querySelectorAll('|ax-xtermjs')
                        .forEach((el) => {
                          el.$('|ax-xtermjs-container').style.display = '';
                        });
                      terminal.$('^|ax-xtermjs').classList.remove('fullscreen');
                    }
                    terminal.$xtermFit.fit();
                  },
                },
              })
            )
          ),
        ],
        options.toolbarTag
      ),
      a['div|ax-xtermjs-container'],
    ],
    {
      $init: function () {
        const resizeFn = function () {
          this.$xtermFit.fit();
        }.bind(this);

        window.addEventListener('resize', resizeFn);
        this.$xterm = new x.xtermjs.Terminal(options.terminal);
        this.$xtermFit = new x.xtermjs.FitAddon();
        this.$xterm.loadAddon(this.$xtermFit);
        this.$xterm.open(this.$('|ax-xtermjs-container'));
        this.$xterm.write(options.text || '');
        resizeFn();
      },
      $write: function (text) {
        this.$xterm.write(text);
      },
      ...options.terminalTag,
    }
  );

ax.css({
  '|ax-xtermjs': {
    display: 'block',
    height: 'calc( 300px + 1.8rem )',

    '&.fullscreen': {
      height: 'calc( 100vh - 1.8rem )',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      '|ax-xtermjs-toolbar': {
        zIndex: '257',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      },
      '|ax-xtermjs-container': {
        height: '100%',
        '.xterm-screen': {
          marginTop: '1.8rem',
        },
      },
    },

    '|ax-xtermjs-container': {
      display: 'block',
      height: '300px',
    },

    '|ax-xtermjs-toolbar': {
      display: 'block',
      overflow: 'auto',
      backgroundColor: 'white',
      border: '1px solid #e6e6e6',
      borderBottom: 'none',
      button: {
        fontSize: '1.2rem',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
    },

    '|ax-xtermjs-toolbar-right': {
      float: 'right',
    },

    '|ax-xtermjs-toolbar-left': {
      lineHeight: '1.8',
      paddingLeft: '5px',
    },
  },
});

ax.extension.xtermjs.Terminal = window.Terminal;
ax.extension.xtermjs.FitAddon = (window.FitAddon || {}).FitAddon;

ax.extension.xtermjs.report = {};

ax.extension.xtermjs.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-control'](
    a['|appkit-report-terminal'](
      x.xtermjs({
        text: options.value || '',
        ...options.xtermjs,
      }),
      options.terminalTag
    ),
    {
      'data-name': options.name,
      $value: function () {
        return options.value;
      },

      tabindex: 0,
      $focus: function () {
        this.focus();
      },

      ...options.controlTag,
    }
  );
};

}));
