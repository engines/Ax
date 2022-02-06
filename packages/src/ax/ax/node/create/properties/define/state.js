ax.node.create.properties.define.state = function (element, property) {
  Object.defineProperty(element, property, {
    get: () => element.$ax[property],
    set: (state) => {
      element.$ax[property] = state;
      element.$render();
    },
  });
};
