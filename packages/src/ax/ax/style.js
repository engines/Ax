/**
 * Creates CSS RuleSets from Ax Style Definitions.
 * An Ax Style Definition may be a string or an object.
 */
ax.style = function (...definitions) {
  return definitions
    .flat(Infinity)
    .map((definition) => {
      if (ax.is.object(definition)) {
        return this.style.definition(definition);
      } else {
        return definition;
      }
    })
    .join(' ');
};
