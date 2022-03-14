ax.extensions.report.field.field = function (r, options = {}) {
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
            label: false,
            labelTag: {},
          }),
          r.hint(options),
        ],
        options.bodyTag || {}
      ),
    ],
    options.fieldTag || {}
  );
};
