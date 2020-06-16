ax.extension.report.field.components.field = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  if (options.as == 'hidden') {
    options.label = false;
    options.help = false;
    options.hint = false;
  }

  return a['|appkit-report-field'](
    [
      this.header(r, options),
      a['|appkit-report-field-body'](
        [
          r.help(options),
          r.control({
            ...options,
            label: null,
            labelTag: null,
          }),
          r.hint(options),
        ],
        options.bodyTag
      ),
    ],
    options.fieldTag
  );
};
