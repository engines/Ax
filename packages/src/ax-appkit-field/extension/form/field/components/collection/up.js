ax.extension.form.field.components.collection.up = function (f, options) {
  return f.button({
    label: '⏶',
    onclick: function (e, el) {
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^|appkit-form-collection-item');
      var previous = target.previousSibling;
      var parent = target.parentElement;
      if (previous) {
        parent.insertBefore(target, previous);
        el.focus();
        this.$send('ax.appkit.form.collection.item.move');
      }
    },
    ...options,
  });
};
