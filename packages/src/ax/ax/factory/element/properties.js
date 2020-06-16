/**
 * Render active element, with reactive properties.
 */
ax.factory.element.properties = function (element) {
  return this.init(
    this.properties
      .render(
        this.properties.events(
          this.properties.accessors(
            this.properties.tools(this.properties.define(element))
          )
        )
      )
      .$render()
  );
};
