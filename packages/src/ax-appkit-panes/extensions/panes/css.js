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
      }
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
