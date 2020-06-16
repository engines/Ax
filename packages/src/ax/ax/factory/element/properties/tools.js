/**
 * Add traverse and query tools to element.
 */
ax.factory.element.properties.tools = function (element) {
  element.$ = this.tools.traverse;
  element.$$ = this.tools.query;

  return element;
};
