/**
 * Update state and render new content.
 */
ax.node.create.properties.accessors.state.set = function (element, state) {
  element.$ax.$state = state;
  element.$render();

  return element;
};
