/**
 * Add initial events to element.
 */
ax.node.create.events = function (element) {
  element.$events = {};

  for (let handle in element.$ax.$on) {
    element.$events[handle] = element.$ax.$on[handle](element);
    element.addEventListener(handle.split(':')[0], element.$events[handle]);
  };
};
