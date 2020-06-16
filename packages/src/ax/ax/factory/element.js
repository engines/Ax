/**
 * Create element from Ax component properties.
 */
ax.factory.element = function (properties) {
  properties = {
    $tag: 'span',
    ...properties,
  };

  let element = window.document.createElement(properties.$tag);
  element.$ax = properties;

  return this.element.properties(element);
};
