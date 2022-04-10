ax.extensions.button = function (options = {}) {
  let handler = options.onclick || (() => {});

  let label = a['ax-appkit-button-label'](options.label || '', {
    style: {
      pointerEvents: 'none',
    },
  });

  let confirmation;

  if (ax.is.string(options.confirm)) {
    confirmation = () => confirm(options.confirm);
  } else if (ax.is.function(options.confirm)) {
    confirmation = (el) => confirm(options.confirm(el));
  } else if (options.confirm) {
    confirmation = () => confirm('Are you sure?');
  } else {
    confirmation = () => true;
  }

  let buttonTag = {
    type: options.type || 'button',
    name: options.name,
    value: options.value,
    ...options.buttonTag,
    $on: {
      'click: button onclick': (e) => {
        let el = e.currentTarget
        if (confirmation(el)) {
          handler(e, el);
        } else {
          e.preventDefault();
        }
      },
      ...(options.buttonTag || {}).$on,
    },
  };

  return a.button(label, buttonTag);
};
