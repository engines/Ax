ax.extension.report.field.nest.prefab.controls.many = function (f, options) {
  let a = ax.a;

  return f.controls.nest({
    ...options,
    report: (ff) => (a, x) =>
      a['ax-appkit-report-nest-many-wrapper'](
        [
          ff.items({
            ...options,
            report: (fff) => [
              a['ax-appkit-report-nest-many-item-header'](
                null,
                options.itemHeaderTag
              ),
              a['ax-appkit-report-nest-many-item-body'](
                options.report(fff),
                options.itemBodyTag
              ),
            ],
          }),
        ],
        options.wrapperTag
      ),
  });
};
