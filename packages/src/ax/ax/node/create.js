/**
 * Create element from Ax component properties.
 */
ax.node.create = function (properties) {
  try {
    let element = ax.node.create.element(properties);
    this.create.shadow(element);
    this.create.properties(element);
    this.create.tools(element);
    this.create.accessors(element);
    this.create.events(element);
    this.create.render(element);
    this.create.apply(element);
    this.create.init(element);
    return element;
  } catch (err) {
    if (properties.$catch) {
      return ax.node(properties.$catch(err));
    } else {
      console.error(
        `Ax failed to create element with properties: `,
        properties,
        err
      );
      return '';
    }
  }
};
