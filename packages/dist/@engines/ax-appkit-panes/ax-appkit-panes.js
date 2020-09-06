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

ax.extension.panes = function (options = {}) {
  let a = ax.a;

  let proximate = options.proximate || null;
  let adjacent = options.adjacent || null;
  let orientation = options.vertical ? 'vertical' : 'horizontal';

  function move(e) {
    let el = e.target.$('^ax-appkit-panes');

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
    let proximateEl = el.$('ax-appkit-panes-proximate'),
      adjacentEl = el.$('ax-appkit-panes-adjacent'),
      drag = el.$('ax-appkit-panes-drag');

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

    el.$send('ax.appkit.panes.resize', {
      detail: {
        percent: percent,
      },
    });
  }

  function clear(e) {
    e.target.$('^ax-appkit-panes').classList.remove('dragable');
    window.document.removeEventListener('mousemove', move);
    window.document.removeEventListener('mouseup', clear);
  }

  return a['ax-appkit-panes'](
    [
      a['ax-appkit-panes-proximate'](proximate),
      a['ax-appkit-panes-drag'](null, {
        $on: {
          mousedown: (e, el) => {
            el.$('^ax-appkit-panes').classList.add('dragable');
            window.document.addEventListener('mousemove', move);
            window.document.addEventListener('mouseup', clear);
          },
        },
      }),
      a['ax-appkit-panes-adjacent'](adjacent),
    ],
    {
      class: orientation,
      $init: (el) => {
        resize(el, options.percent);
      },
      ...options.panesTag,
    }
  );
};

ax.style({
  'ax-appkit-panes': {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    'ax-appkit-panes-proximate': {
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 'calc( 50% + 2px )',
      overflow: 'auto',
    },

    'ax-appkit-panes-adjacent': {
      display: 'block',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      left: 'calc( 50% + 2px )',
      overflowY: 'auto',
      overflowX: 'hidden',
    },

    'ax-appkit-panes-drag': {
      display: 'block',
      position: 'absolute',
      left: 'calc( 50% - 2px )',
      top: 0,
      bottom: 0,
      width: '4px',
      background: '#0001',
      '&:hover': {
        background: '#ddd',
      },
    },

    '&.dragable': {
      cursor: 'grabbing',
      'ax-appkit-panes-drag': {
        background: '#aaa',
      },
    },

    '&:not(.dragable)': {
      'ax-appkit-panes-drag': {
        cursor: 'ew-resize',
      },
    },

    '&.vertical': {
      'ax-appkit-panes-proximate': {
        bottom: 'calc( 50% + 2px )',
        right: 0,
      },

      'ax-appkit-panes-adjacent': {
        left: 0,
        top: 'calc( 50% + 2px )',
      },

      'ax-appkit-panes-drag': {
        display: 'block',
        position: 'absolute',
        top: 'calc( 50% - 2px )',
        left: 0,
        right: 0,
        height: '4px',
        width: '100%',
        background: '#eee',
      },

      '&:not(.dragable)': {
        'ax-appkit-panes-drag': {
          cursor: 'ns-resize',
        },
      },
    },
  },
});

}));
