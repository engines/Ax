import report from './test/report.js'
import form from './test/form.js'
import performance from './test/performance.js'
import wip from './test/wip.js'

export default (router) => a['div.container']([
  a.button('report',{$on: {click: (e, el) => router.open('/test')}}),
  a.button('form',{$on: {click: (e, el) => router.open('/test/form')}}),
  a.button('performance',{$on: {click: (e, el) => router.open('/test/performance')}}),
  a.button('wip',{$on: {click: (e, el) => router.open('/test/wip')}}),
  router.mount({
    routes: {
      '/?': report,
      '/form': form,
      '/performance': performance,
      '/wip': wip,
    },
    lazy: true,
  }),
  // a({$init: (el) => setInterval(() => el.$('^ button').click(), 2000)}),
])
