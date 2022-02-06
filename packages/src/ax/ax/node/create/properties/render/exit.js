/**
 * Recursive removal of event handlers and call of $exit functions.
 */
ax.node.create.properties.render.exit = function (element) {
  for (let child of element.childNodes)
    ax.node.create.properties.render.exit(child);

  if (element.$ax && ax.is.function(element.$ax.$exit))
    element.$ax.$exit(element);
};
