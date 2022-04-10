/**
 * Set Ax content property based on component type.
 */
ax.tag.proxy.properties = function (properties) {
  if (ax.is.object(properties)) return properties;
  if (ax.is.tag(properties)) return { $nodes: [properties()] };
  if (ax.is.array(properties) || ax.is.nodelist(properties))
    return { $nodes: properties };
  return { $nodes: [properties] };
};
