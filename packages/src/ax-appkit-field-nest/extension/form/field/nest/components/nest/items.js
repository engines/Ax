ax.extension.form.field.nest.components.nest.items = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let formFn = options.form || (() => null);
  let item = function (itemData, index) {
    let i = options.collection ? '' : index;
    let scope = `${f.scope}[${i}]`;
    let ff = this.items.factory({
      scope: scope,
      object: itemData,
      index: index,
      singular: options.singular,
      collection: options.collection,
      formOptions: f.formOptions,
    });

    return a['li|ax-appkit-form-nest-item'](formFn(ff), {
      name: scope,

      $controls: (el) => () => {
        return ax.x.lib.unnested(el, 'ax-appkit-form-control');
      },
      $value: (el) => () => {
        let controls = el.$controls();
        object = {};
        for (let control of controls) {
          object[control.$key] = control.$value();
        }
        return object;
      },

      $rescope: (el) => (oldScope, newScope, index) => {
        let oldName = el.getAttribute('name');
        let i = f.collection ? '' : index;
        let newName = `${newScope}[${i}]`;
        ff.index = index;
        ff.scope = newName;
        el.setAttribute('name', newName);
        let rescopable = x.lib.unnested(el, `[name^="${oldName}"]`);
        rescopable.forEach((target) => {
          if (ax.is.function(target.$rescope)) {
            target.$rescope(oldName, newName);
          } else {
            target.setAttribute(
              'name',
              target.getAttribute('name').replace(oldName, newName)
            );
          }
        });
      },
      ...options.itemTag,
    });
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

  return a['ul|ax-appkit-form-nest-items'](itemsData.map(item), {
    name: f.scope,
    $add: (el) => () => {
      let newItem = item({}, el.children.length);
      el.append(newItem);
      let first = newItem.$('ax-appkit-form-control');
      if (first) first.$focus();
      el.$send('ax.appkit.form.nest.item.add');
    },

    $count: (el) => () => {
      return el.$itemElements().length;
    },

    $value: (el) => () => {
      let elements = el.$itemElements();
      let values = elements.map((element) => element.$value());
      if (options.collection) {
        return values;
      } else {
        return { ...values };
      }
    },

    $rescope: (el) => (oldScope, newScope) => {
      let oldName = el.getAttribute('name');
      let newName = oldName.replace(oldScope, newScope);
      el.setAttribute('name', newName);
      el.$itemElements().forEach((itemElement, index) => {
        itemElement.$rescope(oldName, newName, index);
      });
    },

    $itemElements: (el) => () =>
      x.lib.unnested(el, '|ax-appkit-form-nest-item'),
    ...options.itemsTag,
  });
};
