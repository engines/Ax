ax.extension.form.field.dependent.collect = (options) => {
  let x = ax.x;

  let collection;

  if (ax.is.string(options.dependent)) {
    collection = [
      {
        key: options.dependent,
      },
    ];
  } else if (ax.is.array(options.dependent)) {
    collection = options.dependent;
  } else if (ax.is.object(options.dependent)) {
    collection = [options.dependent];
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
      item.name = nameFor(options.scope, item.key);
    }
  }

  return collection;
};
