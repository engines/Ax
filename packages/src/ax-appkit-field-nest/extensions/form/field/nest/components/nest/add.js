ax.extensions.form.field.nest.components.nest.add = function (f, options) {
  let singular = f.singular;
  let itemsTagName = options.itemsTagName || 'ax-appkit-form-nest-items';

  let label = `✚ Add${singular ? ` ${singular}` : ''}`;

  return a['ax-appkit-form-nest-add-button'](
    f.button({
      label: label,
      onclick: (e) => {
        let el = e.currentTarget
        let items = el.$(`^ax-appkit-form-nest ${itemsTagName}`);
        items.$add();
      },
      ...options,
    }),
    options.addButtonTag || {}
  );
};
