ax.extension.report.factory.output = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-output'](
    x.out(options.value, {
      parse: options.parse,
      out: options.out,
    }),
    options.outputTag
  );
};
