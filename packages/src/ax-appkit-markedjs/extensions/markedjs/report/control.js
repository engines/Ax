ax.extensions.markedjs.report.control = function (r, options = {}) {
  let value = options.value;
  let component;

  if (value) {
    component = x.markedjs({
      markdown: value,
      markedjsTag: options.markedjsTag,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-control'](
    a['ax-appkit-report-markdown'](component, options.markdownTag || {}),
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
