ax.extension.form.field.nest.components.nest.items = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let formFn = options.form || (() => null);
  let item = function (itemData, index) {
    let i = f.unindexed ? '' : index;
    let scope = `${f.scope}[${i}]`; // f.scope ? `${f.scope}[${i}]` : `${i}`;
    let ff = this.items.factory({
      scope: scope,
      object: itemData,
      index: index,
      singular: f.singular,
      unindexed: f.unindexed,
      formOptions: f.formOptions,
    });

    return a['li|ax-appkit-form-nest-item'](formFn(ff), {
      // $itemsElement: (el) => () => {
      //   let selector = x.lib.object.dig(options, ['itemsTag', '$tag']) || 'ax-appkit-form-nest-items'
      //   return el.$(`^${selector}`)
      // },
      name: scope,

      $rescope: (el) => (oldScope, newScope, index) => {
        let oldName = el.getAttribute('name');
        let i = ff.unindexed ? '' : index;
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

    $rescope: (el) => (oldScope, newScope) => {
      let oldName = el.getAttribute('name');
      let newName = oldName.replace(oldScope, newScope);
      el.setAttribute('name', newName);
      el.$itemElements().forEach((itemElement, index) => {
        itemElement.$rescope(oldName, newName, index);
      });
    },

    // $rescopeItems: (el) => () => {
    //   el.$itemElements().forEach(function (item, index) {
    //     item.$rescopeItem(f.scope, index);
    //   });
    // },
    $itemElements: (el) => () =>
      x.lib.unnested(el, '|ax-appkit-form-nest-item'),
    ...options.itemsTag,
    // $on: {
    //   'ax.appkit.form.nest.item.move': (e, el) => {
    //     e.stopPropagation();
    //     el.$rescopeItems();
    //   },
    //   'ax.appkit.form.nest.item.remove': (e, el) => {
    //     e.stopPropagation();
    //     el.$rescopeItems();
    //   },
    //   ...(options.itemsTag || {}).$on,
    // },
  });
};
