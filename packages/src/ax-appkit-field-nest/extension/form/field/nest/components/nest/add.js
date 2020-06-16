ax.extension.form.field.nest.components.nest.add = function (f, options) {
  let a = ax.a;

  let singular = f.singular;

  let label = `✚ Add${singular ? ` ${singular}` : ''}`;

  return a['|appkit-form-nest-add-button'](
    f.button({
      label: label,
      onclick: (e, el) => {
        let itemsTag = options.target
          ? options.target(el)
          : el.$('^|appkit-form-nest |appkit-form-nest-items');
        itemsTag.$add();
        itemsTag.$send('ax.appkit.form.nest.item.add');
      },
      ...options,
    }),
    options.addButtonTag
  );
};
