ax.extension.form.field.collection.add = function (f, options) {
  let label = `✚ Add${options.singular ? ` ${options.singular}` : ''}`;

  return f.button({
    label: label,
    onclick: (e, el) => {
      let itemsTag = options.target
        ? options.target(el)
        : el.$(
            '^ax-appkit-control-collection ax-appkit-control-collection-items'
          );
      itemsTag.$add();
      itemsTag.$send('ax.appkit.form.collection.item.add');
    },
    ...options,
  });
};
