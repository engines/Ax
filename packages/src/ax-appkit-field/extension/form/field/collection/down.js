ax.extension.form.field.collection.down = function (f, options) {
  return f.button({
    label: '⏷',
    onclick: function (e, el) {
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^ax-appkit-control-collection-item');
      var next = target.nextSibling;
      var parent = target.parentElement;
      if (next) {
        parent.insertBefore(target, next.nextSibling);
        el.focus();
        el.$send('ax.appkit.form.collection.item.move');
      }
    },
    ...options,
  });
};
