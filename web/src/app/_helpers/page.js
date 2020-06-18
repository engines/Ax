const page = (name) => (router) => (a, x) => a['div.container']([page.for(router, name)]);

page.for = (router, name) => {
  let markdown
  if (name.match(/^docs\/.+$/)) {
    markdown = app.Docs[name.replace('docs/', '')];
  } else {
    markdown = app.Docs.readme;
  }

  let sections = markdown.split(
    /<\!--(MARKDOWN|PLAYGROUND|NAVIGATION|README-ONLY)-->\n/
  ) || []

  let mode = 'MARKDOWN'
  let result = [];

  for (let i in sections) {
    if (i % 2 === 0) {
      if (mode === 'MARKDOWN') {
        result.push(app.mdUNSAFE(sections[i]));
      } else if (mode === 'PLAYGROUND') {
        let js = sections[i].match(/(?:.|\n)*```javascript\n((?:.|\n)*)\n```/)[1]
        result.push(app.example(js))
      } else if (mode === 'NAVIGATION') {
        let path
        let split = sections[i].split(/<a\shref="((?:(?!\").)*)\.md">((?:(?!<\/a>).)*)<\/a>/)
        for (let j in split) {
          if (j % 3 === 0) {
            result.push(app.mdUNSAFE(split[j], {inline: true}));
          } else if (j % 3 === 1) {
            path = split[j]
            if (path == '/docs/index' ) path = '/docs'
          } else {
            result.push(
              (a, x) => a.a(split[j], {
                href: '',
                $on: { click: (e) => {
                  e.preventDefault()
                  router.open(path)
                }}
              })
            );
          }
        }
      }
    } else {
      mode = sections[i]
    }
  }

  return result;
};

export default page
