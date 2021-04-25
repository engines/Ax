ax.extension.form.field.nest.components.nest.items.remove = function (
  f,
  options = {}
) {
  let singular = f.singular || 'item';
  let confirmation;

  if (ax.is.false(options.confirm)) {
    confirmation = false;
  } else if (ax.is.string(options.confirm) || ax.is.function(options.confirm)) {
    confirmation = options.confirm;
  } else {
    confirmation = `Are you sure that you want to remove this ${singular}?`;
  }

  return f.button({
    label: '✖',
    confirm: confirmation,
    onclick: function (e, el) {
      let itemsElement = el.$('^|ax-appkit-form-nest-items');
      let itemElements = itemsElement.$itemElements();
      let item;
      for (item of itemElements) {
        if (item.contains(el)) break;
      }
      let parent = item.parentElement;
      let index = Array.prototype.indexOf.call(parent.children, item);
      item.remove();
      (ax.x.lib.tabable.next(parent) || window.document.body).focus();
      let length = parent.children.length;
      itemsElement.$('^form').$rescope();
      itemsElement.$send('ax.appkit.form.nest.items.change');
    },
    ...options,
  });
};
