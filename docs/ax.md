<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>

<!--MARKDOWN-->
Call `ax()` to render content.

<!--PLAYGROUND-->
~~~javascript
ax('Hello, world!');
~~~
<!--MARKDOWN-->


<!--PLAYGROUND-->
~~~javascript
let element = ax.element('Hello, world!');
document.body.appendChild(element);
~~~
<!--MARKDOWN-->

<!--PLAYGROUND-->
~~~javascript
let element = ax.element.create({$tag: 'h1', $text: 'Hello, world!'})
ax.insert(element);
~~~
<!--MARKDOWN-->
