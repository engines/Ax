ax.extensions.report.factory.select = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = x.lib.form.collection.value(options.value);
  let selections = x.lib.form.selections(options.selections || {});

  let labels = [];

  if (ax.is.not.array(value)) {
    value = [value];
  }

  for (let selected of value) {
    let found = selections.find((selection) => selection.value === selected);
    if (found) {
      labels.push(found.label);
    } else {
      labels.push(selected);
    }
  }
  labels = labels.join(', ');

  let selectTagOptions = {
    name: options.name,
    ...options.selectTag,
  };

  if (!labels) {
    labels = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-select'](labels, {
    tabindex: 0,
    ...selectTagOptions,
  });
};
