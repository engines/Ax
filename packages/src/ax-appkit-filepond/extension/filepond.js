ax.extension.filepond = (options = {}) => {
  return ax.a['ax-appkit-filepond'](null, {
    $init: (el) => {
      el.$nodes = ax.x.filepond.FilePond.create({
        ...options.filepond,
      }).element;
    },

    ...options.filepondTag,
  });
};
