ax.extension.markedjs.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = x.markedjs({
      markdown: value,
      markedjsTag: options.markedjsTag,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['ax-appkit-report-control'](
    a['ax-appkit-report-markdown'](component, options.markdownTag),
    {
      'data-name': options.name,
      $value: (el) => () => {
        return options.value;
      },

      tabindex: 0,
      $focus: (el) => () => {
        el.focus();
      },

      ...options.controlTag,
    }
  );
};
