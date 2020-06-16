ax.extension.form.field.components.label = function (options = {}) {
  let a = ax.a;
  let x = ax.x;
  let lib = x.lib;

  let label = options.label || lib.text.labelize(options.key);
  let component = a.label(label, options.labelTag);

  let labelWrapperTag = {
    ...options.labelWrapperTag,

    $on: {
      'click: focus on input': function () {
        let target = this.$('^|appkit-form-field |appkit-form-control');
        target.$focus();
      },
      ...(options.labelWrapperTag || {}).$on,
    },
  };

  return a['|appkit-form-field-label-wrapper'](component, labelWrapperTag);
};
