ax.css.ruleset = function (keys, value) {
  if (keys[keys.length - 1][0] == '$') {
    keys.pop();
    return `${this.selector(keys)} {${ax.style(value)}}`;
  } else if (ax.is.object(value)) {
    return this.rulesets(value, keys);
  } else if (ax.is.array(value)) {
    return this.sheet(value, keys);
  } else if (ax.is.string(value)) {
    return `${this.selector(keys)} {${value}}\n`;
  }
};
