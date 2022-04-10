/**
 * Add initial events to element.
 */
ax.node.create.events = function (element) {
  if (element.$ax.$on) {
    ax.node.create.events.adds(element, element.$ax.$on);
  }
};
