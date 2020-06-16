ax.extension.form.field.components.header = function (f, options = {}) {
  let component;

  if (options.header == true) {
    options.header = null;
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

  return ax.a['|appkit-form-field-header'](component, options.headerTag);
};
