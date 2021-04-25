ax.extension.filepond = (options = {}) => {
  return ax.a['ax-appkit-filepond'](ax.a.input(null, options.inputTag), {
    $init: (el) => {
      ax.x.filepond.FilePond.create(el.$('input'), options.filepond);
    },
    ...options.filepondTag,
  });
};
