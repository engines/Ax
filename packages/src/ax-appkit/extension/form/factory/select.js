ax.extension.form.factory.select = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let applyPlaceholder = (el) => {
    let selected = el.$$('option')[el.selectedIndex];
    if (selected.classList.contains('placeholder')) {
      el.classList.add('placeholder');
    } else {
      el.classList.remove('placeholder');
    }
  };

  let selectTagOptions = {
    name: options.name,
    value: options.value,
    required: options.required,
    readonly: options.readonly,
    multiple: options.multiple,
    ...options.selectTag,
    $init: (el) => applyPlaceholder(el),
    $on: {
      'change: update placeholder styling': (e, el) => applyPlaceholder(el),
      ...(options.selectTag || {}).$on,
    },
  };

  return a['|appkit-form-select-wrapper'](
    a.select(this.select.options(options), selectTagOptions),
    options.wrapperTag
  );
};
