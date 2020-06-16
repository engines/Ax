ax((a, x) => [
  a.h3('Sign in'),
  x.form({
    action: '/test',
    form: (f) => [
      f.input({name: 'username'}),
      f.input({name: 'password', type: 'password'}),
      f.submit(),
    ],
  }),
]);
