ax.extensions.report = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let r = this.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options,
  });

  return r.report(options);
};
