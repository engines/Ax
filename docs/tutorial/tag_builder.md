<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>
<!--MARKDOWN-->

Tag builder
===========

The tag builder creates HTML elements. To create an element with _Properties_:
~~~javascript
ax((a) => a(Properties));
~~~

Specify content with `$text` and `$html` properties.

<!--PLAYGROUND-->
~~~javascript
(async () => {
  const {default: ax} = await import("https://cdn.jsdelivr.net/npm/@engines/ax.js");
  ax((a) => [
    a({$text: 'Euro symbol: '}),
    a({$html: '&euro;'}),
  ]);
})()
// import {ax, a, x} from '@engines/ax';
~~~
<!--MARKDOWN-->

The nodename is specified with `$tag`. It defaults to `span` if unset.

Specify an array of children using `$nodes`.

<!--PLAYGROUND-->
~~~javascript
ax((a) => a({
  $tag: 'article',
  $nodes: [
    a({$tag: 'h3', $text: 'Heading'}),
    a({
      $tag: 'section',
      $nodes: [
        a({$tag: 'h5', $text: 'Subheading'}),
        a({$tag: 'p', $text: 'Lorem ipsum'})
      ]
    })
  ]
}));
~~~
<!--MARKDOWN-->

Put tag attributes in the properties. The following example creates an element:
~~~html
<h1 id="mainHeading" class="app-heading">This is the main heading.</h1>
~~~
<!--PLAYGROUND-->
~~~javascript
ax((a) => a({
  $tag: 'h1',
  $text: 'This is the main heading.',
  id: 'mainHeading',
  class: 'app-heading',
}));
~~~
<!--MARKDOWN-->

<!--NAVIGATION-->
<a class="app-navigation" href="/docs/tutorial/invoke_ax.md">Prev: Invoke ax()</a>
<a class="app-navigation" style="float: right;" href="/docs/tutorial/shorthand.md">Next: Shorthand</a>
