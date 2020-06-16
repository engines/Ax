/**
 * Process style definitions.
 */
ax.css.styles = function (styles) {
  if (ax.is.string(styles)) {
    return styles;
  } else {
    return ax.css.styles.rules(styles);
  }
};
