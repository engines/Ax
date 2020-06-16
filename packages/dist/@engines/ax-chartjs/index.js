import "chart.js/dist/Chart.css";
import Chart from 'chart.js';
import axChartjs from './lib/ax-chartjs';

axChartjs.dependencies = (ax) => {
  ax.extension.chartjs.Chart = Chart
}

export default axChartjs
