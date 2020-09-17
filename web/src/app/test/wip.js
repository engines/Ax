export default (router) => (a, x) => [

  x.codemirror({
    value: 'let i = 0;\n',
    lineNumbers: true,
    mode: 'javascript'
  }),

  x.form({
    shims: [
      x.form.field.shim,
      x.form.field.extras.shim,
      x.form.field.dependent.shim,
      x.form.field.nest.shim,
      x.form.field.nest.prefab.shim,
      x.codemirror.form.shim,
      x.bootstrap.form.shim,
      x.form.async.shim,
    ],
    object: {
      pets: [
        {name: 'Fluffy', colors: [{color: '#333333'},{color: '#999999'}]},
        {name: 'Spot', colors: [{color: '#663333'},{color: '#664444'}]},
      ]
    },
    form: (f) => [
      // f.field({
      //   key: 'colors',
      //   type: 'color',
      //   collection: true,
      //   addable: true,
      //   removeable: true,
      //   moveable: true,
      //   draggable: true,
      // }),
      f.field({
        key: 'pets',
        as: 'many',
        singular: 'pet',
        addable: true,
        moveable: true,
        removeable: true,
        draggable: true,
        form: (ff) => [

          ff.field({
            key: 'name',
          }),

          ff.field({
            key: 'colors',
            as: 'table',
            singular: 'color',
            addable: true,
            moveable: true,
            removeable: true,
            form: fff => [

              // ax.a({
              //   $tag: 'h6',
              //   $text: (el) => `Pet ${ff.index} color ${fff.index}`,
              //   name: `${ff.scope}[title]`,
              //   $on: {
              //     'ax.appkit.form.control.rescope': (e,el) => el.$render(),
              //   },
              // }),

              fff.field({
                key: 'color',
                type: 'color',
              }),
            ]
          }),
        ]
      }),

    ]
  }),

  // x.fetch({
  //   url: 'http://slowwly.robertomurray.co.uk/delay/1000/url/https://jsonplaceholder.typicode.com/todos',
  //   // url: 'https://reqres.in/api/api/register',
  //   placeholder: 'Fetching!',
  //   when: {
  //     404: (error) => router.open('/')
  //   }
  // }),
  //
  // a['!'](`
  // <svg
  // version="1.1"
  // id="Layer_1"
  // xmlns="http://www.w3.org/2000/svg"
  // xmlns:xlink="http://www.w3.org/1999/xlink"
  // x="0px"
  // y="0px"
  // viewBox="0 0 386.972 386.972"
  // style="enable-background:new 0 0 386.972 386.972;"
  // xml:space="preserve"
  // >
  // <path d="M25.99,0v386.972l334.991-193.486L25.99,0z M55.99,51.972l245.009,141.514L55.99,335V51.972z"/>
  // </svg>
  // `),
  //
  // a({
  //   $tag: ["http://www.w3.org/2000/svg", 'svg'],
  //   // "id":"Layer_1",
  //   // "version":"1.1",
  //   // "xmlns":"http://www.w3.org/2000/svg",
  //   // "xmlns:xlink":"http://www.w3.org/1999/xlink",
  //   // "x":"0px",
  //   // "y":"0px",
  //   "viewBox":"0 0 386.972 386.972",
  //   // "style":"enable-background:new 0 0 386.972 386.972;",
  //   // "xml:space":"preserve",
  //   $nodes: [
  //     a({
  //       $tag: ["http://www.w3.org/2000/svg", 'path'],
  //       d: "M25.99,0v386.972l334.991-193.486L25.99,0z M55.99,51.972l245.009,141.514L55.99,335V51.972z",
  //     })
  //   ]
  // }),
  //
  //
  //
  // x.easymde(),
  //
  //
  // router,
  //
  //
  // Object.keys(x.codemirror.CodeMirror.keyMap),
  //
  // // x.form({
  // //   shims: [
  // //     x.form.field.shim,
  // //     x.bootstrap.form.shim,
  // //   ],
  // //   object: {
  // //     text1: 'Hello from \x1B[1;3;31mxterm.js\x1B[0m\r\n',
  // //   },
  // //   form: (f) => [
  // //
  // //   ],
  // // }),
  //
  // a.p([
  //   a({
  //     $tag: 'input',
  //     $on: {input: (e, el) => el.nextSibling.$state = el.value}
  //   }),
  //   a({$text: (el) => `You entered ${el.$state || 'nothing'}`}),
  // ]),
  //
  // // x.easymde({}),
  //
  // x.filepond({filepond: {server: {url: `/test`}}}),
  //
  // x.chartjs({
  //   canvasTag: {
  //     height: '150px',
  //   },
  //   chartjs: {
  //     type: 'horizontalBar',
  //     data: {
  //       labels: ['Red', 'Blue', 'Green'],
  //       datasets: [{
  //         data: [12, 19, 3],
  //         backgroundColor: ['red', 'blue', 'green'],
  //       }]
  //     },
  //     options: {
  //       legend: { display: false },
  //       maintainAspectRatio: false,
  //     }
  //   }
  // }),
  //
  // a.h5('Xterm.js'),
  // x.xtermjs({
  //   label: 'Log',
  //   text: 'Hello from \x1B[1;3;31mxterm.js\x1B[0m\r\n',
  //   terminal: {fontSize: 12},
  // }),
  // a({
  //   $init: (el) => el.$random = setInterval(
  //     () => el.previousSibling.$write(`${Math.random()}\r\n`),
  //     1000
  //   ),
  //   $exit: (el) => clearInterval(el.$random)
  // }),
  //
  //
  // a.h1('Namespaced tag'),
  // a({
  //   $tag: ['http://www.w3.org/2000/svg', 'svg'],
  //   width: 100, height: 100,
  //   viewBox: '0 0 100 100',
  //   $nodes: [
  //     a({
  //       $tag: ['http://www.w3.org/2000/svg', 'circle'],
  //       cx: 50, cy: 50, r: 40,
  //       stroke: '#00F', 'stroke-width': 3, fill: 'none',
  //     })
  //   ],
  // }),
  // a.h1('Web component'),
  // a({
  //   $tag: 'elix-auto-size-textarea',
  //   'minimum-rows': 2,
  //   placeholder: 'oooh',
  //   $on: {input: (e, el) => output.$text = e.target.value}
  // }),
  // a({
  //   $tag: 'p',
  //   id: 'output',
  // }),
  //
  // a({$text: 'Hello, world!', class: 'greeting'}),
  // a['!']("<h1>Raw HTML</h1>"),
  // x.codemirror({
  //   value: "let msg = 'Hello';\nalert(msg);",
  //   mode: 'javascript',
  //   codemirror: {
  //     lineNumbers: true,
  //   }
  // }),
  // x.fetch({
  //   url: 'https://jsonplaceholder.typicode.com/todos/1',
  //   placeholder: 'Loading todo',
  //   success: (todo, el) => el.$nodes = [
  //     x.report({
  //       shims: [
  //         x.report.field.shim,
  //         x.report.field.extras.shim,
  //         x.report.field.dependent.shim,
  //         x.report.field.nest.shim,
  //         x.report.field.nest.prefab.shim,
  //         x.bootstrap.report.shim,
  //         x.xtermjs.report.shim,
  //         x.codemirror.report.shim,
  //       ],
  //       object: todo,
  //       report: (r) => [
  //         todo,
  //         r.field({key: 'id'}),
  //         r.field({key: 'userId'}),
  //         r.field({key: 'title', as: 'xtermjs'}),
  //         r.field({key: 'completed', as: 'checkbox'}),
  //       ]
  //     }),
  //   ],
  // }),
]
