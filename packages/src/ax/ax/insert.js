/**
 * Inserts an element in the DOM.
 */
ax.insert = function (selector, type, content, options = {}) {
  let method = options.method || 'appendChild';
  let tag = window.document.createElement(type);
  Object.assign(tag, options.tag);
  let target = window.document.querySelector(selector);
  tag.innerHTML = content;
  target[method](tag);
};
