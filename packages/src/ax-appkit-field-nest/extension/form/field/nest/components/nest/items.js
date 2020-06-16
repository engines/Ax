ax.extension.form.field.nest.components.nest.items = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let formFn = options.form || (() => null);
  let item = function (itemData, index) {
    let i = f.unindexed ? '' : index;
    let scope = f.scope ? `${f.scope}[${i}]` : `${i}`;
    let ff = this.items.factory({
      scope: scope,
      object: itemData,
      index: index,
      singular: f.singular,
      unindexed: f.unindexed,
      formOptions: f.formOptions,
    });

    return a['div|appkit-form-nest-item'](formFn(ff), {
      $rescope: function (scope, index) {
        ff.index = index;
        let i = ff.unindexed ? '' : index;
        ff.scope = `${scope}[${i}]`;

        let namedElements = x.lib.unnested(this, `[name^="${scope}"]`);

        namedElements.forEach(function (el) {
          if (el.dataset.axPseudotag == 'appkit-form-nest') {
            el.$rescope(scope, index);
          } else {
            el.$('^|appkit-form-nest').$rescopeElement(el, scope, index);
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

  return a['div|appkit-form-nest-items'](itemsData.map(item), {
    $add: function () {
      let newItem = item({}, this.children.length);
      this.append(newItem);
      let first = newItem.$('|appkit-form-control');
      if (first) first.$focus();
    },
    $count: function () {
      return this.$$(':scope > |appkit-form-nest-item').$$.length;
    },
    $rescopeItems: function () {
      this.$$(':scope > |appkit-form-nest-item').$$.forEach(function (
        itemTag,
        index
      ) {
        itemTag.$rescope(f.scope, index);
      });
    },
    ...options.itemsTag,
    $on: {
      'ax.appkit.form.nest.item.move': (e, el) => {
        e.stopPropagation();
        el.$rescopeItems();
      },
      'ax.appkit.form.nest.item.remove': (e, el) => {
        e.stopPropagation();
        el.$rescopeItems();
      },
      ...(options.itemsTag || {}).$on,
    },
  });
};
