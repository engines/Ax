export default (router) => (a, x) => a['app-test-form']([
  router,
  a.h1('Form'),
  x.form({
    id: 'form',
    horizontal: true,
    object: {
      input: 'some value',
      color: '#4488DD',
      email: 'mail@example.com',
      number: 10,
      tel: '+12223334444',
      url: 'http://www.example.com',

      checkbox: 'something truthy',
      checkboxes: ['beta','gamma'],
      hidden: 'no see',
      radios: 'beta',
      select: 'beta',
      textarea: 'Multi-line\ntext',

      country: 'AU',
      language: 'en',
      multiselect: ['beta','gamma'],
      password: 'mysecret1',
      selectinput: 'delta',
      timezone: 'Australia/Sydney',

      markdown: 'This is **markdown**.',
      code: 'let n = 1;',
      code_mode: 'javascript',

      one: {
        number: 42,
        email : 'mail@example.com',
      },
      many: [
        {height: 10, weight: 5},
        {height: 12, weight: 7},
      ],
    },
    action: '/test',
    shims: [
      x.form.field.shim,
      x.form.field.extras.shim,
      x.form.field.dependent.shim,
      x.form.field.nest.shim,
      x.form.field.nest.prefab.shim,
      x.easymde.form.shim,
      x.codemirror.form.shim,
      x.bootstrap.form.shim,
      x.form.async.shim,
    ],
    fetch: {
      placeholder: x.cycle(),
    },
    encode: 'json',
    form: (f) => [
      f.field({key: 'input', help: 'This is **help**.'}),
      f.field({key: 'hidden', as: 'hidden', hint: 'This is a hint', }),
      f.field({key: 'input2', dependent: {key: 'input', value: 'some value'}, help: 'This is **help**.'}),
      f.field({key: 'color', type: 'color', collection: true, moveable: true, removeable: true, addable: true, }),
      // f.field({key: 'email', type: 'email'}),
      // f.field({key: 'number', type: 'number'}),
      // f.field({key: 'tel', type: 'tel'}),
      // f.field({key: 'url', type: 'url'}),
      // f.field({key: 'datetime', type: 'datetime'}),
      //
      // f.field({key: 'checkbox', as: 'checkbox', hint: 'This is a hint', }),
      // f.field({key: 'checkboxes', as: 'checkboxes', selections: ['cat','dog','bird'], hint: 'This is a hint', }),
      // f.field({key: 'radios', as: 'radios', selections: ['alpha', 'beta', 'gamma', 'delta'], hint: 'This is a hint', }),
      // f.field({key: 'select', as: 'select', selections: ['alpha', 'beta', 'gamma', 'delta'], hint: 'This is a hint'}),
      // f.field({key: 'textarea', as: 'textarea', resize: '200', hint: 'This is a hint'}),
      //
      //
      // f.field({key: 'country', as: 'country', hint: 'This is a hint'}),
      // f.field({key: 'language', as: 'language', hint: 'This is a hint'}),
      // f.field({key: 'multiselect', as: 'multiselect', selections: ['cat','dog'], hint: 'This is a hint', }),
      // f.field({key: 'password', as: 'password', hint: 'This is a hint', }),
      // f.field({key: 'selectinput', as: 'selectinput', selections: ['cat','dog'], hint: 'This is a hint', }),
      // f.field({key: 'timezone', as: 'timezone', hint: 'This is a hint'}),

      f.field({key: 'markdown', as: 'easymde', hint: 'This is a hint', }),
      f.field({
        key: 'code',
        as: 'codemirror',
        mode: 'javascript',
        // toolbar: false,
        codemirror: {lineNumbers: false},
        // control: {
          // },
        hint: 'This is a hint',
      }),
      // f.fieldset({
      //   label: 'Hi',
      //   legend: 'Legend',
      //   body: [
      //     f.field({key: 'strings', collection: true, addable: false,}),
      //   ],
      //   help: 'Help me',
      //   hint: 'This is a hint',
      //   dependent: {
      //     key: 'select',
      //     value: 'beta',
      //   },
      //   hint: 'This is a hint'
      // }),
      f.field({key: 'one', as: 'one', form: (ff) => [
        ff.field({key: 'number', type: 'number', hint: 'This is a hint'}),
        ff.field({key: 'email', type: 'email', hint: 'This is a hint'}),
      ], hint: 'This is a hint'}),
      f.field({
        key: 'many',
        // collection: true,
        as: 'many',
        moveable: true,
        removeable: true,
        addable: true,
        draggable: true,
        deletable: true,
        form: (ff) => [
          ff.field({key: 'height', type: 'number', hint: 'This is a hint'}),
          ff.field({key: 'weight', type: 'number', hint: 'This is a hint'}),

          ff.field({
            key: 'many',
            // collection: true,
            as: 'table',
            moveable: true,
            removeable: true,
            addable: true,
            draggable: true,
            deletable: true,
            form: (fff) => [
              fff.field({key: 'height', type: 'number', hint: 'This is a hint'}),
              fff.field({key: 'weight', type: 'number', hint: 'This is a hint'}),
            ],
          }),

        ],
        hint: 'This is a hint'
      }),
      f.submit(),
    ],
  }),
  a.button('Disable', {
    $on: {click: (e, el) => form.$disable()},
  }),
  a.button('Enable', {
    $on: {click: (e, el) => form.$enable()},
  }),
])
