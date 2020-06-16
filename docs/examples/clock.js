ax((a,x) => a({
  $tag: 'h1',
  $text: () => (new Date).toLocaleTimeString(),
  $init: el => setInterval(el.$render, 1000),
}))
