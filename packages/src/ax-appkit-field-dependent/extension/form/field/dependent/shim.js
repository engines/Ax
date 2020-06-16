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
        $init: function () {
          options.formTag &&
            options.formTag.$init &&
            options.formTag.$init.bind(this)(arguments);
          this.$checkDependents();
        },
        $checkDependents: function () {
          let dependents = ax.x.lib.unnested(
            this,
            '|appkit-form-field-dependent'
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
            let newItem = el.$$('|appkit-form-nest-item').$$.reverse()[0];
            let dependents = ax.x.lib.unnested(
              newItem,
              '|appkit-form-field-dependent'
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
