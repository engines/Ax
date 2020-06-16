ax.extension.lib.object.assign = function (object, keys, value) {
  let key = keys[0];
  let depth = keys.length;

  if (depth === 1) {
    // Assign the value if no nesting.

    if (key === '') {
      object.push(value);
    } else {
      object[key] = value;
    }
  } else {
    // Assign nested value

    // Look ahead to next key
    let next = keys[1];

    if (key === '') {
      // Build a collection
      let index = object.length - 1;
      let current = object[index];
      if (
        ax.is.object(current) &&
        (depth > 2 || ax.is.undefined(current[next]))
      ) {
        // Add to current item
        key = index;
      } else {
        // Start building next item
        key = index + 1;
      }
    }

    // Create empty object if needed
    if (ax.is.undefined(object[key])) {
      if (next === '') {
        object[key] = [];
      } else {
        object[key] = {};
      }
    }

    // Do next layer of nesting
    this.assign(object[key], keys.slice(1), value);
  }
};
