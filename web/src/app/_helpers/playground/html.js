const html = (js, options={}) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Ax playground</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="favicon.png" type="image/png">
<script type="application/javascript" src="chart.js/dist/Chart.js"></script>
<script type="application/javascript" src="@engines/ax/lib/ax.js"></script>
<script type="application/javascript" src="@engines/ax-appkit/lib/ax-appkit.js"></script>
<script type="application/javascript" src="@engines/ax-chartjs/lib/ax-chartjs.js"></script>
<script>
window.onerror = function (msg, url, line) {
  document.body.innerHTML +=
  \`<pre id="consoleErrors" class="text-danger text-wrap">\${msg}</pre>\`;
}
</script>
</head>
<body>
<script>
console.time("Render timer");
eval(${JSON.stringify(js)});
console.timeEnd("Render timer");
</script>
</body>
</html>`;

export default html
