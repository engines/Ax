ax.extension.report.field.nest.components.nest = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let nestReport = options.report || (() => null);

  let nestFactory = this.nest.factory({
    scope: options.name, // name is the scope for child items
    object: options.value,
    reportOptions: r.reportOptions,
  });

  let nestTagOptions = {
    name: nestFactory.scope,
    ...options.nestTag,
  };

  let controlTagOptions = {
    $value: function () {
      let items = this.$('|appkit-report-nest-items');
      if (items) {
        return this.$('|appkit-report-nest-items').$count();
      } else {
        return null;
      }
    },
    $focus: function () {
      let first = this.$('|appkit-report-control');
      if (first) first.$focus();
    },
    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    a['|appkit-report-nest'](nestReport(nestFactory), nestTagOptions),
    controlTagOptions
  );
};
