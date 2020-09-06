<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>

<!--MARKDOWN-->
Invoke ax()
===========

Call `ax()` to create elements and insert them into the DOM.

Normally `ax()` is called with a function as an argument, where the function, in turn, returns content.

This _content function_ is called with two arguments: a _tag builder_ and an _extensions_ namespace. In the examples here, these are assigned as `a` and `x`.

<!--PLAYGROUND-->
~~~javascript
ax((a, x) => [
  a.h3('Heading'),
  x.markedjs({markdown: 'This is **markdown**.'}),
]);
~~~
<!--MARKDOWN-->

<!--NAVIGATION-->
<a class="app-navigation" href="/docs/tutorial/introduction.md">Prev: Introduction</a>
<a class="app-navigation" style="float: right;" href="/docs/tutorial/tag_builder.md">Next: Tag builder</a>
