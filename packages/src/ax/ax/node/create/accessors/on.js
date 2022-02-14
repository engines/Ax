/**
 * Add an event listener.
 */
ax.node.create.accessors.on = function (element) {
  element.$on = function (handlers) {
    for (let handle in handlers) {
      element.$off(handle);
      element.$events[handle] = handlers[handle](element);
      element.addEventListener(handle.split(':')[0], element.$events[handle]);
    }
  };
};
