<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>
<!--MARKDOWN-->

Namespace
=========

Set `$tag` as an array `[URI, Nodename]` to create an element with a specified namespace.

<!--PLAYGROUND-->
~~~javascript
let ns = 'http://www.w3.org/2000/svg'
ax(ax.a({
  $tag: [ns, 'svg'],
  viewBox: '0 0 100 100',
  $nodes: ax.a({
    $tag: [ns, 'circle'],
    cx: 50,
    cy: 50,
    r: 40,
    fill: 'blue',
  }),
}));


ax(ax.a({
  $tag: [ns, 'svg'],
  $nodes: ax.a[[ns, 'circle']]({
    cx: 50,
    cy: 50,
    r: 40,
    fill: 'blue',
  }),
}));
~~~
<!--MARKDOWN-->

<!--NAVIGATION-->
<a class="app-navigation" href="/docs/tutorial/tag_builder.md">Prev: Tag builder</a>
<a class="app-navigation" style="float: right;" href="/docs/tutorial/extensions.md">Next: Extensions</a>
