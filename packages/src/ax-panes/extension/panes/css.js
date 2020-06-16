ax.css({
  '|ax-panes': {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    '|ax-panes-proximate': {
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 'calc( 50% + 2px )',
      overflowY: 'auto',
      overflowX: 'hidden',
    },

    '|ax-panes-adjacent': {
      display: 'block',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      left: 'calc( 50% + 2px )',
      overflowY: 'auto',
      overflowX: 'hidden',
    },

    '|ax-panes-drag': {
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
      '|ax-panes-drag': {
        background: '#aaa',
      },
    },

    '&:not(.dragable)': {
      '|ax-panes-drag': {
        cursor: 'ew-resize',
      },
    },

    '&.vertical': {
      '|ax-panes-proximate': {
        bottom: 'calc( 50% + 2px )',
        right: 0,
      },

      '|ax-panes-adjacent': {
        left: 0,
        top: 'calc( 50% + 2px )',
      },

      '|ax-panes-drag': {
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
        '|ax-panes-drag': {
          cursor: 'ns-resize',
        },
      },
    },
  },
});
