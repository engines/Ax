ax.extensions.report.field.nest.components.nest.items = function (f, options) {
  let reportFn = options.report || (() => '');
  let item = function (itemData, index) {
    let ff = this.items.factory({
      scope: f.scope ? `${f.scope}[${index}]` : `${index}`,
      object: itemData,
      index: index,
      reportOptions: f.reportOptions,
    });

    return a['ax-appkit-report-nest-item'](reportFn(ff), options.itemTag || {});
  }.bind(this);

  let itemsData;
  let object = f.object;

  if (ax.is.array(object)) {
    itemsData = object;
  } else if (ax.is.object(object)) {
    itemsData = Object.values(object || {});
  } else {
    itemsData = [];
  }

  return a['ax-appkit-report-nest-items'](
    itemsData.length
      ? itemsData.map(item)
      : a['i.placeholder'](
          ax.is.undefined(options.placeholder) ? '' : options.placeholder
        ),
    {
      $count: (el) => () => {
        return el.$$(':scope > ax-appkit-report-nest-item').$$.length;
      },
      ...options.itemsTag,
    }
  );
};
