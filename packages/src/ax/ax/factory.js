/**
 * Element Factory.
 * The Element Factory turns a component into an HTML node or a null.
 */
ax.factory = function (component) {
  let is = ax.is;
  let factory = ax.factory;

  if (is.null(component)) return null;
  if (is.node(component)) return component;
  if (is.nodelist(component)) return factory.nodelist(component);
  if (is.array(component)) return factory.array(component);
  if (is.object(component)) return factory.object(component);
  if (is.tag(component)) return factory.tag(component);
  if (is.function(component)) return factory.function(component);
  if (is.undefined(component)) return factory.undefined();
  return factory.text(component);
};
