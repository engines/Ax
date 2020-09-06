ax.extension.report.field.field = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  if (options.as == 'hidden') {
    options.label = false;
    options.help = false;
    options.hint = false;
  }

  return a['ax-appkit-report-field'](
    [
      this.header(r, options),
      a['ax-appkit-report-field-body'](
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
