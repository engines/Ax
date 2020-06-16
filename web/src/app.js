import navbar from './app/navbar'

const app = (a,x) => [
  x.router({
    routes: (router) => [
      navbar(router),
      router.nest({
        routes: {
          '/?': () => app.page('index'),
          '/usage': () => app.page('usage'),
          '/integration': () => 'hi',
        }
      })
    ],
    transition: x.transition.fade({duration: 250}),
  }),
];
export default app;
