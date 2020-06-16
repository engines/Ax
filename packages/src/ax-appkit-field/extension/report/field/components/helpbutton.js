ax.extension.report.field.components.helpbutton = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-field-helpbutton'](null, {
    $state: false,
    $nodes: function () {
      return a['|appkit-report-field-helpbutton-text'](
        this.$state ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    $on: {
      'click: toggle help': function () {
        this.$state = !this.$state;
        this.$('^|appkit-report-field', '|appkit-report-field-help').$toggle();
      },
    },
    ...options.helpbuttonTag,
    style: {
      cursor: 'help',
      ...(options.helpbuttonTag || {}).style,
    },
  });
};
