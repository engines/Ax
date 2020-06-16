ax.extension.form.field.components.collection = function (
  f,
  control,
  options = {}
) {
  let a = ax.a;
  let x = ax.x;

  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['|appkit-form-collection-item'](
      [
        a['|appkit-form-collection-item-header'](
          a['|appkit-form-collection-item-buttons'](
            [
              options.stationary
                ? null
                : this.collection.up(f, options.upButton || {}),
              options.stationary
                ? null
                : this.collection.down(f, options.downButton || {}),
              options.confined
                ? null
                : this.collection.remove(f, {
                    item: options.item,
                    ...options.removeButton,
                  }),
            ],
            options.itemButtonsTag
          ),
          options.itemHeaderTag
        ),
        a['|appkit-form-collection-item-body'](
          control({
            ...options,
            name: `${options.name}[]`,
            value: value,
          }),
          options.itemBodyTag
        ),
      ],
      options.itemTag
    );

  let components = values.map((value) => itemFn(value));

  let controlTagOptions = {
    'data-name': options.name,
    $value: function () {
      return this.$$('|appkit-form-control').value.$$;
    },

    $focus: function () {
      let first = this.$('|appkit-form-control');
      if (first) setTimeout(first.$focus, 1);
    },

    $disable: function () {
      let controls = this.$$('|appkit-form-control').$$;
      for (let control of controls) {
        control.$disable();
      }
    },

    $enable: function () {
      if (!options.disabled) {
        let controls = this.$$('|appkit-form-control').$$;
        for (let control of controls) {
          control.$enable();
        }
      }
    },

    ...options.controlTag,
  };

  return a['|appkit-form-control'](
    a['|appkit-form-collection'](
      [
        a['bananas|appkit-form-collection-items'](components, {
          $add: function () {
            this.append(itemFn());
          },
          ...options.itemsTag,
        }),
        options.confined
          ? null
          : this.collection.add(f, {
              item: options.item,
              ...options.addButton,
            }),
      ],
      options.collectionTag
    ),
    controlTagOptions
  );
};
