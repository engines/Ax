import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

const icon = (klass, text, options = {}) => {
  var nodes = [a.span([], { class: klass })];

  if (text) {
    if (!options.compact) nodes.push(" ");
    nodes.push(text);
  }

  if (options.reverse) {
    nodes.reverse();
  }

  let iconTag = {
    style: { whiteSpace: "nowrap" },
    ...options.iconTag,
  };

  return a["app-icon"](nodes, iconTag);
};

export default icon;
