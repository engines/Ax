ax.node.create.tools.query.proxy.shim.iterator = (collection) => {
  return function () {
    return {
      current: 0,
      last: collection.length - 1,
      next() {
        if (this.current <= this.last) {
          return { done: false, value: collection[this.current++] };
        } else {
          return { done: true };
        }
      },
    };
  };
};
