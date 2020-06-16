ax.css({
  '|appkit-menu': {
    display: 'block',
    width: '150px',
    zIndex: 1,
    '|appkit-menu-item': {
      display: 'block',
      width: '100%',
      userSelect: 'none',
      position: 'relative',
      '|appkitMenuSubmenuOpen': {
        whiteSpace: 'nowrap',
        display: 'block',
        width: '125px',
        lineHeight: '1.5',
        padding: '0.375rem',
        overflowX: 'hidden',
      },
      appkitMenuSubmenuOpenCaret: {
        float: 'right',
        lineHeight: '1.5',
        padding: '0.375rem',
      },
      appkitMenuSubmenu: {
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
        border: 'none',
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
