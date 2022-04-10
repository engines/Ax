ax.extensions.form.field.nest.components.nest.items.down = function (
  f,
  options = {}
) {
  let itemsTagName = options.itemsTagName || 'ax-appkit-form-nest-items';

  return f.button({
    label: '⏷',
    onclick: (e) => {
      let el = e.currentTarget
      let itemsElement = el.$(`^${itemsTagName}`);
      let itemElements = itemsElement.$itemElements();
      let item;
      for (item of itemElements) {
        if (item.contains(el)) break;
      }
      var next = item.nextSibling;
      var parent = item.parentElement;
      if (next) {
        parent.insertBefore(item, next.nextSibling);
        el.$('^form').$rescope();
        itemsElement.$send('ax.appkit.form.nest.items.change');
      }
    },
    ...options,
  });
};
