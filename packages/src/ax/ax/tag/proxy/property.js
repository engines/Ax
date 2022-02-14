/**
 * Extract attributes from property.
 */
ax.tag.proxy.property = function (property) {
  // if the property starts with a word, use the word as nodename
  // if the property has a '#' word, use as id
  // if the property has '.' words, use as class
  // if the property has '[]' attrs, use as html tag attributes
  // e.g. div#myTagId.btn.btn-primary

  if (ax.is.not.string(property)) {
    console.error('Expecting a string but got', property);
  }

  let attributes = {};
  let nodename = (property.match(/^([\w-]+)/) || [])[1];
  let id = (property.match(/#([\w-]+)/) || [])[1];
  let classes = [...property.matchAll(/\.([\w-]+)/g)].map(
    match => match[1]
  );
  let attrs = [...property.matchAll(/\[(.*?)=(.*?)\]/g)].map(
    match => [match[1], match[2]]
  );

  if (nodename) attributes.$tag = nodename;
  if (id) attributes.id = id;
  if (classes.length) {
    attributes.class = classes.join(' ');
  }
  for (let attr of attrs) {
    attributes[attr[0]] = JSON.parse(attr[1]);
  }

  return attributes;
};
