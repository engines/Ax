export default (router) => (a, x) => [
  a.h1('Performance'),
  a.h5('Removed elements not deleted',{class: 'float-left'}),
  a.p('1000 small renders per second for 5 minutes',{class: 'float-right'}),
  a.img(null,{class: 'w-100 mb-4',src: '/performance/nodelete.png'}),
  a.h5('Removed elements deleted',{class: 'float-left'}),
  a.p('1000 small renders per second for 5 minutes',{class: 'float-right'}),
  a.img(null,{class: 'w-100 mb-4',src: '/performance/delete.png'}),
  a.h5('No external libraries',{class: 'float-left'}),
  a.p('1 huge render every 2 seconds for 10 minutes',{class: 'float-right'}),
  a.img(null,{class: 'w-100 mb-4',src: '/performance/nolibs.png'}),
  a.h5('With EasyMDE',{class: 'float-left'}),
  a.p('1 huge render every 2 seconds for 45 seconds',{class: 'float-right'}),
  a.img(null,{class: 'w-100 mb-4',src: '/performance/easymde.png'}),
  // a.h5('window.performance'),
  // performance,
]