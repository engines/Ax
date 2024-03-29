ax.extensions.form.field.field = function (f, options = {}) {
  if (options.as == 'hidden') {
    options.label = false;
    options.help = false;
    options.hint = false;
  }

  return a['ax-appkit-form-field'](
    [
      this.header(f, options),
      a['ax-appkit-form-field-body'](
        [
          f.help(options),
          f.control({
            ...options,
            // Controls don't normally need labels. Checkbox is exception.
            // Label for checkbox needs to be specified in options.control.
            // options.label and options.labelTag consumed by field.header()
            label: false,
            labelTag: {},
          }),
          f.hint(options),
        ],
        options.bodyTag || {}
      ),
    ],
    options.fieldTag || {}
  );
};
