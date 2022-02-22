ax.extensions.form.field.helpbutton = function (options = {}) {
  return a['ax-appkit-form-field-helpbutton']({
    $showHelp: false,
    $nodes: (el) => {
      let show = el.$showHelp;
      return a['ax-appkit-form-field-helpbutton-text'](
        el.show ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    ...options.helpbuttonTag,
    $on: {
      'click: toggle help': (e, el) => {
        el.$showHelp = !el.$showHelp;
        el.$render();
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
