/**
 * Send an event from the element.
 */
ax.node.create.accessors.send = function (element) {
  element.$send = function (type, options = {}) {
    return element.dispatchEvent(
      new CustomEvent(type, {
        detail: options.detail || {},
        bubbles: options.bubbles == false ? false : true,
        cancelable: options.cancelable == false ? false : true,
      })
    );
  };
};
