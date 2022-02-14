(async () => {
  const { default: ax } = await import("./ax");
  window.ax = ax // Make ax global
  const { default: app } = await import("./app");

// ax((a,x) => a.strong('Click me', {style: "{padding: {left: '1rem'}}"}))

  ax((a, x) => a['my-app']([
    x.form({
      shims: [
        x.form.field.shim,
        x.form.field.extras.shim,
        x.form.field.dependent.shim,
        x.form.field.nest.shim,
        x.form.field.nest.prefab.shim,
        x.bootstrap.form.shim,
        x.form.async.shim,
      ],
      form: f => [
        a.h5('Extras'),
        f.field({
          key: 'country',
          as: 'country',
        }),
        f.field({
          key: 'language',
          as: 'language',
        }),
        f.field({
          key: 'multiselect',
          as: 'multiselect',
          selections: {
            dog: 'Dog',
            cat: 'Cat',
          }
        }),
        f.field({
          key: 'password',
          as: 'password',
        }),
        f.field({
          key: 'selectinput',
          as: 'selectinput',
          selections: {
            dog: 'Dog',
            cat: 'Cat',
          }
        }),
        f.field({
          key: 'timezone',
          as: 'timezone',
        }),
        f.field({
          key: 'pets',
          as: 'table',
          addable: true,
          removeable: true,
          singular: 'pet',
          form: ff => [
            ff.field({
              key: 'name'
            }),
            ff.field({
              key: 'age',
              type: 'number',
            }),
            ff.field({
              key: 'type',
              as: 'select',
              selections: {
                dog: 'Dog',
                cat: 'Cat',
              }
            }),
          ]
        }),

      ],
    }),
    // a.h1(x.time()),
    // x.cycle(),
    // x.transition.fade({initial: 'OLD', id: 'oldnew'}),
    // a.button('New', {$on: {click: (el) => (e) => oldnew.$to('NEW')}}),
    // x.check({label: a.strong('Click me', {style: {padding: {left: '0.2rem'}}})}),
    // x.table({
    //   header: true,
    //   data: [
    //     ['', 'One','Two','Three'],
    //     ['A', '1A','2A','3A'],
    //     ['B', '1B','2B','3B'],
    //     ['C', '1C','2C','3C']
    //   ],
    //   tableTag: {class: 'table table-dark'},
    // }),
    // x.fetch({
    //   placeholder: x.cycle(),
    //   url: ['/test.json', '/test.json'],
    // }),
    // x.fetch({
    //   placeholder: x.cycle(),
    //   url: '/test.json',
    //   query: [
    //     {a: 1},
    //     {a: 1},
    //     {a: 1},
    //     {a: 1},
    //   ],
    // }),
    // a.div({
    //   style: {height: '100px', width: '100px', backgroundColor: 'red'},
    //   $on: {
    //     click: (el) => (e) => {
    //       el.style.backgroundColor = "yellow";
    //       el.$off('mouseover')
    //     },
    //     mouseover: (el) => (e) => {
    //       el.style.backgroundColor = "blue";
    //     },
    //     mouseleave: (el) => (e) => {
    //       el.style.backgroundColor = "red";
    //     },
    //   }
    // })
  ]))

  // ax((a, x) => a['my-custom-component'](
  //   [
  //     a.h3('Hi'),
  //     // x.transition.fade({}),
  //   ],
  //   {
  //     $shadow: {h3: {$: {color: 'red'}}},
  //     data: {some: {value: 'value'}},
  //   },
  // ))

  // ax((a, x) => a['my-app']([
  //   a.h1({id: 'counter', $text: (el) => el._count, _count: 10}),
  //   a.button('<', {$on: {click: (el) => (e) => counter._count--}}),
  //   a.button('>', {$on: {click: (el) => (e) => counter._count++}}),
  // ]))
  //


  // x.table({
  //   rows: [
  //     ['hi']
  //   ]
  // }),

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
//     a['p#id1']({id: 'id2'}, [() => () =>
//       ({a: 1})]),
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


  // ax.css(app.css);
  // ax(app.main);
  loadingSpinner.style.opacity = 0
  setTimeout(() => loadingSpinner.remove(), 1000)
})();
