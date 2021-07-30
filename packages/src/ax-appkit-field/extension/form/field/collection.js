ax.extension.form.field.collection = function (f, control, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['ax-appkit-control-collection-item'](
      [
        a['ax-appkit-control-collection-item-header'](
          a['ax-appkit-control-collection-item-buttons'](
            [
              options.moveable
                ? this.collection.up(f, options.upButton || {})
                : null,
              options.moveable
                ? this.collection.down(f, options.downButton || {})
                : null,
              options.removeable
                ? this.collection.remove(f, {
                    singular: options.singular,
                    ...options.removeButton,
                  })
                : null,
            ],
            options.itemButtonsTag
          ),
          options.itemHeaderTag
        ),
        a['ax-appkit-control-collection-item-body'](
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
    $value: (el) => () => {
      return el.$$('ax-appkit-form-control').$value().$$;
    },

    $focus: (el) => () => {
      let first = el.$('ax-appkit-form-control');
      if (first) setTimeout(first.$focus, 0);
    },

    $enabled: !options.disabled,

    $disable: (el) => () => {
      el.$enabled = false;
      let controls = el.$$('ax-appkit-form-control').$$;
      for (let control of controls) {
        control.$disable();
      }
    },

    $enable: (el) => () => {
      if (!options.disabled) {
        el.$enabled = true;
        let controls = el.$$('ax-appkit-form-control').$$;
        for (let control of controls) {
          control.$enable();
        }
      }
    },

    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-control-collection'](
      [
        a['ax-appkit-control-collection-items'](components, {
          $add: (el) => () => {
            el.append(itemFn());
          },
          ...options.itemsTag,
        }),
        options.addable
          ? this.collection.add(f, {
              singular: options.singular,
              ...options.addButton,
            })
          : null,
      ],
      options.collectionTag
    ),
    controlTagOptions
  );
};
