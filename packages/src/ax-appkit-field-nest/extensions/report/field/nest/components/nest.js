ax.extensions.report.field.nest.components.nest = function (r, options = {}) {
  let nestReport = options.report || (() => '');

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
    $value: (el) => () => {
      let items = el.$('ax-appkit-report-nest-items');
      if (items) {
        return el.$('ax-appkit-report-nest-items').$count();
      } else {
        return '';
      }
    },
    $focus: (el) => () => {
      let first = el.$('ax-appkit-report-control');
      if (first) first.$focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    a['ax-appkit-report-nest'](nestReport(nestFactory), nestTagOptions),
    controlTagOptions
  );
};
