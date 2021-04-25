ax.extension.form.field.nest.components.nest.factory = function (options) {
  let x = ax.x;

  let ff = x.form.factory({
    scope: options.scope,
    object: options.object,
    formOptions: options.formOptions,
    items: (options = {}) => this.items(ff, options),
    add: (options = {}) => this.add(ff, options),
    collection: options.collection,
    singular: options.singular,
  });

  return ff;
};
