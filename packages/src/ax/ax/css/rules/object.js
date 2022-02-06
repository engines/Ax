/**
 * Convert an object containing Ax Style Definition to css style rules.
 */
ax.css.rules.object = function (styles, selectors = []) {
  let result = ax.css.rules.rule(styles, selectors);

  for (let selectorList of Object.keys(styles)) {
    let selected = styles[selectorList];
    for (let selector of selectorList.split(',')) {
      selector = selector.trim();
      selector = selector.replace(/^([a-zA-Z0-9-_]+)/, (match) =>
        ax.kebab(match)
      );
      result += ax.css.rules(selected, selectors.concat(selector));
    }
  }

  return result;
};
