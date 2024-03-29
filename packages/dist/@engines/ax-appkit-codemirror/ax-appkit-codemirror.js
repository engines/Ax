// Ax, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax, dependencies={}) => factory(ax, dependencies)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax, dependencies={}) {

const a = ax.a,
  x = ax.x,
  is = ax.is;

ax.extensions.codemirror = function (options = {}) {
  return a['ax-appkit-codemirror'](
    [
      ax.is.false(options.toolbar)
        ? ''
        : x.codemirror.toolbar({
            keymap: false,
            ...options,
          }),
      a.textarea(options.value || '', {
        style: { display: 'none' },
        $init: (el) => {
          let intersection = new IntersectionObserver(() => {
            if (!el.$codemirror) {
              el.$codemirror = x.codemirror.CodeMirror.fromTextArea(el, {
                ...options,
                ...(options.mode
                  ? {
                      mode:
                        ax.is.object(options.mode) && options.mode.value
                          ? options.mode.value
                          : options.mode,
                    }
                  : {}),
                ...(options.keymap
                  ? {
                      keyMap:
                        ax.is.object(options.keymap) && options.keymap.value
                          ? options.keymap.value
                          : options.keymap,
                    }
                  : {}),
                ...options.codemirror,
              });
              el.$codemirror.setSize('100%', '100%');
              intersection.disconnect();
              intersection = null;
            }
          });
          intersection.observe(el);
        },
        $exit: (el) => {
          el.$codemirror = null;
        },
        ...options.textareaTag,
      }),
    ],
    options.codemirrorTag || {}
  );
};

ax.css({
  'ax-appkit-codemirror': {
    $: {
      display: 'block',
    },
    'div.CodeMirror': {
      $: {
        minHeight: '2em',
        borderRadius: 'unset',
        padding: 'unset',
        fontFamily: 'monospace',
        zIndex: 1,
        border: '1px solid #e6e6e6',
      },
      'div.CodeMirror-scroll': {
        $: {
          minHeight: 'unset',
        },
      },
    },
    'div.CodeMirror.disabled': {
      $: {
        backgroundColor: '#e9ecef',
      },
    },
    '&.fullscreen': {
      $: {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        border: 'none',
        borderRadius: '0px',
        zIndex: '999',
      },
      'ax-appkit-codemirror-toolbar': {
        $: {
          overflow: 'hidden',
        },
        'ax-appkit-codemirror-label': {
          $: {
            display: 'block',
            maxHeight: '1.8rem',
          },
        },
      },
    },
  },
  'ax-appkit-codemirror-toolbar': {
    $: {
      display: 'block',
      overflow: 'auto',
      color: '#333',
      backgroundColor: 'white',
      border: '1px solid #e6e6e6',
      borderBottom: 'none',
    },
    button: {
      $: {
        padding: '0px 5px',
        margin: '1px',
        fontSize: '1.2em',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
    },
    select: {
      $: {
        border: 'none',
        backgroundColor: 'transparent',
        height: '1.5rem',
      },
    },
    'ax-appkit-codemirror-label': {
      $: {
        display: 'block',
        padding: '4px 4px',
      },
    },
    'ax-appkit-codemirror-toolbar-right': {
      $: {
        float: 'right',
      },
      label: {
        $: {
          margin: '0px',
          padding: '0px 5px',
        },
      },
      '& > *': {
        $: {
          verticalAlign: 'text-bottom',
        },
      },
    },
    'ax-appkit-codemirror-mode': {
      $: {
        display: 'inline-block',
        border: '1px solid #e6e6e6',
        margin: '0px 2px',
      },
    },
    'ax-appkit-codemirror-keymap': {
      $: {
        display: 'inline-block',
        border: '1px solid #e6e6e6',
        margin: '0px 2px',
      },
    },
  },
});

ax.extensions.codemirror.CodeMirror =
  dependencies.CodeMirror || window.CodeMirror;

ax.extensions.codemirror.form = {};

ax.extensions.codemirror.icons = {};

ax.extensions.codemirror.report = {};

ax.extensions.codemirror.toolbar = function (options = {}) {
  return a['ax-appkit-codemirror-toolbar']([
    a['ax-appkit-codemirror-toolbar-right']([
      ax.extensions.codemirror.toolbar.mode(options),
      ax.extensions.codemirror.toolbar.keymap(options),
      a['ax-appkit-codemirror-fullscreen'](
        a.button({
          $nodes: ax.extensions.codemirror.icons.maximize(),
          type: 'button',
          $on: {
            'click: toggle full screen': (e) => {
              let el = e.currentTarget;
              let wrapper = el.$('^ax-appkit-codemirror');
              let codemirror = wrapper.$('textarea').$codemirror;
              if (wrapper.classList.contains('fullscreen')) {
                el.$nodes = ax.extensions.codemirror.icons.maximize();
                el.$('^body').style.overflowY = 'unset';
                wrapper.classList.remove('fullscreen');
                codemirror.focus();
              } else {
                el.$nodes = ax.extensions.codemirror.icons.restore();
                el.$('^body').style.overflowY = 'hidden';
                wrapper.classList.add('fullscreen');
                codemirror.focus();
              }
            },
          },
        })
      ),
    ]),
    a['ax-appkit-codemirror-label'](options.label || ''),
  ]);
};

ax.extensions.codemirror.form.control = function (r, options = {}) {
  return a['ax-appkit-form-control'](
    a['ax-appkit-codemirror-control']([
      x.codemirror({
        ...options,
        textareaTag: {
          name: options.name,
          disabled: options.disabled,
          ...options.textareaTag,
        },
        codemirrorTag: {
          $on: {
            'keyup: update textarea value': (e) => {
              let el = e.currentTarget;
              el.$send('ax.appkit.form.control.change');
              el.$('textarea').$codemirror.save();
            },
            'keydown: check for exit': (e) => {
              let el = e.currentTarget;
              let control = el.$('^ax-appkit-codemirror-control');
              let allowEsc =
                el.$('textarea').$codemirror.options.keyMap != 'vim';

              if (control.classList.contains('fullscreen')) {
                if (e.keyCode == 27 && (allowEsc || e.ctrlKey)) {
                  // ESC pressed - close full screen
                  control.$('ax-appkit-codemirror-fullscreen button').click();
                }
              } else {
                if (e.keyCode == 27 && (allowEsc || e.ctrlKey)) {
                  // ESC pressed - move focus forward
                  if (e.ctrlKey && e.shiftKey) {
                    // ctrl+shift+ESC pressed - move focus backward
                    ax.x.lib.tabable.previous(e.target).focus();
                  } else {
                    ax.x.lib.tabable.next(e.target).focus();
                  }
                }
              }
            },
            ...(options.codemirrorTag || {}).$on,
          },
          ...options.codemirrorTag,
        },
      }),
    ]),
    {
      $value: (el) => () => {
        return el.$('textarea').$codemirror.getValue();
      },

      $focus: (el) => () => {
        let codemirror = el.$('textarea').$codemirror;
        if (codemirror) codemirror.focus();
      },

      $enabled: !options.disabled,
      $disable: (el) => () => {
        el.$enabled = false;
        el.$$('.CodeMirror').classList.add('disabled');
        el.$$('textarea').setAttribute('disabled', 'disabled');
      },

      $enable: (el) => () => {
        if (!options.disabled) {
          el.$enabled = true;
          el.$$('.CodeMirror').classList.remove('disabled');
          el.$$('textarea').removeAttribute('disabled');
        }
      },

      ...options.controlTag,
    }
  );
};

ax.extensions.codemirror.form.shim = {
  controls: {
    codemirror: (f, target) => (options = {}) => {
      return ax.x.codemirror.form.control(f, options);
    },
  },
};

ax.extensions.codemirror.icons.maximize = () =>
  a({
    $tag: ['http://www.w3.org/2000/svg', 'svg'],
    height: 22,
    width: 22,
    viewBox: '0 0 22 22',
    $nodes: [
      a({
        $tag: ['http://www.w3.org/2000/svg', 'g'],
        transform: 'scale(0.04)',
        $nodes: [
          a({
            $tag: ['http://www.w3.org/2000/svg', 'path'],
            style: { fill: '#333' },
            d: `M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 394c0 3.3-2.7 6-6 6H54c-3.3 0-6-2.7-6-6V192h416v234z`,
          }),
        ],
      }),
    ],
  });

ax.extensions.codemirror.icons.restore = () =>
  a({
    $tag: ['http://www.w3.org/2000/svg', 'svg'],
    height: 22,
    width: 22,
    viewBox: '0 0 22 22',
    $nodes: [
      a({
        $tag: ['http://www.w3.org/2000/svg', 'g'],
        transform: 'scale(0.04)',
        $nodes: [
          a({
            $tag: ['http://www.w3.org/2000/svg', 'path'],
            style: { fill: '#333' },
            d: `M464 0H144c-26.5 0-48 21.5-48 48v48H48c-26.5 0-48 21.5-48 48v320c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48h48c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-96 464H48V256h320v208zm96-96h-48V144c0-26.5-21.5-48-48-48H144V48h320v320z`,
          }),
        ],
      }),
    ],
  });

ax.extensions.codemirror.report.control = function (r, options = {}) {
  return a['ax-appkit-report-control'](
    a['ax-appkit-codemirror-control']([
      x.codemirror({
        readOnly: true,
        ...options,
        codemirrorTag: {
          $on: {
            'keydown: check for exit': (e) => {
              let el = e.currentTarget;
              let control = el.$('^ax-appkit-codemirror-control');

              if (control.classList.contains('fullscreen')) {
                if (e.keyCode == 27) {
                  // ESC pressed - close full screen
                  control.$('ax-appkit-codemirror-fullscreen button').click();
                }
              } else {
                if (e.keyCode == 9 && e.shiftKey) {
                  // shift+TAB pressed - move focus backward
                  ax.x.lib.tabable.previous(e.target).focus();
                } else if (e.keyCode == 9) {
                  // TAB pressed - move focus forward
                  ax.x.lib.tabable.next(e.target).focus();
                }
              }
            },
            ...(options.codemirrorTag || {}).$on,
          },
          ...options.codemirrorTag,
        },
      }),
    ]),
    {
      'data-name': options.name,
      $value: (el) => () => {
        return options.value;
      },
      $focus: (el) => () => {
        el.$('textarea').$codemirror.focus();
      },
      ...options.controlTag,
    }
  );
};

ax.extensions.codemirror.report.shim = {
  controls: {
    codemirror: (f, target) => (options = {}) =>
      ax.x.codemirror.report.control(f, options),
  },
};

ax.extensions.codemirror.toolbar.keymap = function (options = {}) {
  let keymap = options.keymap;

  let installedKeymaps = x.codemirror.CodeMirror.keyMap;
  let component;

  let keymapLabel = (keymap) => {
    let labels = {
      vim: 'Vim',
      emacs: 'Emacs',
      sublime: 'Sublime',
    };
    return labels[keymap] || keymap;
  };

  let keymapSelect = (value, selections) => {
    if (ax.is.undefined(selections)) {
      selections = [['default', '𝍣 Keys']];
      if (installedKeymaps.vim) selections.push(['vim', 'Vim']);
      if (installedKeymaps.emacs) selections.push(['emacs', 'Emacs']);
      if (installedKeymaps.sublime) selections.push(['sublime', 'Sublime']);
    }

    return a.select(
      x.form.factory.select.options({
        value: value,
        selections: selections,
      }),
      {
        $on: {
          'change: set editor keyMap': (e) => {
            let el = e.currentTarget;
            el.$(
              '^ax-appkit-codemirror-control ax-appkit-codemirror textarea'
            ).$codemirror.setOption('keyMap', el.value);
          },
        },
      }
    );
  };

  if (!keymap) {
    component = '';
  } else if (ax.is.string(keymap)) {
    component = a.label(keymapLabel(keymap));
  } else if (ax.is.object(keymap)) {
    component = keymapSelect(keymap.value, keymap.selections);
  } else {
    component = keymapSelect();
  }

  return component
    ? a['ax-appkit-codemirror-keymap'](component, options.keymapTag || {})
    : '';
};

ax.extensions.codemirror.toolbar.mode = function (options = {}) {
  let mode = options.mode;
  let component;

  if (ax.is.string(mode)) {
    component = a.label(mode);
  } else if (mode) {
    let selections = mode.selections;

    let selectName = '';
    if (options.name) {
      if (options.name.endsWith(']')) {
        selectName = options.name.replace(/(.*)(\])$/, '$1_mode]');
      } else {
        selectName = options.name + '_mode';
      }
    }

    if (ax.is.undefined(selections)) {
      selections = Object.keys(x.codemirror.CodeMirror.modes); // List of installed language modes
      selections.shift(); // remove 'null'
    }

    component = a.select(
      x.form.factory.select.options({
        placeholder: '𝍣 Mode',
        value: mode.value,
        selections: selections,
      }),
      {
        name: selectName,
        $on: {
          'change: set editor mode': (e) => {
            let el = e.currentTarget;
            el.$(
              '^ax-appkit-codemirror-control ax-appkit-codemirror textarea'
            ).$codemirror.setOption('mode', el.value);
          },
        },
      }
    );
  } else {
    component = '';
  }

  return component
    ? a['ax-appkit-codemirror-mode'](component, options.modeTag || {})
    : '';
};

}));
