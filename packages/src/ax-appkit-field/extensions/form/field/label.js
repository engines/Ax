ax.extensions.form.field.label = function (options = {}) {
  let label = options.label || lib.text.labelize(options.key);
  let component = a.label(label, options.labelTag || {});

  let wrapperTag = {
    ...options.wrapperTag,

    $on: {
      'click: focus on input': (e, el) => {
        let target = el.$('^ax-appkit-form-field ax-appkit-form-control');
        target.$focus();
      },
      ...(options.wrapperTag || {}).$on,
    },
  };

  return a['ax-appkit-form-field-label-wrapper'](component, wrapperTag);
};
