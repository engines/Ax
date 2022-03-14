ax.extensions.form.field.dependent.components.dependent = function (
  f,
  target,
  options
) {
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
      'ax.appkit.form.control.change': (e, el) => {
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
