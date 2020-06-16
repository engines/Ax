ax.css({
  '|appkit-form-nest-item[draggable]': {
    cursor: 'grab',
    'input, textarea, select, button': {
      pointerEvents: 'none',
    },
  },
  '|appkit-form-nest-item[draggable]:active': {
    cursor: 'grabbing',
  },
});
