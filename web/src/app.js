import navbar from './app/navbar'

const app = (a,x) => a['app-router'](
  [
    x.router({
      routes: (router) => [
        navbar(router),
        router.nest({
          routes: {
            '/?': app.page('index'),
            '/docs/?': app.page('docs/index'),
            '/docs/installation': app.page('docs/installation'),
            '/docs/usage': app.page('docs/usage'),
            '/docs/integration': app.page('docs/integration'),
          }
        })
      ],
      transition: x.transition.fade({duration: 250}),
    }),
  ],
  {
    $on: {
      "appkit.router.load": (e, el) => {
        el.$('#navbar').$activate();
      },
    },
  }
);

export default app;
