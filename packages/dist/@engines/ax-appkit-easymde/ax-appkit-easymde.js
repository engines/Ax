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

ax.extension.easymde = (options = {}) => (a, x) =>
  a['ax-appkit-easymde'](
    a.textarea(options.value || '', {
      $init: (el) => {
        el.$observer = new IntersectionObserver(() => {
          if (!el.$easymde) {
            el.$easymde = new x.easymde.EasyMDE({
              element: el,
              toolbar: x.easymde.toolbar(),
              placeholder: options.placeholder,
              autoDownloadFontAwesome: false,
              ...options.easymde,
            });
          }
        });
        el.$observer.observe(el);
      },
      $exit: (el) => {
        el.$observer.disconnect();
        el.$observer = null;
        el.$easymde = null;
      },
      ...options.textareaTag,
      $updateValue: (el) => () => {
        el.value = el.$easymde.value();
      },
      $on: {
        'keydown: check for editor exit': (e, el) => {
          if (e.keyCode == 27) {
            // ESC pressed - move focus forward
            ax.x.lib.tabable.next(e.target).focus();
          }
        },
        ...(options.textareaTag || {}).$on,
      },
    }),
    {
      $refresh: (el) => () => {
        el.$('textarea').$easymde.codemirror.refresh();
      },
      ...options.easymdeTag,
    }
  );

ax.style({
  'ax-appkit-control-easymde': {
    'div.CodeMirror.disabled': {
      backgroundColor: '#e9ecef',
    },
    '.editor-statusbar': {
      padding: '0px 5px',
    },
    '.editor-toolbar': {
      button: {
        color: '#666',
      },
      'button:hover': {
        color: '#333',
      },
      backgroundColor: 'white',
      opacity: 1,
      border: '1px solid #e6e6e6',
      borderBottom: 'none',
      '&:before': {
        margin: 0,
      },
      '&:after': {
        margin: 0,
      },
    },
  },
});

ax.extension.easymde.EasyMDE = dependencies.EasyMDE || window.EasyMDE;

ax.extension.easymde.form = {};

ax.extension.easymde.toolbar = () => [
  {
    name: 'bold',
    action: ax.x.easymde.EasyMDE.toggleBold,
    className: 'fa fa-bold',
    title: 'Bold',
  },
  {
    name: 'italic',
    action: ax.x.easymde.EasyMDE.toggleItalic,
    className: 'fa fa-italic',
    title: 'Italic',
  },
  {
    name: 'heading',
    action: ax.x.easymde.EasyMDE.toggleHeadingSmaller,
    className: 'fa fa-heading',
    title: 'Heading',
  },
  '|',
  {
    name: 'quote',
    action: ax.x.easymde.EasyMDE.toggleBlockquote,
    className: 'fa fa-quote-left',
    title: 'Quote',
  },
  {
    name: 'unordered-list',
    action: ax.x.easymde.EasyMDE.toggleUnorderedList,
    className: 'fa fa-list-ul',
    title: 'Generic List',
  },
  {
    name: 'ordered-list',
    action: ax.x.easymde.EasyMDE.toggleOrderedList,
    className: 'fa fa-list-ol',
    title: 'Numbered List',
  },
  '|',
  {
    name: 'link',
    action: ax.x.easymde.EasyMDE.drawLink,
    className: 'fa fa-link',
    title: 'Create Link',
  },
  {
    name: 'image',
    action: ax.x.easymde.EasyMDE.drawImage,
    className: 'fa fa-image',
    title: 'Insert Image',
  },
  {
    name: 'table',
    action: ax.x.easymde.EasyMDE.drawTable,
    className: 'fa fa-table',
    title: 'Insert Table',
  },
  '|',
  {
    name: 'preview',
    action: ax.x.easymde.EasyMDE.togglePreview,
    className: 'fa fa-eye no-disable',
    title: 'Toggle Preview',
  },
  {
    name: 'side-by-side',
    action: ax.x.easymde.EasyMDE.toggleSideBySide,
    className: 'fa fa-columns no-disable',
    title: 'Toggle Side by Side',
  },
  {
    name: 'fullscreen',
    action: ax.x.easymde.EasyMDE.toggleFullScreen,
    className: 'fa fa-arrows-alt no-disable',
    title: 'Toggle Fullscreen',
  },
];

ax.extension.easymde.form.control = function (f, options) {
  let a = ax.a,
    x = ax.x;

  let controlTagOptions = {
    $value: (el) => () => {
      return el.$$('textarea').value();
    },
    $disable: (el) => () => {
      el.$$('.CodeMirror').classList.add('disabled');
      el.$$('textarea').setAttribute('disabled', 'disabled');
    },
    $enable: (el) => () => {
      // el.$('ax-appkit-control-easymde').$refresh();
      el.$$('.CodeMirror').classList.remove('disabled');
      el.$$('textarea').removeAttribute('disabled');
    },
    $focus: (el) => () => {
      el.$('ax-appkit-control-easymde textarea').$easymde.codemirror.focus();
    },

    ...options.controlTag,

    $on: {
      'keyup: update textarea': (e, el) => {
        el.$('textarea').$updateValue();
        el.$send('ax.appkit.form.control.change');
      },
      'keydown: check for editor exit': (e, el) => {
        if (e.target.nodeName === 'TEXTAREA') {
          if (e.keyCode == 27) {
            // ESC pressed - move focus forward
            ax.x.lib.tabable.next(e.target).focus();
          }
        }
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['ax-appkit-form-control'](
    a['ax-appkit-control-easymde'](
      x.easymde({
        ...options,
        textareaTag: {
          name: options.name,
          ...options.textareaTag,
        },
      })
    ),
    controlTagOptions
  );
};

ax.extension.easymde.form.shim = {
  controls: {
    easymde: (f, target) => (options = {}) => (a, x) =>
      x.easymde.form.control(f, options),
  },
};

}));
