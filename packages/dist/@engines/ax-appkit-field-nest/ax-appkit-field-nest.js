// Ax, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax, dependencies={}) => factory(ax, dependencies)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax, dependencies={}) {

ax.extension.form.field.nest = {};

ax.extension.report.field.nest = {};

ax.extension.form.field.nest.components = {};

ax.extension.form.field.nest.sortable =
  dependencies.sortable || window.sortable;

ax.extension.form.field.nest.lib = {};

ax.extension.form.field.nest.shim = {
  controls: {
    nest: (f, target) => (options = {}) =>
      ax.x.form.field.nest.components.nest(f, options),
  },

  form: (f, target) => (options = {}) =>
    target({
      ...options,
      formTag: {
        $rescope: (el) => () => {
          ax.x.lib
            .unnested(el, 'ax-appkit-form-nest')
            .forEach((target) => target.$rescope(f.scope));
        },
        ...options.formTag,
      },
    }),

  field: (f, target) => (options = {}) => {
    if (options.collection) {
      if (
        options.as == 'one' ||
        options.as == 'many' ||
        options.as == 'table' ||
        options.as == 'nest'
      ) {
        options.collection = false;
        options.items = {
          singular: options.singular,
          collection: true,
          ...options.items,
        };
      }
    }
    return target(options);
  },
};

ax.extension.report.field.nest.components = {};

ax.extension.report.field.nest.shim = {
  controls: {
    nest: (f, target) => (options = {}) =>
      ax.x.report.field.nest.components.nest(f, options),
  },
};

ax.extension.form.field.nest.components.nest = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let nestForm = options.form || (() => null);
  let ff = this.nest.factory({
    parent: f,
    scope: f.scope ? `${f.scope}[${options.key}]` : options.key,
    indexedScope:
      f.indexedScope || f.scope
        ? `${f.indexedScope || f.scope}[${options.key}]`
        : options.key,
    object: options.value,
    singular: options.singular,
    collection: options.collection,
    formOptions: f.formOptions,
  });

  let nestTagOptions = {
    name: ff.scope,

    $rescope: (el) => (
      oldScope,
      newScope,
      oldIndexedScope,
      newIndexedScope
    ) => {
      let oldName = oldScope ? `${oldScope}[${options.key}]` : options.key;
      let oldIndexedName =
        oldIndexedScope || oldScope
          ? `${oldIndexedScope || oldScope}[${options.key}]`
          : options.key;
      let newName = newScope ? `${newScope}[${options.key}]` : oldName;
      let newIndexedName = newIndexedScope
        ? `${newIndexedScope}[${options.key}]`
        : oldIndexedName;

      el.setAttribute('name', newName);
      ff.scope = newName;
      ff.indexedScope = newIndexedName;

      let rescopable = x.lib.unnested(
        el,
        `[name^="${oldName}"], [name^="${oldIndexedName}"]`
      );

      rescopable.forEach((target) => {
        if (ax.is.function(target.$rescope)) {
          target.$rescope(oldName, newName, oldIndexedName, newIndexedName);
        }
      });
    },

    ...options.nestTag,
  };

  let controlTagOptions = {
    $controls: (el) => () => {
      return x.lib.unnested(
        el,
        'ax-appkit-form-control, |ax-appkit-form-nest-items'
      );
    },
    $value: (el) => () => {
      let controls = ax.x.lib
        .unnested(
          el,
          'ax-appkit-form-control:not(.ax-appkit-form-control-without-value), |ax-appkit-form-nest-items'
        )
        .filter((control) => control.$enabled);
      let object = {};
      for (let control of controls) {
        if (control.$ax.$pseudotag == 'ax-appkit-form-nest-items') {
          object = control.$value();
          break;
        }
        object[control.$key] = control.$output();
      }
      return object;
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
    $focus: (el) => () => {
      let first = el.$(
        'ax-appkit-form-control:not(.ax-appkit-form-control-not-focusable)'
      );
      if (first) first.$focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-nest'](nestForm(ff), nestTagOptions),
    controlTagOptions
  );
};

ax.extension.report.field.nest.components.nest = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let nestReport = options.report || (() => null);

  let nestFactory = this.nest.factory({
    scope: options.name, // name is the scope for child items
    object: options.value,
    reportOptions: r.reportOptions,
  });

  let nestTagOptions = {
    name: nestFactory.scope,
    ...options.nestTag,
  };

  let controlTagOptions = {
    $value: (el) => () => {
      let items = el.$('ax-appkit-report-nest-items');
      if (items) {
        return el.$('ax-appkit-report-nest-items').$count();
      } else {
        return null;
      }
    },
    $focus: (el) => () => {
      let first = el.$('ax-appkit-report-control');
      if (first) first.$focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-report-control'](
    a['ax-appkit-report-nest'](nestReport(nestFactory), nestTagOptions),
    controlTagOptions
  );
};

ax.extension.form.field.nest.components.nest.add = function (f, options) {
  let a = ax.a;

  let singular = f.singular;

  let label = `✚ Add${singular ? ` ${singular}` : ''}`;

  return a['ax-appkit-form-nest-add-button'](
    f.button({
      label: label,
      onclick: (e, el) => {
        let items = el.$('^ax-appkit-form-nest |ax-appkit-form-nest-items');
        items.$add();
      },
      ...options,
    }),
    options.addButtonTag
  );
};

ax.extension.form.field.nest.components.nest.factory = function (options) {
  let x = ax.x;

  let ff = x.form.factory({
    items: (options = {}) => this.items(ff, options),
    add: (options = {}) => this.add(ff, options),
    ...options,
  });

  return ff;
};

ax.extension.form.field.nest.components.nest.items = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let formFn = options.form || (() => null);
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

    return a['li|ax-appkit-form-nest-item'](formFn(ff), {
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

    $itemElements: (el) => () =>
      x.lib.unnested(el, '|ax-appkit-form-nest-item'),

    ...options.itemsTag,
  });
};

ax.extension.report.field.nest.components.nest.factory = function (options) {
  let x = ax.x;

  let ff = x.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options.reportOptions,
  });

  ff.items = (options = {}) => this.items(ff, options);

  return ff;
};

ax.extension.report.field.nest.components.nest.items = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let reportFn = options.report || (() => null);
  let item = function (itemData, index) {
    let ff = this.items.factory({
      scope: f.scope ? `${f.scope}[${index}]` : `${index}`,
      object: itemData,
      index: index,
      reportOptions: f.reportOptions,
    });

    return a['ax-appkit-report-nest-item'](reportFn(ff), options.itemTag);
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

ax.extension.form.field.nest.components.nest.items.down = function (
  f,
  options = {}
) {
  return f.button({
    label: '⏷',
    onclick: function (e, el) {
      let itemsElement = el.$('^|ax-appkit-form-nest-items');
      let itemElements = itemsElement.$itemElements();
      let item;
      for (item of itemElements) {
        if (item.contains(el)) break;
      }
      var next = item.nextSibling;
      var parent = item.parentElement;
      if (next) {
        parent.insertBefore(item, next.nextSibling);
        el.$('^form').$rescope();
        itemsElement.$send('ax.appkit.form.nest.items.change');
      }
    },
    ...options,
  });
};

ax.extension.form.field.nest.components.nest.items.factory = function (
  options = {}
) {
  let x = ax.x;

  let f = x.form.factory({
    remove: (options) => this.remove(f, options),
    up: (options) => this.up(f, options),
    down: (options) => this.down(f, options),
    ...options,
  });

  return f;
};

ax.extension.form.field.nest.components.nest.items.remove = function (
  f,
  options = {}
) {
  let singular = f.singular || 'item';
  let confirmation;

  if (ax.is.false(options.confirm)) {
    confirmation = false;
  } else if (ax.is.string(options.confirm) || ax.is.function(options.confirm)) {
    confirmation = options.confirm;
  } else {
    confirmation = `Are you sure that you want to remove this ${singular}?`;
  }

  return f.button({
    label: '✖',
    confirm: confirmation,
    onclick: function (e, el) {
      let itemsElement = el.$('^|ax-appkit-form-nest-items');
      let itemElements = itemsElement.$itemElements();
      let item;
      for (item of itemElements) {
        if (item.contains(el)) break;
      }
      let parent = item.parentElement;
      let index = Array.prototype.indexOf.call(parent.children, item);
      item.remove();
      (ax.x.lib.tabable.next(parent) || window.document.body).focus();
      let length = parent.children.length;
      itemsElement.$('^form').$rescope();
      itemsElement.$send('ax.appkit.form.nest.items.change');
    },
    ...options,
  });
};

ax.extension.form.field.nest.components.nest.items.up = function (
  f,
  options = {}
) {
  return f.button({
    label: '⏶',
    onclick: function (e, el) {
      let itemsElement = el.$('^|ax-appkit-form-nest-items');
      let itemElements = itemsElement.$itemElements();
      let item;
      for (item of itemElements) {
        if (item.contains(el)) break;
      }
      var previous = item.previousSibling;
      var parent = item.parentElement;
      if (previous) {
        parent.insertBefore(item, previous);
        el.$('^form').$rescope();
        itemsElement.$send('ax.appkit.form.nest.items.change');
      }
    },
    ...options,
  });
};

ax.extension.report.field.nest.components.nest.items.factory = function (
  options
) {
  let x = ax.x;

  let index = options.index;

  let f = x.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options.reportOptions,
  });

  f.index = index;

  return f;
};

}));
