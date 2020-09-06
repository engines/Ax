<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>

<!--MARKDOWN-->
Invoke ax()
===========

Call `ax()` to create elements and insert them into the DOM.

Normally `ax()` is called with a function as an argument. The function, in turn, returns content.

This _content function_ is called with two arguments: a _tag builder_ and an _extensions object_. In the examples here, these are assigned as `a` and `x`.

<!--PLAYGROUND-->
~~~javascript
ax((a, x) => [
  a.h3('A form'),
  x.form({
    action: '/test',
    form: (f) => [
      f.input({name: 'name'}),
      f.input({name: 'score', type: 'number'}),
      f.submit(),
    ]
  }),
]);
~~~
<!--MARKDOWN-->

<!--PLAYGROUND-->
~~~javascript
x.form({
  shims: [
    x.form.field.shim,
    x.form.async.shim
  ],
  object: pet,
  action: '/test',
  encode: 'json',
  form: (f) => [
    f.field({key: 'type', as: 'select', selections: {'cat': 'Cat', 'dog': 'Dog'}}),
    f.field({key: 'name', required: true}),
    f.submit(),
  ],
  success: (result, el) => {
    output.$nodes = [
      'Response from server:',
      result,
      a.h3(`${result.name} is a ${result.type}.`)
    ]
  }
}),
a({id: 'output'}),
~~~
<!--MARKDOWN-->

<!--NAVIGATION-->
<a class="app-navigation" href="/docs/tutorial/introduction.md">Prev: Introduction</a>
<a class="app-navigation" style="float: right;" href="/docs/tutorial/tag_builder.md">Next: Tag builder</a>
