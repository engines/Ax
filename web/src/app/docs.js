export default (router) => router.mount({
  routes: {
    '*': app.page,
  },
  lazy: false,
})
