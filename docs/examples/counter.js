ax((a,x) => a({
  $state: 10,
  $nodes: (el) => [
    a.h1(el.$state),
    a.button("⯇", {$on: {click: () => el.$state--}}),
    a.button("⯈", {$on: {click: () => el.$state++}}),
  ]
}))
