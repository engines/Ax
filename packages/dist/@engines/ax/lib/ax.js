// Axf Framework, copyright (c) Lachlan Douglas
// Distributed under an MIT license: https://github.com/engines/Ax/LICENSE.md
;(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.ax = factory();
  }
}(this, function() {

/**
 * Creates an HTML element and inserts it in the DOM.
 * The target for the insertion is the document.body, unless options.target
 * specifies otherwise. options.target can be a selector string or an element.
 * If options.target is false, the element will not be added to the DOM.
 * The default insertion method is to append a child. Set options.method
 * 'replace' to replace the target, or 'prepend' to prepend a child.
 */
let ax = function (component, options = {}) {
  let element = ax.factory(component);
  let target = options.target;
  if (element == null) return;

  let load = () => {
    if (target != false) {
      if (ax.is.undefined(target)) {
        target = window.document.body;
      } else if (ax.is.string(target)) {
        target = window.document.querySelector(target);
      }
      if (options.method == 'replace') {
        target.replaceWith(element);
      } else if (options.method == 'prepend') {
        target.prependChild(element);
      } else {
        target.appendChild(element);
      }
    }
  };

  // Ensure that the document is ready.
  if (document.readyState == 'complete') {
    load();
  } else {
    document.addEventListener('DOMContentLoaded', load);
  }

  return element;
};

/**
 * Creates a <style> tag in <head>.
 */
ax.css = function (styles, options = {}) {
  ax.insert('head', 'style', this.css.styles(styles), {
    tag: options.styleTag,
  });

  return null;
};

/**
 * Process style definitions.
 */
ax.css.styles = function (styles) {
  if (ax.is.string(styles)) {
    return styles;
  } else {
    return ax.css.styles.rules(styles);
  }
};

/**
 * Convert Ax Style Definitions to css style rules.
 */
ax.css.styles.rules = function (styles, selectors = []) {
  if (selectors[0] && selectors[0][0] == '@') {
    return ax.css.styles.rules.at(styles, selectors);
  } else if (ax.is.object(styles)) {
    return ax.css.styles.rules.object(styles, selectors);
  } else {
    return '';
  }
};

/**
 * Handle @ rules.
 */
ax.css.styles.rules.at = function (styleSpec, selectors) {
  let atRule = selectors.shift();
  let rules = this.rules(styleSpec, selectors);
  rules = '\t' + rules.split('\n').join('\n\t');
  return `${atRule} {\n${rules}\n}\n\n`;
};

/**
 * Convert an object containing Ax Style Definition to css style rules.
 */
ax.css.styles.rules.object = function (styles, selectors = []) {
  let result = ax.css.styles.rules.rule(styles, selectors);

  Object.keys(styles).forEach(function (selector) {
    let selected = styles[selector];
    selector.split(',').forEach(function (selectorPart) {
      selectorPart = selectorPart.trim();
      if (selectorPart.match(/^[a-zA-Z]+$/)) {
        // If the selector is simple set of characters, then kebab it.
        // Selectors like '.someClass' stay as they are.
        selectorPart = ax.kebab(selectorPart);
      }
      if (selectorPart[0] == '|') {
        let match = selectorPart.match(/^\|([a-zA-Z0-9-_]*)(.*)/);
        selectorPart = `[data-ax-pseudotag="${match[1]}"]${match[2]}`;
      }
      result += ax.css.styles.rules(selected, selectors.concat(selectorPart));
    });
  });

  return result;
};

/**
 * Convert Ax Style Definition to a css style rule.
 */
ax.css.styles.rules.rule = function (object, selectors) {
  var result = '';
  Object.keys(object).forEach(function (property) {
    if (!ax.is.object(object[property])) {
      result += '\t' + ax.kebab(property) + ': ' + object[property] + ';\n';
    }
  });

  if (result === '') {
    return result;
  } else {
    return (
      selectors.join(' ').replace(/\s*&\s*/g, '') + ' {\n' + result + '}\n'
    );
  }
};

/**
 * Extension loader.
 * Use this method to load Ax Extensions that are are imported as ES6 modules.
 * For example:
 * import ax from '@engines/ax'
 * import axAppkit from '@engines/ax-appkit'
 * import axChartjs from '@engines/ax-chartjs'
 * ax.extend( axAppkit, axChartjs ).
 */
ax.extend = function () {
  for (let extension of arguments) {
    extension.extend(this);
    if (ax.is.function(extension.dependencies)) extension.dependencies(this);
  }
};

/**
 * Extension namespace.
 * Extensions are installed here.
 */
ax.extension = {
  lib: {},
};

/**
 * Alias for shortcut to Ax Extensions.
 */
ax.x = ax.extension;

/**
 * Element Factory.
 * The Element Factory turns a component into an HTML node or a null.
 */
ax.factory = function (component) {
  let is = ax.is;
  let factory = ax.factory;

  if (is.null(component)) return null;
  if (is.node(component)) return component;
  if (is.nodelist(component)) return factory.nodelist(component);
  if (is.array(component)) return factory.array(component);
  if (is.object(component)) return factory.object(component);
  if (is.tag(component)) return factory.tag(component);
  if (is.function(component)) return factory.function(component);
  if (is.undefined(component)) return factory.undefined();
  return factory.text(component);
};

/**
 * Create element from an array of components.
 */
ax.factory.array = function (component) {
  return this.element({
    $nodes: component,
  });
};

/**
 * Create element from Ax component properties.
 */
ax.factory.element = function (properties) {
  properties = {
    $tag: 'span',
    ...properties,
  };

  let element = window.document.createElement(properties.$tag);
  element.$ax = properties;

  return this.element.properties(element);
};

/**
 * Append init script to element.
 */
ax.factory.element.init = function (element) {
  if (ax.is.function(element.$ax.$init)) {
    element.appendChild(
      ax.factory.element({
        $tag: 'script',
        type: 'text/javascript',
        $html:
          '(function(){' +
          'let script=window.document.currentScript;' +
          'let element=script.parentElement;' +
          'script.remove();' +
          'element.$init( element, element.$state );' +
          '})()',
      })
    );
  }

  return element;
};

/**
 * Render active element, with reactive properties.
 */
ax.factory.element.properties = function (element) {
  return this.init(
    this.properties
      .render(
        this.properties.events(
          this.properties.accessors(
            this.properties.tools(this.properties.define(element))
          )
        )
      )
      .$render()
  );
};

/**
 * Add methods to element.
 */
ax.factory.element.properties.accessors = function (element) {
  return this.accessors.nodes(
    this.accessors.html(
      this.accessors.text(
        this.accessors.on(
          this.accessors.off(this.accessors.send(this.accessors.state(element)))
        )
      )
    )
  );
};

/**
 * Get HTML content, or set new HTML content.
 */
ax.factory.element.properties.accessors.html = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$html', {
    get: function () {
      return element.$ax.$html;
    },
    set: function (html) {
      accessors.html.set(element, html);
    },
  });

  return element;
};

/**
 * Render html content.
 */
ax.factory.element.properties.accessors.html.set = function (element, html) {
  delete element.$ax.$text;
  delete element.$ax.$nodes;
  element.$ax.$html = html;
  element.$render();

  return element;
};

/**
 * Get nodes content, or set new nodes content.
 */
ax.factory.element.properties.accessors.nodes = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$nodes', {
    get: function () {
      return element.$ax.$nodes;
    },
    set: function (nodes) {
      accessors.nodes.set(element, nodes);
    },
  });

  return element;
};

/**
 * Render nodes content.
 */
ax.factory.element.properties.accessors.nodes.set = function (element, nodes) {
  delete element.$ax.$text;
  delete element.$ax.$html;
  element.$ax.$nodes = nodes;
  element.$render();

  return element;
};

/**
 * Remove an event listener.
 */
ax.factory.element.properties.accessors.off = function (element) {
  element.$off = function (handle) {
    element.removeEventListener(handle.split(':')[0], element.$events[handle]);

    delete element.$events[handle];
  };

  return element;
};

/**
 * Add an event listener.
 */
ax.factory.element.properties.accessors.on = function (element) {
  element.$on = function (handlers) {
    for (let handle in handlers) {
      element.$off(handle);
      element.$events[handle] = (e) =>
        handlers[handle].call(element, e, element, element.$state);
      element.addEventListener(handle.split(':')[0], element.$events[handle]);
    }
  };

  return element;
};

/**
 * Send an event from the element.
 */
ax.factory.element.properties.accessors.send = function (element) {
  element.$send = function (type, options = {}) {
    return element.dispatchEvent(
      new CustomEvent(type, {
        detail: options.detail || {},
        bubbles: options.bubbles == false ? false : true,
        cancelable: options.cancelable == false ? false : true,
      })
    );
  };

  return element;
};

/**
 * Get element state, or set element state.
 */
ax.factory.element.properties.accessors.state = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$state', {
    get: () => element.$ax.$state,
    set: (state) => accessors.state.set(element, state),
  });

  return element;
};

/**
 * Update state, and render new content.
 */
ax.factory.element.properties.accessors.state.set = function (element, state) {
  if (element.$ax.$state === state) return;

  element.$ax.$state = state;

  if (element.$ax.$update) {
    element.$ax.$update.call(element, element, state) && element.$render();
  } else {
    element.$render();
  }

  return element;
};

/**
 * Get text content, or set new text content.
 */
ax.factory.element.properties.accessors.text = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$text', {
    get: function () {
      return element.$ax.$text;
    },
    set: function (text) {
      accessors.text.set(element, text);
    },
  });

  return element;
};

/**
 * Render text content.
 */
ax.factory.element.properties.accessors.text.set = function (element, text) {
  delete element.$ax.$html;
  delete element.$ax.$nodes;
  element.$ax.$text = text;
  element.$render();

  return element;
};

/**
 * Set properties on element.
 */
ax.factory.element.properties.define = function (element) {
  for (let property in element.$ax) {
    if (element.$ax.hasOwnProperty(property)) {
      if (property[0].match(/[a-zA-Z]/)) {
        let value = element.$ax[property];

        if (ax.is.not.undefined(value)) {
          if (property == 'data') {
            this.define.data(element, value);
          } else if (property == 'style') {
            this.define.style(element, value);
          } else {
            this.define.attribute(element, property, value);
          }
        }
      } else if (property == '$pseudotag') {
        element.dataset.axPseudotag = element.$ax.$pseudotag;
      } else {
        if (
          !element.$ax.active ||
          !property.match(
            /^(\$text|\$nodes|\$html|\$state|\$send|\$on|\$off|\$render|\$ax|$events|\$|\$\$)$/
          )
        ) {
          let customAttribute = element.$ax[property];
          if (ax.is.function(customAttribute)) {
            element[property] = customAttribute.bind(element);
          } else {
            element[property] = customAttribute;
          }
        }
      }
    }
  }

  return element;
};

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

/**
 * Define data attribute on element, with data
 * being a string or an object.
 */
ax.factory.element.properties.define.data = function (element, data) {
  if (ax.is.object(data)) {
    this.data.attribute(element, ['data'], data);
  } else {
    this.attribute(element, 'data', value);
  }
};

/**
 * Make a data attribute from a string or object.
 */
ax.factory.element.properties.define.data.attribute = function (
  element,
  keys,
  value
) {
  if (ax.is.string(value)) {
    let kebab = keys.join('-');
    ax.factory.element.properties.define.attribute(element, kebab, value);
  } else {
    Object.keys(value).forEach(
      function (key) {
        let kebab = ax.kebab(key);
        this.attribute(element, keys.concat(key), value[key]);
      }.bind(this)
    );
  }
};

/**
 * Define style attribute on element, with style
 * being a string or an object.
 */
ax.factory.element.properties.define.style = function (element, style) {
  if (ax.is.object(style)) {
    let result = '';
    Object.keys(style).forEach(
      function (key) {
        let kebab = ax.kebab(key);
        result += kebab + ': ' + style[key] + '; ';
      }.bind(this)
    );
    this.attribute(element, 'style', result);
  } else {
    this.attribute(element, 'style', style);
  }
};

/**
 * Add initial events to element.
 */
ax.factory.element.properties.events = function (element) {
  element.$events = {};

  for (let handle in element.$ax.$on) {
    element.$events[handle] = (e) =>
      element.$ax.$on[handle].call(element, e, element, element.$state);
    element.addEventListener(handle.split(':')[0], element.$events[handle]);
  }

  return element;
};

/**
 * Add appropriate render function to element.
 */
ax.factory.element.properties.render = function (element) {
  let render = this.render;

  element.$render = function () {
    if (element.$ax.hasOwnProperty('$text')) {
      return render.text(element);
    } else if (element.$ax.hasOwnProperty('$html')) {
      return render.html(element);
    } else if (element.$ax.hasOwnProperty('$nodes')) {
      return render.nodes(element);
    } else {
      return element;
    }
  };

  return element;
};

/**
 * Add raw HTML to element.
 */
ax.factory.element.properties.render.html = function (element) {
  // Get content for the element.
  let html = element.$ax.$html;

  if (ax.is.function(html)) {
    html = html.call(element, element, element.$state);
  }

  element.innerHTML = html;

  return element;
};

/**
 * Add child nodes to element.
 */
ax.factory.element.properties.render.nodes = function (element) {
  // Get content for the element.
  let nodes = element.$ax.$nodes;

  if (ax.is.function(nodes)) {
    nodes = nodes.call(element, element, element.$state);
  }

  // Clear existing content
  while (element.firstChild) {
    element.firstChild.remove();
  }

  // Add content
  if (ax.is.array(nodes)) {
    nodes.forEach(function (node) {
      node = ax.factory(node);
      if (node != null) element.appendChild(node);
    });
  } else {
    let node = ax.factory(nodes);
    if (node != null) element.appendChild(node);
  }

  return element;
};

/**
 * Add text to element.
 */
ax.factory.element.properties.render.text = function (element) {
  // Get content for the element.
  let text = element.$ax.$text;

  // Resolve content function, if there is one.
  if (ax.is.function(text)) {
    text = text.call(element, element, element.$state);
  }

  // Clear exisitng content
  while (element.childNodes.length) {
    element.removeChild(element.lastChild);
  }

  // Add new content
  element.appendChild(window.document.createTextNode(text));

  return element;
};

/**
 * Add traverse and query tools to element.
 */
ax.factory.element.properties.tools = function (element) {
  element.$ = this.tools.traverse;
  element.$$ = this.tools.query;

  return element;
};

/**
 * Query Tool, for collecting and operating on groups of elements.
 */
ax.factory.element.properties.tools.query = function (selector) {
  selector = selector.replace(/\|([\w\-]+)/g, '[data-ax-pseudotag="$1"]');

  let collection = Array.from(this.querySelectorAll(selector));

  return ax.factory.element.properties.tools.query.proxy(collection);
};

/**
 * Instantiate the Query Tool proxy.
 */
ax.factory.element.properties.tools.query.proxy = function (
  collection,
  pending = []
) {
  return new Proxy(function () {}, this.proxy.shim(collection, pending));
};

/**
 * Query Tool shim.
 */
ax.factory.element.properties.tools.query.proxy.shim = function (
  collection,
  pending
) {
  return {
    get: ax.factory.element.properties.tools.query.proxy.shim.get(
      collection,
      pending
    ),
    set: ax.factory.element.properties.tools.query.proxy.shim.set(
      collection,
      pending
    ),
    apply: ax.factory.element.properties.tools.query.proxy.shim.apply(
      collection,
      pending
    ),
  };
};

/**
 * Apply a function to selected elements.
 */
ax.factory.element.properties.tools.query.proxy.shim.apply = function (
  collection,
  pending
) {
  return function (target, receiver, args) {
    collection.forEach(function (node, i) {
      collection[i] = pending[i].call(node, ...args);
    });

    return ax.factory.element.properties.tools.query.proxy(collection);
  };
};

/**
 * Get values from selected elements.
 */
ax.factory.element.properties.tools.query.proxy.shim.get = function (
  collection,
  pending
) {
  return function (target, property, receiver) {
    if (/^\d+$/.test(property)) return collection[property];
    if (/^\$\$$/.test(property)) return collection;
    if (/^toArray$/.test(property)) return collection;
    if (/^forEach$/.test(property)) return (fn) => collection.forEach(fn);
    if (/^toString$/.test(property)) return () => collection.toString();

    collection.forEach(function (node, i) {
      let result = node[property];
      if (ax.is.undefined(result)) {
        console.error(`Ax query for '${property}' is undefined on:`, node);
      } else if (ax.is.function(result)) {
        pending[i] = result;
      } else {
        collection[i] = result;
      }
    });

    return ax.factory.element.properties.tools.query.proxy(collection, pending);
  };
};

/**
 * Set a value on selected elements.
 */
ax.factory.element.properties.tools.query.proxy.shim.set = function (
  collection,
  pending
) {
  return function (target, property, value, receiver) {
    collection.forEach(function (node) {
      node[property] = value;
    });

    return true;
  };
};

/**
 * Traverse Tool, for traversing the DOM.
 */
ax.factory.element.properties.tools.traverse = function (...selectors) {
  let result = this;
  selectors.forEach(function (selector) {
    if (ax.is.array(selector)) {
      result = result.$(...selector);
    } else if (/,\s*/.test(selector)) {
      // comma is OR
      let selectors = selector.split(/,\s*/);
      let selected;
      for (let i in selectors) {
        selected = ax.factory.element.properties.tools.traverse.select(
          result,
          selectors[i]
        );
        if (selected) break;
      }
      result = selected;
    } else if (/^\S+$/.test(selector)) {
      // there is a single selector
      result = ax.factory.element.properties.tools.traverse.select(
        result,
        selector
      );
    } else {
      // there must be multiple selectors
      selectors = selector.match(/(\S+)/g);
      result = result.$(...selectors);
    }
  });
  return result;
};

/**
 * Select an element based on traversal instruction.
 */
ax.factory.element.properties.tools.traverse.select = function (
  element,
  selector
) {
  selector = selector.replace(/\|([\w\-]+)/g, '[data-ax-pseudotag="$1"]');

  if (!element) {
    return null;
  } else if (/^\s*\^/.test(selector)) {
    selector = selector.replace(/^\s*\^\s*/, '');
    if (selector) {
      return element.closest(selector);
    } else {
      return element.parentElement;
    }
  } else if (/^\s*$/.test(selector)) {
    return element;
  } else {
    return element.querySelector(selector);
  }
};

/**
 * Create element for a function.
 * Function is called with the Ax Tag Builder and Extensions.
 * The result, which can be any valid component, is fed back
 * into the Factory.
 */
ax.factory.function = function (fn) {
  return this(fn(ax.a, ax.x));
};

/**
 * Create element for a nodelist.
 */
ax.factory.nodelist = function (nodelist) {
  return this.element({
    $nodes: Array.from(nodelist),
  });
};

/**
 * Create element for an object.
 */
ax.factory.object = function (object) {
  return this.element({
    $tag: 'pre',
    $text: JSON.stringify(object, null, 2),
  });
};

/**
 * Create element for an uncalled Tag Builder function.
 * e.g: a.br or a.hr
 */
ax.factory.tag = (component) => component();

/**
 * Create element for text.
 */
ax.factory.text = (component) =>
  window.document.createTextNode(` ${component} `);

/**
 * Create element for undefined content.
 */
ax.factory.undefined = function () {
  return this.element({
    $text: 'UNDEFINED',
    $init: (el) => console.warn('Component is undefined:', el),
  });
};

/**
 * Inserts an element in the DOM.
 */
ax.insert = function (selector, type, content, options = {}) {
  let method = options.method || 'appendChild';
  let tag = window.document.createElement(type);
  Object.assign(tag, options.tag);
  let target = window.document.querySelector(selector);
  tag.innerHTML = content;
  target[method](tag);
};

/**
 * Check value is of a data type.
 */
ax.is = {};

/**
 * Determines whether value is an array.
 */
ax.is.array = function (value) {
  return value instanceof Array;
};

/**
 * Determines whether value is boolean.
 */
ax.is.boolean = function (value) {
  return typeof value === 'boolean';
};

/**
 * Determines whether value is a class.
 */
ax.is.class = function (value) {
  return this.function(value) && ('' + value).slice(0, 5) === 'class';
};

/**
 * Determines whether value is false.
 */
ax.is.false = function (value) {
  return value === false;
};

/**
 * Determines whether value is a function.
 */
ax.is.function = function (value) {
  return typeof value === 'function';
};

/**
 * Determines whether value is an HTML node.
 */
ax.is.node = function (value) {
  return value instanceof Node;
};

/**
 * Determines whether value is an HTML node list.
 */
ax.is.nodelist = function (value) {
  return value instanceof NodeList;
};

/**
 * Determines whether value is not a type.
 */
ax.is.not = new Proxy(
  {},
  {
    get: (target, property, receiver) => {
      if (ax.is.function(ax.is[property])) {
        return (value) => !ax.is[property](value);
      } else {
        console.error(`ax.is does not support .${property}()`);
      }
    },
  }
);

/**
 * Determines whether value is null.
 */
ax.is.null = function (value) {
  return value === null;
};

/**
 * Determines whether value is number.
 */
ax.is.number = function (value) {
  return typeof value === 'number';
};

/**
 * Determines whether value is an object.
 */
ax.is.object = function (value) {
  return typeof value === 'object';
};

/**
 * Determines whether value is a Promise.
 */
ax.is.promise = function (value) {
  return value instanceof Promise;
};

/**
 * Determines whether value is a string.
 */
ax.is.string = function (value) {
  return typeof value === 'string';
};

/**
 * Determines whether value is a Tag Builder Proxy function.
 */
ax.is.tag = function (value) {
  return '' + ax.a.tagProxyFunction === '' + value;
};

/**
 * Determines whether value is true.
 */
ax.is.true = function (value) {
  return value === true;
};

/**
 * Determines whether value is undefined.
 */
ax.is.undefined = function (value) {
  return value === void 0;
};

/**
 * Convert string from camelCase to kebab-case.
 */
ax.kebab = (string) =>
  (string[0].match(/[A-Z]/) ? '-' : '') +
  string.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

/**
 * Tag Builder namespace.
 * The Tag Builder creates arbitrary HTML elements.
 * It is instantiated as `ax.a`.
 */
ax.tag = {};

/**
 * Tag Builder proxy namespace.
 */
ax.tag.proxy = {};

/**
 * Tag Builder proxy function.
 * Accepts an HTML fragment or an object of Ax component properties.
 * Returns an element.
 */
ax.tag.proxy.function = function (component) {
  if (ax.is.string(component)) {
    let jig = window.document.createElement('div');
    jig.innerHTML = component;
    return jig.childNodes;
  }
  if (ax.is.object(component)) {
    return ax.factory.element(component);
  } else {
    console.error('Component must be String or Object.');
  }
};

/**
 * Tag Builder proxy shim.
 * Creates arbitrary HTML elements.
 */
ax.tag.proxy.shim = {
  get: (target, property) => (component = null, attributes = {}) =>
    ax.factory.element({
      ...ax.tag.proxy.shim.attributes(property, attributes),
      ...ax.tag.proxy.shim.component(component),
    }),
};

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

/**
 * Set Ax content property based on component type.
 */
ax.tag.proxy.shim.component = function (component) {
  if (ax.is.tag(component))
    return {
      $nodes: [component],
    };
  if (ax.is.function(component))
    // Handle functions here because
    // the Factory expects any function for $node to be a
    // content function.
    return {
      $nodes: [component(ax.a, ax.x)],
    };
  if (ax.is.string(component))
    return {
      $text: component,
    };
  if (ax.is.null(component)) return {};
  return {
    $nodes: component,
  };
};

/**
 * Tag Builder proxy instantiation.
 */
ax.a = new Proxy(ax.tag.proxy.function, ax.tag.proxy.shim);

/**
 * Throw an error.
 */
ax.throw = function (...args) {
  throw new Error(args);
};

return ax;

}));
