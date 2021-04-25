ax.extension.form.field.nest.components.nest.items.down = function (
  f,
  options = {}
) {
  return f.button({
    label: '⏷',
    onclick: function (e, el) {
      let itemsElement = el.$('^|ax-appkit-form-nest-items');
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
