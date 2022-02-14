ax.css({
  'ax-appkit-codemirror': {
    $: {
      display: 'block',
    },
    'div.CodeMirror': {
      $: {
        minHeight: '2em',
        borderRadius: 'unset',
        padding: 'unset',
        fontFamily: 'monospace',
        zIndex: 1,
      },
      'div.CodeMirror-scroll': {
        $: {
          minHeight: 'unset',
        },
      },
    },
    'div.CodeMirror.disabled': {
      $: {
        backgroundColor: '#e9ecef',
      },
    },
    '&.fullscreen': {
      $: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        border: 'none',
        borderRadius: '0px',
        zIndex: '999',
      },
      'ax-appkit-codemirror-toolbar': {
        $: {
          overflow: 'hidden',
        },
        'ax-appkit-codemirror-label': {
          $: {
            display: 'block',
            maxHeight: '1.8rem',
          },
        },
      },
    },
  },
  'ax-appkit-codemirror-toolbar': {
    $: {
      display: 'block',
      overflow: 'auto',
      color: '#333',
      backgroundColor: 'white',
      border: '1px solid #e6e6e6',
      borderBottom: 'none',
    },
    button: {
      $: {
        padding: '0px 5px',
        margin: '1px',
        fontSize: '1.2em',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
    },
    select: {
      $: {
        border: 'none',
        backgroundColor: 'transparent',
        height: '1.5rem',
      },
    },
    'ax-appkit-codemirror-label': {
      $: {
        display: 'block',
        padding: '4px 4px',
      },
    },
    'ax-appkit-codemirror-toolbar-right': {
      $: {
        float: 'right',
      },
      label: {
        $: {
          margin: '0px',
          padding: '0px 5px',
        },
      },
      '& > *': {
        $: {
          verticalAlign: 'text-bottom',
        },
      },
    },
    'ax-appkit-codemirror-mode': {
      $: {
        display: 'inline-block',
        border: '1px solid #e6e6e6',
        margin: '0px 2px',
      },
    },
    'ax-appkit-codemirror-keymap': {
      $: {
        display: 'inline-block',
        border: '1px solid #e6e6e6',
        margin: '0px 2px',
      },
    },
  },
});
