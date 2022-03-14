export default {
  '.error': {
    $: {
      color: 'red',
    },
  },
  '.success': {
    $: {
      color: 'blue',
    },
  },
  blockquote: {
    $: {
      color: '#666',
      borderLeft: '2px solid #666',
      paddingLeft: '10px',
    },
  },
  '.greeting': {
    $: {
      color: 'blue'
    },
  },
  'app-playground': {
    $: {
      display: 'block',
    },
    '.CodeMirror': {
      $: {
        width: '100%',
        height: 'unset',
        minHeight: '2em',
        border: '1px solid #ddd',
        borderRadius: 'unset',
        padding: 'unset',
        fontFamily: 'monospace',
      },
    },
    iframe: {
      $: {
        minHeight: '200px',
        height: 'calc(100% - 46px)',
        width: '100%',
        border: '1px solid #007bff',
      },
    },
  },
};
