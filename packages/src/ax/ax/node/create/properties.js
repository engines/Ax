/**
 * Render active element, with reactive properties.
 */
ax.node.create.properties = function (element) {
  return this.properties.init(
    this.properties.apply(
      this.properties.render(
        this.properties.events(
          this.properties.accessors(
            this.properties.tools(
              this.properties.shadow(this.properties.define(element))
            )
          )
        )
      )
    )
  );
};
