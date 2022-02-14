ax.extensions.filepond = (options = {}) => {
  return ax.a['ax-appkit-filepond'](ax.a.input(options.inputTag || {}), {
    $init: (el) => {
      el.$filepond = ax.x.filepond.FilePond.create(
        el.$('input'),
        options.filepond
      );
    },
    ...options.filepondTag,
  });
};
