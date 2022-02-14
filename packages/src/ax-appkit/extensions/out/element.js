ax.extensions.out.element = function (value) {
  let a = ax.a;
  let x = ax.x;

  if (ax.is.array(value)) {
    return a['ax-appkit-out-collection'](
      a.ol(value.map((element) => a.li(x.out.element(element))))
    );
  } else if (ax.is.null(value)) {
    return a['ax-appkit-out-null'](null);
  } else if (ax.is.undefined(value)) {
    return a['ax-appkit-out-undefined'](a.i('UNDEFINED'));
  } else if (ax.is.function(value)) {
    return a['ax-appkit-out-function'](`𝑓 ${value}`);
  } else if (ax.is.object(value)) {
    return a['ax-appkit-out-object'](
      a.ul(
        Object.keys(value).map((key) => {
          return a.li([a.label(key), ' ', x.out.element(value[key])]);
        })
      )
    );
  } else if (ax.is.number(value)) {
    return a['ax-appkit-out-number'](value);
  } else if (ax.is.boolean(value)) {
    return a['ax-appkit-out-boolean'](value);
  } else {
    return a['ax-appkit-out-text'](value);
  }
};
