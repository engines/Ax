ax.tag.proxy.create = (...properties) => {
  return ax.node.create(
    Object.assign({}, ...properties.map(ax.tag.proxy.properties))
  );
};
