ax.css({
  '|ax-xtermjs': {
    display: 'block',
    height: 'calc( 300px + 1.8rem )',

    '&.fullscreen': {
      height: 'calc( 100vh - 1.8rem )',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      '|ax-xtermjs-toolbar': {
        zIndex: '257',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      },
      '|ax-xtermjs-container': {
        height: '100%',
        '.xterm-screen': {
          marginTop: '1.8rem',
        },
      },
    },

    '|ax-xtermjs-container': {
      display: 'block',
      height: '300px',
    },

    '|ax-xtermjs-toolbar': {
      display: 'block',
      overflow: 'auto',
      backgroundColor: 'white',
      border: '1px solid #e6e6e6',
      borderBottom: 'none',
      button: {
        fontSize: '1.2rem',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
    },

    '|ax-xtermjs-toolbar-right': {
      float: 'right',
    },

    '|ax-xtermjs-toolbar-left': {
      lineHeight: '1.8',
      paddingLeft: '5px',
    },
  },
});
