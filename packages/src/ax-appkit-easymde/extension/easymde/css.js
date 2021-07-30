ax.style({
  'ax-appkit-easymde': {
    '> textarea': {
      display: 'none',
    },
    'div.CodeMirror.disabled': {
      backgroundColor: '#e9ecef',
    },
    '.editor-statusbar': {
      padding: '0px 5px',
    },
    '.editor-toolbar': {
      button: {
        color: '#666',
      },
      'button:hover': {
        color: '#333',
      },
      backgroundColor: 'white',
      opacity: 1,
      border: '1px solid #e6e6e6',
      borderBottom: 'none',
      '&:before': {
        margin: 0,
      },
      '&:after': {
        margin: 0,
      },
    },
  },
});
