ax.extensions.form.field.header = function (f, options = {}) {
  let component;

  if (options.header == true) {
    options.header = null;
  } else if (options.header == false) {
    return '';
  }

  if (options.header) {
    // TODO: is header declared? same in report
    component = header;
  } else {
    let caption = options.label === false ? '' : f.label(options);
    if (options.help) {
      component = [caption, f.helpbutton(options)];
    } else {
      component = caption;
    }
  }

  return a['ax-appkit-form-field-header'](component, options.headerTag || {});
};
