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
