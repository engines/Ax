import './playground/css'
import 'codemirror/lib/codemirror.css'
import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript.js';
import html from './playground/html';

const playground = (js, options={}) => (a, x) =>
  a({
    $tag: 'app-playground',
    $nodes: () => [
      a({
        $tag: 'textarea',
        $text: js,
        $init: (el) => {
          el.$codemirror = CodeMirror.fromTextArea(el, {
            lineNumbers: true,
          })
        }
      }),
      a['div.btn-group.p-1']([
        a({
          $tag: 'button',
          class: 'btn btn-primary',
          $nodes: [ app.icon('fa fa-play') ],
          $on: {
            click: (e, el) => {
              let js = el.$('^app-playground textarea').$codemirror.getValue();
              let iframeWrapper = el.$('^app-playground app-playground-iframe-wrapper');
              iframeWrapper.$render();
              let iframe = iframeWrapper.$('iframe').$render();
              iframe.classList.remove('d-none');
              let iDoc = iframe.contentDocument;
              iDoc.body.innerHTML = '';
              iDoc.write(html(js, options));
              iDoc.close();
            },
          },
        }),
        a({
          $tag: 'button',
          class: 'btn btn-outline-primary',
          $nodes: [ app.icon('fa fa-stop') ],
          $on: {
            click: (e, el) => {
              let iframe = el.$('^app-playground iframe');
              iframe.classList.add('d-none');
            },
          },
        }),
        a({
          $tag: 'button',
          class: 'btn btn-outline-primary',
          $nodes: [ app.icon('fa fa-undo') ],
          $on: {
            click: (e, el) => {
              el.$('^app-playground').$render();
            },
          },
        }),
      ]),
      a['app-playground-iframe-wrapper'](
        a.iframe(null, { class: 'd-none' }),
      ),
    ],
  });

export default playground;
