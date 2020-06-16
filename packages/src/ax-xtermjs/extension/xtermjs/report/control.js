ax.extension.xtermjs.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-control'](
    a['|appkit-report-terminal'](
      x.xtermjs({
        text: options.value || '',
        ...options.xtermjs,
      }),
      options.terminalTag
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
