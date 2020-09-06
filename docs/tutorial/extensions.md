<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>

<!--MARKDOWN-->
Extensions
==========

Extensions add functionality to Ax, usually for the purpose of integrating third-party libraries.

<!--NAVIGATION-->
See the <a class="app-navigation" href="/docs/installation.md">installation</a> page for instructions on how to load extensions.
<!--MARKDOWN-->

<!--PLAYGROUND-->
~~~javascript
ax((a, x) => x.chartjs({
  canvasTag: {height: '150px'},
  type: 'horizontalBar',
  data: {
    labels: ['Red', 'Blue', 'Green'],
    datasets: [{
      data: [12, 19, 3],
      backgroundColor: ['red', 'blue', 'green'],
    }]
  },
  options: {
    legend: {display: false},
    maintainAspectRatio: false,
  }
}));
~~~
<!--MARKDOWN-->

<!--PLAYGROUND-->
~~~javascript
ax((a, x) => x.xtermjs({
  divTag: {style: {height: '100px'}},
  text: 'Hello from \x1B[1;3;31mxterm.js\x1B[0m\r\n'
}));
~~~
<!--MARKDOWN-->

<!--PLAYGROUND-->
~~~javascript
ax((a, x) => x.codemirror({
  value: 'let i = 0;\n',
  lineNumbers: true,
  mode: 'javascript'
}));
~~~
<!--MARKDOWN-->



<!--NAVIGATION-->
<a class="app-navigation" href="/docs/tutorial/shorthand.md">Prev: Shorthand</a>
<a class="app-navigation" style="float: right;" href="/docs/tutorial/properties.md">Next: Properties</a>
