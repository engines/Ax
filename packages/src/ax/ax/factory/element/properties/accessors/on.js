/**
 * Add an event listener.
 */
ax.factory.element.properties.accessors.on = function (element) {
  element.$on = function (handlers) {
    for (let handle in handlers) {
      element.$off(handle);
      element.$events[handle] = (e) =>
        handlers[handle].call(element, e, element, element.$state);
      element.addEventListener(handle.split(':')[0], element.$events[handle]);
    }
  };

  return element;
};
