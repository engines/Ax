ax.extensions.report.field.dependent.shim = {
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
