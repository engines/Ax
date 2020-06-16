ax.extension.form.field.components.helpbutton = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-form-field-helpbutton'](null, {
    $state: false,
    $nodes: (el, show) => {
      return a['|appkit-form-field-helpbutton-text'](
        el.show ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    ...options.helpbuttonTag,
    $on: {
      'click: toggle help': function () {
        this.$state = !this.$state;
        this.$('^|appkit-form-field', '|appkit-form-field-help').$toggle();
      },
      ...(options.helpbuttonTag || []).$on,
    },
    style: {
      cursor: 'help',
      ...(options.helpbuttonTag || {}).style,
    },
  });
};
