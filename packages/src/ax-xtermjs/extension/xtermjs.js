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
