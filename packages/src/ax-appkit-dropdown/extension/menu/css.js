ax.css({
  'ax-appkit-context': {
    position: 'relative',
  },
  'ax-appkit-context-popup': {
    display: 'none',
    left: '0px',
  },
  'ax-appkit-menu': {
    display: 'block',
    width: '150px',
    zIndex: 1,
    'ax-appkit-menu-item': {
      display: 'block',
      width: '100%',
      userSelect: 'none',
      position: 'relative',
      'ax-appkit-menu-submenu-open': {
        whiteSpace: 'nowrap',
        display: 'block',
        width: '125px',
        lineHeight: '1.5',
        padding: '0.375rem',
        overflowX: 'hidden',
      },
      'ax-appkit-menu-submenu-open-caret': {
        float: 'right',
        lineHeight: '1.5',
        padding: '0.375rem',
      },
      'ax-appkit-menu-submenu': {
        position: 'absolute',
        left: '150px',
        top: '0px',
        display: 'none',
      },
      '&:hover': {
        backgroundColor: 'lightgray',
      },
      button: {
        lineHeight: '1.5',
        padding: '0.375rem',
        width: '100%',
        border: '1px solid transparent',
        background: 'none',
        textAlign: 'left',
      },
    },
    hr: {
      marginTop: '0.375rem',
      marginBottom: '0.375rem',
    },
    menu: {
      margin: 0,
      padding: 0,
      backgroundColor: 'white',
      boxShadow: '0px 0px 5px gray',
    },
  },
});
