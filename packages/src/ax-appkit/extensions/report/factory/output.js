ax.extensions.report.factory.output = function (options = {}) {
  return a['ax-appkit-report-output'](
    x.out(options.value, {
      parse: options.parse,
      placeholder: options.placeholder,
      ...options.out,
    }),
    {
      tabindex: 0,
      ...options.outputTag,
    }
  );
};
