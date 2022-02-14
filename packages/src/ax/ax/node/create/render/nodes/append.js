ax.node.create.render.nodes.append = function (element, nodes) {
  nodes.forEach(function (node) {
    node = ax.node(node);
    if (ax.is.nodelist(node)) {
      ax.node.create.render.nodes.append(element, node);
    } else {
      element.appendChild(node);
    }
  });
};
