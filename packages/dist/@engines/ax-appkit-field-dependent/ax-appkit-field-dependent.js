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

ax.extension.form.field.dependent = {};

ax.extension.report.field.dependent = {};

ax.extension.form.field.dependent.components = {};

ax.extension.form.field.dependent.shim = {
  field: (f, target) => (options = {}) =>
    ax.x.form.field.dependent.components.dependent(f, target, options),

  fieldset: (f, target) => (options = {}) =>
    ax.x.form.field.dependent.components.dependent(f, target, options),

  dependent: (f, target) => (options = {}) =>
    ax.x.form.field.dependent.components.dependent(f, target, options),

  form: (f, target) => (options = {}) =>
    target({
      ...options,
      formTag: {
        ...options.formTag,
        $init: (el) => {
          options.formTag && options.formTag.$init && options.formTag.$init(el);
          el.$checkDependents();
        },
        $on: {
          'ax.appkit.form.async.complete: check dependents': (el) => (e) => {
            el.$checkDependents();
          },
          ...(options.formTag || {}).$on,
        },
        $checkDependents: (el) => () => {
          let dependents = ax.x.lib.unnested(
            el,
            'ax-appkit-form-field-dependent'
          );
          for (let i in dependents) {
            dependents[i].$check();
          }
        },
      },
    }),

  items: (f, target) => (options = {}) =>
    target({
      ...options,
      itemsTag: {
        ...options.itemsTag,
        $on: {
          'ax.appkit.form.nest.item.add: check dependents on new item': (
            el
          ) => (e) => {
            let newItem = el.$itemElements().reverse()[0];
            let dependents = ax.x.lib.unnested(
              newItem,
              'ax-appkit-form-field-dependent'
            );
            for (let i in dependents) {
              dependents[i].$check();
            }
          },
          ...(options.itemsTag || {}).$on,
        },
      },
    }),
};

ax.extension.report.field.dependent.components = {};

ax.extension.report.field.dependent.shim = {
  field: (r, target) => (options = {}) => {
    return ax.x.report.field.dependent.components.dependent({
      body: target(options),
      scope: r.scope,
      dependent: options.dependent,
    });
  },

  fieldset: (r, target) => (options = {}) => {
    return ax.x.report.field.dependent.components.dependent({
      body: target(options),
      scope: r.scope,
      dependent: options.dependent,
    });
  },

  dependent: (r, target) => (options = {}) => {
    return ax.x.report.field.dependent.components.dependent({
      scope: r.scope,
      ...options,
    });
  },
};

ax.extension.form.field.dependent.components.dependent = function (
  f,
  target,
  options
) {
  let a = ax.a;
  let x = ax.x;

  let indexedScope = f.indexedScope || f.scope;
  let name = indexedScope ? `${indexedScope}[${options.key}]` : options.key;

  let optionsCollection = x.form.field.dependent.components.dependent.collect(
    indexedScope,
    options.dependent
  );

  let dependentTag = {
    name: name,
    $init: (el) => {
      el.$dependencies = optionsCollection.map((opts) => ({
        key: opts.key,
        field: x.form.field.dependent.components.dependent.dependency(el, opts),
        value: opts.value,
        pattern: opts.pattern,
      }));
      for (let dependency of el.$dependencies) {
        if (dependency.field) {
          dependency.field.$registerDependent(el);
        }
      }
    },
    $registerDependent: (el) => (dependent) => {
      el.$dependents.push(dependent);
    },
    $hide: (el) => () => {
      el.style.display = 'none';
      el.$('ax-appkit-form-control').$disable();
      let dependents = x.lib.unnested(el, 'ax-appkit-form-field-dependent');
      for (let i in dependents) {
        dependents[i].$hide();
      }
    },
    $show: (el) => () => {
      el.$('ax-appkit-form-control').$enable();
      if (!options.animate) {
        el.style.display = 'block';
      } else {
        x.lib.animate.fade.in(el);
      }
      let dependents = x.lib.unnested(el, 'ax-appkit-form-field-dependent');
      for (let i in dependents) {
        dependents[i].$check();
      }
    },
    $dependents: [],
    $value: (el) => () => {
      return el.$('ax-appkit-form-control').$value();
    },
    $match: (el) => () => {
      if (ax.is.undefined(el.$matched)) {
        if (el.$dependencies.length) {
          for (let dependency of el.$dependencies) {
            if (x.form.field.dependent.components.dependent.match(dependency)) {
              el.$matched = true;
              return true;
            }
          }
          el.$matched = false;
          return false;
        } else {
          el.$matched = true;
          return true;
        }
      } else {
        return el.$matched;
      }
    },
    $check: (el) => () => {
      if (el.$match()) {
        el.$show();
      } else {
        el.$hide();
      }
    },
    $reset: (el) => () => {
      el.$matched = undefined;
      for (let dependent of el.$dependents) {
        dependent.$reset();
      }
    },
    $checkDependents: (el) => () => {
      for (let dependent of el.$dependents) {
        dependent.$reset();
        dependent.$check();
      }
    },
    ...options.dependentTag,
    style: {
      display: 'none',
      ...(options.dependentTag || {}).style,
    },
    $on: {
      'ax.appkit.form.control.change': (el) => (e) => {
        el.$checkDependents();
      },
      ...(options.dependentTag || {}).$on,
    },
    $rescope: (el) => (
      oldScope,
      newScope,
      oldIndexedScope,
      newIndexedScope,
      index
    ) => {
      let oldName = oldScope ? `${oldScope}[${options.key}]` : options.key;
      let oldIndexedName =
        oldIndexedScope || oldScope
          ? `${oldIndexedScope || oldScope}[${options.key}]`
          : options.key;
      let newName = newScope ? `${newScope}[${options.key}]` : options.key;
      let newIndexedName = newIndexedScope
        ? `${newIndexedScope}[${options.key}]`
        : options.key;

      el.setAttribute('name', newIndexedName);

      let rescopable = x.lib.unnested(
        el,
        `[name^="${oldName}"], [name^="${oldIndexedName}"]`
      );
      rescopable.forEach((target) => {
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
    },
  };

  return a['ax-appkit-form-field-dependent'](target(options), dependentTag);
};

ax.extension.report.field.dependent.components.dependent = function (options) {
  let a = ax.a;
  let x = ax.x;

  let optionsCollection = x.form.field.dependent.components.dependent.collect(
    options
  );

  let dependentTag = {
    $init: (el) => {
      el.$dependencies = optionsCollection.map((options) => ({
        field: x.report.field.dependent.components.dependent.dependency(
          el,
          options
        ),
        value: options.value,
        pattern: options.pattern,
      }));
      el.$check();
    },
    $hide: (el) => () => {
      el.style.display = 'none';
    },
    $show: (el) => () => {
      el.style.display = 'block';
    },
    $value: (el) => () => {
      return el.$('ax-appkit-report-control').$value();
    },
    $match: (el) => () => {
      if (ax.is.undefined(el.$matched)) {
        if (el.$dependencies.length) {
          for (let dependency of el.$dependencies) {
            if (x.form.field.dependent.components.dependent.match(dependency)) {
              el.$matched = true;
              return true;
            }
          }
          el.$matched = false;
          return false;
        } else {
          el.$matched = true;
          return true;
        }
      } else {
        return el.$matched;
      }
    },
    $check: (el) => () => {
      if (el.$match()) {
        el.$show();
      } else {
        el.$hide();
      }
    },
    ...options.dependentTag,
    style: {
      display: 'none',
      ...(options.dependentTag || {}).style,
    },
  };

  return a['ax-appkit-report-field-dependent'](options.body, dependentTag);
};

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

ax.extension.form.field.dependent.components.dependent.dependency = (
  el,
  options
) => {
  let selector;

  if (options.selector) {
    selector = options.selector;
  } else {
    selector = `[name="${options.name}"]`;
  }

  let search = options.search || '^form';
  let target = el.$(search).$(selector);
  if (target) {
    return target;
  } else {
    console.error(
      el,
      'Form field failed to find a dependency target using selector:',
      selector,
      'from options',
      options
    );
  }
};

ax.extension.form.field.dependent.components.dependent.match = function (
  options
) {
  let field = options.field;

  if (field && field.$match()) {
    let fieldValue = field.$value();

    if (options.value) {
      return fieldValue === options.value;
    } else if (options.pattern) {
      return new RegExp(options.pattern || '.*').test(fieldValue.toString());
    } else if (ax.is.array(fieldValue)) {
      return fieldValue.length > 0;
    } else {
      return !!fieldValue;
    }
  } else {
    return false;
  }
};

ax.extension.report.field.dependent.components.dependent.dependency = (
  el,
  options
) => {
  let selector;

  if (options.selector) {
    selector = options.selector;
  } else {
    let name = options.name;
    selector = `[data-name='${name}']`;
  }

  let search = options.search || '^ax-appkit-report';

  let target = el.$(search).$(selector);
  let targetDependency;

  if (target) {
    targetDependency = target.$('^ax-appkit-report-field-dependent');
  }

  if (targetDependency) {
    return targetDependency;
  } else {
    console.error(
      'Report field failed to find a dependency target using selector:',
      selector,
      'from options',
      options
    );
  }
};

}));
