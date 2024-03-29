ax.node.create.render.nodes.append = function (element, nodes) {
  if (ax.is.node(nodes)) {
    element.appendChild(nodes);
  } else if (ax.is.nodelist(nodes)) {
    for (let node of Array.from(nodes)) {
      element.appendChild(node);
    }
  } else if (ax.is.array(nodes)) {
    for (let node of nodes) {
      node = ax.node(node);
      this.append(element, node);
    }
  } else {
    this.append(element, [nodes]);
  }
};
