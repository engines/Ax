const page = (name) => (router) => (a, x) => a['div.container']([page.for(router, name)]);

page.for = (router, name) => {
  let markdown
  if (name.match(/^docs\/.+$/)) {
    markdown = app.Docs[name.replace('docs/', '')];
  } else {
    markdown = app.Pages[name];
  }

  let sections = markdown.match(
    /<\!--(MARKDOWN|PLAYGOUND|NAVIGATION)-->((?!<\!--\/(MARKDOWN|PLAYGOUND|NAVIGATION)-->).|\n)*<\!--\/(MARKDOWN|PLAYGOUND|NAVIGATION)-->/g
  ) || []

  let result = sections.map((raw) => {
    let match = raw.match(
      /<\!--(MARKDOWN|PLAYGOUND|NAVIGATION)-->\n((?:\n|.)*)\n<\!--\/(MARKDOWN|PLAYGOUND|NAVIGATION)-->/
    )
    let type = match[1]
    let contents = match[2]
    if (type == 'MARKDOWN') {
      return app.mdUNSAFE(contents)
    } else if ( type == 'EXAMPLE' ) {
      let js = contents.match(/```javascript\n((?:.|\n)*)\n```/)[1]
      return app.example(js)
    } else {
      let href = contents.match(/href="(.*)"/)[1]
      let inner = contents.match(/<a.*>(.*)<\/a>/)[1]
      return (a, x) => a.a(inner, {
        href: '',
        $on: { click: (e) => {
          e.preventDefault()
          router.open(href)
        }}
      })
    }
  })

  return result;
};

export default page
