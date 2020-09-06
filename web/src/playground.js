(async () => {
  const { default: ax } = await import("./ax");
  window.ax = ax
  window.addEventListener('load', () => ax.x.lib.animate.fade.out(loading));
  console.time('Render timer');
  eval(js);
  console.timeEnd('Render timer');
})().catch((e) => document.body.innerHTML +=
  `<pre class="text-danger text-wrap">${e.message}</pre>`
);
