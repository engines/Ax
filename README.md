Ax
==

Ax is for creating reactive components and single page applications in JavaScript.

The Ax core library is concerned with DOM rendering and updating. Other features are provided by extensions.

Ax Framework (NPM package `axf`) includes a selection of extensions for building forms and reports, client-side routing and XHR/fetching.

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
  <script>
    ax.css({h1: {color: 'blue'}});
    ax((a, x) => a({
      $state: 10,
      $nodes: (el) => [
        a.h1(el.$state),
        a.button("⯇", {$on: {click: () => {el.$state--}}}),
        a.button("⯈", {$on: {click: () => {el.$state++}}}),
      ]
    }));
  </script>
</body>
</html>
~~~

Usage
-----
See the <a class="app-navigation" href="/docs/index.md">Docs</a>.

<!--README-ONLY-->
This Repo
=========

1. The development files for Ax in `packages/src/`
2. Pre-built Ax packages for distribution in `packages/dist/`
3. The Ax website in `web/`

Run Website
-----------

```console
cd web
npm i
webpack -p
```

Serve the `/web/` directory.


Website Dev
-----------

`npm run dev`

Build Packages
--------------

`gulp` to run a development webserver with auto-rebuild of /dist.
`gulp build` to build /dist without publishing.
`gulp publish` to build /dist and publish all packages to NPM.

<!--MARKDOWN-->
<hr>
<a href="https://github.com/engines/Ax"><i class="fab fa-github"></i></a>
