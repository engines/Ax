/**
 * Remove an event listener.
 */
ax.node.create.properties.accessors.off = function (element) {
  element.$off = function (handle) {
    if (ax.is.array(handle)) {
      while (element.$events.length) {
        element.$off(handle[0]);
      }
    } else {
      element.removeEventListener(
        handle.split(':')[0],
        element.$events[handle]
      );
      delete element.$events[handle];
    }
  };

  return element;
};
