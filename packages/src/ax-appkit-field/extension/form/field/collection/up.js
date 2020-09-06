ax.extension.form.field.collection.up = function (f, options) {
  return f.button({
    label: '⏶',
    onclick: function (e, el) {
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^ax-appkit-control-collection-item');
      var previous = target.previousSibling;
      var parent = target.parentElement;
      if (previous) {
        parent.insertBefore(target, previous);
        el.focus();
        el.$send('ax.appkit.form.collection.item.move');
      }
    },
    ...options,
  });
};
