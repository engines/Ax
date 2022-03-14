/**
 * Add traverse and query tools to element.
 */
ax.node.create.tools = function (element) {
  element.$ = this.tools.traverse;
  element.$$ = this.tools.query;
};
