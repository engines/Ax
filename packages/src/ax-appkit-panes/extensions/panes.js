ax.extensions.panes = (options = {}) => {
  let proximate = options.proximate || '';
  let adjacent = options.adjacent || '';
  let orientation = options.vertical ? 'vertical' : 'horizontal';

  let listeners

  let clear = (e, el) => {
    el.classList.remove('dragable');
    window.document.removeEventListener('mousemove', listeners.mousemove);
    window.document.removeEventListener('mouseup', listeners.mouseup);
  }

  let move = (e, el) => {
    if (e.target != document) {
      let percent;
      if (options.vertical) {
        let position = el.clientHeight - (e.clientY - el.offsetTop);
        percent = (100 * position) / el.clientHeight;
      } else {
        let position = el.clientWidth - (e.clientX - el.offsetLeft);
        percent = 100 * (1 - position / el.clientWidth);
      }
      el.$percent = percent;
      el.$resize();
    }
  }


  return a['ax-appkit-panes'](
    [
      a['ax-appkit-panes-proximate'](proximate),
      a['ax-appkit-panes-drag']({
        $on: {
          mousedown: (e, el) => {
            e.preventDefault();
            let panesEl = el.$('^ax-appkit-panes')
            panesEl.classList.add('dragable');
            listeners = {
              mousemove: (e) => move(e, panesEl),
              mouseup: (e) => clear(e, panesEl)
            }
            clear(e, panesEl)
            window.document.addEventListener('mousemove', listeners.mousemove);
            window.document.addEventListener('mouseup', listeners.mouseup);
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
      ...options.panesTag,
    }
  );
};
