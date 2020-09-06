/**
 * Node pre-processor that accepts various component types
 * and returns a node.
 */
ax.node = function (component) {
  if (ax.is.null(component)) return null;
  if (ax.is.node(component)) return component;
  if (ax.is.nodelist(component)) return ax.node.nodelist(component);
  if (ax.is.array(component)) return ax.node.array(component);
  if (ax.is.object(component)) return ax.node.object(component);
  if (ax.is.tag(component)) return ax.node.tag(component);
  if (ax.is.function(component)) return ax.node.function(component);
  if (ax.is.undefined(component)) return ax.node.undefined();
  return ax.node.text(component);
};
