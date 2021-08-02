/**
 * Update state and render new content.
 */
ax.node.create.properties.accessors.state.set = function (element, state) {
  if (element.$ax.$state != state) {
    element.$ax.$state = state;
    element.$render();
  }

  return element;
};
