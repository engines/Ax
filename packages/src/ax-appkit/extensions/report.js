ax.extensions.report = function (options = {}) {
  let r = this.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options,
  });

  return r.report(options);
};
