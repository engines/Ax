/**
 * Add traverse and query tools to element.
 */
ax.node.create.properties.tools = function (element) {
  element.$ = this.tools.traverse;
  element.$$ = this.tools.query;

  return element;
};
