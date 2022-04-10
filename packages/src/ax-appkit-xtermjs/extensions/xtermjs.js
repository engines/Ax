ax.extensions.xtermjs = (options = {}) =>
  a['ax-appkit-xtermjs'](
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
