ax.extension.out.element = function (value) {
  let a = ax.a;
  let x = ax.x;

  if (ax.is.array(value)) {
    return a['|appkit-out-collection'](
      a.ol(value.map((element) => a.li(x.out.element(element))))
    );
  } else if (ax.is.null(value)) {
    return a['|appkit-out-null'](null);
  } else if (ax.is.function(value)) {
    return a['|appkit-out-function'](`𝑓 ${value}`);
  } else if (ax.is.object(value)) {
    return a.ul(
      Object.keys(value).map((key) => {
        return a.li([a.label(key), ' ', x.out.element(value[key])]);
      })
    );
  } else if (ax.is.number(value)) {
    return a['|appkit-out-number'](value);
  } else if (ax.is.boolean(value)) {
    return a['|appkit-out-boolean'](value);
  } else {
    return a['|appkit-out-text'](value);
  }
};
