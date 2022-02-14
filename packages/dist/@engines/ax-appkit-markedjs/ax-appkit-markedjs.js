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

ax.extensions.markedjs = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let content = options.markdown;
  let html;

  let processMarkdown = function (string) {
    string = (string || '').toString();
    if (options.inline) {
      return x.markedjs.marked.inlineLexer(string, options.markedjs);
    } else {
      return x.markedjs.marked.marked(string, options.markedjs);
    }
  };

  if (content instanceof Array) {
    let result = [];
    content.forEach(function (item) {
      result.push(processMarkdown(item));
    });
    html = result.join('');
  } else {
    html = processMarkdown(content);
  }

  if (options.sanitize) {
    html = options.sanitize(html);
  }

  return a({
    $tag: options.inline ? 'span' : 'div',
    $html: html,
    ...options.markedjsTag,
  });
};

ax.extensions.markedjs.marked = dependencies.marked || window.marked;

ax.extensions.markedjs.report = {};

ax.extensions.markedjs.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = x.markedjs({
      markdown: value,
      markedjsTag: options.markedjsTag,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? '' : options.placeholder
    );
  }

  return a['ax-appkit-report-control'](
    a['ax-appkit-report-markdown'](component, options.markdownTag || {}),
    {
      'data-name': options.name,
      $value: (el) => () => {
        return options.value;
      },

      tabindex: 0,
      $focus: (el) => () => {
        el.focus();
      },

      ...options.controlTag,
    }
  );
};

}));
