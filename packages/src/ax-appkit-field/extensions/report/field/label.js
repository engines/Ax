ax.extensions.report.field.label = function (options = {}) {
  if (ax.is.false(options.label)) return '';
  let label = options.label || x.lib.text.labelize(options.key);
  if (!label) return '';
  let component = a.label(label, options.labelTag || {});

  let wrapperTag = {
    ...options.wrapperTag,

    $on: {
      'click: focus on output': (e, el) => {
        let target = el.$('^ax-appkit-report-field ax-appkit-report-control');
        target && target.$focus();
      },
      ...(options.wrapperTag || {}).$on,
    },
  };

  return a['ax-appkit-report-field-label-wrapper'](component, wrapperTag);
};
