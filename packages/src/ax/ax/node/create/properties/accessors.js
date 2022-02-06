/**
 * Add methods to element.
 */
ax.node.create.properties.accessors = function (element) {
  return this.accessors.nodes(
    this.accessors.html(
      this.accessors.text(
        this.accessors.on(this.accessors.off(this.accessors.send(element)))
      )
    )
  );
};
