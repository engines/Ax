export default (router) => (a,x) => router.mount({
  routes: {
    '*': app.page,
  },
  lazy: false,
})
