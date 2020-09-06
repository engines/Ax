ax.style({
  'ax-appkit-xtermjs': {
    display: 'block',
    '&.fullscreen': {
      height: 'calc( 100vh - 1.5rem )',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      'ax-appkit-xtermjs-toolbar': {
        zIndex: '257',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        'ax-appkit-xtermjs-label': {
          display: 'block',
          maxHeight: '1.8rem',
        },
      },
      '& > div': {
        height: '100% !important',
        '.xterm-screen': {
          marginTop: 'calc(1.8rem + 1px)',
        },
      },
    },
    '& > div': {
      display: 'block',
      height: '300px',
    },
  },
  'ax-appkit-xtermjs-toolbar': {
    display: 'block',
    overflow: 'auto',
    backgroundColor: 'white',
    border: '1px solid #e6e6e6',
    borderBottom: 'none',
    button: {
      padding: '0px 5px',
      margin: '1px',
      fontSize: '1.2rem',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
    },
    'ax-appkit-xtermjs-label': {
      display: 'block',
      padding: '4px 4px',
    },
    'ax-appkit-xtermjs-toolbar-right': {
      float: 'right',
    },
  },
});
