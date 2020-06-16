/**
 * Convert an object containing Ax Style Definition to css style rules.
 */
ax.css.styles.rules.object = function (styles, selectors = []) {
  let result = ax.css.styles.rules.rule(styles, selectors);

  Object.keys(styles).forEach(function (selector) {
    let selected = styles[selector];
    selector.split(',').forEach(function (selectorPart) {
      selectorPart = selectorPart.trim();
      if (selectorPart.match(/^[a-zA-Z]+$/)) {
        // If the selector is simple set of characters, then kebab it.
        // Selectors like '.someClass' stay as they are.
        selectorPart = ax.kebab(selectorPart);
      }
      if (selectorPart[0] == '|') {
        let match = selectorPart.match(/^\|([a-zA-Z0-9-_]*)(.*)/);
        selectorPart = `[data-ax-pseudotag="${match[1]}"]${match[2]}`;
      }
      result += ax.css.styles.rules(selected, selectors.concat(selectorPart));
    });
  });

  return result;
};
