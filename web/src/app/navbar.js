export default (router) => (a, x) =>
  a["nav#navbar.navbar.navbar-expand-md.navbar-light.bg-white"](
    [
      a.a(
        a.img([], {
          src: "/logo.png",
          width: 100,
          height: 57,
          class: "app-navbar-brand-icon",
        }),
        {
          class: "navbar-brand",
          href: "#",
          $on: {
            click: (e, el) => {
              e.preventDefault();
              router.open("/");
            },
          },
        }
      ),
      a.button(a({ class: "navbar-toggler-icon" }), {
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
              a.a("Home", {
                class: "nav-link",
                href: "#",
                $on: {
                  click: (e, el) => {
                    e.preventDefault();
                    router.open("/");
                  },
                },
              }),
              {
                class: "nav-item",
                data: {
                  path: "/",
                },
              }
            ),
            a.li(
              a.a("Docs", {
                class: "nav-link",
                href: "#",
                $on: {
                  click: (e, el) => {
                    e.preventDefault();
                    router.open("/docs");
                  },
                },
              }),
              {
                class: "nav-item",
                data: {
                  path: "/docs",
                },
              }
            ),
            a.li(
              a.a("Test", {
                class: "nav-link",
                href: "#",
                $on: {
                  click: (e, el) => {
                    e.preventDefault();
                    router.open("/test");
                  },
                },
              }),
              {
                class: "nav-item",
                data: {
                  path: "/test",
                },
              }
            ),
          ],
          {
            class: "navbar-nav mr-auto mb-4",
          }
        ),
        {
          id: "navbarCollapse",
          class: "collapse navbar-collapse",
        }
      ),
    ],
    {
      $activate: (el) => () => {
        el.$$(".nav-item.active").classList.remove("active");
        let section = location.pathname.split("/")[1];
        let active = el.$(`[data-path="/${section}"]`);
        if (active) active.classList.add("active");
      },
    }
  );
