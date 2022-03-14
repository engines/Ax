ax.extensions.markedjs = function (options = {}) {
  let markdown = options.markdown;
  let html;

  let processMarkdown = function (string) {
    string = (string || '').toString();
    if (options.inline) {
      return x.markedjs.marked.parseInline(string, options.markedjs);
    } else {
      return x.markedjs.marked.parse(string, options.markedjs);
    }
  };

  if (markdown instanceof Array) {
    let result = [];
    markdown.flat(Infinity).forEach(function (item) {
      result.push(processMarkdown(item));
    });
    html = result.join('');
  } else {
    html = processMarkdown(markdown);
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
