ax.css({
  'ax-appkit-form-nest [draggable]': {
    $: {
      cursor: 'grab',
    },
    'input, textarea, select, button': {
      $: {
        pointerEvents: 'none',
      },
    },
  },
  'ax-appkit-form-nest [draggable]:active': {
    $: {
      cursor: 'grabbing',
    },
  },
});
