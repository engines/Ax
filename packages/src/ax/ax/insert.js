/**
 * Inserts an element in the DOM.
 */
ax.insert = function (element, options = {}) {
  let target = options.target;
  if (ax.is.string(target)) {
    target = window.document.querySelector(target);
  } else if (ax.is.undefined(target)) {
    target = window.document.body;
  }
  let method = options.method || 'appendChild';
  target[method](element);
};
