import css from "./playground/css";
// import "@engines/ax-appkit-codemirror/node_modules/codemirror/lib/codemirror.css";
// import "@engines/ax-appkit-codemirror/node_modules/codemirror/mode/javascript/javascript.js";
import html from "./playground/html";

const playground = (js, options = {}) => (a, x) =>
 a({
    $tag: "app-playground",
    class: "clearfix",
    $nodes: () => [
     a({
        $tag: "textarea",
        $text: js,
        $init: (el) => {
          el.$codemirror = x.codemirror.CodeMirror.fromTextArea(el, {
            lineNumbers: true,
          });
        },
      }),
      a["div.btn-group.p-1.float-right"]([
       a({
          $tag: "button",
          class: "btn btn-primary",
          $nodes: [app.icon("fa fa-play")],
          title: 'Execute code',
          $on: {
            click: (el) => (e) => {
              let js = el.$("^app-playground textarea").$codemirror.getValue();
              let iframeWrapper = el.$(
                "^app-playground app-playground-iframe-wrapper"
              );
              iframeWrapper.$render();
              let iframe = iframeWrapper.$("iframe").$render();
              iframe.classList.remove("d-none");
              let iDoc = iframe.contentDocument;
              iDoc.body.innerHTML = "";
              iDoc.write(html(js, options));
              iDoc.close();
              if (
                iframeWrapper.getBoundingClientRect().bottom >
                window.innerHeight
              ) {
                iframeWrapper.scrollIntoView();
              }
            },
          },
        }),
       a({
          $tag: "button",
          class: "btn btn-outline-primary",
          $nodes: [app.icon("fa fa-stop")],
          title: 'Close output window',
          $on: {
            click: (el) => (e) => {
              let iframe = el.$("^app-playground iframe");
              iframe.classList.add("d-none");
            },
          },
        }),
       a({
          $tag: "button",
          class: "btn btn-outline-primary",
          $nodes: [app.icon("fa fa-undo")],
          title: 'Reset editor',
          $on: {
            click: (el) => (e) => {
              let playground = el.$("^app-playground");
              playground.$render();
              playground.$(".btn-group").scrollIntoView();
            },
          },
        }),
      ]),
      a["app-playground-iframe-wrapper"](a.iframe(null, { class: "d-none" })),
    ],
  });

export default playground;
