/**
 * Extension loader.
 * Use this method to load Ax Extensions that are are imported as ES6 modules.
 * For example:
 * import ax from '@engines/ax'
 * import axAppkit from '@engines/ax-appkit'
 * import axChartjs from '@engines/ax-appkit-chartjs'
 * import "chart.js/dist/Chart.css";
 * import Chart from 'chart.js';
 * ax.extend( axAppkit, [axChartjs, {Chart: Chart}] ).
 */
ax.extend = function (...extensions) {
  for (let extension of extensions) {
    if (ax.is.array(extension)) {
      extension[0].extend(this, extension[1] || {});
    } else {
      extension.extend(this);
    }
  }
};
