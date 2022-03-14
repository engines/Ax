// /**
//  * Extract properties from tag property.
//  */
ax.node.create.element.tag = function (tag) {
  // if the tag starts with a word, use the word as nodename
  // if the tag has a '#' word, use as id
  // if the tag has '.' words, use as class
  // if the tag has '[]' attrs, use as html tag properties
  // e.g. div#myTagId.btn.btn-primary

  let properties = {};

  let nodename = (tag.match(/^([\w-]+)/) || [])[1];
  let id = (tag.match(/#([\w-]+)/) || [])[1];
  let classes = [...tag.matchAll(/\.([\w-]+)/g)].map(
    match => match[1]
  );
  let attrs = [...tag.matchAll(/\[(.*?)=(.*?)\]/g)].map(
    match => [match[1], match[2]]
  );

  properties.$tag = nodename || 'span';
  if (id) properties.id = id;
  if (classes.length) {
    properties.class = classes.join(' ');
  }
  for (let attr of attrs) {
    properties[attr[0]] = JSON.parse(attr[1]);
  }

  return properties;
};
