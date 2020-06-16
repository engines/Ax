ax.extension.report.field.nest.prefab.components.many = function (f, options) {
  let a = ax.a;

  return f.controls.nest({
    ...options,
    report: (ff) => (a, x) =>
      a['|appkit-report-nest-many-wrapper'](
        [
          ff.items({
            ...options,
            report: (fff) => [
              a['|appkit-report-nest-many-item-header'](
                null,
                options.itemHeaderTag
              ),
              a['|appkit-report-nest-many-item-body'](
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
