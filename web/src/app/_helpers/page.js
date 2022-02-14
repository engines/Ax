const page = (router) => (a, x) => {
  return a["div.container"]([page.for(router)]);
}

page.for = (router) => {
  return (a, x) => {
    let name = router.path
    let markdown;

    if (name.match(/^\/docs\/.+$/)) {
      markdown = app.Docs[name.replace("/docs/", "")];
    } else if (name.match(/^\/docs/)) {
      markdown = app.Docs.index;
    } else {
      markdown = app.Docs.readme;
    }

    if (!markdown) return a['.error'](`No page for '${name}'`)

    let mode = "MARKDOWN";
    let nodes = [];

    let sections =
      markdown.split(/<\!--(MARKDOWN|PLAYGROUND|README-ONLY)-->\n/) || [];

    for (let i in sections) {
      if (i % 2 === 0) {
        if (mode === "MARKDOWN") {
          nodes.push(app.mdUNSAFE(sections[i]));
        } else if (mode === "PLAYGROUND") {
          let js = sections[i].match(
            /(?:.|\n)*~~~javascript\n((?:.|\n)*)\n~~~/
          )[1];
          nodes.push(app.example(js));
        }
      } else {
        mode = sections[i];
      }
    }

    return a["app-markdown-page"](nodes, {
      $on: {
        click: (el) => (e) => {
          if (e.target.classList.contains("app-navigation")) {
            e.preventDefault();
            let path = e.target.attributes.href.value.replace(/\.[^/.]+$/, "");
            if (path == "/docs/index") path = "/docs";
            router.open(path);
          }
        },
      },
    });
  }
};

export default page;
