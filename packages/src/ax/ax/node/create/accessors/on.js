/**
 * Add an event listener.
 */
ax.node.create.accessors.on = function (element) {
  element.$on = function (ons) {
    ax.node.create.events.ons(element, ons)
  };
};
