<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>

<!--MARKDOWN-->





_properties_ comprise **tag attributes**, **Ax attributes** and **Custom attributes**. Key names starting with `$` are Ax Attributes and Custom Attributes. More on these below.





Create dynamic content by setting `$text`, `$nodes`, or `$html` as a function. New content can be rendered by calling `$render`.

<!--PLAYGROUND-->
~~~javascript
ax((a, x) => a({
  id: 'random',
  $tag: 'h1',
  $text: Math.random,
}));
setInterval(random.$render, 100)
~~~
<!--MARKDOWN-->
