ax.extension.report.field.components.collection = function (
  f,
  control,
  options = {}
) {
  let a = ax.a;
  let x = ax.x;

  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['|appkit-report-collection-item'](
      [
        a['|appkit-report-collection-item-header'](null, options.itemHeaderTag),
        a['|appkit-report-collection-item-body'](
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
      return options.value;
    },
    $focus: function () {
      this.$('|appkit-report-control').focus();
    },
    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    a['|appkit-report-collection'](
      [a['|appkit-report-collection-items'](components, options.itemsTag)],
      options.collectionTag
    ),
    controlTagOptions
  );
};
