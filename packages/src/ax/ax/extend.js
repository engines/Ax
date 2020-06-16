/**
 * Extension loader.
 * Use this method to load Ax Extensions that are are imported as ES6 modules.
 * For example:
 * import ax from '@engines/ax'
 * import axAppkit from '@engines/ax-appkit'
 * import axChartjs from '@engines/ax-chartjs'
 * ax.extend( axAppkit, axChartjs ).
 */
ax.extend = function () {
  for (let extension of arguments) {
    extension.extend(this);
    if (ax.is.function(extension.dependencies)) extension.dependencies(this);
  }
};
