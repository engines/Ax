ax.extension.form.field.helpbutton = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['ax-appkit-form-field-helpbutton'](null, {
    $state: false,
    $nodes: (el) => {
      let show = el.$state;
      return a['ax-appkit-form-field-helpbutton-text'](
        el.show ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    ...options.helpbuttonTag,
    $on: {
      'click: toggle help': (e, el) => {
        el.$state = !el.$state;
        el.$('^ax-appkit-form-field', 'ax-appkit-form-field-help').$toggle();
      },
      ...(options.helpbuttonTag || []).$on,
    },
    style: {
      cursor: 'help',
      ...(options.helpbuttonTag || {}).style,
    },
  });
};
