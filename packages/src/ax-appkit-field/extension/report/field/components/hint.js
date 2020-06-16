ax.extension.report.field.components.hint = function (options = {}) {
  let a = ax.a;

  let hint = options.hint;

  return hint
    ? a['small|appkit-report-field-hint'](hint, options.hintTag)
    : null;
};
