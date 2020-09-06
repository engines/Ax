<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>

<!--MARKDOWN-->
ax
==

Invoke Ax
---------

Ax is invoked by calling its nominal function:
~~~javascript
ax(component, options);
~~~

The _component_ is parsed by Ax to create an HTML element with content. Valid Ax components are:
 * **function** - that returns another component when called.
 * **element**, **node** - rendered as is.
 * **array**, **nodelist** - collection of components.
 * **object** - rendered as pretty JSON.
 * **null** - render nothing.
 * **string**, **anything else** - rendered as text.

When a component is a function, the component is called with two arguments, the **Tag Builder** and the **Extensions Object**.  It is common to refer to the Tag Builder and Extension Object arguments as `a` and `x`.
<!--PLAYGROUND-->
~~~javascript
ax((a, x) => 'Hello, world!');
~~~
<!--MARKDOWN-->
Tag Builder
-----------



Extensions
----------

The Extensions Object provides access to features that are provided by any **Ax Extensions** included in the document. Here a form builder extension provides a `x.form(options)` method:
<!--PLAYGROUND-->
~~~javascript
ax((a, x) => [
  a.h3('Sign in'),
  x.form({
    action: '/test',
    form: f => [
      f.input({name: 'username'}),
      f.input({name: 'password', type: 'password'}),
      f.submit(),
    ]
  }),
]);
~~~
<!--MARKDOWN-->

Tag Attributes
--------------

HTML tag attributes, are mapped to attributes on the element. For example, define attribute `class: 'border-2'` and the element will have an attribute of `class="border-2"`.
<!--PLAYGROUND-->
~~~javascript
ax((a, x) => a.div('A box', {class: 'border-2'}));
~~~
<!--MARKDOWN-->

Ax Attributes
-------------

Ax Attributes are:
* `$tag` {string} _nodename_ for the element, with default `<span>`.
* `$nodes` {(array|function)} collection of components for the element.
* `$text` {(string|function)} plain text content for the element.
* `$html` {(string|function)} html content for the element.
* `$state` {(object|literal)} data used in rendering content.
* `$update` {function} called when $state changes.
* `$init` {function} called once the element is rendered.
* `$on` {object} event handlers for the element.

Each element created by Ax has its Ax Attributes applied to methods on the element for controlling the element and its content.
* `$text` get/set methods for changing text content.
* `$html` get/set methods for changing html content.
* `$nodes` get/set methods for changing nodes content.
* `$state`  get/set methods for changing element state.
* `$render` method for populating an element with content.
* `$events` storage of event handlers.
* `$on` method for adding event handlers.
* `$off` method for removing event handlers.
* `$send` method for sending event from an element.
* `$` the Traversal Tool method for selecting another element.
* `$$` the Query Tool method for selecting and manipulating collections of other elements.
* `$ax` storage of the current state of the Ax Attributes for an element.

##Updating content

The `$text`, `$html`, `$nodes` and `$state` properties are defined with setters that, when invoked, will trigger the element `$update` and `$render` method.


The `$render` method applies a `$text`, `$html` or `$nodes` content property to generate DOM elements.

In this example the $text function is called when the element is rendered, and each time the `$render` method is called on the element.
<!--PLAYGROUND-->
~~~javascript
ax((a, x) => a({
  $tag: 'h1',
  $text: () => (new Date).toLocaleTimeString(),
  $init: el => setInterval(el.$render, 1000),
}));
~~~
<!--MARKDOWN-->


New content can be rendered by using the `$text`, `$html` and `$nodes` setters:
<!--PLAYGROUND-->
~~~javascript
ax((a, x) => a['#myEl'])

myEl.$text = 'Here it comes'

setTimeout(() => {
	let newElement = ax.element.create({$tag: 'h1', $text: 'A heading'});
	myEl.$nodes = newElement
}, 1000);
~~~
<!--MARKDOWN-->

Alternatively, use `$state` in collaboration with a content function.
<!--PLAYGROUND-->
~~~javascript
ax((a, x) => a({
  id: 'myEl',
  $state: 'on',
  $text: el => `I am ${el.$state}.`
}));

setTimeout(() => {
	myEl.$state = 'off'
}, 1000);
~~~
<!--MARKDOWN-->


Functions defined on `$text`, `$html` and `$nodes` are called, with the element itself as an argument, when the element is rendered and whenever the element state changes.
<!--PLAYGROUND-->
~~~javascript
ax((a, x) => a({
  $state: 10,
  $nodes: el => [
    a.h1(el.$state),
    a.button("⯇", {$on: {click: () => {el.$state--}}}),
    a.button("⯈", {$on: {click: () => {el.$state++}}}),
  ]
}));
~~~
<!--MARKDOWN-->

The `$update` function is called when the `$state` property changes. Use `$update` to manage data bindings and trigger state-dependent behaviour. If `$update` is not specified, the `$render` method will be called and the content will be refreshed by reapplying the relevant object content property. If `$update` is specified, the `$render` method will be called only if `$update()` returns `true`.
<!--PLAYGROUND-->
~~~javascript
ax((a, x) => a({
  $tag: 'button',
  $text: (el) => el.$state ? 'Clicked' : 'Unclicked',
  $on: { click: (e,el) => el.$state = !el.$state },
  $update: (el) => {
    setTimeout( el.$render, 500)
    return false
  },
}));
~~~
<!--MARKDOWN-->

Custom Attributes
-----------------

Any other attributes that start with `$` are Custom Attributes, which are added to the element, as custom properties, when the element is created. When Custom Attributes are functions, the element is bound to the function when its associated custom property is defined on the element. Use a regular function, as opposed to an arrow function, to access the element with `this` within the scope of the function.
<!--PLAYGROUND-->
~~~javascript
ax((a, x) => a({
  $tag: 'h1',
  $init: el => setInterval(el.$tick, 1000),
  $tick: function() {
    this.$text = (new Date).toLocaleTimeString()
  },
}));
ax((a, x) => a({
  $tag: 'h1',
  $init: el => setInterval(el.$render, 1000),
  $text: () => (new Date).toLocaleTimeString(),
}));
ax((a, x) => a({
  $nodes: ['*******'],
  style: {
    opacity: 0,
    transition: `opacity 2s linear`
  },
  $init: (el) => setTimeout( () => el.style.opacity = 1, 1000),
}));
~~~
<!--MARKDOWN-->
