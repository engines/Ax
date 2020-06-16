/**
 * Traverse Tool, for traversing the DOM.
 */
ax.factory.element.properties.tools.traverse = function (...selectors) {
  let result = this;
  selectors.forEach(function (selector) {
    if (ax.is.array(selector)) {
      result = result.$(...selector);
    } else if (/,\s*/.test(selector)) {
      // comma is OR
      let selectors = selector.split(/,\s*/);
      let selected;
      for (let i in selectors) {
        selected = ax.factory.element.properties.tools.traverse.select(
          result,
          selectors[i]
        );
        if (selected) break;
      }
      result = selected;
    } else if (/^\S+$/.test(selector)) {
      // there is a single selector
      result = ax.factory.element.properties.tools.traverse.select(
        result,
        selector
      );
    } else {
      // there must be multiple selectors
      selectors = selector.match(/(\S+)/g);
      result = result.$(...selectors);
    }
  });
  return result;
};
