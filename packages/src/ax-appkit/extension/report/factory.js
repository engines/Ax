ax.extension.report.factory = function (options) {
  let shims = [this.shim, ...(options.reportOptions.shims || [])];

  return new (function () {
    let proxy = function (factory, base = {}, shim = {}) {
      return new Proxy(base, {
        get: (target, property) => {
          let object = target[property];
          if (ax.is.function(shim[property])) {
            return shim[property](factory.target, object);
          } else if (ax.is.object(shim[property])) {
            return proxy(factory, object, shim[property]);
          } else {
            return object;
          }
        },
      });
    };

    this.target = options;

    for (let i in shims) {
      this.target = proxy(this, this.target, shims[i]);
    }

    return this.target;
  })();
};
