(async () => {
  const { default: ax } = await import("./ax");
  const { default: app } = await import("./app");
  ax.style(app.css);
  ax(app.main);
  loadingSpinner.style.opacity = 0
  setTimeout(() => loadingSpinner.remove(), 1000)
})();
