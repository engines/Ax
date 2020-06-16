ax.extension.report.field.nest.components.nest.factory = function (options) {
  let x = ax.x;

  let ff = x.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options.reportOptions,
  });

  ff.items = (options = {}) => this.items(ff, options);

  return ff;
};
