ax.style.definition = function (definition, keys = []) {


  return Object.entries(definition)
    .map(([key, value]) => {
      if (ax.is.undefined(value)) {
        return ''
      } else if (ax.is.object(value)) {
        return ax.style.definition(value, [...keys, key]);
      } else {
        return `${ax.kebab(...keys, key)}: ${value};`;
      }
    })
    .join(' ');
};
