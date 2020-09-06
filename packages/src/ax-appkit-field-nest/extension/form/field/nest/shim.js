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
