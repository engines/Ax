/**
 * Remove an event listener.
 */
ax.factory.element.properties.accessors.off = function (element) {
  element.$off = function (handle) {
    element.removeEventListener(handle.split(':')[0], element.$events[handle]);

    delete element.$events[handle];
  };

  return element;
};
