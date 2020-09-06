ax.extension.router.element.location = (el) => () => {
  let location = window.location;

  return {
    path: location.pathname,
    query: x.lib.query.parse(location.search.slice(1)),
    anchor: location.hash.slice(1),
  };
};
