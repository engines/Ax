ax.extension.form.field.collection.remove = function (f, options) {
  let singular = options.singular || 'item';
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
    onclick: (el) => (e) => {
      var target = el.$('^ax-appkit-control-collection-item');
      let parent = target.parentElement;
      let index = Array.prototype.indexOf.call(parent.children, target);
      target.remove();
      (ax.x.lib.tabable.next(parent) || window.document.body).focus();
      let length = parent.children.length;
      parent.$send('ax.appkit.form.collection.item.remove', {
        detail: {
          target: el,
          index: index,
          length: length,
        },
      });
    },
    ...options,
  });
};
