/**
 * Traverse Tool, for traversing the DOM.
 */
ax.node.create.properties.tools.traverse = function (...selectors) {
  let result = this;
  let traverse = ax.node.create.properties.tools.traverse;
  selectors.forEach(function (selector) {
    if (ax.is.array(selector)) {
      result = result.$(...selector);
    } else if (/,\s*/.test(selector)) {
      // comma is OR
      let selectors = selector.split(/,\s*/);
      let selected;
      for (let i in selectors) {
        selected = traverse.select(result, selectors[i]);
        if (selected) break;
      }
      result = selected;
    } else if (/^\S+$/.test(selector)) {
      // string contains a single selector
      result = traverse.select(result, selector);
    } else {
      // string contains multiple selectors
      selectors = selector.match(/(\S+)/g);
      result = result.$(...selectors);
    }
  });
  return result;
};
