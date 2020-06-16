/**
 * Update state, and render new content.
 */
ax.factory.element.properties.accessors.state.set = function (element, state) {
  if (element.$ax.$state === state) return;

  element.$ax.$state = state;

  if (element.$ax.$update) {
    element.$ax.$update.call(element, element, state) && element.$render();
  } else {
    element.$render();
  }

  return element;
};
