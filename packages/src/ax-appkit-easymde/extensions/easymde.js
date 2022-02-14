ax.extensions.easymde = (options = {}) => (a, x) =>
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
      'keydown: check for editor exit': (el) => (e) => {
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
