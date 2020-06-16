ax.extension.report.factory.select = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = x.lib.form.collection.value(options.value);
  let selections = x.lib.form.selections(options.selections || {});

  let label = [];

  if (ax.is.not.array(value)) {
    value = [value];
  }

  for (let selected of value) {
    let found = selections.find((selection) => selection.value === selected);
    if (found) {
      label.push(found.label);
    }
  }
  label = label.join(', ');

  let selectTagOptions = {
    name: options.name,
    ...options.selectTag,
  };

  if (label.length == 0) {
    label = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-report-select'](label, selectTagOptions);
};
