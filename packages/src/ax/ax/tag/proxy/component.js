/**
 * Set Ax content property based on component type.
 */
ax.tag.proxy.component = function (component) {
  if (ax.is.string(component))
    return {
      $text: component,
    };
  if (ax.is.array(component))
    return {
      $nodes: component,
    };
  if (ax.is.null(component)) return {};
  return {
    $nodes: [component],
  };
};
