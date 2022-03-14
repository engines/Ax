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
        style: {display: 'none'},
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
