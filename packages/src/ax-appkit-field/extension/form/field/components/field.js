ax.extension.form.field.components.field = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  if (
    options.as == 'hidden' ||
    options.as == 'input/hidden' ||
    options.type == 'hidden'
  ) {
    options.label = false;
    options.help = false;
    options.hint = false;
  }

  return a['|appkit-form-field'](
    [
      this.header(f, options),
      a['|appkit-form-field-body'](
        [
          f.help(options),
          f.control({
            ...options,
            // Controls don't normally need labels. Checkbox is exception.
            // Label for checkbox needs to be specified in options.checkbox.
            // options.label and options.labelTag consumed by field.header()
            label: null,
            labelTag: null,
          }),
          f.hint(options),
        ],
        options.bodyTag
      ),
    ],
    options.fieldTag
  );
};
