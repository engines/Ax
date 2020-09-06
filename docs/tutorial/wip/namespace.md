<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>
<!--MARKDOWN-->

Namespace
=========

Set `$tag` as an array `[URI, Nodename]` to create an element with a specified namespace.

<!--PLAYGROUND-->
~~~javascript
ax((a) => a({
  $tag: ['http://www.w3.org/2000/svg', 'svg'],
  width: 100, height: 100,
  viewBox: '0 0 100 100',
  $nodes: [
    a({
      $tag: ['http://www.w3.org/2000/svg', 'circle'],
      cx: 50, cy: 50, r: 40,
      stroke: '#00F', 'stroke-width': 3, fill: 'none',
    })
  ],
}));
~~~
<!--MARKDOWN-->

<!--NAVIGATION-->
<a class="app-navigation" href="/docs/tutorial/tag_builder.md">Prev: Tag builder</a>
<a class="app-navigation" style="float: right;" href="/docs/tutorial/extensions.md">Next: Extensions</a>
