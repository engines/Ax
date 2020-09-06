<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>
<!--MARKDOWN-->

Shadow
======

Attach a shadow DOM with the `$shadow` property.

<!--PLAYGROUND-->
~~~javascript
ax((a, x) => [
  a.h1('DOM'),
  a.div(a.h1('DOM'), {$shadow: true}),
  a.h1('DOM'),
]);
~~~
<!--MARKDOWN-->

Specify styles with a string or object, or an array of such.

<!--PLAYGROUND-->
~~~javascript
ax((a, x) => [
  a.h1('DOM',{class: 'border border-primary'}),
  a.div(
    a.h1('DOM', {class: 'border border-primary'}),
    {
      $shadow: [
        '@import "/bootstrap/dist/css/bootstrap.min.css"',
        'h1.border-primary {background-color: silver;}',
        {'h1.border-primary': {borderSize: '2px'}},
      ]
    }
  ),
  a.h1('DOM',{class: 'border border-primary'}),
]);
~~~
<!--MARKDOWN-->

<!--NAVIGATION-->
<a class="app-navigation" href="/docs/tutorial/tag_builder.md">Prev: Tag builder</a>
<a class="app-navigation" style="float: right;" href="/docs/tutorial/extensions.md">Next: Extensions</a>
