<!--NAVIGATION-->
<a href="/docs">Docs</a>
<!--/NAVIGATION-->

<!--MARKDOWN-->
Ax is a JavaScript library for creating reactive DOM components and single page applications. It aims to be simple and easy to use.

The Ax core is concerned with DOM rendering and updating. Other features, like client-side routing and XHR helpers, are provided via various extensions.

Syntax for element creation is similar to that used by libraries like
<a href="https://github.com/MithrilJS/mithril.js" target="mithril">Mithril</a> and
<a href="https://github.com/hyperhype/hyperscript" target="hyperscript">HyperScript</a>. The life cycle of elements takes inspiration from <a href="https://github.com/intercellular/cell" target="cell">Cell</a>.

<i class="fab fa-github"></i>

> What happened to @gliechtenstein?
> The creator of cell.js <a href="https://www.reddit.com/r/RBI/comments/bwv5eo/public_software_developer_just_disappeared_no/" target="ethan">disappeared</a> in 2018.<br>
> Ethan, if you're out there, please post to let people know that you're alright. We've been worried about you.

<hr>

Quick start
-----------

~~~html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://cdn.jsdelivr.net/npm/axf/axf.js" ></script>
</head>
<body>
  <script>ax('Hello, world!')</script>
</body>
</html>
~~~
<!--/MARKDOWN-->
