ax.extension.form.field.nest.components.nest.add = function (f, options) {
  let a = ax.a;

  let singular = f.singular;

  let label = `✚ Add${singular ? ` ${singular}` : ''}`;

  return a['ax-appkit-form-nest-add-button'](
    f.button({
      label: label,
      onclick: (e, el) => {
        let items = el.$('^ax-appkit-form-nest |ax-appkit-form-nest-items');
        items.$add();
      },
      ...options,
    }),
    options.addButtonTag
  );
};
