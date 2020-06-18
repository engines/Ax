let navbar = (router) => (a, x) =>
  a["nav#navbar.navbar.navbar-expand-md.navbar-light.bg-white.mx-n2.mt-n1"](
    [
      a.a(
        a.img(null,{src: '/logo.png', width: 100, height: 57, class: 'app-navbar-brand-icon'}),
        {
          class: "navbar-brand",
          href: "#",
          $on: {click: (e, el) => {
            e.preventDefault();
            router.open("/")
          }},
        }
      ),
      a.button(a({class: "navbar-toggler-icon"}), {
        class: "navbar-toggler mb-4",
        data: {
          toggle: "collapse",
          target: "#navbarCollapse",
        },
      }),
      a.div(
        a.ul(
          [
            a.li(
              a.a('Home', {
                class: 'nav-link',
                href: '#',
                $on: {click: (e, el) => {
                  e.preventDefault();
                  router.open("/")
                }},
              }),
              {
                class: 'nav-item',
                data: {
                  path: '/'
                },
              }
            ),
            a.li(
              a.a( 'Integration',{
                class: 'nav-link',
                href: '#',
                $on: {click: (e, el) => {
                  e.preventDefault();
                  router.open("/integration")
                }},
              }),
              {
                class: 'nav-item',
                data: {
                  path: '/integration'
                },
              }
            ),
            a.li(
              a.a( 'Usage',{
                class: 'nav-link',
                href: '#',
                $on: {click: (e, el) => {
                  e.preventDefault();
                  router.open("/usage")
                }},
              }),
              {
                class: 'nav-item',
                data: {
                  path: '/usage'
                },
              }
            ),
          ],
          {
            class: 'navbar-nav mr-auto mb-4',
          }
        ),
        {
          id: 'navbarCollapse',
          class: 'collapse navbar-collapse',
        }
      ),
    ],
    {
      $activate: function() {
        this.$$('.nav-item.active').classList.remove('active')
        let section = location.pathname.split('/')[1]
        let active = this.$(`[data-path="/${section}"]`)
        if (active) active.classList.add('active')
      },
    }
  );

export default navbar
