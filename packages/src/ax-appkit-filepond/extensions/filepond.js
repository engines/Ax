ax.extensions.filepond = (options = {}) => {
  return a['ax-appkit-filepond'](a.input(options.inputTag || {}), {
    $init: (el) => {
      el.$filepond = ax.x.filepond.FilePond.create(
        el.$('input'),
        options.filepond
      );
    },
    ...options.filepondTag,
  });
};
