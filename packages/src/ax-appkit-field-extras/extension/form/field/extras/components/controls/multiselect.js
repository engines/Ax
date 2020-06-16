ax.extension.form.field.extras.components.controls.multiselect = function (
  f,
  options = {}
) {
  let a = ax.a;
  let x = ax.x;

  options.value = x.lib.form.collection.value(options.value);

  options.selections = x.lib.form.selections(options.selections);

  let controlTagOptions = {
    name: options.name,
    $init: function () {
      this.$preselect();
    },

    $value: function () {
      return this.$('|appkit-form-multiselect-selected').$state.map(function (
        item
      ) {
        return item.value;
      });
    },

    $data: function () {
      return this.$value();
    },

    $focus: function () {
      this.$('select').focus();
    },

    $disable: function () {
      this.$$('|appkit-form-multiselect-selected-item-remove').$disable();
      this.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!options.disabled) {
        this.$$('|appkit-form-multiselect-selected-item-remove').$enable();
        this.$('select').removeAttribute('disabled');
      }
    },

    $preselect: function () {
      let items = [];
      let select = this.$('select');
      let selections = Array.apply(null, select.options);

      options.value.map((itemValue) => {
        selections.forEach((selection, i) => {
          if (selection.value.toString() == itemValue.toString()) {
            items.push({
              index: i,
              value: itemValue,
              label: selection.text,
            });
            selection.disabled = 'disabled';
          }
        });
      });
      this.$('|appkit-form-multiselect-selected').$state = items;
    },

    $on: {
      'ax.appkit.form.multiselect.selected.change: send control change event': (
        e,
        el
      ) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },

    ...options.controlTag,
  };

  return a['|appkit-form-control'](
    [
      x.form.field.extras.components.controls.multiselect.select(f, options),
      x.form.field.extras.components.controls.multiselect.selected(f, options),
    ],
    controlTagOptions
  );
};
