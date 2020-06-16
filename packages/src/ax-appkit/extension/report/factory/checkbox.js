ax.extension.report.factory.checkbox = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-checkbox'](
    x.check({
      ...options,
      inputTag: {
        tabindex: -1,
        disabled: 'disabled',
        ...options.inputTag,
      },
      ...options.checkbox,
      readonly: 'readonly',
    }),
    options.checkboxTag
  );
};
