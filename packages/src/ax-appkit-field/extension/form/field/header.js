ax.extension.form.field.header = function (f, options = {}) {
  let component;

  if (options.header == true) {
    options.header = null;
  } else if (options.header == false) {
    return null;
  }

  if (options.header) {
    component = header;
  } else {
    let caption = options.label === false ? null : f.label(options);
    if (options.help) {
      component = [caption, f.helpbutton(options)];
    } else {
      component = caption;
    }
  }

  return ax.a['ax-appkit-form-field-header'](component, options.headerTag);
};
