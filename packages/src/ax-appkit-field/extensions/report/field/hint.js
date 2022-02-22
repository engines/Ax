ax.extensions.report.field.hint = function (options = {}) {
  let hint = options.hint;

  return hint
    ? a['ax-appkit-report-field-hint'](a.small(hint), options.hintTag || {})
    : '';
};
