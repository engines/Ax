<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>
<!--MARKDOWN-->

Specify an `$init` function and it will be called when the element is first rendered.

<!--PLAYGROUND-->
~~~javascript
ax((a, x) => a({
  $tag: 'h1',
  $init: (el) => setInterval(el.$render, 1000),
  $text: () => (new Date).toLocaleTimeString(),
}))
~~~
<!--MARKDOWN-->
