/**
 * Add an event listener.
 */
ax.node.create.accessors.on = function (element) {
  element.$on = function (adds) {
    ax.node.create.events.adds(element, adds);
  };
};
