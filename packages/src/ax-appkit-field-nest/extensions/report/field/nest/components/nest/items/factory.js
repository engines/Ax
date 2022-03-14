ax.extensions.report.field.nest.components.nest.items.factory = function (
  options
) {
  let index = options.index;

  let f = x.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options.reportOptions,
  });

  f.index = index;

  return f;
};
