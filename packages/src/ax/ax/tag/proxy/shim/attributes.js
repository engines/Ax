/**
 * Line-up the attributes for an element.
 */
ax.tag.proxy.shim.attributes = function (property, attributes) {
  // if the property starts with a word, use the word as nodename
  // if the property has a '|' word, use as pseudotag
  // if the property has a '#' word, use as id
  // if the property has '.' words, use as class
  // if the property has '[]' attrs, use as attributes
  // e.g. div#myTagId.btn.btn-primary

  let nodename = (property.match(/^([\w-]+)/) || [])[1];
  let pseudotag = (property.match(/\|([\w-]+)/) || [])[1];
  let id = (property.match(/#([\w-]+)/) || [])[1];
  let classes = property.match(/\.[\w-]+/g) || [];
  let attrs = property.match(/\[.*?\]/g) || [];

  if (nodename) attributes.$tag = attributes.$tag || nodename;
  if (pseudotag) attributes.$pseudotag = attributes.$pseudotag || pseudotag;
  if (id) attributes.id = attributes.id || id;
  for (let klass of classes) {
    attributes.class = `${klass.replace('.', '')} ${
      attributes.class || ''
    }`.trim();
  }
  for (let attr of attrs) {
    let match = attr.match(/^\[([\w-]+)\=(.*)\]/);
    attributes[match[1]] = JSON.parse(match[2]);
  }
  return attributes;
};
