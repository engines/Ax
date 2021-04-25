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
            .forEach((target) => target.$rescope());
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
