ax.extensions.report.factory.text = function (options = {}) {
  let a = ax.a;

  let component;

  if (options.value) {
    component = options.value;
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-text'](
    a.textarea(component, {
      readonly: true,
      ...options.textareaTag,
    }),
    options.textTag || {}
  );
};
