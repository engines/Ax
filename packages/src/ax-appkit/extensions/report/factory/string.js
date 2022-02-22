ax.extensions.report.factory.string = function (options = {}) {
  let value = options.value || '';

  let component;

  if (options.value) {
    component = options.value.toString();
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-string'](component, {
    tabindex: 0,
    ...options.stringTag,
  });
};
