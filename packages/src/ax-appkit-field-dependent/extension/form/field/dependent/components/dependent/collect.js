ax.extension.form.field.dependent.components.dependent.collect = (
  indexedScope,
  options
) => {
  let x = ax.x;

  let collection;

  if (ax.is.string(options)) {
    collection = [
      {
        key: options,
      },
    ];
  } else if (ax.is.array(options)) {
    collection = options;
  } else if (ax.is.object(options)) {
    collection = [options];
  } else {
    collection = [];
  }

  let nameFor = (scope, key) => {
    let dismantle = x.lib.name.dismantle;
    let parts = [...dismantle(scope || ''), ...dismantle(key)];
    while (parts.indexOf('..') >= 0) {
      let index = parts.indexOf('..');
      parts.splice(index, 1);
      if (index > 0) parts.splice(index - 1, 1);
    }
    let name = parts.shift();
    if (parts.length) name = `${name}[${parts.join('][')}]`;
    return name;
  };

  for (let item of collection) {
    if (item.key) {
      item.name = nameFor(indexedScope, item.key);
    }
  }

  return collection;
};
