ax.extension.form.field.nest.components.nest.items = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let formFn = options.form || (() => null);

  let itemsTagName =
    (options.itemsTag || {}).$tag || 'ax-appkit-form-nest-items';
  let itemTagName = (options.itemTag || {}).$tag || 'ax-appkit-form-nest-item';

  let item = function (itemData, index) {
    let ff = this.items.factory({
      parent: f,
      scope: `${f.scope}[${options.collection ? '' : index}]`,
      indexedScope: `${f.indexedScope}[${index}]`,
      object: itemData,
      index: index,
      singular: f.singular,
      collection: f.collection,
      formOptions: f.formOptions,
    });

    return a[itemTagName](formFn(ff), {
      name: ff.scope,

      $controls: (el) => () => {
        return ax.x.lib.unnested(el, 'ax-appkit-form-control');
      },
      $valueControls: (el) => () => {
        return ax.x.lib
          .unnested(
            el,
            'ax-appkit-form-control:not(.ax-appkit-form-control-without-value)'
          )
          .filter((control) => control.$enabled);
      },
      $value: (el) => () => {
        let controls = el.$valueControls();
        object = {};
        for (let control of controls) {
          object[control.$key] = control.$output();
        }
        return object;
      },

      $rescope: (el) => (
        oldScope,
        newScope,
        oldIndexedScope,
        newIndexedScope,
        index
      ) => {
        let oldName = `${oldScope}[${options.collection ? '' : ff.index}]`;
        let oldIndexedName = `${oldIndexedScope}[${ff.index}]`;
        let newName = `${newScope}[${options.collection ? '' : index}]`;
        let newIndexedName = `${newIndexedScope}[${index}]`;

        let rescopable = x.lib.unnested(
          el,
          `[name^="${oldName}"], [name^="${oldIndexedName}"]`
        );

        el.setAttribute('name', newName);
        ff.scope = newName;
        ff.indexedScope = newIndexedName;
        ff.index = index;

        rescopable.forEach((target) => {
          if (ax.is.function(target.$rescope)) {
            target.$rescope(oldName, newName, oldIndexedScope, newIndexedName);
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

  return a[itemsTagName](itemsData.map(item), {
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

    $controls: (el) => () => {
      return x.lib.unnested(el, 'ax-appkit-form-control');
    },

    $enabled: true,
    $disable: (el) => () => {
      el.$enabled = false;
      let controls = el.$controls();
      for (let i in controls) {
        controls[i].$disable && controls[i].$disable();
      }
    },
    $enable: (el) => () => {
      el.$enabled = true;
      let controls = el.$controls();
      for (let i in controls) {
        controls[i].$enable && controls[i].$enable();
      }
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

    $rescope: (el) => (
      oldScope,
      newScope,
      oldIndexedScope,
      newIndexedScope
    ) => {
      let rescopable = x.lib.unnested(
        el,
        `[name^="${oldScope}"], [name^="${oldIndexedScope}"]`
      );
      rescopable.forEach((target, index) => {
        if (ax.is.function(target.$rescope)) {
          target.$rescope(
            oldScope,
            newScope,
            oldIndexedScope,
            newIndexedScope,
            index
          );
        }
      });
      el.setAttribute('name', newScope);
    },

    $itemElements: (el) => () => x.lib.unnested(el, itemTagName),

    ...options.itemsTag,
  });
};
