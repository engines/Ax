/**
 * Set Ax content property based on component type.
 */
ax.tag.proxy.shim.component = function (component) {
  if (ax.is.tag(component))
    return {
      $nodes: [component],
    };
  if (ax.is.function(component))
    // Handle functions here because
    // the Factory expects any function for $node to be a
    // content function.
    return {
      $nodes: [component(ax.a, ax.x)],
    };
  if (ax.is.string(component))
    return {
      $text: component,
    };
  if (ax.is.null(component)) return {};
  return {
    $nodes: component,
  };
};
