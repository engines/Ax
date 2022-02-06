<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>
<!--MARKDOWN-->

Shorthand
=========

Text is rendered as a textnode.

Object literals are rendered as pretty JSON. `null` renders nothing.


<!--PLAYGROUND-->
~~~javascript
ax([
  'TEXT',
  null,
  {one: 1, two: 2, three: 3},
])
~~~
<!--MARKDOWN-->

The tag builder provides a shorthand syntax.
~~~javascript
a[Nodespec](Content, Properties)
~~~
Where a Nodespec is like `'h1#anId.aClass.anotherClass[attibute="value"]'`.

This example creates three equivalent `<p class="abc">` elements.

<!--PLAYGROUND-->
~~~javascript
ax((a) => [
  a['p.abc']('one'),
  a.p('two', {class: 'abc'}),
  a({$tag: 'p', $text: 'three', class: 'abc'}),
]);
~~~
<!--MARKDOWN-->

The _Content_ argument can be text, a node, an array of content, a function that return content or an object.

<!--PLAYGROUND-->
~~~javascript
ax((a) => [
  a.h5('Your score?'),
  a.form([
    a['input[name="score"][type="number"]'],
    a['button[type="submit"]']('Submit'),
  ], {
    $on: {submit: (el) => (evt) => alert('Form submitted!')},
    action: '/test',
    method: 'POST',
  }),
]);
~~~
<!--MARKDOWN-->

The tag builder `!` method renders raw HTML.

Empty elements can be created using `a[Nodespec]` alone, as above with `a['input[name="score"][type="number"]']`. Similarly, create a horizontal rule with `a['hr']`, or just `a.hr`.

<!--PLAYGROUND-->
~~~javascript
ax((a) => [
  a['!']('<strong>HTML</strong>'),
  a.hr,
])
~~~
<!--MARKDOWN-->

<!--NAVIGATION-->
<a class="app-navigation" href="/docs/tutorial/tag_builder.md">Prev: Tag builder</a>
<a class="app-navigation" style="float: right;" href="/docs/tutorial/extensions.md">Next: Extensions</a>
