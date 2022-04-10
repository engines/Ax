ax.extensions.form.field.nest.components.nest.items.up = function (
  f,
  options = {}
) {
  let itemsTagName = options.itemsTagName || 'ax-appkit-form-nest-items';

  return f.button({
    label: '⏶',
    onclick: (e) => {
      let el = e.currentTarget;
      let itemsElement = el.$(`^${itemsTagName}`);
      let itemElements = itemsElement.$itemElements();
      let item;
      for (item of itemElements) {
        if (item.contains(el)) break;
      }
      var previous = item.previousSibling;
      var parent = item.parentElement;
      if (previous) {
        parent.insertBefore(item, previous);
        el.$('^form').$rescope();
        itemsElement.$send('ax.appkit.form.nest.items.change');
      }
    },
    ...options,
  });
};
