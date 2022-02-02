ax.extension.form.field.extras.controls.multiselect = function (
  f,
  options = {}
) {
  let a = ax.a;
  let x = ax.x;

  options.value = x.lib.form.collection.value(options.value);

  options.selections = x.lib.form.selections(options.selections);

  let controlTagOptions = {
    name: options.name,
    $init: (el) => {
      el.$preselect();
    },

    $value: (el) => () => {
      return el
        .$('ax-appkit-form-multiselect-selected')
        .$selected.map(function (item) {
          return item.value;
        });
    },

    $data: (el) => () => {
      return el.$value();
    },

    $focus: (el) => () => {
      el.$('select').focus();
    },

    $enabled: !options.disabled,
    $disable: (el) => () => {
      el.$enabled = false;
      el.$$('ax-appkit-form-multiselect-selected-item-remove').$disable();
      el.$('select').setAttribute('disabled', 'disabled');
    },
    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        el.$$('ax-appkit-form-multiselect-selected-item-remove').$enable();
        el.$('select').removeAttribute('disabled');
      }
    },

    $preselect: (el) => () => {
      let items = [];
      let select = el.$('select');
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
      el.$('ax-appkit-form-multiselect-selected').$update(items);
    },

    $on: {
      'ax.appkit.form.multiselect.selected.change: send control change event': (el) => (e) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },

    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-multiselect'](
      [
        x.form.field.extras.controls.multiselect.select(f, options),
        x.form.field.extras.controls.multiselect.selected(f, options),
      ],
      options.multiselectTag
    ),
    controlTagOptions
  );
};
