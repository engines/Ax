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

ax.extension.form.field.dependent.components = {};

ax.extension.form.field.dependent.shim = {
  field: (f, target) => (options = {}) => {
    return ax.x.form.field.dependent.components.dependent({
      body: target(options),
      scope: f.scope,
      dependent: options.dependent,
    });
  },

  fieldset: (f, target) => (options = {}) => {
    return ax.x.form.field.dependent.components.dependent({
      body: target(options),
      scope: f.scope,
      dependent: options.dependent,
    });
  },

  dependent: (f, target) => (options = {}) => {
    return ax.x.form.field.dependent.components.dependent({
      scope: f.scope,
      ...options,
    });
  },

  form: (f, target) => (options = {}) =>
    target({
      ...options,
      formTag: {
        ...options.formTag,
        $init: (el) => {
          options.formTag &&
            options.formTag.$init &&
            options.formTag.$init.bind(el)(arguments);
          el.$checkDependents();
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
            e,
            el
          ) => {
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

ax.extension.form.field.dependent.components.dependent = function (options) {
  let a = ax.a;
  let x = ax.x;

  let optionsCollection = x.form.field.dependent.collect(options);

  let dependentTag = {
    $init: (el) => {
      el.$dependencies = optionsCollection.map((opts) => ({
        field: x.form.field.dependent.components.dependent.dependency(el, opts),
        value: opts.value,
        pattern: opts.pattern,
      }));
      for (let dependency of el.$dependencies) {
        dependency.field.$registerDependent(el);
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
      'ax.appkit.form.control.change': (e, el) => {
        el.$checkDependents();
      },
      ...(options.dependentTag || {}).$on,
    },
  };

  return a['ax-appkit-form-field-dependent'](options.body, dependentTag);
};

ax.extension.report.field.dependent.components.dependent = function (options) {
  let a = ax.a;
  let x = ax.x;

  let optionsCollection = x.form.field.dependent.collect(options);

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
  let targetDependency;

  if (target) {
    targetDependency = target.$('^ax-appkit-form-field-dependent');
  }

  if (targetDependency) {
    return targetDependency;
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

  if (field.$match()) {
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
