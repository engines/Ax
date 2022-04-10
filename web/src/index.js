(async () => {
  const { default: ax } = await import("./ax-kitchen-sink");

  // Make ax global
  window.ax = ax
  window.a = ax.a
  window.x = ax.x

  // const { default: app } = await import("./app");
  // ax.css(app.css);
  // ax(app.main);

  let app = a['my-app']([
    a['app-pet']('Dog'),
    a.button('Switch', {
      $on: {click: (e) => e.ccurrentTarget.$('^my-app app-pet').$text = 'Cat'}
    })
  ])

  ax(app)

  setTimeout(() => {
    loadingSpinner.style.opacity = 0
    setTimeout(() => loadingSpinner.remove(), 1000)
  }, 0)
})();
