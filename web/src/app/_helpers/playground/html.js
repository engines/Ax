const html = (js, options = {}) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Ax playground</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="favicon.png" type="image/png">

<script>
let js = ${JSON.stringify(js)};
debugger
</script>

<script type="application/javascript" src="/vendors~main~playground.js"></script>
<script type="application/javascript" src="/playground.js"></script>

</head>
<body>
<i id="loading" style="
  position: fixed;
  left: 0;
  right: 0;
  top: 20px;
  text-align: center;
  font-family:
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji';
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #999;
  pointer-events: none;
  z-index: 999;
  ">Loading</i>
</body>
</html>`;

export default html;
