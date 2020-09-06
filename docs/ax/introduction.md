<!--NAVIGATION-->
<a class="app-navigation" href="/docs/index.md">Index</a>

<!--MARKDOWN-->
Call `ax()` to render content.



Give an element `$state` and when it changes the element will re-render.

Event handlers can be set using `$on`.

<!--PLAYGROUND-->
~~~javascript
ax({
  $state: 10,
  $nodes: (el) => [
    a.h1(el.$state),
    a.button("⯇", {$on: {click: () => {el.$state--}}}),
    a.button("⯈", {$on: {click: () => {el.$state++}}}),
  ]
})
~~~
<!--MARKDOWN-->

Specify an `$update` function and it will be called when `$state` changes but before content is rendered. Return `true` to proceed to render, and `false` to not render.

<!--PLAYGROUND-->
~~~javascript
ax([
  {
    $tag: 'button',
    $state: 0,
    $text: (el) => el.$state,
    $on: {click: (e,el) => el.$state++},
    $update: (el) => {
      if (el.$state < 3) {
        message.$text = `${3 - el.$state} more to go!`
        return false
      } else {
        message.$text = 'That is enough, thanks.'
        return true
      }
    },
  },
  {
    id: 'message',
    $tag: 'h3',
    $text: 'Please click the button three times.'
  }
])
~~~
<!--MARKDOWN-->
