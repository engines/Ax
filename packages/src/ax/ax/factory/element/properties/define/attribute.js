/**
 * Define other (i.e. not style or data) attributes on element.
 */
ax.factory.element.properties.define.attribute = function (
  element,
  property,
  value
) {
  let attribute = window.document.createAttribute(ax.kebab(property));
  attribute.value = value;
  element.setAttributeNode(attribute);
};
