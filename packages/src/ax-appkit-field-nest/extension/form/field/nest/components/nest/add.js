ax.extension.form.field.nest.components.nest.add = function (f, options) {
  let a = ax.a;

  let singular = f.singular;
  let itemsTagName = options.itemsTagName || 'ax-appkit-form-nest-items';

  let label = `✚ Add${singular ? ` ${singular}` : ''}`;

  return a['ax-appkit-form-nest-add-button'](
    f.button({
      label: label,
      onclick: (el) => (e) => {
        let items = el.$(`^ax-appkit-form-nest ${itemsTagName}`);
        items.$add();
      },
      ...options,
    }),
    options.addButtonTag
  );
};
