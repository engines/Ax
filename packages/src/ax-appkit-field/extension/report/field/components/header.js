ax.extension.report.field.components.header = function (r, options = {}) {
  if (options.type == 'hidden') {
    return null;
  } else {
    let component;

    if (options.header == true) {
      options.header = null;
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

    return ax.a['|appkit-report-field-header'](component, options.headerTag);
  }
};
