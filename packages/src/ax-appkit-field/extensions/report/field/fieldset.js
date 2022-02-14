ax.extensions.report.field.fieldset = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let control = a['ax-appkit-report-control'](
    [
      options.legend ? a.legend(options.legend, options.legendTag || {}) : '',
      options.body || '',
    ],
    {
      $focus: (el) => () => {
        let first = el.$('ax-appkit-report-control')[0];
        if (first) first.$focus();
      },
    }
  );

  options.label = options.label ? options.label : false;

  return a['ax-appkit-report-field'](
    a.fieldset(
      [
        this.header(f, options),
        a['ax-appkit-report-field-body'](
          [f.help(options), control, f.hint(options)],
          options.bodyTag || {}
        ),
      ],
      options.fieldsetTag || {}
    )
  );
};
