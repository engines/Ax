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

ax.extension.filepond = (options = {}) => {
  return ax.a['ax-appkit-filepond'](ax.a.input(null, options.inputTag), {
    $init: (el) => {
      ax.x.filepond.FilePond.create(el.$('input'), options.filepond);
    },
    ...options.filepondTag,
  });
};

ax.style({
  'ax-appkit-filepond': {
    display: 'block',
  },
});

ax.extension.filepond.FilePond = dependencies.FilePond || window.FilePond;

}));
