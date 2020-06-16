ax.extension.report.factory.text = function (options = {}) {
  let a = ax.a;

  let component;

  if (options.value) {
    component = options.value;
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-report-text'](component, options.textTag);
};
