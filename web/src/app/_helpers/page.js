const page = (name) => (a, x) => a['div.container']([page.for(name)]);

page.for = (name) => {
  let raw = app.Pages[name];
  let blocks = raw.split(/```javascript\n(.*)\n```/);
  const result = [];

  for (let i in blocks) {
    if (i % 2 === 0) {
      result.push(app.md(blocks[i]));
    } else {
      result.push(app.example(blocks[i]));
    }
  }
  return result;
};

export default page
