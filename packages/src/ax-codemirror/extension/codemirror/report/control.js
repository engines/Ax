ax.extension.codemirror.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;
  let report = x.codemirror.report;

  return a['|appkit-report-control'](
    a['|appkit-report-codemirror'](
      [report.control.toolbar(options), report.control.editor(options)],
      {
        ...options.codeTag,
      }
    ),

    {
      'data-name': options.name,
      $value: function () {
        return options.value;
      },

      tabindex: 0,
      $focus: function () {
        this.focus();
      },

      ...options.controlTag,
    }
  );
};
