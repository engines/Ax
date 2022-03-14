ax.node.create.element = function (properties) {
  let element
  if (ax.is.array(properties.$tag)) {
    let tag = ax.node.create.element.tag(properties.$tag[1] || '')
    properties = {
      ...properties,
      ...tag,
      $tag: [properties.$tag[0], tag.$tag]
    }
    element = window.document.createElementNS(...properties.$tag);
  } else {
    properties = {
      ...properties,
      ...ax.node.create.element.tag(properties.$tag || '')
    }
    element = window.document.createElement(properties.$tag);
  }
  element.$ax = properties
  return element
};
