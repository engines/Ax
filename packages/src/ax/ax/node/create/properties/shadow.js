/**
 * Attach shadow DOM to element and insert styles.
 */
ax.node.create.properties.shadow = function (element) {
  if (element.$ax.$shadow) {
    if (ax.is.array(element.$ax.$shadow)) {
      for (let s of element.$ax.$shadow) {
        element.shadowRoot.appendChild(ax.a.style(ax.css(s)));
      }
    } else if (ax.is.not.true(element.$ax.$shadow)) {
      element.shadowRoot.appendChild(ax.a.style(ax.css(element.$ax.$shadow)));
    }
  }

  return element;
};
