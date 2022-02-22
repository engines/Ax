
(async () => {
  let importedAx = await import("./ax");
  const { default: ax } = importedAx
  window.ax = ax // Make ax global
  const { default: app } = await import("./app");

  debugger



  ax.css(app.css);
  ax(app.main);
  loadingSpinner.style.opacity = 0
  setTimeout(() => loadingSpinner.remove(), 1000)
})();


// let svgNS = 'http://www.w3.org/2000/svg'
// let myApp = (a,x) => a['my-app']([
//   a({
//     $tag: [svgNS, 'svg'],
//     width: 100,
//     height: 100,
//     viewBox: '0 0 100 100',
//     $nodes: [
//       a({
//         $tag: [svgNS, 'circle'],
//         cx: 50,
//         cy: 50,
//         r: 40,
//         stroke: '#00F',
//         strokeWidth: 3,
//         fill: 'none',
//       })
//     ],
//   }),
//
//   a(
//     [
//       a.h3('Hi'),
//     ],
//     {
//       $shadow: {h3: {$: {color: 'red'}}},
//       data: {some: {value: 'value'}},
//     },
//   ),
//
//   // x.router({
//   //   mount: {
//   //     /
//   //   }
//   // })
//
//   // <template id="tooltipTemplate">
//   // <div>Michael's Birthday {{date}}</div>
//   // </template>
//   a['my-app-calendar']([
//     a['date-picker']({
//       monthNameBackground: '#EEE',
//       $on: {
//         click: (e, el) => el.$('^my-app-calendar output').$text = el.selectedDate,
//       },
//     }),
//     a.h1([
//       `The date is `,
//       a.output('not selected'),
//     ]),
//
//   ])
//
//
// ])
//
// await import('calendar-native-web-component')
// // a.script([
//   // ], {
//     // }),
//
//     // ax.script({
//       //   type: 'module',
//       //   src: 'https://cdn.jsdelivr.net/npm/@smarthtmlelements/smart-calendar@6.2.0/index.min.js',
//       // })
//
//       ax(myApp)
//
//
//
//       // ax((a,x) => a.strong('Click me', {style: "{padding: {left: '1rem'}}"}))
//
//       //   ax((a, x) => a['my-app.d-block.container']([
//         // 'x',
//         // a['!']("\n\n  <hr>  \n\n "),
//         // a['!']("<hr>"),
//         // 'y',
//         //
//         // [
//           //
//           //   {
//             //     some: 'object',
//             //     for: '<hr>',
//             //   },
//             //
//             //   {
//               //     some: 'object',
//               //     for: 'th\ning',
//               //   },
//               //
//               //
//               // ],
//               //
//               //
//               // a({
//                 //   $tag: 'div',
//                 //   _count: 10,
//                 //   _aaa: () => () => {alert('old')},
//                 //   // $up: (el) => () => {
//                   //   //   el._count++
//                   //   // },
//                   //   $nodes: (el) => [
//                     //     el._count,
//                     //     `Updated at ${new Date().toLocaleTimeString()}`,
//                     //   ],
//                     //   $on: {
//                       //     click: (e, el) => el._count++,
//                       //   },
//                       // }),
//                       //
//                       //     // x.chartjs({
//                         //     //   canvasTag: {
//                           //     //     height: '150px',
//                           //     //   },
//                           //     //   chartjs: {
//                             //     //     type: 'dendogram',
//                             //     //     data: {
//                               //     //       labels: ['Red', 'Blue', 'Green'],
//                               //     //       datasets: [{
//                                 //     //         data: [12, 19, 3],
//                                 //     //         backgroundColor: ['red', 'blue', 'green'],
//                                 //     //       }]
//                                 //     //     },
//                                 //     //     options: {
//                                   //     //       legend: { display: false },
//                                   //     //       maintainAspectRatio: false,
//                                   //     //     }
//                                   //     //   }
//                                   //     // }),
//                                   //     //
//                                   //     // a.h1('Ax Appkit Router'),
//                                   //     //
//                                   //     // a.h2('Navigation'),
//                                   //     // a.p('A new page will be loaded when these are clicked.'),
//                                   //     // a.p([
//                                     //     //   'Navigate with a link ',
//                                     //     //   a.a('Link to /hot', {href: '/hot'}),
//                                     //     // ]),
//                                     //     // a.p([
//                                       //     //   'Navigate with a button ',
//                                       //     //   x.button({
//                                         //     //     label: 'Button to /cold',
//                                         //     //     onclick: () => location.assign('/cold'),
//                                         //     //   }),
//                                         //     // ]),
//                                         //     // a.hr,
//                                         //     //
//                                         //     // x.router({
//                                           //     //   routes: {
//                                             //     //     '/cold': 'I am cold.',
//                                             //     //     '/hot': 'I am hot.',
//                                             //     //   },
//                                             //     // }),
//                                             //
//                                             //
//                                             //     // x.router({
//                                               //     //   lazy: true,
//                                               //     //   scope: '/my-scoped-routes*',
//                                               //     //   transition: 'fade',
//                                               //     //   routes: (route) => {
//                                                 //     //
//                                                 //     //     return a.div([
//                                                   //     //
//                                                   //     //       a.h2('Navigation using the router'),
//                                                   //     //
//                                                   //     //       route,
//                                                   //     //
//                                                   //     //       x.button({
//                                                     //     //         label: 'Open <<scope>>/a',
//                                                     //     //         onclick: () => route.open(`${route.scope}/a`),
//                                                     //     //       }),
//                                                     //     //       x.button({
//                                                       //     //         label: 'Open <<scope>>/b',
//                                                       //     //         onclick: () => route.open(`${route.scope}/b`),
//                                                       //     //       }),
//                                                       //     //       x.button({
//                                                         //     //         label: 'Open /not-in-scope',
//                                                         //     //         onclick: () => route.open('/not-in-scope'),
//                                                         //     //       }),
//                                                         //     //
//                                                         //     //       route.mount({
//                                                           //     //         routes: {
//                                                             //     //           '/?': 'Home',
//                                                             //     //           '/a': (route) => a.div([
//                                                               //     //             route,
//                                                               //     //             x.button({
//                                                                 //     //               label: 'Open <<location>>/../a',
//                                                                 //     //               onclick: () => route.open('../a'),
//                                                                 //     //             }),
//                                                                 //     //             x.button({
//                                                                   //     //               label: 'Open <<location>>/../b',
//                                                                   //     //               onclick: () => route.open('../b'),
//                                                                   //     //             }),
//                                                                   //     //           ]),
//                                                                   //     //           '/b/?*': (route) => a.div([
//                                                                     //     //             route,
//                                                                     //     //             x.button({
//                                                                       //     //               label: 'Open <<location>>/../a',
//                                                                       //     //               onclick: () => route.open('../a'),
//                                                                       //     //             }),
//                                                                       //     //             route.mount({
//                                                                         //     //               routes: {
//                                                                           //     //                 '/?': (route) => x.button({
//                                                                             //     //                   label: 'Open <<location>>/a',
//                                                                             //     //                   onclick: () => route.open('a'),
//                                                                             //     //                 }),
//                                                                             //     //                 '/a': (route) => a.div([
//                                                                               //     //                   route,
//                                                                               //     //                   x.button({
//                                                                                 //     //                     label: 'Open <<location>>/../b',
//                                                                                 //     //                     onclick: () => route.open('../b'),
//                                                                                 //     //                   }),
//                                                                                 //     //                 ]),
//                                                                                 //     //                 '/b': (route) => a.div([
//                                                                                   //     //                   route,
//                                                                                   //     //                   x.button({
//                                                                                     //     //                     label: 'Open <<location>>/../a',
//                                                                                     //     //                     onclick: () => route.open('../a'),
//                                                                                     //     //                   }),
//                                                                                     //     //                 ]),
//                                                                                     //     //               }
//                                                                                     //     //             })
//                                                                                     //     //           ]),
//                                                                                     //     //         }
//                                                                                     //     //       })
//                                                                                     //     //     ])
//                                                                                     //     //
//                                                                                     //     //   }
//                                                                                     //     // }),
//                                                                                     //     // x.form({
//                                                                                       //     //   shims: [
//                                                                                         //     //     x.form.field.shim,
//                                                                                         //     //     x.form.field.extras.shim,
//                                                                                         //     //     x.form.field.dependent.shim,
//                                                                                         //     //     x.form.field.nest.shim,
//                                                                                         //     //     x.form.field.nest.prefab.shim,
//                                                                                         //     //     x.bootstrap.form.shim,
//                                                                                         //     //     x.form.async.shim,
//                                                                                         //     //   ],
//                                                                                         //     //   form: f => [
//                                                                                           //     //     a.h5('Extras'),
//                                                                                           //     //     f.field({
//                                                                                             //     //       key: 'country',
//                                                                                             //     //       as: 'country',
//                                                                                             //     //     }),
//                                                                                             //     //     f.field({
//                                                                                               //     //       key: 'language',
//                                                                                               //     //       as: 'language',
//                                                                                               //     //     }),
//                                                                                               //     //     f.field({
//                                                                                                 //     //       key: 'multiselect',
//                                                                                                 //     //       as: 'multiselect',
//                                                                                                 //     //       selections: {
//                                                                                                   //     //         dog: 'Dog',
//                                                                                                   //     //         cat: 'Cat',
//                                                                                                   //     //       }
//                                                                                                   //     //     }),
//                                                                                                   //     //     f.field({
//                                                                                                     //     //       key: 'password',
//                                                                                                     //     //       as: 'password',
//                                                                                                     //     //     }),
//                                                                                                     //     //     f.field({
//                                                                                                       //     //       key: 'selectinput',
//                                                                                                       //     //       as: 'selectinput',
//                                                                                                       //     //       selections: {
//                                                                                                         //     //         dog: 'Dog',
//                                                                                                         //     //         cat: 'Cat',
//                                                                                                         //     //       }
//                                                                                                         //     //     }),
//                                                                                                         //     //     f.field({
//                                                                                                           //     //       key: 'timezone',
//                                                                                                           //     //       as: 'timezone',
//                                                                                                           //     //     }),
//                                                                                                           //     //     f.field({
//                                                                                                             //     //       key: 'pets',
//                                                                                                             //     //       as: 'table',
//                                                                                                             //     //       addable: true,
//                                                                                                             //     //       removeable: true,
//                                                                                                             //     //       singular: 'pet',
//                                                                                                             //     //       form: ff => [
//                                                                                                               //     //         ff.field({
//                                                                                                                 //     //           key: 'name'
//                                                                                                                 //     //         }),
//                                                                                                                 //     //         ff.field({
//                                                                                                                   //     //           key: 'age',
//                                                                                                                   //     //           type: 'number',
//                                                                                                                   //     //         }),
//                                                                                                                   //     //         ff.field({
//                                                                                                                     //     //           key: 'type',
//                                                                                                                     //     //           as: 'select',
//                                                                                                                     //     //           selections: {
//                                                                                                                       //     //             dog: 'Dog',
//                                                                                                                       //     //             cat: 'Cat',
//                                                                                                                       //     //           }
//                                                                                                                       //     //         }),
//                                                                                                                       //     //       ]
//                                                                                                                       //     //     }),
//                                                                                                                       //     //
//                                                                                                                       //     //   ],
//                                                                                                                       //     // }),
//                                                                                                                       //     // a.h1(x.time()),
//                                                                                                                       //     // x.cycle(),
//                                                                                                                       //     // x.transition.fade({initial: 'OLD', id: 'oldnew'}),
//                                                                                                                       //     // a.button('New', {$on: {click: (e, el) => oldnew.$to('NEW')}}),
//                                                                                                                       //     // x.check({label: a.strong('Click me', {style: {padding: {left: '0.2rem'}}})}),
//                                                                                                                       //     // x.table({
//                                                                                                                         //     //   header: true,
//                                                                                                                         //     //   data: [
//                                                                                                                           //     //     ['', 'One','Two','Three'],
//                                                                                                                           //     //     ['A', '1A','2A','3A'],
//                                                                                                                           //     //     ['B', '1B','2B','3B'],
//                                                                                                                           //     //     ['C', '1C','2C','3C']
//                                                                                                                           //     //   ],
//                                                                                                                           //     //   tableTag: {class: 'table table-dark'},
//                                                                                                                           //     // }),
//                                                                                                                           //     // x.fetch({
//                                                                                                                             //     //   placeholder: x.cycle(),
//                                                                                                                             //     //   url: ['/test.json', '/test.json'],
//                                                                                                                             //     // }),
//                                                                                                                             //     // x.fetch({
//                                                                                                                               //     //   placeholder: x.cycle(),
//                                                                                                                               //     //   url: '/test.json',
//                                                                                                                               //     //   query: [
//                                                                                                                                 //     //     {a: 1},
//                                                                                                                                 //     //     {a: 1},
//                                                                                                                                 //     //     {a: 1},
//                                                                                                                                 //     //     {a: 1},
//                                                                                                                                 //     //   ],
//                                                                                                                                 //     // }),
//                                                                                                                                 //     // a.div({
//                                                                                                                                   //     //   style: {height: '100px', width: '100px', backgroundColor: 'red'},
//                                                                                                                                   //     //   $on: {
//                                                                                                                                     //     //     click: (e, el) => {
//                                                                                                                                       //     //       el.style.backgroundColor = "yellow";
//                                                                                                                                       //     //       el.$off('mouseover')
//                                                                                                                                       //     //     },
//                                                                                                                                       //     //     mouseover: (e, el) => {
//                                                                                                                                         //     //       el.style.backgroundColor = "blue";
//                                                                                                                                         //     //     },
//                                                                                                                                         //     //     mouseleave: (e, el) => {
//                                                                                                                                           //     //       el.style.backgroundColor = "red";
//                                                                                                                                           //     //     },
//                                                                                                                                           //     //   }
//                                                                                                                                           //     // })
//                                                                                                                                           //   ]))
//
//                                                                                                                                           // ax((a, x) => a['my-custom-component'](
//                                                                                                                                             //   [
//                                                                                                                                               //     a.h3('Hi'),
//                                                                                                                                               //     // x.transition.fade({}),
//                                                                                                                                               //   ],
//                                                                                                                                               //   {
//                                                                                                                                                 //     $shadow: {h3: {$: {color: 'red'}}},
//                                                                                                                                                 //     data: {some: {value: 'value'}},
//                                                                                                                                                 //   },
//                                                                                                                                                 // ))
//
//                                                                                                                                                 // ax((a, x) => a['my-app']([
//                                                                                                                                                   //   a.h1({id: 'counter', $text: (el) => el._count, _count: 10}),
//                                                                                                                                                   //   a.button('<', {$on: {click: (e, el) => counter._count--}}),
//                                                                                                                                                   //   a.button('>', {$on: {click: (e, el) => counter._count++}}),
//                                                                                                                                                   // ]))
//                                                                                                                                                   //
//
//
//                                                                                                                                                   // x.table({
//                                                                                                                                                     //   rows: [
//                                                                                                                                                       //     ['hi']
//                                                                                                                                                       //   ]
//                                                                                                                                                       // }),
//
//                                                                                                                                                       // ax((a) => a({
//                                                                                                                                                         //   $text: 'hi',
//                                                                                                                                                         // }, {
//                                                                                                                                                           //   style: {color: 'blue'},
//                                                                                                                                                           // }))
//                                                                                                                                                           //
//                                                                                                                                                           // ax.css([
//                                                                                                                                                             //   {
//                                                                                                                                                               //     div: {
//                                                                                                                                                                 //       'h1, h3': [{
//                                                                                                                                                                   //         $: {
//                                                                                                                                                                     //           color: 'red'
//                                                                                                                                                                     //         },
//                                                                                                                                                                     //       }],
//                                                                                                                                                                     //     },
//                                                                                                                                                                     //   },
//                                                                                                                                                                     //
//                                                                                                                                                                     //
//                                                                                                                                                                     //   {
//                                                                                                                                                                       //     p: {
//                                                                                                                                                                         //       '&.xxx': {
//                                                                                                                                                                           //         $: [{
//                                                                                                                                                                             //           color: 'blue'
//                                                                                                                                                                             //         }]
//                                                                                                                                                                             //       }
//                                                                                                                                                                             //     }
//                                                                                                                                                                             //   }
//                                                                                                                                                                             // ])
//                                                                                                                                                                             //
//                                                                                                                                                                             // ax((a) => a['my-app']([
//                                                                                                                                                                               //   a.div([
//                                                                                                                                                                                 //     a.h1("hi"),
//                                                                                                                                                                                 //     a.p("ho", {class: 'xxx'}),
//                                                                                                                                                                                 //     a['!']('&euro;'),
//                                                                                                                                                                                 //   ]),
//                                                                                                                                                                                 //   a.h3("di"),
//                                                                                                                                                                                 // ]))
//                                                                                                                                                                                 //
//                                                                                                                                                                                 //
//                                                                                                                                                                                 //
//                                                                                                                                                                                 //
//                                                                                                                                                                                 // ax((a) => a.h1(
//                                                                                                                                                                                   //   (el) => [
//                                                                                                                                                                                     //     a['p#id1']({id: 'id2'}, [() => () =>
//                                                                                                                                                                                       //       ({a: 1})]),
//                                                                                                                                                                                       //     a['!']('&euro;', '&euro;'),
//                                                                                                                                                                                       //     'hi',
//                                                                                                                                                                                       //     a.h1('ho'),
//                                                                                                                                                                                       //     a.h1(() => [{a: 1}]),
//                                                                                                                                                                                       //     a.h3('ggg', {style: {color: 'red'}}),
//                                                                                                                                                                                       //     a.h3({$text: 'fff', style: {color: 'blue'}}),
//                                                                                                                                                                                       //     a.h5(a(() => '111', {style: {color: 'orange'}})),
//                                                                                                                                                                                       //     a.p(a([(b,x) => (b,x) => (b,x) => b.i(['222'])], {style: {color: 'orange'}})),
//                                                                                                                                                                                       //   ],
//                                                                                                                                                                                       //   {$count: 10}
//                                                                                                                                                                                       // ))
//                                                                                                                                                                                       //
//
//                                                                                                                                                                                       // let markdown = `
//                                                                                                                                                                                       // This is a *heading*
//                                                                                                                                                                                       // -------------------
//                                                                                                                                                                                       //
//                                                                                                                                                                                       // This is a *paragraph*.
//                                                                                                                                                                                       //
//                                                                                                                                                                                       // - this
//                                                                                                                                                                                       // - is
//                                                                                                                                                                                       // - a
//                                                                                                                                                                                       // - *list*
//                                                                                                                                                                                       // `
//                                                                                                                                                                                       // ax((a,x) => x.markedjs({markdown}))
//
