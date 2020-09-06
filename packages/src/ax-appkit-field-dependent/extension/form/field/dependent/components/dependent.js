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
