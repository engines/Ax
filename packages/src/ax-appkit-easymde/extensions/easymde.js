ax.extensions.easymde = (options = {}) =>
  a['ax-appkit-easymde'](
    a.textarea(options.value || '', {
      $init: (el) => {
        el.$easymde = new x.easymde.EasyMDE({
          element: el,
          toolbar: x.easymde.toolbar(),
          placeholder: options.placeholder,
          autoDownloadFontAwesome: false,
          ...options.easymde,
        });
        setTimeout(() => {
          el.$easymde.codemirror.refresh();
        }, 0);
        // el.$observer = new IntersectionObserver((entries) => {
        //   console.log(entries)
        //   // if (!el.$easymde) {
        //   // }
        // }, {});
        // el.$observer.observe(el);
      },
      $exit: (el) => {
        // el.$observer.disconnect();
        // el.$observer = null;
        el.$easymde = null;
      },
      ...options.textareaTag,
      $updateValue: (el) => () => {
        el.value = el.$easymde.value();
      },
      $on: {
        'keydown: check for editor exit': (e) => {
          let el = e.currentTarget;
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
