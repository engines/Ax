/**
 * Creates an HTML element and inserts it in the DOM.
 * The target for the insertion is the document.body, unless options.target
 * specifies otherwise. options.target can be a selector string or an element.
 * The default insertion method is to append a child. Set options.method
 * 'replaceWith' to replace the target, or 'prependChild' to prepend a child.
 */
let ax = (component, options = {}) => {
  let element = ax.node(component);
  let insert = () => ax.insert(element, options);

  // Ensure that the document is ready to write to.
  if (
    window.document.readyState == 'interactive' ||
    window.document.readyState == 'complete'
  ) {
    insert();
  } else {
    window.document.addEventListener('DOMContentLoaded', insert);
  }

  return element;
};
