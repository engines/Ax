ax((a,x) => x.chartjs({
  canvasTag: {
    height: '150px',
  },
  chartjs: {
    type: 'horizontalBar',
    data: {
      labels: ['Red', 'Blue', 'Green'],
      datasets: [{
        data: [12, 19, 3],
        backgroundColor: ['red', 'blue', 'green'],
      }]
    },
    options: {
      legend: { display: false },
      maintainAspectRatio: false,
    }
  }
}));
