const page = (name) => (router) => (a, x) => a['div.container']([page.for(router, name)]);

page.for = (router, name) => {
  let markdown
  if (name.match(/^docs\/.+$/)) {
    markdown = app.Docs[name.replace('docs/', '')];
  } else {
    markdown = app.Docs.readme;
  }

  let sections = markdown.split(
    /<\!--(MARKDOWN|PLAYGROUND|NAVIGATION)-->\n/g
  ) || []


  let mode = 'MARKDOWN'
  let result = [];
// debugger
  for (let i in sections) {
    if (i % 2 === 0) {
      if (mode === 'MARKDOWN') {
        result.push(app.mdUNSAFE(sections[i]));
      } else if (mode === 'PLAYGROUND') {
        let js = sections[i].match(/(?:.|\n)*```javascript\n((?:.|\n)*)\n```/)[1]
        result.push(app.example(js))
      } else {
        let path = sections[i].match(/href="(.*)\.md"/)[1]
        // debugger
        if (path == '/docs/index' ) path = '/docs'
        let inner = sections[i].match(/<a.*>(.*)<\/a>/)[1]
        result.push(
          (a, x) => a.a(inner, {
            href: '',
            $on: { click: (e) => {
              e.preventDefault()
              router.open(path)
            }}
          })
        );
      }
    } else {
      mode = sections[i]
    }
  }

  // for (let i in blocks) {
  //   if (i % 3 === 0) {
  //     result.push(app.md(blocks[i]));
  //     comment = ''
  //   } else if (i % 3 === 1) {
  //     comment = blocks[i]
  //   } else {
  //     if (comment == 'EXAMPLE') {
  //       result.push(app.example(blocks[i]));
  //     } else if (comment == 'LINK') {
  //       result.push();
  //     } else {
  //       result.push(app.md(blocks[i]));
  //     }
  //   }
  // }

  //
  // let result = sections.map((raw) => {
  //   let match = raw.match(
  //     /<\!--(MARKDOWN|PLAYGOUND|NAVIGATION)-->\n((?:\n|.)*)\n<\!--\/(MARKDOWN|PLAYGOUND|NAVIGATION)-->/
  //   )
  //   let type = match[1]
  //   let contents = match[2]
  //   if (type == 'MARKDOWN') {
  //     return app.mdUNSAFE(contents)
  //   } else if ( type == 'EXAMPLE' ) {
  //     let js = contents.match(/```javascript\n((?:.|\n)*)\n```/)[1]
  //     return app.example(js)
  //   } else {
  //     let href = contents.match(/href="(.*)"/)[1]
  //     let inner = contents.match(/<a.*>(.*)<\/a>/)[1]
  //     return (a, x) => a.a(inner, {
  //       href: '',
  //       $on: { click: (e) => {
  //         e.preventDefault()
  //         router.open(href)
  //       }}
  //     })
  //   }
  // })

  return result;
};

export default page
