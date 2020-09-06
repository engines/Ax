/**
 * Extension loader.
 * Use this method to load Ax Extensions that are are imported as ES6 modules.
 * For example:
 * import ax from '@engines/ax'
 * import axCore from '@engines/ax-appkit-core'
 * import axChartjs from '@engines/ax-appkit-chartjs'
 * import "chart.js/dist/Chart.css";
 * import Chart from 'chart.js';
 * ax.extend( axCore, [axChartjs, {Chart: Chart}] ).
 */
ax.extend = function () {
  for (let extension of arguments) {
    if (ax.is.array(extension)) {
      extension[0].extend(this, extension[1] || {});
    } else {
      extension.extend(this);
    }
  }
};
