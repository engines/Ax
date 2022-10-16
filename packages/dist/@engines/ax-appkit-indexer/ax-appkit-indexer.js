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

ax.extensions.indexer = (options = {}) => {
  return a['ax-appkit-indexer'](

"INDEXER"

  //   a.input(options.inputTag || {}), {
  //   $init: (el) => {
  //     el.$filepond = ax.x.filepond.FilePond.create(
  //       el.$('input'),
  //       options.filepond
  //     );
  //   },
  //   ...options.filepondTag,
  // }


);
};

}));
