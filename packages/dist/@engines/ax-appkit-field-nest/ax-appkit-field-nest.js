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
  form: (f, target) => (options = {}) =>
    target({
      ...options,
      formTag: {
        $rescope: (el) => () => {
          ax.x.lib
            .unnested(el, 'ax-appkit-form-nest')
            .forEach((target) => target.$rescope());
        },
        // $on: {
        //   'ax.appkit.form.nest.item.move: rescope': (e, el) => el.$rescope(),
        //   ...(options.formTag || {}).$on
        // },
        ...options.formTag,
      },
    }),

  controls: {
    nest: (f, target) => (options = {}) =>
      ax.x.form.field.nest.components.nest(f, options),
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
  console.log('nest opts', options);
  let ff = this.nest.factory({
    scope: options.name, // name is the scope for child items
    object: options.value,
    singular: options.singular,
    unindexed: options.unindexed,
    formOptions: f.formOptions,
  });
  let rebasedName = function (name, scope, index) {
    let pattern = `^${scope.replace(/(\[|\])/g, '\\$1')}\\[\\d*\\](.*)$`;
    let regex = new RegExp(pattern);
    let match = name.match(regex);
    if (!match) return scope;
    let i = options.unindexed ? '' : index;
    return `${scope}[${i}]${match[1]}`;
  };

  let nestTagOptions = {
    name: ff.scope,

    $rescope: (el) => (oldScope, newScope) => {
      let oldName = el.getAttribute('name');
      let newName = oldName.replace(oldScope, newScope);
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

    ...options.nestTag,
  };

  let controlTagOptions = {
    $value: (el) => () => el.$('|ax-appkit-form-nest-items').$count(),
    $controls: (el) => () => {
      return x.lib.unnested(el, 'ax-appkit-form-control');
    },
    $buttons: (el) => () => {
      return el.$$('button').$$;
    },
    $disable: (el) => () => {
      let controls = [...el.$controls(), ...el.$buttons()];
      for (let i in controls) {
        controls[i].$disable && controls[i].$disable();
      }
    },
    $enable: (el) => () => {
      let controls = [...el.$controls(), ...el.$buttons()];
      for (let i in controls) {
        controls[i].$enable && controls[i].$enable();
      }
    },
    $focus: (el) => () => {
      let first = el.$('ax-appkit-form-control');
      if (first) first.$focus();
    },
    ...options.controlTag,
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-form-nest'](nestForm(ff), nestTagOptions),
    controlTagOptions
  );
};

// ax.extension.form.field.nest.lib.rescopeForm = (el) => () => {
//   let nests = ax.x.lib.unnested(el, 'ax-appkit-form-nest');
//   nests.forEach((target) => target.$rescope());
// }

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
    scope: options.scope,
    object: options.object,
    formOptions: options.formOptions,
    items: (options = {}) => this.items(ff, options),
    add: (options = {}) => this.add(ff, options),
    unindexed: options.unindexed,
    singular: options.singular,
  });

  return ff;
};

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
          ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
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
        // el.focus();
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
    scope: options.scope,
    object: options.object,
    formOptions: options.formOptions,
    index: options.index,
    unindexed: options.unindexed,
    singular: options.singular,
    remove: (options) => this.remove(f, options),
    up: (options) => this.up(f, options),
    down: (options) => this.down(f, options),
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
      // itemsElement.focus();
      itemsElement.$send('ax.appkit.form.nest.items.change');

      // parent.$send('ax.appkit.form.nest.item.remove', {
      //   detail: {
      //     target: item,
      //     index: index,
      //     length: length,
      //   },
      // });
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
        // el.focus();
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
