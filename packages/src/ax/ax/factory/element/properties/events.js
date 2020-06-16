/**
 * Add initial events to element.
 */
ax.factory.element.properties.events = function (element) {
  element.$events = {};

  for (let handle in element.$ax.$on) {
    element.$events[handle] = (e) =>
      element.$ax.$on[handle].call(element, e, element, element.$state);
    element.addEventListener(handle.split(':')[0], element.$events[handle]);
  }

  return element;
};
