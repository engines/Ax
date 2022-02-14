ax.extensions.report.field.header = function (r, options = {}) {
  if (options.type == 'hidden') {
    return '';
  } else {
    let component;

    if (options.header == true) {
      options.header = null;
    } else if (options.header == false) {
      return '';
    }

    if (options.header) {
      component = header;
    } else {
      let caption = r.label(options);
      if (options.help) {
        component = [caption, r.helpbutton(options)];
      } else {
        component = caption;
      }
    }

    return ax.a['ax-appkit-report-field-header'](component, options.headerTag || {});
  }
};
