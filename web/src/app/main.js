import navbar from "./navbar";
import test from "./test";
import docs from "./docs";

export default a["app-router"](
  [
    x.router({
      routes: (router) => [
        navbar(router),
        router.mount({
          routes: {
            "/?": app.page,
            "/docs*": docs,
            "/test*": test,
          },
        }),
      ],
      transition: x.transition.fade,
      lazy: true,
      // transition: 'fade',
      default: router => a['p.error']( [
        router,
        `Not found: CLIENT ${ router.path } in ${ router.scope || 'root' }`
      ] ),

    }),
  ],
  {
    $on: {
      "ax.appkit.router.load": (e, el) => {
        el.$("#navbar").$activate();
      },
    },
  }
);

// export default a["app-router"](
//   [
//     x.router({
//       routes: {
//         '/?': 'Home',
//         '/one': 'Page 1',
//       },
//       transition: x.transition.fade,
//       lazy: true,
//       default: router => a['p.error']( [
//         router,
//         `Not found: CLIENT ${ router.path } in ${ router.scope || 'root' }`
//       ] ),
//     }),
//   ],
//   {
//     $on: {
//       "ax.appkit.router.load": (e, el) => {
//         console.log('Router load event', e)
//       },
//     },
//   }
// );
