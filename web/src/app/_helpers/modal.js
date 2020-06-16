const modal = (options = {}) => (a, x) =>
  a["app-modal"](
    a["div.modal"](a["div.modal-dialog"](a["div.modal-content"]), {
      tabindex: -1,
    }),
    {
      id: options.id || "modal",
      $open: function (options = {}) {
        this.$(".modal-dialog").className = `modal-dialog modal-${
          options.size || "md"
        }`;

        this.$(".modal-content").$nodes = [
          a["div.modal-header"]([
            a[".modal-title"](options.title || null),
            a["button.close"](a("&times;"), { data: { dismiss: "modal" } }),
          ]),
          a["div.modal-body"](options.body || null),
          options.footer ? a["div.modal-footer"](options.footer || null) : null,
        ];

        $(this.$(".modal")).modal({ backdrop: "static" });
      },
    }
  );

export default modal
