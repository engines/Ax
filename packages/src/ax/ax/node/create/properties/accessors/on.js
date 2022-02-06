/**
 * Add an event listener.
 */
ax.node.create.properties.accessors.on = function (element) {
  element.$on = function (handlers) {
    for (let handle in handlers) {
      element.$off(handle);
      element.$events[handle] = handlers[handle];
      element.addEventListener(handle.split(':')[0], (e) =>
        element.$events[handle](element)(e)
      );
    }
  };

  return element;
};
