(async () => {
  const { default: ax } = await import("./ax");
  window.ax = ax // Make ax global
  const { default: app } = await import("./app");

// ax((a) => a({
//   $text: 'hi',
// }, {
//   style: {color: 'blue'},
// }))
//
// ax.css([
//   {
//     div: {
//       'h1, h3': [{
//         $: {
//           color: 'red'
//         },
//       }],
//     },
//   },
//
//
//   {
//     p: {
//       '&.xxx': {
//         $: [{
//           color: 'blue'
//         }]
//       }
//     }
//   }
// ])
//
// ax((a) => a['my-app']([
//   a.div([
//     a.h1("hi"),
//     a.p("ho", {class: 'xxx'}),
//     a['!']('&euro;'),
//   ]),
//   a.h3("di"),
// ]))
//
//
//
//
// ax((a) => a.h1(
//   (el) => [
//     a['p#id1']({id: 'id2'}, [() => [() =>
//       {a: 1}]]),
//     a['!']('&euro;', '&euro;'),
//     'hi',
//     a.h1('ho'),
//     a.h1(() => [{a: 1}]),
//     a.h3('ggg', {style: {color: 'red'}}),
//     a.h3({$text: 'fff', style: {color: 'blue'}}),
//     a.h5(a(() => '111', {style: {color: 'orange'}})),
//     a.p(a([(b,x) => (b,x) => (b,x) => b.i(['222'])], {style: {color: 'orange'}})),
//   ],
//   {$count: 10}
// ))
//
// ax((a) => a.h1('hi'))


  ax.css(app.css);
  ax(app.main);
  loadingSpinner.style.opacity = 0
  setTimeout(() => loadingSpinner.remove(), 1000)
})();
