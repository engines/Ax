import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";

const icon = (klass, text, options = {}) => (a, x) => {
  var component = [a.span(null, { class: klass })];

  if (text) {
    if (!options.compact) component.push(" ");
    component.push(text);
  }

  if (options.reverse) {
    component.reverse();
  }

  let iconTag = {
    style: { whiteSpace: "nowrap" },
    ...options.iconTag,
  };

  return a["app-icon"](component, iconTag);
};

export default icon;
