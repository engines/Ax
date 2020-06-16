/**
 * Add child nodes to element.
 */
ax.factory.element.properties.render.nodes = function (element) {
  // Get content for the element.
  let nodes = element.$ax.$nodes;

  if (ax.is.function(nodes)) {
    nodes = nodes.call(element, element, element.$state);
  }

  // Clear existing content
  while (element.firstChild) {
    element.firstChild.remove();
  }

  // Add content
  if (ax.is.array(nodes)) {
    nodes.forEach(function (node) {
      node = ax.factory(node);
      if (node != null) element.appendChild(node);
    });
  } else {
    let node = ax.factory(nodes);
    if (node != null) element.appendChild(node);
  }

  return element;
};
