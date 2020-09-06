ax.extension.xtermjs.report.shim = {
  controls: {
    xtermjs: (r, target) => (options = {}) =>
      ax.x.xtermjs.report.control(r, options),
  },
};
