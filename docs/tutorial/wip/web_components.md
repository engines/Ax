<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>
<!--MARKDOWN-->

Web components
==============


Instantiate web components.

<!--PLAYGROUND-->
~~~javascript
class HelloWorld extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>Hello, world!</h1>';
  }
}
customElements.define('hello-world', HelloWorld);
ax((a) => a['hello-world']);
~~~
<!--MARKDOWN-->


<!--PLAYGROUND-->
~~~javascript
(async function() {
  await import('https://cdn.jsdelivr.net/npm/elix@14.0.0/define/Tabs.js');
  ax.css({
    elixTabs: {
      height: '150px',
      width: '300px',
      '.panel': {
        alignItems: 'center',
        background: 'white',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
      }
    },
  })
  ax((a) => a['elix-tabs#sampleTabs']([
    a['elix-tab-button']('Un', {slot: 'tabButtons'}),
    a['elix-tab-button']('Deux', {slot: 'tabButtons'}),
    a['elix-tab-button']('Trois', {slot: 'tabButtons'}),
    a.div('Tab 1', {class: 'panel', aria: {label: 'One'}}),
    a.div('Tab 2', {class: 'panel', aria: {label: 'Two'}}),
    a.div('Tab 3', {class: 'panel', aria: {label: 'Three'}}),
  ]));
})();
~~~
<!--MARKDOWN-->

<!--NAVIGATION-->
<a class="app-navigation" href="/docs/tutorial/tag_builder.md">Prev: Tag builder</a>
<a class="app-navigation" style="float: right;" href="/docs/tutorial/extensions.md">Next: Extensions</a>
