ax.node.create.properties.state = function (element, property, options = {}) {
  Object.defineProperty(element, property, {
    get: () => {
      let value = element.$ax[property];
      if (ax.is.function(value)) return value(element);
      return value;
    },
    set: (state) => {
      element.$ax[property] = state;
      if (options.reactive) element.$render();
    },
  });
};
