/**
 * Create element from an array of components.
 */
ax.factory.array = function (component) {
  return this.element({
    $nodes: component,
  });
};
