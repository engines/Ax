ax.extension.panes = (options = {}) => {
  let a = ax.a;

  let proximate = options.proximate || null;
  let adjacent = options.adjacent || null;
  let orientation = options.vertical ? 'vertical' : 'horizontal';

  return a['ax-appkit-panes'](
    [
      a['ax-appkit-panes-proximate'](proximate),
      a['ax-appkit-panes-drag'](null, {
        $on: {
          mousedown: (e, el) => {
            e.preventDefault();
            el.$('^ax-appkit-panes').classList.add('dragable');
            window.document.addEventListener(
              'mousemove',
              el.$('^ax-appkit-panes').$move
            );
            window.document.addEventListener(
              'mouseup',
              el.$('^ax-appkit-panes').$clear
            );
          },
        },
      }),
      a['ax-appkit-panes-adjacent'](adjacent),
    ],
    {
      class: orientation,
      $init: (el) => {
        el.$percent = Number(options.percent) || 50;
        el.$resize();
      },
      $resize: (el) => () => {
        let proximateEl = el.$('ax-appkit-panes-proximate'),
          adjacentEl = el.$('ax-appkit-panes-adjacent'),
          drag = el.$('ax-appkit-panes-drag');

        let percent = el.$percent;
        if (Number.isNaN(percent)) percent = 50;
        if (percent > 90) percent = 90;
        if (percent < 10) percent = 10;
        el.$percent = percent;
        if (options.vertical) {
          proximateEl.style.bottom = `calc( 100% - ${percent}% + 2px )`;
          adjacentEl.style.top = `calc( ${percent}% + 2px )`;
          drag.style.top = `calc( ${percent}% - 2px )`;
        } else {
          proximateEl.style.right = `calc( 100% - ${percent}% + 2px )`;
          adjacentEl.style.left = `calc( ${percent}% + 2px )`;
          drag.style.left = `calc( ${percent}% - 2px )`;
        }

        el.$send('ax.appkit.panes.resize', {
          detail: {
            percent: percent,
          },
        });
      },
      $move: (el) => (e) => {
        if (e.target != document) {
          let percent;

          if (options.vertical) {
            let position = el.clientHeight - (e.clientY - el.offsetTop);
            percent = (100 * position) / el.clientHeight;
          } else {
            let position = el.clientWidth - (e.clientX - el.offsetLeft);
            percent = 100 * (1 - position / el.clientWidth);
          }

          el.$resize(percent);
        } else {
          el.$resize(options.percent);
          el.$clear(e);
        }
      },
      $clear: (el) => (e) => {
        el.classList.remove('dragable');
        window.document.removeEventListener('mousemove', el.$move);
        window.document.removeEventListener('mouseup', el.$clear);
      },
      ...options.panesTag,
    }
  );
};
