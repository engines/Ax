ax.extension.panes = function (options = {}) {
  let a = ax.a;

  let proximate = options.proximate || null;
  let adjacent = options.adjacent || null;
  let orientation = options.vertical ? 'vertical' : 'horizontal';

  function move(e) {
    let el = e.target.$('^|ax-panes');

    let percent,
      vertical = options.vertical;

    if (vertical) {
      let position = el.clientHeight - (e.clientY - el.offsetTop);
      percent = (100 * position) / el.clientHeight;
    } else {
      let position = el.clientWidth - (e.clientX - el.offsetLeft);
      percent = 100 * (1 - position / el.clientWidth);
    }

    resize(el, percent, vertical);
  }

  function resize(el, percent) {
    let proximateEl = el.$('|ax-panes-proximate'),
      adjacentEl = el.$('|ax-panes-adjacent'),
      drag = el.$('|ax-panes-drag');

    percent = Number(percent || 50);
    if (Number.isNaN(percent)) percent = 50;
    if (percent > 90) percent = 90;
    if (percent < 10) percent = 10;

    if (options.vertical) {
      proximateEl.style.bottom = `calc( 100% - ${percent}% + 2px )`;
      adjacentEl.style.top = `calc( ${percent}% + 2px )`;
      drag.style.top = `calc( ${percent}% - 2px )`;
    } else {
      proximateEl.style.right = `calc( 100% - ${percent}% + 2px )`;
      adjacentEl.style.left = `calc( ${percent}% + 2px )`;
      drag.style.left = `calc( ${percent}% - 2px )`;
    }

    el.$send('ax.panes.resize', {
      detail: {
        percent: percent,
      },
    });
  }

  function clear(e) {
    e.target.$('^|ax-panes').classList.remove('dragable');
    window.document.removeEventListener('mousemove', move);
    window.document.removeEventListener('mouseup', clear);
  }

  return a['|ax-panes'](
    [
      a['|ax-panes-proximate'](proximate),
      a['|ax-panes-drag'](null, {
        $on: {
          mousedown: (e, el) => {
            el.$('^|ax-panes').classList.add('dragable');
            window.document.addEventListener('mousemove', move);
            window.document.addEventListener('mouseup', clear);
          },
        },
      }),
      a['|ax-panes-adjacent'](adjacent),
    ],
    {
      class: orientation,
      $init: function () {
        resize(this, options.percent);
      },
      ...options.panesTag,
    }
  );
};
