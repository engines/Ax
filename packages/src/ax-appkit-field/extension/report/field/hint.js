ax.extension.report.field.hint = function (options = {}) {
  let a = ax.a;

  let hint = options.hint;

  return hint
    ? a['ax-appkit-report-field-hint'](a.small(hint), options.hintTag)
    : null;
};
