ax.node.create.element = function (properties) {
  if (ax.is.array(properties.$tag)) {
    return window.document.createElementNS(...properties.$tag);
  } else {
    return window.document.createElement(properties.$tag || 'span');
  }
};
