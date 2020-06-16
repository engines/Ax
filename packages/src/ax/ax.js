/**
 * Creates an HTML element and inserts it in the DOM.
 * The target for the insertion is the document.body, unless options.target
 * specifies otherwise. options.target can be a selector string or an element.
 * If options.target is false, the element will not be added to the DOM.
 * The default insertion method is to append a child. Set options.method
 * 'replace' to replace the target, or 'prepend' to prepend a child.
 */
let ax = function (component, options = {}) {
  let element = ax.factory(component);
  let target = options.target;
  if (element == null) return;

  let load = () => {
    if (target != false) {
      if (ax.is.undefined(target)) {
        target = window.document.body;
      } else if (ax.is.string(target)) {
        target = window.document.querySelector(target);
      }
      if (options.method == 'replace') {
        target.replaceWith(element);
      } else if (options.method == 'prepend') {
        target.prependChild(element);
      } else {
        target.appendChild(element);
      }
    }
  };

  // Ensure that the document is ready.
  if (document.readyState == 'complete') {
    load();
  } else {
    document.addEventListener('DOMContentLoaded', load);
  }

  return element;
};
