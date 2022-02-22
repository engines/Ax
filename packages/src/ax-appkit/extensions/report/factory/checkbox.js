ax.extensions.report.factory.checkbox = function (options = {}) {
  return a['ax-appkit-report-checkbox'](
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
    {
      tabindex: 0,
      ...options.checkboxTag,
    }
  );
};
