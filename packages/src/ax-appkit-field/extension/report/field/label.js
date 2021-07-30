ax.extension.report.field.label = function (options = {}) {
  let a = ax.a;
  let x = ax.x;
  let lib = x.lib;

  if (ax.is.false(options.label)) return null;
  let label = options.label || lib.text.labelize(options.key);
  if (!label) return null;
  let component = a.label(label, options.labelTag);

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
