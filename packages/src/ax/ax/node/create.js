/**
 * Create element from Ax component properties.
 */
ax.node.create = function (properties) {
  if (ax.is.not.object(properties)) return null;

  properties = {
    $tag: 'span',
    ...properties,
  };

  let element;

  if (ax.is.array(properties.$tag)) {
    element = window.document.createElementNS(...properties.$tag);
  } else {
    element = window.document.createElement(properties.$tag);
  }

  if (properties.$shadow) element.attachShadow({ mode: 'open' });

  element.$ax = properties;

  return ax.node.create.properties(element);
};
