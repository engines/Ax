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
