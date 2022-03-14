(async () => {
  const {default: ax} = await import("./ax-kitchen-sink");
  window.ax = ax
  const loadingEl = document.getElementById('loading')
  loadingEl.style.opacity = 0
  setTimeout(() => loadingEl.remove(), 1000)
  let script = document.createElement('script')
  script.type = "module";
  script.textContent = js
  console.time('Render timer');
  document.body.appendChild(script)
  console.timeEnd('Render timer');
})().catch((e) => document.body.innerHTML +=
  `<pre class="text-danger text-wrap">${e.message}</pre>`
);
