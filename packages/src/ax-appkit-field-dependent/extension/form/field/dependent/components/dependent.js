ax.extension.form.field.dependent.components.dependent = function (options) {
  let a = ax.a;
  let x = ax.x;

  let optionsCollection = x.form.field.dependent.collect(options);

  let dependentTag = {
    $init: function () {
      this.$dependencies = optionsCollection.map((options) => ({
        field: x.form.field.dependent.components.dependent.dependency(
          this,
          options
        ),
        value: options.value,
        pattern: options.pattern,
      }));
      for (let dependency of this.$dependencies) {
        dependency.field.$registerDependent(this);
      }
    },
    $registerDependent: function (dependent) {
      this.$dependents.push(dependent);
    },
    $hide: function () {
      this.style.display = 'none';
      this.$('|appkit-form-control').$disable();
      let dependents = x.lib.unnested(this, '|appkit-form-field-dependent');
      for (let i in dependents) {
        dependents[i].$hide();
      }
    },
    $show: function () {
      this.$('|appkit-form-control').$enable();
      if (!options.animate) {
        this.style.display = 'block';
      } else {
        x.lib.animate.fade.in(this);
      }
      let dependents = x.lib.unnested(this, '|appkit-form-field-dependent');
      for (let i in dependents) {
        dependents[i].$check();
      }
    },
    $dependents: [],
    $value: function () {
      return this.$('|appkit-form-control').$value();
    },
    $match: function () {
      if (ax.is.undefined(this.$matched)) {
        if (this.$dependencies.length) {
          for (let dependency of this.$dependencies) {
            if (x.form.field.dependent.components.dependent.match(dependency)) {
              this.$matched = true;
              return true;
            }
          }
          this.$matched = false;
          return false;
        } else {
          this.$matched = true;
          return true;
        }
      } else {
        return this.$matched;
      }
    },
    $check: function () {
      if (this.$match()) {
        this.$show();
      } else {
        this.$hide();
      }
    },
    $reset: function () {
      this.$matched = undefined;
      for (let dependent of this.$dependents) {
        dependent.$reset();
      }
    },
    $checkDependents: function () {
      for (let dependent of this.$dependents) {
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

  return a['|appkit-form-field-dependent'](options.body, dependentTag);
};
