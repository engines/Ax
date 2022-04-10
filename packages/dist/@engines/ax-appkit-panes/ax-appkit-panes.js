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

ax.extensions.panes = (options = {}) => {
  let proximate = options.proximate || '';
  let adjacent = options.adjacent || '';
  let orientation = options.vertical ? 'vertical' : 'horizontal';

  let listeners;

  let clear = (e) => {
    let el = e.currentTarget
    el.classList.remove('dragable');
    window.document.removeEventListener('mousemove', listeners.mousemove);
    window.document.removeEventListener('mouseup', listeners.mouseup);
  };

  let move = (e) => {
    let el = e.currentTarget
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
  };

  return a['ax-appkit-panes'](
    [
      a['ax-appkit-panes-proximate'](proximate),
      a['ax-appkit-panes-drag']({
        $on: {
          mousedown: (e) => {
            let el = e.currentTarget
            e.preventDefault();
            let panesEl = el.$('^ax-appkit-panes');
            panesEl.classList.add('dragable');
            listeners = {
              mousemove: (e) => move(e, panesEl),
              mouseup: (e) => clear(e, panesEl),
            };
            clear(e, panesEl);
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

ax.css({
  'ax-appkit-panes': {
    $: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    'ax-appkit-panes-proximate': {
      $: {
        display: 'block',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 'calc( 50% + 2px )',
        overflow: 'auto',
      },
    },

    'ax-appkit-panes-adjacent': {
      $: {
        display: 'block',
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        left: 'calc( 50% + 2px )',
        overflowY: 'auto',
        overflowX: 'hidden',
      },
    },

    'ax-appkit-panes-drag': {
      $: {
        display: 'block',
        position: 'absolute',
        left: 'calc( 50% - 2px )',
        top: 0,
        bottom: 0,
        width: '4px',
        backgroundColor: '#0003',
      },
      '&:hover': {
        $: {
          backgroundColor: '#0006',
        },
      },
    },

    '&.dragable': {
      $: {
        cursor: 'grabbing',
      },
      'ax-appkit-panes-drag': {
        $: {
          background: '#aaa',
        },
      },
    },

    '&:not(.dragable)': {
      'ax-appkit-panes-drag': {
        $: {
          cursor: 'ew-resize',
        },
      },
    },

    '&.vertical': {
      'ax-appkit-panes-proximate': {
        $: {
          right: 0,
          bottom: 'calc( 50% + 2px )',
        },
      },

      'ax-appkit-panes-adjacent': {
        $: {
          left: 0,
          top: 'calc( 50% + 2px )',
        },
      },

      'ax-appkit-panes-drag': {
        $: {
          display: 'block',
          position: 'absolute',
          top: 'calc( 50% - 2px )',
          left: 0,
          right: 0,
          height: '4px',
          width: '100%',
          background: '#eee',
        },
      },

      '&:not(.dragable)': {
        'ax-appkit-panes-drag': {
          $: {
            cursor: 'ns-resize',
          },
        },
      },
    },
  },
});

}));
