/**
 * Attach shadow DOM to element and insert styles.
 */
ax.node.create.shadow = function (element) {
  // if (properties.$shadow)
  if (element.$ax.$shadow) {
    element.attachShadow({ mode: 'open' });
    if (ax.is.not.true(element.$ax.$shadow)) {
      element.shadowRoot.appendChild(
        ax.a.style(ax.css.sheet([element.$ax.$shadow]))
      );
    }
  };
};
