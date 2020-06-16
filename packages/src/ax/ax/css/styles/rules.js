/**
 * Convert Ax Style Definitions to css style rules.
 */
ax.css.styles.rules = function (styles, selectors = []) {
  if (selectors[0] && selectors[0][0] == '@') {
    return ax.css.styles.rules.at(styles, selectors);
  } else if (ax.is.object(styles)) {
    return ax.css.styles.rules.object(styles, selectors);
  } else {
    return '';
  }
};
