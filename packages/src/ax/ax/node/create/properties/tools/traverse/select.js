/**
 * Select an element based on traversal instruction.
 */
ax.node.create.properties.tools.traverse.select = function (element, selector) {
  selector = selector.replace(/\|([\w\-]+)/g, '[data-ax-pseudotag="$1"]');
  if (!element) {
    return null;
  } else if (/^\s*\^/.test(selector)) {
    selector = selector.replace(/^\s*\^\s*/, '');
    if (selector) {
      return element.closest(selector);
    } else {
      return element.parentElement;
    }
  } else if (/^\s*$/.test(selector)) {
    return element;
  } else {
    return element.querySelector(selector);
  }
};
