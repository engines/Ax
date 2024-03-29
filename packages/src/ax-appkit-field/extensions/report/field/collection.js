ax.extensions.report.field.collection = function (f, control, options = {}) {
  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['ax-appkit-control-collection-item'](
      [
        a['ax-appkit-control-collection-item-header'](
          options.itemHeaderTag || {}
        ),
        a['ax-appkit-control-collection-item-body'](
          control({
            ...options,
            name: `${options.name}[]`,
            value: value,
          }),
          options.itemBodyTag || {}
        ),
      ],
      options.itemTag || {}
    );

  let components = values.map((value) => itemFn(value));

  let controlTagOptions = {
    'data-name': options.name,
    $value: (el) => () => {
      return options.value;
    },
    $focus: (el) => () => {
      let first = el.$('ax-appkit-report-control');
      if (first) setTimeout(first.$focus, 0);
    },
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    a['ax-appkit-control-collection'](
      [
        a['ax-appkit-control-collection-items'](
          components,
          options.itemsTag || {}
        ),
      ],
      options.collectionTag || {}
    ),
    controlTagOptions
  );
};
