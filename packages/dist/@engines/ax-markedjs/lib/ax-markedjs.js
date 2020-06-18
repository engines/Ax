// Axf Framework, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = {
      extend: (ax) => factory(ax)
    };
  } else {
    factory(root.ax)
  }
}(this, function(ax) {

ax.extension.markedjs = {};

ax.extension.markedjs.marked = window.marked;

ax.extension.markedjs.markdown = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let content = options.markdown || '';
  let html;

  let processMarkdown = function (string) {
    string = (string || '').toString();
    if (options.inline) {
      return x.markedjs.marked.inlineLexer(string, options.markedjs);
    } else {
      return x.markedjs.marked(string, options.markedjs);
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

  return a[`${options.inline ? 'span' : 'div'}|ax-markedjs`](a(html), options.markedjsTag);
};

ax.extension.markedjs.report = {};

ax.extension.markedjs.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = x.markedjs.markdown({
      markdown: value,
      markedjsTag: options.markedjsTag,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-report-control'](
    a['|appkit-report-markdown'](component, options.markdownTag),
    {
      'data-name': options.name,
      $value: function () {
        return options.value;
      },

      tabindex: 0,
      $focus: function () {
        this.focus();
      },

      ...options.controlTag,
    }
  );
};

}));
