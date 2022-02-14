ax.tag.proxy.create = (...attributes) => {
  return ax.node.create(
    Object.assign({},
      ...attributes.map(ax.tag.proxy.nodes)
    )
  );
};
