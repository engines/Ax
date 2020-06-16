ax.extension.form.field.components.collection.down = function (f, options) {
  return f.button({
    label: '⏷',
    onclick: function (e, el) {
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^|appkit-form-collecion-item');
      var next = target.nextSibling;
      var parent = target.parentElement;
      if (next) {
        parent.insertBefore(target, next.nextSibling);
        el.focus();
        this.$send('ax.appkit.form.collection.item.move');
      }
    },
    ...options,
  });
};
