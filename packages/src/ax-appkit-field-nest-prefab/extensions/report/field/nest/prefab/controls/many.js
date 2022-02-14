ax.extensions.report.field.nest.prefab.controls.many = function (r, options) {
  let a = ax.a;

  return r.controls.nest({
    ...options,
    report: (rr) => (a, x) =>
      a['ax-appkit-report-nest-many-wrapper'](
        [
          rr.items({
            ...options,
            report: (rrr) => [
              a['ax-appkit-report-nest-many-item-header'](
                options.itemHeaderTag || {}
              ),
              a['ax-appkit-report-nest-many-item-body'](
                options.report(rrr),
                options.itemBodyTag || {}
              ),
            ],
          }),
        ],
        options.wrapperTag || {}
      ),
  });
};
