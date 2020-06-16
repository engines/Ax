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

ax.extension.appkit = {};

ax.extension.button = function (options = {}) {
  let a = ax.a;

  let handler = options.onclick || (() => {});

  let label = a['appkit-button-label'](options.label || '', {
    style: {
      pointerEvents: 'none',
    },
  });

  let confirmation;

  if (ax.is.string(options.confirm)) {
    confirmation = () => confirm(options.confirm);
  } else if (ax.is.function(options.confirm)) {
    confirmation = (el) => confirm(options.confirm(el));
  } else if (options.confirm) {
    confirmation = () => confirm('Are you sure?');
  } else {
    confirmation = () => true;
  }

  let buttonTag = {
    type: options.type || 'button',
    name: options.name,
    value: options.value,
    ...options.buttonTag,
    $on: {
      'click: button onclick': function (e) {
        confirmation(this) && handler.bind(this)(e, this, this.$state);
      },
      ...(options.buttonTag || {}).$on,
    },
  };

  return a.button(label, buttonTag);
};

ax.extension.check = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let inputId =
    x.lib.object.dig(options, ['inputTag', 'id']) || x.lib.uuid.generate();

  let inputTagOptions = {
    type: options.type || 'checkbox',
    name: options.name,
    value: options.checked === '' ? '' : options.checked || 'on',
    required: options.required,
    onclick: options.readonly ? 'return false' : 'return true',
    checked: options.value ? 'checked' : undefined,
    ...options.inputTag,
    id: inputId,
  };

  let labelTagOptions = {
    for: inputId,
    ...options.labelTag,
  };

  return a['|appkit-check'](
    [
      a.input(null, inputTagOptions),
      a.label(options.label || '', labelTagOptions),
    ],
    options.checkTag
  );
};

ax.extension.cycle = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let period = options.period || 500;
  let collection = options.collection || '⣯⣟⡿⢿⣻⣽⣾⣷';

  let max = collection.length - 1;

  let cycleTag = {
    $state: 0,
    $nodes: (el, i) => collection[i],
    $init: function () {
      let target = this;
      let cycle = function () {
        setTimeout(function () {
          if (target.$state === max) {
            target.$state = 0;
          } else {
            target.$state++;
          }
          cycle();
        }, period);
      };
      cycle();
    },
    ...options.cycleTag,
  };

  return a['|appkit-cycle'](null, cycleTag);
};

ax.extension.form = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let f = this.form.factory({
    scope: options.scope,
    object: options.object,
    formOptions: options,
  });

  return f.form(options);
};

ax.extension.form.factory = function (options) {
  let shims = [this.shim, ...(options.formOptions.shims || [])];

  return new (function () {
    let proxy = function (factory, base = {}, shim = {}) {
      return new Proxy(base, {
        get: (target, property) => {
          let object = target[property];
          if (ax.is.function(shim[property])) {
            return shim[property](factory.target, object);
          } else if (ax.is.object(shim[property])) {
            return proxy(factory, object, shim[property]);
          } else {
            return object;
          }
        },
      });
    };

    this.target = options;

    for (let i in shims) {
      this.target = proxy(this, this.target, shims[i]);
    }

    return this.target;
  })();
};

ax.extension.form.factory.button = function (options = {}) {
  let x = ax.x;

  return x.button(options);
};

ax.extension.form.factory.cancel = (f, options = {}) => {
  let label = options.label || '✖️ Cancel';

  let onclick =
    options.onclick ||
    (() =>
      console.warn('Form cancel button does not have an onclick handler.'));

  let buttonOptions = {
    label: label,
    name: options.name,
    value: options.value,
    onclick: onclick,
    to: options.to,
    title: options.title,
    buttonTag: options.buttonTag,
    ...options.button,
  };

  return f.button(buttonOptions);
};

ax.extension.form.factory.checkbox = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-checkbox'](
    x.check({
      name: options.name,
      value: options.value,
      type: options.type,
      label: options.label,
      checked: options.checked,
      required: options.required,
      readonly: options.readonly,
      inputTag: options.inputTag,
      labelTag: options.labelTag,
      checkTag: options.checkTag,
    }),
    options.checkboxTag
  );
};

ax.extension.form.factory.checkboxes = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = x.lib.form.collection.value(options.value);
  let selections = x.lib.form.selections(options.selections);

  return a['appkit-form-checkboxes'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        name: `${options.name}[]`,
        value: value.includes(selection.value) ? selection.value : '',
        label: label,
        checked: selection.value,
        readonly: options.readonly,
        inputTag: {
          ...(options.disabled || selection.disabled
            ? {
                disabled: 'disabled',
              }
            : {}),
          ...options.inputTag,
        },
        labelTag: options.labelTag,
        checkTag: options.checkTag,
      });
    }),
    options.checkboxesTag
  );
};

ax.extension.form.factory.form = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let form = options.form || (() => null);

  let formTagOptions = {
    method: options.method || 'POST',
    action: options.url || options.action,
    $formData: function () {
      return new FormData(this);
    },
    $data: function () {
      return x.lib.form.data.objectify(this.$formData());
    },
    ...options.formTag,
  };

  return a.form(form(f), formTagOptions);
};

ax.extension.form.factory.input = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let datalist = null;
  let datalistId;

  if (options.datalist) {
    datalistId = x.lib.uuid.generate();
    datalist = a.datalist(
      options.datalist.map((item) =>
        a.option(null, {
          value: item,
        })
      ),
      {
        id: datalistId,
      }
    );
  }

  let inputTagOptions = {
    name: options.name,
    value: options.value,
    type: options.type,
    required: options.required,
    readonly: options.readonly,
    pattern: options.pattern,
    minlength: options.minlength,
    maxlength: options.maxlength,
    min: options.min,
    max: options.max,
    step: options.step,
    placeholder: options.placeholder,
    autocomplete: options.autocomplete,
    multiple: options.multiple,
    list: datalistId,
    ...options.inputTag,
  };

  return a['|appkit-form-input-wrapper'](
    [a.input(null, inputTagOptions), datalist],
    options.wrapperTag
  );
};

ax.extension.form.factory.radios = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = options.value || '';

  let selections = x.lib.form.selections(options.selections);

  return a['|appkit-form-radios'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        type: 'radio',
        name: options.name,
        value: value == selection.value ? true : false,
        label: label,
        checked: selection.value,
        required: options.required,
        readonly: options.readonly,
        inputTag: {
          ...(options.disabled || selection.disabled
            ? {
                disabled: 'disabled',
              }
            : {}),
          ...options.inputTag,
        },
        labelTag: options.labelTag,
        checkTag: options.checkTag,
      });
    }),
    options.radiosTag
  );
};

ax.extension.form.factory.select = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let applyPlaceholder = (el) => {
    let selected = el.$$('option')[el.selectedIndex];
    if (selected.classList.contains('placeholder')) {
      el.classList.add('placeholder');
    } else {
      el.classList.remove('placeholder');
    }
  };

  let selectTagOptions = {
    name: options.name,
    value: options.value,
    required: options.required,
    readonly: options.readonly,
    multiple: options.multiple,
    ...options.selectTag,
    $init: (el) => applyPlaceholder(el),
    $on: {
      'change: update placeholder styling': (e, el) => applyPlaceholder(el),
      ...(options.selectTag || {}).$on,
    },
  };

  return a['|appkit-form-select-wrapper'](
    a.select(this.select.options(options), selectTagOptions),
    options.wrapperTag
  );
};

ax.extension.form.factory.select.options = function (options) {
  let a = ax.a;
  let x = ax.x;

  let selections = x.lib.form.selections(options.selections);

  if (options.placeholder) {
    selections.unshift({
      value: '',
      label: options.placeholder,
      class: 'placeholder',
    });
  }

  return selections.map(function (selection) {
    let optionsTagOptions = {
      ...options.optionTag,
      ...selection.optionTag,
    };

    if (selection.disabled == 'hr') {
      return a.option('—————', {
        value: selection.value,
        disabled: 'disabled',
        ...optionsTagOptions,
      });
    } else if (selection.disabled == 'br') {
      return a.option('', {
        value: selection.value,
        disabled: 'disabled',
        ...optionsTagOptions,
      });
    } else {
      let value = options.value;
      let selected;

      if (ax.is.array(value)) {
        selected = value.some(function (value) {
          return value == selection.value;
        });
      } else {
        selected = value == selection.value;
      }

      return a.option(selection.label, {
        value: selection.value,
        selected: selected || undefined,
        disabled: selection.disabled,
        class: selection.class,
        ...optionsTagOptions,
      });
    }
  });
};

ax.extension.form.factory.submit = (f, options = {}) => {
  let label = options.label === false ? '' : options.label || '✔ Submit';

  let buttonOptions = {
    label: label,
    type: 'submit',
    name: options.name,
    value: options.value,
    onclick: options.onclick,
    title: options.title,
    buttonTag: options.buttonTag,
    ...options.button,
  };

  return f.button(buttonOptions);
};

ax.extension.form.factory.textarea = function (options = {}) {
  let a = ax.a;

  let value = options.value || '';

  let textareaTagOptions = {
    name: options.name,
    required: options.required,
    readonly: options.readonly,
    placeholder: options.placeholder,
    ...options.textareaTag,
  };

  return a['|appkit-form-textarea-wrapper'](
    a.textarea(value, textareaTagOptions),
    options.wrapperTag
  );
};

ax.extension.form.shim = {
  input: (f) => (options) => ax.x.form.factory.input(options),
  select: (f) => (options) => ax.x.form.factory.select(options),
  textarea: (f) => (options) => ax.x.form.factory.textarea(options),
  checkbox: (f) => (options) => ax.x.form.factory.checkbox(options),
  checkboxes: (f) => (options) => ax.x.form.factory.checkboxes(options),
  radios: (f) => (options) => ax.x.form.factory.radios(options),
  button: (f) => (options) => ax.x.form.factory.button(options),
  form: (f) => (options) => ax.x.form.factory.form(f, options),
  submit: (f) => (options) => ax.x.form.factory.submit(f, options),
  cancel: (f) => (options) => ax.x.form.factory.cancel(f, options),
};

ax.extension.http = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let singleRequest;
  let urls = options.url;

  if (ax.is.not.array(urls)) {
    singleRequest = true;
    urls = [urls];
  }
  let customCallbacks = options.when || {};

  let responsesSuccess = function (responses, el) {
    el.$send('ax.appkit.http.success');

    if (options.success) {
      Promise.all(
        responses.map((response) => contentPromiseFor(response))
      ).then((responses) => {
        if (singleRequest) {
          options.success.bind(el)(responses[0], el);
        } else {
          options.success.bind(el)(responses, el);
        }
      });
    } else {
      el.$nodes = responses.map((response) =>
        a['|appkit-http-response.success'](null, {
          $init: (el) => defaultContent(response, el),
        })
      );
    }
  };

  let responseError = (response, el) => {
    el.$send('ax.appkit.http.error');

    if (options.error) {
      options.error.bind(el)(response, el);
    } else {
      el.$nodes = a[`|appkit-http-response.error`](null, {
        $init: (el) => defaultContent(response, el),
      });
    }
  };

  let defaultContent = (response, el) => {
    let contentType = response.headers.get('content-type');

    if (contentType) {
      contentType = contentType.split(';')[0];

      let contentHandler = customCallbacks[contentType];

      if (contentHandler) {
        contentHandler.bind(el)(response, el);
      } else {
        el.$nodes = a({
          $init: componentFor(contentType, response),
        });
      }
    }
  };

  let contentPromiseFor = (response) => {
    let contentType = response.headers.get('content-type');

    if (contentType) {
      contentType = contentType.split(';')[0];
      if (contentType == 'application/json') {
        return response.json();
      } else {
        return response.text();
      }
    } else {
      return null;
    }
  };

  let componentFor = (contentType, response) => {
    if (contentType == 'application/json') {
      return (el) =>
        contentPromiseFor(response).then((content) => (el.$nodes = content));
    } else if (contentType == 'text/html') {
      return (el) =>
        contentPromiseFor(response).then((content) => (el.$html = content));
    } else if (contentType == 'text/plain') {
      return (el) =>
        contentPromiseFor(response).then(
          (content) => (el.$nodes = a.pre(content))
        );
    } else {
      return (el) =>
        contentPromiseFor(response).then((content) => (el.$text = content));
    }
  };

  return a['|appkit-http'](options.placeholder || null, {
    $init: (el) => {
      el.$send('ax.appkit.http.start');

      let optionFor = (key, i) => {
        if (ax.is.array(options[key])) {
          return options[key][i];
        } else {
          return options[key];
        }
      };

      Promise.all(
        urls.map((url, i) => {
          let query = optionFor('query', i);

          if (query) {
            url = `${url}?${x.lib.query.from.object(query)}`;
          }

          return fetch(url, {
            method: optionFor('method', i),
            headers: optionFor('headers', i),
            body: optionFor('body', i),
            ...optionFor('fetch', i),
          });
        })
      )
        .then((responses) => {
          let hadError;

          for (let i in responses) {
            let response = responses[i];

            if (response.status < 200 || response.status >= 300) {
              let statusErrorCallback = customCallbacks[response.status];

              if (statusErrorCallback) {
                statusErrorCallback.bind(el)(response, el);
              } else {
                responseError(response, el);
              }

              console.warn(
                `Received HTTP status ${response.status} when fetching ${
                  optionFor('method', i) || 'GET'
                } ${response.url}.`
              );

              hadError = true;
              break; // Exit promise on first error.
            }
          }

          if (!hadError) responsesSuccess(responses, el);
        })
        .catch((error) => {
          console.error('Ax appkit http error.', error.message, el);
          if (options.catch) options.catch(error, el);
        })
        .finally(() => {
          // el is ususally removed from DOM by callback,
          // so get parent for sending complete event and calling complete fn.
          let parent = el.$('^');
          if (options.complete) {
            options.complete.bind(parent)(parent);
          }
          // Parent sometimes removed too, by complete fn,
          // or when router navigates away.
          if (parent) parent.$send('ax.appkit.http.complete');
        });
    },
    ...options.httpTag,
  });
};

ax.extension.lib.animate = {};

ax.extension.lib.animate.fade = {};

ax.extension.lib.animate.fade.in = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.display = options.display || 'block';
  el.style.transition = `opacity ${duration}ms linear`;

  let complete = () => {
    if (options.complete) options.complete(el);
  };

  setTimeout(() => (el.style.opacity = 1), 0);
  setTimeout(complete, duration);
};

ax.extension.lib.animate.fade.out = function (el, options = {}) {
  let duration = options.duration || 250;
  el.style.transition = `opacity ${duration}ms linear`;

  let complete = () => {
    el.style.display = 'none';
    if (options.complete) options.complete(el);
  };

  setTimeout(() => (el.style.opacity = 0), 0);
  setTimeout(complete, duration);
};

ax.extension.lib.animate.fade.toggle = function (el, options = {}) {
  if (el.style.display === 'none') {
    this.in(el, options);
  } else {
    this.out(el, options);
  }
};

ax.extension.lib.array = {};

ax.extension.lib.coerce = {};

ax.extension.lib.coerce.boolean = function (value) {
  value = value || false;
  let string = value.toString().toLowerCase();
  return value && string !== 'false' && string !== 'off' && string !== '0';
};

ax.extension.lib.coerce.number = function (value) {
  return Number(value) || 0;
};

ax.extension.lib.coerce.string = function (value) {
  return ax.is.undefined(value) ? '' : String(value);
};

ax.extension.lib.compact = function (value) {
  let compact = ax.x.lib.compact;

  if (ax.is.array(value)) {
    return compact.array(value);
  } else if (ax.is.object(value)) {
    return compact.object(value);
  } else if (['', undefined, null].includes(value)) {
    return null;
  } else {
    return value;
  }
};

ax.extension.lib.compact.array = function (array) {
  return array.map((value) => this(value)).filter((value) => value != null);
};

ax.extension.lib.compact.object = function (object) {
  for (const key in object) {
    object[key] = this(object[key]);
    if (
      object[key] === null ||
      (ax.is.object(object[key]) && Object.keys(object[key]).length === 0) ||
      (ax.is.array(object[key]) && object[key].length === 0)
    )
      delete object[key];
  }

  return object;
};

ax.extension.lib.element = {};

ax.extension.lib.element.visible = function (element) {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
};

ax.extension.lib.form = {};

ax.extension.lib.form.collection = {};

ax.extension.lib.form.collection.value = function (value) {
  if (ax.is.array(value)) {
    return value;
  } else if (value) {
    return [value];
  } else {
    return [];
  }
};

ax.extension.lib.form.data = {};

ax.extension.lib.form.data.objectify = function (data) {
  let x = ax.x;
  let object = {};

  for (var pair of data.entries()) {
    x.lib.object.assign(object, x.lib.name.dismantle(pair[0]), pair[1]);
  }

  return object;
};

ax.extension.lib.form.selections = function (selections) {
  if (ax.is.array(selections)) {
    selections = selections.map(function (selection) {
      if (ax.is.array(selection)) {
        return {
          value: selection[0],
          label: selection[1],
          disabled: selection[2],
        };
      } else if (ax.is.object(selection)) {
        return {
          value: selection.value,
          label: selection.label,
          disabled: selection.disabled,
        };
      } else {
        return {
          value: selection,
          label: selection,
        };
      }
    });
  } else {
    selections = Object.keys(selections || {}).map(function (key) {
      let label = selections[key];
      return {
        value: key,
        label: label,
      };
    });
  }

  return selections;
};

ax.extension.lib.name = {};

ax.extension.lib.name.dismantle = (string) =>
  (string.match(/\w+|\[\w*\]|\[\.\.\]/g) || []).map((part) =>
    part.replace(/\[|\]/g, '')
  );

ax.extension.lib.object = {};

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

ax.extension.lib.object.dig = function (
  object,
  keys = [],
  defaultValue = null
) {
  let result = object;

  for (let key in keys) {
    if (result == null) {
      return defaultValue;
    } else {
      result = result[keys[key]] || null;
    }
  }

  return result || defaultValue;
};

ax.extension.lib.query = {};

ax.extension.lib.query.from = {};

ax.extension.lib.query.from.object = function (object, options = {}) {
  var queryString = [];
  var property;

  for (property in object) {
    if (object.hasOwnProperty(property)) {
      var k = options.prefix ? options.prefix + '[' + property + ']' : property,
        v = object[property];
      queryString.push(
        v !== null && ax.is.object(v)
          ? this.object(v, {
              prefix: k,
            })
          : encodeURIComponent(k) + '=' + encodeURIComponent(v)
      );
    }
  }
  return queryString.join('&');
};

ax.extension.lib.query.to = {};

ax.extension.lib.query.to.object = function (queryString) {
  var result = {};

  if (queryString) {
    queryString.split('&').map(function (pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1]);
    });
  }

  return result;
};

ax.extension.lib.tabable = function (element) {
  if (element.tabIndex >= 0 && ax.x.lib.element.visible(element)) {
    return true;
  } else {
    return false;
  }
};

ax.extension.lib.tabable.next = function (element) {
  let elements = Array.from(window.document.querySelectorAll('*'));

  // start search at last child element
  element = Array.from(element.querySelectorAll('*')).slice(-1)[0] || element;

  let index = elements.indexOf(element);
  let count = elements.length;
  let target;
  let tabable;

  let i = index;
  do {
    i++;
    if (i === count) i = 0;
    if (i === index) return element;
    target = elements[i];
    tabable = this(target);
  } while (!tabable);

  return target;
};

ax.extension.lib.tabable.previous = function (element) {
  let elements = Array.from(window.document.querySelectorAll('*'));

  let index = elements.indexOf(element);
  let count = elements.length;
  let target;
  let tabable;

  let i = index;
  do {
    i--;
    if (i === 0) i = count - 1;
    if (i === index) return element;
    target = elements[i];
    tabable = this(target);
  } while (!tabable);

  return target;
};

ax.extension.lib.text = {};

ax.extension.lib.text.capitalize = function (string = '') {
  return string.toString().charAt(0).toUpperCase() + string.slice(1);
};

ax.extension.lib.text.humanize = function (string = '') {
  return string.toString().replace(/_/g, ' ');
};

ax.extension.lib.text.labelize = function (string = '') {
  return this.capitalize(this.humanize(string));
};

ax.extension.lib.unnested = function (el, tag) {
  let controls = el.$$(tag).$$;
  let result = [];

  controls.forEach(function (el1, i) {
    let nested;
    controls.forEach(function (el2) {
      if (!el1.isSameNode(el2) && el2.contains(el1)) {
        nested = true;
      }
    });
    if (!nested) {
      result.push(el1);
    }
  });

  return result;
};

ax.extension.lib.uuid = {};

ax.extension.lib.uuid.generate = function () {
  return '00000000-0000-4000-0000-000000000000'.replace(/0/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

ax.extension.out = function (value, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let component;

  if (value) {
    if (options.parse) {
      if (ax.is.string(value)) {
        try {
          component = x.out.element(JSON.parse(value));
        } catch (error) {
          component = a['.error'](`⚠ ${error.message}`);
        }
      } else {
        component = a['.error'](`⚠ Not a string.`);
      }
    } else {
      component = x.out.element(value);
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-out'](component, options.outTag);
};

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

ax.extension.report = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let r = this.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options,
  });

  return r.report(options);
};

ax.extension.report.factory = function (options) {
  let shims = [this.shim, ...(options.reportOptions.shims || [])];

  return new (function () {
    let proxy = function (factory, base = {}, shim = {}) {
      return new Proxy(base, {
        get: (target, property) => {
          let object = target[property];
          if (ax.is.function(shim[property])) {
            return shim[property](factory.target, object);
          } else if (ax.is.object(shim[property])) {
            return proxy(factory, object, shim[property]);
          } else {
            return object;
          }
        },
      });
    };

    this.target = {
      scope: options.scope,
      object: options.object,
      reportOptions: options.reportOptions,
    };

    for (let i in shims) {
      this.target = proxy(this, this.target, shims[i]);
    }

    return this.target;
  })();
};

ax.extension.report.factory.button = function (options = {}) {
  let x = ax.x;

  return x.button(options);
};

ax.extension.report.factory.checkbox = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-checkbox'](
    x.check({
      ...options,
      inputTag: {
        tabindex: -1,
        disabled: 'disabled',
        ...options.inputTag,
      },
      ...options.checkbox,
      readonly: 'readonly',
    }),
    options.checkboxTag
  );
};

ax.extension.report.factory.checkboxes = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = x.lib.form.collection.value(options.value);
  let selections = x.lib.form.selections(options.selections);

  return a['|appkit-report-checkboxes'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        ...options,
        name: `${options.name}[]`,
        value: value.includes(selection.value) ? selection.value : '',
        label: label,
        checked: selection.value,
        readonly: 'readonly',
        inputTag: {
          tabindex: -1,
          disabled: 'disabled',
          ...options.inputTag,
        },
      });
    }),
    options.checkboxesTag
  );
};

ax.extension.report.factory.output = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-output'](
    x.out(options.value, {
      parse: options.parse,
      out: options.out,
    }),
    options.outputTag
  );
};

ax.extension.report.factory.radios = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = options.value || '';

  let selections = x.lib.form.selections(options.selections);

  return a['|appkit-report-radios'](
    selections.map((selection) => {
      let label = selection.label;

      if (selection.disabled == 'hr') {
        label = '—————';
      } else if (selection.disabled == 'br') {
        label = '';
      }

      return x.check({
        type: 'radio',
        name: options.name,
        value: value == selection.value ? selection.value : '',
        label: label,
        checked: selection.value,
        // required: options.required,
        tabindex: -1,
        readonly: 'readonly',
        inputTag: {
          tabindex: -1,
          disabled: 'disabled',
          ...options.inputTag,
        },
        labelTag: options.labelTag,
        checkTag: options.checkTag,
      });
    }),
    options.radiosTag
  );
};

ax.extension.report.factory.report = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let report = options.report || (() => null);

  let reportTagOptions = {
    ...options.reportTag,
  };

  return a['|appkit-report'](report(r), reportTagOptions);
};

ax.extension.report.factory.select = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = x.lib.form.collection.value(options.value);
  let selections = x.lib.form.selections(options.selections || {});

  let label = [];

  if (ax.is.not.array(value)) {
    value = [value];
  }

  for (let selected of value) {
    let found = selections.find((selection) => selection.value === selected);
    if (found) {
      label.push(found.label);
    }
  }
  label = label.join(', ');

  let selectTagOptions = {
    name: options.name,
    ...options.selectTag,
  };

  if (label.length == 0) {
    label = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-report-select'](label, selectTagOptions);
};

ax.extension.report.factory.string = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = options.value || '';

  let component;

  if (options.value) {
    component = options.value.toString();
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-report-string'](component, options.stringTag);
};

ax.extension.report.factory.text = function (options = {}) {
  let a = ax.a;

  let component;

  if (options.value) {
    component = options.value;
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-report-text'](component, options.textTag);
};

ax.extension.report.shim = {
  report: (r) => (options) => ax.x.report.factory.report(r, options),
  button: (r) => (options) => ax.x.report.factory.button(options),
  checkbox: (r) => (options) => ax.x.report.factory.checkbox(options),
  checkboxes: (r) => (options) => ax.x.report.factory.checkboxes(options),
  output: (r) => (options) => ax.x.report.factory.output(options),
  radios: (r) => (options) => ax.x.report.factory.radios(options),
  select: (r) => (options) => ax.x.report.factory.select(options),
  string: (r) => (options) => ax.x.report.factory.string(options),
  text: (r) => (options) => ax.x.report.factory.text(options),
};

ax.extension.router = (options = {}) => (a, x) => {
  let config = {
    scope: options.scope || '',
    default: options.default,
    home: options.home,
    lazy: options.lazy,
    transition: options.transition,
  };

  let routes = options.routes || {};

  if (options.home) {
    if (window.location.pathname.match(/^$|^\/$/)) {
      window.history.replaceState({}, 'Home', options.home);
    }
  }

  let routeTag = {
    id: options.id,

    $init: (el) => {
      const pop = () => el.$go();
      window.addEventListener('popstate', pop);
      el.$send('appkit.router.load', {
        detail: el.$location(),
      });
    },

    $nodes: function () {
      let router = x.router.router({
        router: [this],
        ...config,
      })(this.$location());

      if (ax.is.function(routes)) {
        return routes(router);
      } else {
        return router.routes(routes);
      }
    },

    $go: function () {
      let location = this.$location();
      this.$load(location.path, location.query, location.anchor);
    },

    $open: function (path, query, anchor) {
      if (path[0] != '/') {
        path = config.scope + (path ? `/${path}` : '');
      }

      this.$locate(path, query, anchor);

      this.$send('appkit.router.open', {
        detail: {
          path: path,
          query: query,
          anchor: anchor,
        },
      });
    },

    $locate: function (path, query, anchor) {
      path = path || '/';

      query = x.lib.query.from.object(query);
      path =
        (path || '/') +
        (query ? '?' + query : '') +
        (anchor ? '#' + anchor : '');

      history.pushState(
        {
          urlPath: path,
        },
        '',
        path
      );
      let event = new PopStateEvent('popstate', {
        urlPath: path,
      });
      dispatchEvent(event);
    },

    $location: function () {
      let location = window.location;

      return {
        path: location.pathname,
        query: x.lib.query.to.object(location.search.slice(1)),
        anchor: location.hash.slice(1),
      };
    },

    $load: function (path, query, anchor) {
      let routes = x.lib.unnested(this, '|appkit-router-nest');

      routes.forEach((r) => {
        r.$load(path, query, anchor);
      });

      this.$send('appkit.router.load', {
        detail: {
          path: path,
          query: query,
          anchor: anchor,
        },
      });
    },

    ...options.routeTag,
  };

  return a['|appkit-route'](null, routeTag);
};

ax.extension.router.router = (config) => (location) => {
  config = {
    ...config,
  };

  config.scope = config.scope || '';
  config.match = config.match || {};
  config.splat = config.splat || [];
  config.slash = config.slash || '';

  let router = {};

  router.path = location.path;
  router.query = location.query;
  router.anchor = location.anchor;
  router.scope = config.scope;
  router.match = config.match;
  router.splat = config.splat;
  router.slash = config.slash;
  router.params = {
    ...config.match,
    ...location.query,
  };
  router.loaded = () => config.router[0].$loaded;
  router.load = ax.x.router.router.load(config);
  router.open = ax.x.router.router.open(config);
  router.nest = ax.x.router.router.nest(config, location);

  return router;
};

ax.extension.router.router.load = (config) =>
  function (locator = null, query = {}, anchor = null) {
    let path = window.location.pathname;

    if (locator) {
      if (locator[0] == '/') {
        path = locator;
      } else {
        if (path.match(/\/$/)) {
          path = `${path}${locator}`;
        } else {
          path = `${path}/${locator}`;
        }
      }
    }

    config.router[0].$load(path, query, anchor);
  };

ax.extension.router.router.nest = (config, startLocation) =>
  function (options = {}) {
    let a = ax.a;
    let x = ax.x;

    config = {
      ...config,
    };

    config.default = options.default || config.default;
    config.routes = options.routes || {};

    let init;
    let component;
    let matched;
    let transition = ax.x.router.router.nest.transition(
      ax.is.undefined(options.transition)
        ? config.transition
        : options.transition
    );
    let view = ax.x.router.router.nest.view(config);

    let lazy = ax.is.undefined(options.lazy) ? config.lazy : options.lazy;

    if (transition) {
      init = function () {
        let locatedView = view(this, startLocation);
        this.$matched = locatedView.matched;
        this.$scope = locatedView.scope;
        this.$('|appkit-transition').$to(locatedView.component);
      };
      component = [transition];
    } else {
      component = function () {
        let locatedView = view(this, startLocation);
        this.$matched = locatedView.matched;
        this.$scope = locatedView.scope;
        return locatedView.component;
      };
    }

    let routesTag = {
      id: options.id,
      $init: init,
      $nodes: component,

      $reload: function () {
        this.$matched = false;
        this.$('^|appkit-router').$go();
      },

      $load: function (path, query, anchor) {
        let toLocation = {
          path: path,
          query: query,
          anchor: anchor,
        };

        let locatedView = view(this, toLocation);

        if (
          lazy &&
          this.$scope == locatedView.scope &&
          locatedView.matched &&
          this.$matched
        ) {
          let location = toLocation;
          let routes = x.lib.unnested(this, '|appkit-router-nest');

          routes.forEach((r) => {
            r.$load(location.path, location.query, location.anchor);
          });
        } else {
          this.$scope = locatedView.scope;

          if (transition) {
            this.$('|appkit-transition').$to(locatedView.component);
          } else {
            this.$nodes = locatedView.component;
          }

          this.$matched = locatedView.matched;
        }
      },

      ...options.routesTag,
    };

    return a['|appkit-router-nest'](null, routesTag);
  };

ax.extension.router.router.nest.matcher = (routesKey, scopedpath) => {
  let params = {};
  let splat = [];
  let slash;

  let regexp = ax.x.router.router.nest.regexp(routesKey);
  let routeRegex = new RegExp(regexp.string);
  let match = scopedpath.match(routeRegex);

  if (match) {
    let paramKeys = regexp.keys;
    let remove = 0;

    paramKeys.forEach(function (paramKey, i) {
      let matched = match[i + 1];
      if (paramKey === '*') {
        splat.unshift(matched);
      } else if (paramKey == '**') {
        remove = remove + matched.length;
        splat.unshift(matched);
      } else if (paramKey == '?') {
        remove = remove + matched.length;
        slash = matched;
      } else {
        params[paramKey] = matched;
      }
    });

    let keep = scopedpath.length - remove;
    let scope = scopedpath.substring(0, keep);

    return {
      params: params,
      splat: splat,
      slash: slash,
      scope: scope,
    };
  } else {
    return null;
  }
};

ax.extension.router.router.nest.regexp = (route) => {
  let routeRegexp = route
    .replace(/\*$/, '&&catchall&&')
    .replace(/\*/g, '&&wildcard&&')
    .replace(/\/\?/, '&&slash&&');

  let captures =
    routeRegexp.match(/(:\w+|&&wildcard&&|&&catchall&&|&&slash&&)/g) || [];
  let paramKeys = [];

  captures.forEach(function (capture) {
    let paramKey;
    let pattern;
    if (capture === '&&wildcard&&') {
      paramKey = '*';
      pattern = '([^\\/|^\\.]*)';
    } else if (capture === '&&catchall&&') {
      paramKey = '**';
      pattern = '(.*)';
    } else if (capture === '&&slash&&') {
      paramKey = '?';
      pattern = '(\\/?)';
    } else {
      paramKey = capture.slice(1);
      pattern = '([^\\/|^\\.]*)';
    }
    paramKeys.push(paramKey);
    routeRegexp = routeRegexp.replace(capture, pattern);
  });

  routeRegexp = '^' + routeRegexp + '$';

  return {
    string: routeRegexp,
    keys: paramKeys,
  };
};

ax.extension.router.router.nest.transition = (transition) => {
  if (ax.is.string(transition)) {
    return ax.x.transition[transition]();
  } else if (ax.is.array(transition)) {
    let name = transition[0];
    let options = transition[1];
    return ax.x.transition[name](options);
  } else {
    return transition;
  }
};

ax.extension.router.router.nest.view = (config) => (
  routesElement,
  location
) => {
  let scope = config.scope || '';
  let scopedpath = location.path.slice(scope.length);
  let match = config.match || {};
  let splat = config.splat || [];
  let lazy = config.lazy;
  let defaultContent = config.default;
  let transition = config.transition;
  let component;
  let slash;
  let matched;

  let routesKeys = Object.keys(config.routes);

  for (let i in routesKeys) {
    let routesKey = routesKeys[i];

    matched = ax.x.router.router.nest.matcher(routesKey, scopedpath);

    if (matched) {
      component = config.routes[routesKey];
      splat = [...matched.splat, ...splat];
      match = {
        ...match,
        ...matched.params,
      };
      slash = matched.slash;
      scope = `${scope}${matched.scope}`.replace(/\/$/, '');

      break;
    }
  }

  if (!matched) {
    component = ax.is.undefined(config.default)
      ? (controller) => {
          let message = `'${scopedpath}' not found`;
          let el = config.router[config.router.length - 1];
          console.warn(message, controller, config.router);
          return (a, x) => a['.error'](message);
        }
      : config.default;
  }

  if (ax.is.function(component)) {
    let controller = ax.x.router.router({
      router: [...config.router, routesElement],
      scope: scope,
      match: match,
      splat: splat,
      slash: slash,
      lazy: lazy,
      default: defaultContent,
      transition: transition,
    })(location);
    component = ax.a['|appkit-router-view']([component(controller)], {
      $init: function () {
        if (location.anchor) {
          let anchored = window.document.getElementById(location.anchor);
          if (!anchored)
            console.warn(`Appkit router view cannot find #${location.anchor}`);
          if (anchored) anchored.scrollIntoView();
        }
      },
    });
  }

  return {
    matched: !!matched,
    component: component,
    scope: scope,
  };
};

ax.extension.router.router.open = (config) =>
  function (locator = null, query = {}, anchor = null) {
    if (locator) {
      let path = window.location.pathname;

      if (locator[0] == '/') {
        path = locator;
      } else if (locator) {
        if (path.match(/\/$/)) {
          path = `${path}${locator}`;
        } else {
          path = `${path}/${locator}`;
        }
      }

      config.router[0].$open(path, query, anchor);
    } else {
      config.router[0].$go();
    }
  };

ax.extension.table = function (options = {}) {
  let a = ax.a;

  let component = [];

  let trTag = (i, row) => {
    if (ax.is.function(options.trTag)) {
      return options.trTag(i, row);
    } else {
      return options.trTag;
    }
  };

  let thTag = (i, j, content) => {
    if (ax.is.function(options.thTag)) {
      return options.thTag(i, j, content);
    } else {
      return options.thTag;
    }
  };

  let tdTag = (i, j, content) => {
    if (ax.is.function(options.tdTag)) {
      return options.tdTag(i, j, content);
    } else {
      return options.tdTag;
    }
  };

  let headers;
  if (options.headers == false) {
    headers = {
      rows: [],
      cols: [],
    };
  } else if (options.headers == true || !options.headers) {
    headers = {
      rows: [0],
      cols: [],
    };
  } else {
    headers = {
      rows: options.headers.rows || [],
      cols: options.headers.cols || [],
    };
  }

  let tableCellFor = (i, j, content) => {
    if (headers.rows.includes(i)) {
      let attributes = {
        scope: col,
        ...thTag(i, j, content),
      };
      return a.th(content, attributes);
    } else if (headers.cols.includes(j)) {
      let attributes = {
        scope: row,
        ...thTag(i, j, content),
      };
      return a.th(content, attributes);
    } else {
      return a.td(content, tdTag(i, j, content));
    }
  };

  (options.rows || []).forEach(function (row, i) {
    component.push(
      a.tr(
        row.map(function (content, j) {
          return tableCellFor(i, j, content);
        }),
        trTag(i, row)
      )
    );
  });

  return a.table(component, options.tableTag);
};

ax.extension.time = function (options = {}) {
  const a = ax.a;

  let timeTag = {
    $init: function () {
      this.$tock();
      setInterval(this.$tock, 1000);
    },
    $tock: function () {
      this.$text = new Date().toLocaleTimeString();
    },
    ...options.timeTag,
  };

  return a.time(null, timeTag);
};

ax.extension.transition = {};

ax.extension.transition.fade = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let duration = (options.duration || 500) / 2;

  return a['div|appkit-transition'](null, {
    $init: function () {
      let component = options.initial;
      this.style.display = 'none';
      if (component) {
        this.$in(component);
      }
    },
    $in: function (component) {
      // Show el before inserting content. For any $init functions
      // that rely on visible elements, such as resizing functions that
      // need to access el height/width.
      this.style.display = options.display || 'block';
      this.$nodes = [component];
      x.lib.animate.fade.in(this, {
        duration: duration,
        display: options.display,
        complete: () => {
          if (options.complete) options.complete(this);
        },
      });
    },
    $to: function (component) {
      if (this.style.opacity == '1') {
        x.lib.animate.fade.out(this, {
          duration: duration,
          complete: () => this.$in(component),
        });
      } else {
        this.$in(component);
      }
    },
    ...options.transitionTag,
  });
};

ax.extension.form.field = {};

ax.extension.form.field.components = {};

ax.extension.form.field.components.button = (target, options = {}) =>
  target({
    ...options,
    buttonTag: {
      $disable: function () {
        this.disabled = 'disabled';
      },
      $enable: function () {
        this.removeAttribute('disabled');
      },
      ...options.buttonTag,
    },
  });

ax.extension.form.field.components.collection = function (
  f,
  control,
  options = {}
) {
  let a = ax.a;
  let x = ax.x;

  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['|appkit-form-collection-item'](
      [
        a['|appkit-form-collection-item-header'](
          a['|appkit-form-collection-item-buttons'](
            [
              options.stationary
                ? null
                : this.collection.up(f, options.upButton || {}),
              options.stationary
                ? null
                : this.collection.down(f, options.downButton || {}),
              options.confined
                ? null
                : this.collection.remove(f, {
                    item: options.item,
                    ...options.removeButton,
                  }),
            ],
            options.itemButtonsTag
          ),
          options.itemHeaderTag
        ),
        a['|appkit-form-collection-item-body'](
          control({
            ...options,
            name: `${options.name}[]`,
            value: value,
          }),
          options.itemBodyTag
        ),
      ],
      options.itemTag
    );

  let components = values.map((value) => itemFn(value));

  let controlTagOptions = {
    'data-name': options.name,
    $value: function () {
      return this.$$('|appkit-form-control').value.$$;
    },

    $focus: function () {
      let first = this.$('|appkit-form-control');
      if (first) setTimeout(first.$focus, 1);
    },

    $disable: function () {
      let controls = this.$$('|appkit-form-control').$$;
      for (let control of controls) {
        control.$disable();
      }
    },

    $enable: function () {
      if (!options.disabled) {
        let controls = this.$$('|appkit-form-control').$$;
        for (let control of controls) {
          control.$enable();
        }
      }
    },

    ...options.controlTag,
  };

  return a['|appkit-form-control'](
    a['|appkit-form-collection'](
      [
        a['bananas|appkit-form-collection-items'](components, {
          $add: function () {
            this.append(itemFn());
          },
          ...options.itemsTag,
        }),
        options.confined
          ? null
          : this.collection.add(f, {
              item: options.item,
              ...options.addButton,
            }),
      ],
      options.collectionTag
    ),
    controlTagOptions
  );
};

ax.extension.form.field.components.collection.add = function (f, options) {
  let label = `✚ Add${options.item ? ` ${options.item}` : ''}`;

  return f.button({
    label: label,
    onclick: (e, el) => {
      let itemsTag = options.target
        ? options.target(el)
        : el.$('^|appkit-form-collection |appkit-form-collection-items');
      itemsTag.$add();
      itemsTag.$send('ax.appkit.form.collection.item.add');
    },
    ...options,
  });
};

ax.extension.form.field.components.collection.down = function (f, options) {
  return f.button({
    label: '⏷',
    onclick: function (e, el) {
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^|appkit-form-collecion-item');
      var next = target.nextSibling;
      var parent = target.parentElement;
      if (next) {
        parent.insertBefore(target, next.nextSibling);
        el.focus();
        this.$send('ax.appkit.form.collection.item.move');
      }
    },
    ...options,
  });
};

ax.extension.form.field.components.collection.remove = function (f, options) {
  let item = options.item || 'item';
  let confirmation;

  if (ax.is.false(options.confirm)) {
    confirmation = false;
  } else if (ax.is.string(options.confirm) || ax.is.function(options.confirm)) {
    confirmation = options.confirm;
  } else {
    confirmation = `Are you sure that you want to remove this ${item}?`;
  }

  return f.button({
    label: '✖',
    confirm: confirmation,
    onclick: function (e, el) {
      var target = el.$('^|appkit-form-collection-item');
      let parent = target.parentElement;
      let index = Array.prototype.indexOf.call(parent.children, target);
      target.remove();
      (ax.x.lib.tabable.next(parent) || window.document.body).focus();
      let length = parent.children.length;
      parent.$send('ax.appkit.form.collection.item.remove', {
        detail: {
          target: el,
          index: index,
          length: length,
        },
      });
    },
    ...options,
  });
};

ax.extension.form.field.components.collection.up = function (f, options) {
  return f.button({
    label: '⏶',
    onclick: function (e, el) {
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^|appkit-form-collection-item');
      var previous = target.previousSibling;
      var parent = target.parentElement;
      if (previous) {
        parent.insertBefore(target, previous);
        el.focus();
        this.$send('ax.appkit.form.collection.item.move');
      }
    },
    ...options,
  });
};

ax.extension.form.field.components.control = function (f, options = {}) {
  let as = (options.as || '').split('/');
  let control = options.control || as[0] || 'input';
  let type = options.type || as[1];

  let controlFn = f.controls[control];
  if (!controlFn)
    ax.throw(`Form field factory does not support control '${control}'.`);

  let key = options.key || '';

  options.name = options.name || (f.scope ? `${f.scope}[${key}]` : key);

  let object = f.object || {};

  if (ax.is.not.undefined(object[key])) {
    options.value = object[key];
  }

  let controlOptions = {
    ...options,
    type: type,
    ...options[control],
  };

  if (options.collection) {
    return this.collection(f, controlFn, controlOptions);
  } else {
    return controlFn(controlOptions);
  }
};

ax.extension.form.field.components.controls = {};

ax.extension.form.field.components.controls.checkbox = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: function () {
      this.$valid();
    },

    $value: function () {
      if (this.$('input').checked) {
        return this.$('input').value;
      } else {
        return '';
      }
    },

    $focus: function () {
      this.$('input').focus();
    },

    $disable: function () {
      this.$('input').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!options.disabled) {
        this.$('input').removeAttribute('disabled');
      }
    },

    $validity: function () {
      return this.$('input').validity;
    },

    $valid: function () {
      this.$('input').setCustomValidity('');
      if (this.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(this.$value, this.$validity());
            if (invalidMessage) {
              this.$('input').setCustomValidity(invalidMessage);
            }
          } else {
            this.$('input').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'input: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](f.checkbox(options), controlTagOptions);
};

ax.extension.form.field.components.controls.checkboxes = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    name: options.name,

    $value: function () {
      return this.$$('input:checked').value.$$;
    },

    $focus: function () {
      this.$('input').focus();
    },

    $controls: function () {
      return this.$$('|appkit-form-control').$$;
    },

    $inputs: function () {
      return this.$$('input').$$;
    },

    $disable: function () {
      for (let input of this.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: function () {
      if (!options.disabled) {
        for (let input of this.$inputs()) {
          if (!input.$ax.disabled) {
            input.removeAttribute('disabled');
          }
        }
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        if (options.readonly) e.preventDefault();
      },
      'change: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](
    a['|appkit-form-control-checkboxes'](
      f.checkboxes(options),
      options.checkboxesTag
    ),
    controlTagOptions
  );
};

ax.extension.form.field.components.controls.hidden = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },
    $disable: () => {},

    $enable: () => {},
    ...options.controlTag,
  };

  return a['|appkit-form-control'](null, controlTagOptions);
};

ax.extension.form.field.components.controls.input = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: function () {
      this.$valid();
    },

    $value: function () {
      return this.$('input').value;
    },

    $focus: function () {
      this.$('input').focus();
    },

    $disable: function () {
      this.$('input').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!options.disabled) {
        this.$('input').removeAttribute('disabled');
      }
    },

    $validity: function () {
      return this.$('input').validity;
    },

    $valid: function () {
      this.$('input').setCustomValidity('');
      if (this.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(this.$value, this.$validity());
            if (invalidMessage) {
              this.$('input').setCustomValidity(invalidMessage);
            }
          } else {
            this.$('input').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'input: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](f.input(options), controlTagOptions);
};

ax.extension.form.field.components.controls.radios = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: function () {
      this.$valid();
    },

    $value: function () {
      return this.$('input:checked').value;
    },

    $focus: function () {
      this.$('input').focus();
    },

    $inputs: function () {
      return this.$$('input').$$;
    },

    $disable: function () {
      for (let input of this.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: function () {
      if (!options.disabled) {
        for (let input of this.$inputs()) {
          if (!input.$ax.disabled) {
            input.removeAttribute('disabled');
          }
        }
      }
    },

    $validity: function () {
      return this.$('input').validity;
    },

    $valid: function () {
      this.$('input').setCustomValidity('');
      if (this.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(this.$value, this.$validity());
            if (invalidMessage) {
              this.$('input').setCustomValidity(invalidMessage);
            }
          } else {
            this.$('input').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        if (options.readonly) e.preventDefault();
      },
      'input: check validity': (e, el) => {
        el.$valid();
      },
      'change: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](f.radios(options), controlTagOptions);
};

ax.extension.form.field.components.controls.select = function (f, options) {
  let a = ax.a;

  let controlTagOptions = {
    $init: function () {
      this.$valid();
    },

    $value: function () {
      return this.$('select').value;
    },

    $focus: function () {
      this.$('select').focus();
    },

    $disable: function () {
      this.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!options.disabled) {
        this.$('select').removeAttribute('disabled');
      }
    },

    $validity: function () {
      return this.$('select').validity;
    },

    $valid: function () {
      this.$('select').setCustomValidity('');
      if (this.$validity().valid) {
        return true;
      } else {
        if (options.invalid) {
          if (ax.is.function(options.invalid)) {
            let invalidMessage = options.invalid(this.$value, this.$validity);
            if (invalidMessage) {
              this.$('select').setCustomValidity(invalidMessage);
            }
          } else {
            this.$('select').setCustomValidity(options.invalid);
          }
        }
        return false;
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        if (options.readonly) e.preventDefault();
      },
      'change: check validity': (e, el) => {
        el.$valid();
      },
      'change: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](f.select(options), controlTagOptions);
};

ax.extension.form.field.components.controls.textarea = (f, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $value: function () {
      return this.$('textarea').value;
    },

    $focus: function () {
      this.$('textarea').focus();
    },

    $disable: function () {
      this.$('textarea').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!options.disabled) {
        this.$('textarea').removeAttribute('disabled');
      }
    },

    ...options.controlTag,

    $on: {
      'input: send control change event': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](f.textarea(options), controlTagOptions);
};

ax.extension.form.field.components.field = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  if (
    options.as == 'hidden' ||
    options.as == 'input/hidden' ||
    options.type == 'hidden'
  ) {
    options.label = false;
    options.help = false;
    options.hint = false;
  }

  return a['|appkit-form-field'](
    [
      this.header(f, options),
      a['|appkit-form-field-body'](
        [
          f.help(options),
          f.control({
            ...options,
            // Controls don't normally need labels. Checkbox is exception.
            // Label for checkbox needs to be specified in options.checkbox.
            // options.label and options.labelTag consumed by field.header()
            label: null,
            labelTag: null,
          }),
          f.hint(options),
        ],
        options.bodyTag
      ),
    ],
    options.fieldTag
  );
};

ax.extension.form.field.components.fieldset = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let control = a['|appkit-form-control'](
    [
      options.legend ? a.legend(options.legend, options.legendTag) : null,
      options.body || null,
    ],
    {
      $controls: function () {
        return x.lib.unnested(this, '|appkit-form-control');
      },
      $buttons: function () {
        return this.$$('button').$$;
      },
      $disable: function () {
        let controls = [...this.$controls(), ...this.$buttons()];
        for (let i in controls) {
          controls[i].$disable && controls[i].$disable();
        }
      },
      $enable: function () {
        let controls = [...this.$controls(), ...this.$buttons()];
        for (let i in controls) {
          controls[i].$enable && controls[i].$enable();
        }
      },
      $focus: function () {
        let first = this.$controls()[0];
        if (first) first.$focus();
      },
    }
  );

  options.label = options.label ? options.label : false;

  return a['fieldset|appkit-form-fieldset'](
    [
      this.header(f, options),
      a['|appkit-form-field-body'](
        [f.help(options), control, f.hint(options)],
        options.bodyTag
      ),
    ],
    options.fieldsetTag
  );
};

ax.extension.form.field.components.header = function (f, options = {}) {
  let component;

  if (options.header == true) {
    options.header = null;
  }

  if (options.header) {
    component = header;
  } else {
    let caption = options.label === false ? null : f.label(options);
    if (options.help) {
      component = [caption, f.helpbutton(options)];
    } else {
      component = caption;
    }
  }

  return ax.a['|appkit-form-field-header'](component, options.headerTag);
};

ax.extension.form.field.components.help = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return options.help
    ? a['|appkit-form-field-help-wrapper'](
        a['|appkit-form-field-help'](options.help, {
          $toggle: function () {
            x.lib.animate.fade.toggle(this);
          },
          ...options.helpTag,
          style: {
            display: 'none',
            ...(options.helpTag || {}).style,
          },
        }),
        options.helpWrapper
      )
    : null;
};

ax.extension.form.field.components.helpbutton = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-form-field-helpbutton'](null, {
    $state: false,
    $nodes: (el, show) => {
      return a['|appkit-form-field-helpbutton-text'](
        el.show ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    ...options.helpbuttonTag,
    $on: {
      'click: toggle help': function () {
        this.$state = !this.$state;
        this.$('^|appkit-form-field', '|appkit-form-field-help').$toggle();
      },
      ...(options.helpbuttonTag || []).$on,
    },
    style: {
      cursor: 'help',
      ...(options.helpbuttonTag || {}).style,
    },
  });
};

ax.extension.form.field.components.hint = function (options = {}) {
  let a = ax.a;

  return options.hint
    ? a['small|appkit-form-field-hint'](options.hint, options.hintTag)
    : null;
};

ax.extension.form.field.components.label = function (options = {}) {
  let a = ax.a;
  let x = ax.x;
  let lib = x.lib;

  let label = options.label || lib.text.labelize(options.key);
  let component = a.label(label, options.labelTag);

  let labelWrapperTag = {
    ...options.labelWrapperTag,

    $on: {
      'click: focus on input': function () {
        let target = this.$('^|appkit-form-field |appkit-form-control');
        target.$focus();
      },
      ...(options.labelWrapperTag || {}).$on,
    },
  };

  return a['|appkit-form-field-label-wrapper'](component, labelWrapperTag);
};

ax.extension.form.field.shim = {
  button: (f, target) => (options = {}) =>
    ax.x.form.field.components.button(target, options),
  field: (f, target) => (options = {}) =>
    ax.x.form.field.components.field(f, options),
  fieldset: (f, target) => (options = {}) =>
    ax.x.form.field.components.fieldset(f, options),
  label: (f, target) => (options = {}) =>
    ax.x.form.field.components.label(options),
  help: (f, target) => (options = {}) =>
    ax.x.form.field.components.help(options),
  helpbutton: (f, target) => (options = {}) =>
    ax.x.form.field.components.helpbutton(options),
  hint: (f, target) => (options = {}) =>
    ax.x.form.field.components.hint(options),
  control: (f, target) => (options = {}) =>
    ax.x.form.field.components.control(f, options),
  controls: {
    input: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.input(f, options),
    select: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.select(f, options),
    textarea: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.textarea(f, options),
    checkbox: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.checkbox(f, options),
    checkboxes: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.checkboxes(f, options),
    radios: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.radios(f, options),
    hidden: (f, target) => (options = {}) =>
      ax.x.form.field.components.controls.hidden(f, options),
  },
};

ax.extension.report.field = {};

ax.extension.report.field.components = {};

ax.extension.report.field.components.collection = function (
  f,
  control,
  options = {}
) {
  let a = ax.a;
  let x = ax.x;

  let values = x.lib.form.collection.value(options.value);

  let itemFn = (value) =>
    a['|appkit-report-collection-item'](
      [
        a['|appkit-report-collection-item-header'](null, options.itemHeaderTag),
        a['|appkit-report-collection-item-body'](
          control({
            ...options,
            name: `${options.name}[]`,
            value: value,
          }),
          options.itemBodyTag
        ),
      ],
      options.itemTag
    );

  let components = values.map((value) => itemFn(value));

  let controlTagOptions = {
    'data-name': options.name,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.$('|appkit-report-control').focus();
    },
    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    a['|appkit-report-collection'](
      [a['|appkit-report-collection-items'](components, options.itemsTag)],
      options.collectionTag
    ),
    controlTagOptions
  );
};

ax.extension.report.field.components.control = function (r, options = {}) {
  let as = (options.as || '').split('/');
  let control = options.control || as[0] || 'output';
  let type = options.type || as[1];

  let controlFn = r.controls[control];
  if (!controlFn)
    ax.throw(`Report field factory does not support control '${control}'.`);

  let key = options.key || '';

  let name = options.name || (r.scope ? `${r.scope}[${key}]` : key);

  let object = r.object || {};

  if (key && ax.is.not.undefined(object[key])) {
    options.value = object[key];
  }

  let controlOptions = {
    ...options,
    name: name,
    type: type,
    ...options[control],
  };

  if (options.collection) {
    return this.collection(r, controlFn, controlOptions);
  } else {
    return controlFn(controlOptions);
  }
};

ax.extension.report.field.components.controls = {};

ax.extension.report.field.components.controls.checkbox = function (r, options) {
  let a = ax.a;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [r.checkbox(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extension.report.field.components.controls.checkboxes = function (
  r,
  options
) {
  let a = ax.a;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [r.checkboxes(options)],
    controlTagOptions
  );
};

ax.extension.report.field.components.controls.hidden = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](null, controlTagOptions);
};

ax.extension.report.field.components.controls.output = function (
  r,
  options = {}
) {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [r.output(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extension.report.field.components.controls.radios = function (r, options) {
  let a = ax.a;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [r.radios(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extension.report.field.components.controls.select = function (r, options) {
  let a = ax.a;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [r.select(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extension.report.field.components.controls.string = function (r, options) {
  let a = ax.a;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [r.string(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extension.report.field.components.controls.text = (r, options = {}) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [r.text(options), r.validation(options)],
    controlTagOptions
  );
};

ax.extension.report.field.components.field = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  if (options.as == 'hidden') {
    options.label = false;
    options.help = false;
    options.hint = false;
  }

  return a['|appkit-report-field'](
    [
      this.header(r, options),
      a['|appkit-report-field-body'](
        [
          r.help(options),
          r.control({
            ...options,
            label: null,
            labelTag: null,
          }),
          r.hint(options),
        ],
        options.bodyTag
      ),
    ],
    options.fieldTag
  );
};

ax.extension.report.field.components.fieldset = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let control = a['|appkit-report-control'](
    [
      options.legend ? a.legend(options.legend, options.legendTag) : null,
      options.body || null,
    ],
    {
      $controls: function () {
        return x.lib.unnested(this, '|appkit-report-control');
      },
      $buttons: function () {
        return this.$$('button').$$;
      },
      $disable: function () {
        let controls = [...this.$controls(), ...this.$buttons()];
        for (let i in controls) {
          controls[i].$disable && controls[i].$disable();
        }
      },
      $enable: function () {
        let controls = [...this.$controls(), ...this.$buttons()];
        for (let i in controls) {
          controls[i].$enable && controls[i].$enable();
        }
      },
      $focus: function () {
        let first = this.$controls()[0];
        if (first) first.$focus();
      },
    }
  );

  options.label = options.label ? options.label : false;

  return a['fieldset|appkit-report-fieldset'](
    [
      this.header(f, options),
      a['|appkit-report-field-body'](
        [f.help(options), control, f.hint(options)],
        options.bodyTag
      ),
    ],
    options.fieldsetTag
  );
};

ax.extension.report.field.components.header = function (r, options = {}) {
  if (options.type == 'hidden') {
    return null;
  } else {
    let component;

    if (options.header == true) {
      options.header = null;
    }

    if (options.header) {
      component = header;
    } else {
      let caption = r.label(options);
      if (options.help) {
        component = [caption, r.helpbutton(options)];
      } else {
        component = caption;
      }
    }

    return ax.a['|appkit-report-field-header'](component, options.headerTag);
  }
};

ax.extension.report.field.components.help = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let help = options.help;

  return help
    ? a['|appkit-report-field-help-wrapper'](
        a['|appkit-report-field-help'](help, {
          $toggle: function () {
            x.lib.animate.fade.toggle(this);
          },
          ...options.helpTag,
          style: {
            display: 'none',
            ...(options.helpTag || {}).style,
          },
        }),
        options.helpWrapper
      )
    : null;
};

ax.extension.report.field.components.helpbutton = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-field-helpbutton'](null, {
    $state: false,
    $nodes: function () {
      return a['|appkit-report-field-helpbutton-text'](
        this.$state ? ' ❓ ✖ ' : ' ❓ '
      );
    },
    $on: {
      'click: toggle help': function () {
        this.$state = !this.$state;
        this.$('^|appkit-report-field', '|appkit-report-field-help').$toggle();
      },
    },
    ...options.helpbuttonTag,
    style: {
      cursor: 'help',
      ...(options.helpbuttonTag || {}).style,
    },
  });
};

ax.extension.report.field.components.hint = function (options = {}) {
  let a = ax.a;

  let hint = options.hint;

  return hint
    ? a['small|appkit-report-field-hint'](hint, options.hintTag)
    : null;
};

ax.extension.report.field.components.label = function (options = {}) {
  let a = ax.a;
  let x = ax.x;
  let lib = x.lib;

  if (ax.is.boolean(options.label) && !options.label) return null;
  let label = options.label || lib.text.labelize(options.key);
  if (!label) return null;
  let component = a.label(label, options.labelTag);

  let labelWrapperTag = {
    ...options.labelWrapperTag,

    $on: {
      'click: focus on output': function () {
        let target = this.$('^|appkit-report-field |appkit-report-control');
        target && target.$focus();
      },
      ...(options.labelWrapperTag || {}).$on,
    },
  };

  return a['|appkit-report-field-label-wrapper'](component, labelWrapperTag);
};

ax.extension.report.field.components.validation = function (options = {}) {
  let a = ax.a;

  let message;
  let validity = { valid: true };

  if (options.required && !options.value) {
    message = 'Requires a value.';
    validity.valid = false;
    validity.valueMissing = true;
  }
  if (
    options.value &&
    options.controlPattern &&
    !options.value.toString().match(options.controlPattern)
  ) {
    validity.valid = false;
    validity.typeMismatch = true;
  }
  if (
    options.value &&
    options.pattern &&
    !options.value.toString().match(options.pattern)
  ) {
    validity.valid = false;
    validity.patternMismatch = true;
  }

  if (validity.valid) return null;

  if (ax.is.function(options.invalid)) {
    message = options.invalid(options.value, validity) || null;
  } else if (ax.is.string(options.invalid)) {
    message = options.invalid;
  } else {
    message = message || 'Invalid value.';
  }

  return a['small|appkit-report-field-validation.error'](
    message,
    options.validationTag
  );
};

ax.extension.report.field.shim = {
  field: (r, target) => (options = {}) =>
    ax.x.report.field.components.field(r, options),
  fieldset: (f, target) => (options = {}) =>
    ax.x.form.field.components.fieldset(f, options),
  label: (r, target) => (options = {}) =>
    ax.x.report.field.components.label(options),
  help: (r, target) => (options = {}) =>
    ax.x.report.field.components.help(options),
  helpbutton: (r, target) => (options = {}) =>
    ax.x.report.field.components.helpbutton(options),
  hint: (r, target) => (options = {}) =>
    ax.x.report.field.components.hint(options),
  validation: (r, target) => (options = {}) =>
    ax.x.report.field.components.validation(options),
  control: (r, target) => (options = {}) =>
    ax.x.report.field.components.control(r, options),
  controls: {
    checkbox: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.checkbox(r, options),
    checkboxes: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.checkboxes(r, options),
    string: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.string(r, options),
    select: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.select(r, options),
    radios: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.radios(r, options),
    text: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.text(r, options),
    output: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.output(r, options),
    hidden: (r, target) => (options = {}) =>
      ax.x.report.field.components.controls.hidden(r, options),
  },
};

ax.extension.form.field.dependent = {};

ax.extension.form.field.dependent.collect = (options) => {
  let x = ax.x;

  let collection;

  if (ax.is.string(options.dependent)) {
    collection = [
      {
        key: options.dependent,
      },
    ];
  } else if (ax.is.array(options.dependent)) {
    collection = options.dependent;
  } else if (ax.is.object(options.dependent)) {
    collection = [options.dependent];
  } else {
    collection = [];
  }

  let nameFor = (scope, key) => {
    let dismantle = x.lib.name.dismantle;
    let parts = [...dismantle(scope || ''), ...dismantle(key)];
    while (parts.indexOf('..') >= 0) {
      let index = parts.indexOf('..');
      parts.splice(index, 1);
      if (index > 0) parts.splice(index - 1, 1);
    }
    let name = parts.shift();
    if (parts.length) name = `${name}[${parts.join('][')}]`;
    return name;
  };

  for (let item of collection) {
    if (item.key) {
      item.name = nameFor(options.scope, item.key);
    }
  }

  return collection;
};

ax.extension.form.field.dependent.components = {};

ax.extension.form.field.dependent.components.dependent = function (options) {
  let a = ax.a;
  let x = ax.x;

  let optionsCollection = x.form.field.dependent.collect(options);

  let dependentTag = {
    $init: function () {
      this.$dependencies = optionsCollection.map((options) => ({
        field: x.form.field.dependent.components.dependent.dependency(
          this,
          options
        ),
        value: options.value,
        pattern: options.pattern,
      }));
      for (let dependency of this.$dependencies) {
        dependency.field.$registerDependent(this);
      }
    },
    $registerDependent: function (dependent) {
      this.$dependents.push(dependent);
    },
    $hide: function () {
      this.style.display = 'none';
      this.$('|appkit-form-control').$disable();
      let dependents = x.lib.unnested(this, '|appkit-form-field-dependent');
      for (let i in dependents) {
        dependents[i].$hide();
      }
    },
    $show: function () {
      this.$('|appkit-form-control').$enable();
      if (!options.animate) {
        this.style.display = 'block';
      } else {
        x.lib.animate.fade.in(this);
      }
      let dependents = x.lib.unnested(this, '|appkit-form-field-dependent');
      for (let i in dependents) {
        dependents[i].$check();
      }
    },
    $dependents: [],
    $value: function () {
      return this.$('|appkit-form-control').$value();
    },
    $match: function () {
      if (ax.is.undefined(this.$matched)) {
        if (this.$dependencies.length) {
          for (let dependency of this.$dependencies) {
            if (x.form.field.dependent.components.dependent.match(dependency)) {
              this.$matched = true;
              return true;
            }
          }
          this.$matched = false;
          return false;
        } else {
          this.$matched = true;
          return true;
        }
      } else {
        return this.$matched;
      }
    },
    $check: function () {
      if (this.$match()) {
        this.$show();
      } else {
        this.$hide();
      }
    },
    $reset: function () {
      this.$matched = undefined;
      for (let dependent of this.$dependents) {
        dependent.$reset();
      }
    },
    $checkDependents: function () {
      for (let dependent of this.$dependents) {
        dependent.$reset();
        dependent.$check();
      }
    },
    ...options.dependentTag,
    style: {
      display: 'none',
      ...(options.dependentTag || {}).style,
    },
    $on: {
      'ax.appkit.form.control.change': (e, el) => {
        el.$checkDependents();
      },
      ...(options.dependentTag || {}).$on,
    },
  };

  return a['|appkit-form-field-dependent'](options.body, dependentTag);
};

ax.extension.form.field.dependent.components.dependent.dependency = (
  el,
  options
) => {
  let selector;

  if (options.selector) {
    selector = options.selector;
  } else {
    let name = options.name;
    selector = `[name="${name}"]`;
  }

  let search = options.search || '^form';

  let target = el.$(search).$(selector);
  let targetDependency;

  if (target) {
    targetDependency = target.$('^|appkit-form-field-dependent');
  }

  if (targetDependency) {
    return targetDependency;
  } else {
    console.error(
      el,
      `Form field failed to find a dependency target using selector:`,
      selector
    );
  }
};

ax.extension.form.field.dependent.components.dependent.match = function (
  options
) {
  let field = options.field;

  if (field.$match()) {
    let fieldValue = field.$value();

    if (options.value) {
      return fieldValue === options.value;
    } else if (options.pattern) {
      return new RegExp(options.pattern || '.*').test(fieldValue.toString());
    } else if (ax.is.array(fieldValue)) {
      return fieldValue.length > 0;
    } else {
      return !!fieldValue;
    }
  } else {
    return false;
  }
};

ax.extension.form.field.dependent.shim = {
  field: (f, target) => (options = {}) => {
    return ax.x.form.field.dependent.components.dependent({
      body: target(options),
      scope: f.scope,
      dependent: options.dependent,
    });
  },

  fieldset: (f, target) => (options = {}) => {
    return ax.x.form.field.dependent.components.dependent({
      body: target(options),
      scope: f.scope,
      dependent: options.dependent,
    });
  },

  dependent: (f, target) => (options = {}) => {
    return ax.x.form.field.dependent.components.dependent({
      scope: f.scope,
      ...options,
    });
  },

  form: (f, target) => (options = {}) =>
    target({
      ...options,
      formTag: {
        ...options.formTag,
        $init: function () {
          options.formTag &&
            options.formTag.$init &&
            options.formTag.$init.bind(this)(arguments);
          this.$checkDependents();
        },
        $checkDependents: function () {
          let dependents = ax.x.lib.unnested(
            this,
            '|appkit-form-field-dependent'
          );
          for (let i in dependents) {
            dependents[i].$check();
          }
        },
      },
    }),

  items: (f, target) => (options = {}) =>
    target({
      ...options,
      itemsTag: {
        ...options.itemsTag,
        $on: {
          'ax.appkit.form.nest.item.add: check dependents on new item': (
            e,
            el
          ) => {
            let newItem = el.$$('|appkit-form-nest-item').$$.reverse()[0];
            let dependents = ax.x.lib.unnested(
              newItem,
              '|appkit-form-field-dependent'
            );
            for (let i in dependents) {
              dependents[i].$check();
            }
          },
          ...(options.itemsTag || {}).$on,
        },
      },
    }),
};

ax.extension.report.field.dependent = {};

ax.extension.report.field.dependent.components = {};

ax.extension.report.field.dependent.components.dependent = function (options) {
  let a = ax.a;
  let x = ax.x;

  let optionsCollection = x.form.field.dependent.collect(options);

  let dependentTag = {
    $init: function () {
      this.$dependencies = optionsCollection.map((options) => ({
        field: x.report.field.dependent.components.dependent.dependency(
          this,
          options
        ),
        value: options.value,
        pattern: options.pattern,
      }));
      this.$check();
    },
    $hide: function () {
      this.style.display = 'none';
    },
    $show: function () {
      this.style.display = 'block';
    },
    $value: function () {
      return this.$('|appkit-report-control').$value();
    },
    $match: function () {
      if (ax.is.undefined(this.$matched)) {
        if (this.$dependencies.length) {
          for (let dependency of this.$dependencies) {
            if (x.form.field.dependent.components.dependent.match(dependency)) {
              this.$matched = true;
              return true;
            }
          }
          this.$matched = false;
          return false;
        } else {
          this.$matched = true;
          return true;
        }
      } else {
        return this.$matched;
      }
    },
    $check: function () {
      if (this.$match()) {
        this.$show();
      } else {
        this.$hide();
      }
    },
    ...options.dependentTag,
    style: {
      display: 'none',
      ...(options.dependentTag || {}).style,
    },
  };

  return a['|appkit-report-field-dependent'](options.body, dependentTag);
};

ax.extension.report.field.dependent.components.dependent.dependency = (
  el,
  options
) => {
  let selector;

  if (options.selector) {
    selector = options.selector;
  } else {
    let name = options.name;
    selector = `[data-name='${name}']`;
  }

  let search = options.search || '^|appkit-report';

  let target = el.$(search).$(selector);
  let targetDependency;

  if (target) {
    targetDependency = target.$('^|appkit-report-field-dependent');
  }

  if (targetDependency) {
    return targetDependency;
  } else {
    console.error(
      `Report field failed to find a dependency target using selector:`,
      selector
    );
  }
};

ax.extension.report.field.dependent.shim = {
  field: (r, target) => (options = {}) => {
    return ax.x.report.field.dependent.components.dependent({
      body: target(options),
      scope: r.scope,
      dependent: options.dependent,
    });
  },

  fieldset: (r, target) => (options = {}) => {
    return ax.x.report.field.dependent.components.dependent({
      body: target(options),
      scope: r.scope,
      dependent: options.dependent,
    });
  },

  dependent: (r, target) => (options = {}) => {
    return ax.x.report.field.dependent.components.dependent({
      scope: r.scope,
      ...options,
    });
  },
};

ax.extension.form.field.extras = {};

ax.extension.form.field.extras.components = {};

ax.extension.form.field.extras.components.controls = {};

ax.extension.form.field.extras.components.controls.country = (
  f,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $value: function () {
      return this.$('select').value;
    },
    $focus: function () {
      this.$('select').focus();
    },

    $disable: function () {
      this.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!selectOptions.disabled) {
        this.$('select').removeAttribute('disabled');
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        if (selectOptions.readonly) e.preventDefault();
      },
      'change:': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  let selectOptions = {
    ...options,
    value: options.value,
    selections: x.lib.locale.countries,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  return a['|appkit-form-control'](f.select(selectOptions), controlTagOptions);
};

ax.extension.form.field.extras.components.controls.language = (
  f,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $value: function () {
      return this.$('select').value;
    },
    $focus: function () {
      this.$('select').focus();
    },

    $disable: function () {
      this.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!selectOptions.disabled) {
        this.$('select').removeAttribute('disabled');
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        if (selectOptions.readonly) e.preventDefault();
      },
      'change:': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  let selectOptions = {
    ...options,
    value: options.value,
    selections: x.lib.locale.languages,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  return a['|appkit-form-control'](f.select(selectOptions), controlTagOptions);
};

ax.extension.form.field.extras.components.controls.multiselect = function (
  f,
  options = {}
) {
  let a = ax.a;
  let x = ax.x;

  options.value = x.lib.form.collection.value(options.value);

  options.selections = x.lib.form.selections(options.selections);

  let controlTagOptions = {
    name: options.name,
    $init: function () {
      this.$preselect();
    },

    $value: function () {
      return this.$('|appkit-form-multiselect-selected').$state.map(function (
        item
      ) {
        return item.value;
      });
    },

    $data: function () {
      return this.$value();
    },

    $focus: function () {
      this.$('select').focus();
    },

    $disable: function () {
      this.$$('|appkit-form-multiselect-selected-item-remove').$disable();
      this.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!options.disabled) {
        this.$$('|appkit-form-multiselect-selected-item-remove').$enable();
        this.$('select').removeAttribute('disabled');
      }
    },

    $preselect: function () {
      let items = [];
      let select = this.$('select');
      let selections = Array.apply(null, select.options);

      options.value.map((itemValue) => {
        selections.forEach((selection, i) => {
          if (selection.value.toString() == itemValue.toString()) {
            items.push({
              index: i,
              value: itemValue,
              label: selection.text,
            });
            selection.disabled = 'disabled';
          }
        });
      });
      this.$('|appkit-form-multiselect-selected').$state = items;
    },

    $on: {
      'ax.appkit.form.multiselect.selected.change: send control change event': (
        e,
        el
      ) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },

    ...options.controlTag,
  };

  return a['|appkit-form-control'](
    [
      x.form.field.extras.components.controls.multiselect.select(f, options),
      x.form.field.extras.components.controls.multiselect.selected(f, options),
    ],
    controlTagOptions
  );
};

ax.css({
  '|appkit-form-multiselect-selected-item': {
    display: 'block',
    overflow: 'auto',
  },
  '|appkit-form-multiselect-selected-item-label': {
    verticalAlign: 'middle',
  },
  '|appkit-form-multiselect-selected-item-remove': {
    float: 'right',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    margin: '1px',
  },
});

ax.extension.form.field.extras.components.controls.multiselect.select = function (
  f,
  options = {}
) {
  let a = ax.a;

  return f.select(
    // No name on select. Field name goes on hidden inputs.
    {
      placeholder: options.placeholder || '＋ Add',
      ...options.select,
      selections: options.selections,
      selectTag: {
        $on: {
          'change: add item to selection': function (e, el) {
            this.$(
              '^|appkit-form-control |appkit-form-multiselect-selected'
            ).$add({
              index: this.selectedIndex,
              value: this.value,
              label: this.options[this.selectedIndex].text,
            });
            this.$disableSelected();
          },
        },

        $disableSelected: function () {
          this.options[this.selectedIndex].disabled = 'disabled';
          this.selectedIndex = 0;
        },

        $enableDeselected: function (index) {
          this.options[index].removeAttribute('disabled');
        },

        ...(options.select || {}).selectTag,
      },
    }
  );
};

ax.extension.form.field.extras.components.controls.multiselect.selected = function (
  f,
  options = {}
) {
  let a = ax.a;

  return a['|appkit-form-multiselect-selected'](null, {
    $state: [],

    $remove: function (item) {
      let state = [...this.$state];
      let index = state.indexOf(item);
      if (index !== -1) {
        state.splice(index, 1);
        this.$state = state;
      }
      this.$send('ax.appkit.form.multiselect.selected.change');
    },

    $add: function (item, index) {
      this.$state = [item].concat(this.$state);
      this.$send('ax.appkit.form.multiselect.selected.change');
    },

    $update: function () {
      if (this.$state.length === 0) {
        this.style.display = 'none';
        this.$('^|appkit-form-multiselect-selected').previousSibling.required =
          options.required;
        this.$nodes = [
          f.input({
            name: options.name + '[]',
            disabled: true,
            inputTag: {
              type: 'hidden',
            },
          }),
        ];
      } else {
        this.style.display = '';
        this.$(
          '^|appkit-form-multiselect-selected'
        ).previousSibling.removeAttribute('required');
        this.$nodes = this.$state.map(function (item) {
          return a['|appkit-form-multiselect-selected-item'](
            [
              a['|appkit-form-multiselect-selected-item-label'](item.label),
              a['button|appkit-form-multiselect-selected-item-remove']('✖', {
                type: 'button',
                $on: {
                  'click: remove item from selection': function (e) {
                    if (!this.disabled) {
                      this.$('^|appkit-form-control')
                        .$('select')
                        .$enableDeselected(item.index);
                      this.$('^|appkit-form-multiselect-selected').$remove(
                        item
                      );
                    }
                  },
                },
                $disable: function () {
                  this.disabled = 'disabled';
                },
                $enable: function () {
                  this.removeAttribute('disabled');
                },
              }),
              f.input({
                name: options.name + '[]',
                required: options.required,
                value: item.value,
                inputTag: {
                  type: 'hidden',
                },
              }),
            ],
            options.itemTag
          );
        });
      }
    },
    ...options.selectedTag,
  });
};

ax.extension.form.field.extras.components.controls.password = function (
  f,
  options
) {
  let a = ax.a;

  if (options.confirmation == true) {
    options.confirmation = {};
  }

  let secure = function (element) {
    if (element.value) {
      element.style.fontFamily = 'text-security-disc';
    } else {
      element.style.fontFamily = 'unset';
    }
  };

  let inputOptions = {
    name: options.name,
    value: options.value,
    placeholder: options.placeholder,
    disabled: options.disabled,
    readonly: options.readonly,
    required: options.required,
    pattern: options.pattern,
    autocomplete: 'off',
    ...options.input,
    inputTag: {
      $valid: function () {
        this.setCustomValidity('');
        if (this.validity.valid) {
          return true;
        } else {
          if (options.invalid) {
            if (ax.is.function(options.invalid)) {
              let invalidMessage = options.invalid(this.value, this.validity);
              if (invalidMessage) {
                this.setCustomValidity(invalidMessage);
              }
            } else {
              this.setCustomValidity(options.invalid);
            }
          }
          return false;
        }
      },

      ...(options.input || {}).inputTag,
    },
  };

  let confirmation = function () {
    let confirmationInputOptions = {
      value: options.value,
      disabled: options.disabled,
      readonly: options.readonly,
      autocomplete: 'off',
      ...options.confirmation,
      inputTag: {
        $valid: function () {
          let input = this.$('^').$('input');
          if (input.value == this.value) {
            this.setCustomValidity('');
          } else {
            this.setCustomValidity('Passwords must match.');
          }
        },

        ...(options.confirmation || {}).inputTag,
      },
    };

    return f.input(confirmationInputOptions);
  };

  let controlTagOptions = {
    $init: function () {
      for (let input of this.$inputs()) {
        secure(input);
        input.$valid();
      }
    },

    $inputs: function () {
      return this.$$('input').$$;
    },

    $value: function () {
      return this.$inputs()[0].value;
    },

    $focus: function () {
      this.$inputs()[0].focus();
    },

    $disable: function () {
      for (let input of this.$inputs()) {
        input.setAttribute('disabled', 'disabled');
      }
    },

    $enable: function () {
      if (!inputOptions.disabled) {
        for (let input of this.$inputs()) {
          input.removeAttribute('disabled');
        }
      }
    },

    ...options.controlTag,

    $on: {
      'input: secure text': function () {
        for (let input of this.$inputs()) {
          secure(input);
        }
      },
      'input: check validity': function () {
        for (let input of this.$inputs()) {
          input.$valid();
        }
      },
      'input: send control change event': function () {
        this.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  return a['|appkit-form-control'](
    [f.input(inputOptions), options.confirmation ? confirmation() : null],
    controlTagOptions
  );
};

ax.extension.form.field.extras.components.controls.selectinput = (
  f,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let selections = x.lib.form.selections(options.selections);
  selections.push({
    disabled: 'hr',
  });
  selections.push({
    value: '__USE_INPUT__',
    label: options.customValueLabel || '⬇ Enter a value',
  });

  let selectValue;
  let inputValue;

  if (options.value) {
    let valueInselections = selections.some(
      (option) => option.value == options.value
    );
    selectValue = valueInselections ? options.value : '__USE_INPUT__';
    inputValue = valueInselections ? '' : options.value;
  } else {
    // If no value and no placeholder then show the input
    selectValue = options.placeholder ? '' : '__USE_INPUT__';
  }

  let controlTagOptions = {
    $value: function () {
      return this.$('|appkit-form-selectinput-hiddeninput input').value;
    },
    $focus: function () {
      let select = this.$('select');
      if (select.value === '__USE_INPUT__') {
        this.$('|appkit-form-selectinput-input input').focus();
      } else {
        select.focus();
      }
    },

    $disable: function () {
      let select = this.$('|appkit-form-selectinput-select select');
      let input = this.$('|appkit-form-selectinput-input input');
      let hiddeninput = this.$('|appkit-form-selectinput-hiddeninput input');
      select.disabled = 'disabled';
      input.disabled = 'disabled';
      hiddeninput.disabled = 'disabled';
    },
    $enable: function () {
      if (!options.disabled) {
        let select = this.$('|appkit-form-selectinput-select select');
        let input = this.$('|appkit-form-selectinput-input input');
        let hiddeninput = this.$('|appkit-form-selectinput-hiddeninput input');
        select.removeAttribute('disabled');
        input.removeAttribute('disabled');
        hiddeninput.removeAttribute('disabled');
      }
    },
    $on: {
      change: function () {
        let select = this.$('select');
        let input = this.$('|appkit-form-selectinput-input input');
        let hiddeninput = this.$('|appkit-form-selectinput-hiddeninput input');
        if (select.value === '__USE_INPUT__') {
          input.style.display = '';
          hiddeninput.value = input.value;
          if (options.required) {
            select.removeAttribute('required');
            input.required = 'required';
          }
          if (select == window.document.activeElement) {
            input.focus();
          }
        } else {
          input.style.display = 'none';
          hiddeninput.value = select.value;
          if (options.required) {
            input.removeAttribute('required');
            select.required = 'required';
          }
        }
      },
    },

    ...options.controlTag,
  };

  return a['|appkit-form-control'](
    [
      a['|appkit-form-selectinput-hiddeninput'](
        f.input({
          name: options.name,
          value: options.value,
          type: 'hidden',
          ...options.hiddeninput,
        })
      ),
      a['|appkit-form-selectinput-select'](
        f.select({
          value: selectValue,
          selections: selections,
          placeholder: options.placeholder,
          disabled: options.disabled,
          ...options.select,
        })
      ),
      a['|appkit-form-selectinput-input'](
        f.input({
          value: inputValue,
          disabled: options.disabled,
          ...options.input,
          inputTag: {
            style:
              selectValue == '__USE_INPUT__'
                ? {}
                : {
                    display: 'none',
                  },
            ...(options.input || {}).inputTag,
          },
        })
      ),
    ],
    controlTagOptions
  );
};

ax.extension.form.field.extras.components.controls.timezone = (
  f,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $value: function () {
      return this.$('select').value;
    },
    $focus: function () {
      this.$('select').focus();
    },

    $disable: function () {
      this.$('select').setAttribute('disabled', 'disabled');
    },

    $enable: function () {
      if (!selectOptions.disabled) {
        this.$('select').removeAttribute('disabled');
      }
    },

    ...options.controlTag,

    $on: {
      'click: do nothing when readonly': (e) => {
        if (selectOptions.readonly) e.preventDefault();
      },
      'change:': (e, el) => {
        el.$send('ax.appkit.form.control.change');
      },
      ...(options.controlTag || {}).$on,
    },
  };

  let selectOptions = {
    ...options,
    value: options.value || Intl.DateTimeFormat().resolvedOptions().timeZone,
    selections: x.lib.locale.timezones,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  return a['|appkit-form-control'](f.select(selectOptions), controlTagOptions);
};

ax.extension.form.field.extras.shim = {
  controls: {
    language: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.language(f, options),
    timezone: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.timezone(f, options),
    country: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.country(f, options),
    multiselect: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.multiselect(f, options),
    selectinput: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.selectinput(f, options),
    password: (f, target) => (options = {}) =>
      ax.x.form.field.extras.components.controls.password(f, options),
  },
};

ax.extension.lib.locale = {};

ax.extension.lib.locale.countries = {
  AF: 'Afghanistan',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'Andorra',
  AO: 'Angola',
  AQ: 'Antarctica',
  AG: 'Antigua and Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia and Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CV: 'Cape Verde',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo',
  CD: 'Congo, The Democratic Republic of The',
  CK: 'Cook Islands',
  CR: 'Costa Rica',
  CI: "CÔte D'ivoire",
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  ET: 'Ethiopia',
  FK: 'Falkland Islands (Malvinas)',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GN: 'Guinea',
  GW: 'Guinea Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard Island and Mcdonald Islands',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran, Islamic Republic of',
  IQ: 'Iraq',
  IE: 'Ireland',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KP: "Korea, Democratic People's Republic of",
  KR: 'Korea, Republic of',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: "Lao People's Democratic Republic",
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libyan Arab Jamahiriya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MK: 'Macedonia, The Former Yugoslav Republic of',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia, Federated States of',
  MD: 'Monaco',
  MN: 'Mongolia',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  AN: 'Netherlands Antilles',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestinian Territory, Occupied',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  RE: 'RÉunion',
  RO: 'Romania',
  RU: 'Russian Federation',
  RW: 'Rwanda',
  SH: 'Saint Helena',
  KN: 'Saint Kitts and Nevis',
  LC: 'Saint Lucia',
  PM: 'Saint Pierre and Miquelon',
  VC: 'Saint Vincent and The Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome and Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  CS: 'Serbia and Montenegro',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia and The South Sandwich Islands',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard and Jan Mayen',
  SZ: 'Swaziland',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic',
  TW: 'Taiwan, Province of China',
  TJ: 'Tajikistan',
  TZ: 'Tanzania, United Republic of',
  TH: 'Thailand',
  TL: 'Timor Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad and Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks and Caicos Islands',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  UM: 'United States Minor Outlying Islands',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela',
  VN: 'Viet Nam',
  VG: 'Virgin Islands, British',
  VI: 'Virgin Islands, U.S.',
  WF: 'Wallis and Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
};

ax.extension.lib.locale.languages = {
  ach: 'Acholi',
  aa: 'Afar',
  af: 'Afrikaans',
  ak: 'Akan',
  tw: 'Akan, Twi',
  sq: 'Albanian',
  am: 'Amharic',
  ar: 'Arabic',
  'ar-BH': 'Arabic, Bahrain',
  'ar-EG': 'Arabic, Egypt',
  'ar-SA': 'Arabic, Saudi Arabia',
  'ar-YE': 'Arabic, Yemen',
  an: 'Aragonese',
  'hy-AM': 'Armenian',
  frp: 'Arpitan',
  as: 'Assamese',
  ast: 'Asturian',
  tay: 'Atayal',
  av: 'Avaric',
  ae: 'Avestan',
  ay: 'Aymara',
  az: 'Azerbaijani',
  ban: 'Balinese',
  bal: 'Balochi',
  bm: 'Bambara',
  ba: 'Bashkir',
  eu: 'Basque',
  be: 'Belarusian',
  bn: 'Bengali',
  'bn-IN': 'Bengali, India',
  ber: 'Berber',
  bh: 'Bihari',
  bfo: 'Birifor',
  bi: 'Bislama',
  bs: 'Bosnian',
  'br-FR': 'Breton',
  bg: 'Bulgarian',
  my: 'Burmese',
  ca: 'Catalan',
  ceb: 'Cebuano',
  ch: 'Chamorro',
  ce: 'Chechen',
  chr: 'Cherokee',
  ny: 'Chewa',
  'zh-CN': 'Chinese Simplified',
  'zh-TW': 'Chinese Traditional',
  'zh-HK': 'Chinese Traditional, Hong Kong',
  'zh-MO': 'Chinese Traditional, Macau',
  'zh-SG': 'Chinese Traditional, Singapore',
  cv: 'Chuvash',
  kw: 'Cornish',
  co: 'Corsican',
  cr: 'Cree',
  hr: 'Croatian',
  cs: 'Czech',
  da: 'Danish',
  'fa-AF': 'Dari',
  dv: 'Dhivehi',
  nl: 'Dutch',
  'nl-BE': 'Dutch, Belgium',
  'nl-SR': 'Dutch, Suriname',
  dz: 'Dzongkha',
  en: 'English',
  'en-AR': 'English, Arabia',
  'en-AU': 'English, Australia',
  'en-BZ': 'English, Belize',
  'en-CA': 'English, Canada',
  'en-CB': 'English, Caribbean',
  'en-CN': 'English, China',
  'en-DK': 'English, Denmark',
  'en-HK': 'English, Hong Kong',
  'en-IN': 'English, India',
  'en-ID': 'English, Indonesia',
  'en-IE': 'English, Ireland',
  'en-JM': 'English, Jamaica',
  'en-JA': 'English, Japan',
  'en-MY': 'English, Malaysia',
  'en-NZ': 'English, New Zealand',
  'en-NO': 'English, Norway',
  'en-PH': 'English, Philippines',
  'en-PR': 'English, Puerto Rico',
  'en-SG': 'English, Singapore',
  'en-ZA': 'English, South Africa',
  'en-SE': 'English, Sweden',
  'en-GB': 'English, United Kingdom',
  'en-US': 'English, United States',
  'en-ZW': 'English, Zimbabwe',
  eo: 'Esperanto',
  et: 'Estonian',
  ee: 'Ewe',
  fo: 'Faroese',
  fj: 'Fijian',
  fil: 'Filipino',
  fi: 'Finnish',
  'vls-BE': 'Flemish',
  'fra-DE': 'Franconian',
  fr: 'French',
  'fr-BE': 'French, Belgium',
  'fr-CA': 'French, Canada',
  'fr-LU': 'French, Luxembourg',
  'fr-QC': 'French, Quebec',
  'fr-CH': 'French, Switzerland',
  'fy-NL': 'Frisian',
  'fur-IT': 'Friulian',
  ff: 'Fula',
  gaa: 'Ga',
  gl: 'Galician',
  ka: 'Georgian',
  de: 'German',
  'de-AT': 'German, Austria',
  'de-BE': 'German, Belgium',
  'de-LI': 'German, Liechtenstein',
  'de-LU': 'German, Luxembourg',
  'de-CH': 'German, Switzerland',
  got: 'Gothic',
  el: 'Greek',
  'el-CY': 'Greek, Cyprus',
  kl: 'Greenlandic',
  gn: 'Guarani',
  'gu-IN': 'Gujarati',
  ht: 'Haitian Creole',
  ha: 'Hausa',
  haw: 'Hawaiian',
  he: 'Hebrew',
  hz: 'Herero',
  hil: 'Hiligaynon',
  hi: 'Hindi',
  ho: 'Hiri Motu',
  hmn: 'Hmong',
  hu: 'Hungarian',
  is: 'Icelandic',
  ido: 'Ido',
  ig: 'Igbo',
  ilo: 'Ilokano',
  id: 'Indonesian',
  iu: 'Inuktitut',
  'ga-IE': 'Irish',
  it: 'Italian',
  'it-CH': 'Italian, Switzerland',
  ja: 'Japanese',
  jv: 'Javanese',
  quc: "K'iche'",
  kab: 'Kabyle',
  kn: 'Kannada',
  pam: 'Kapampangan',
  ks: 'Kashmiri',
  'ks-PK': 'Kashmiri, Pakistan',
  csb: 'Kashubian',
  kk: 'Kazakh',
  km: 'Khmer',
  rw: 'Kinyarwanda',
  'tlh-AA': 'Klingon',
  kv: 'Komi',
  kg: 'Kongo',
  kok: 'Konkani',
  ko: 'Korean',
  ku: 'Kurdish',
  kmr: 'Kurmanji (Kurdish)',
  kj: 'Kwanyama',
  ky: 'Kyrgyz',
  lol: 'LOLCAT',
  lo: 'Lao',
  'la-LA': 'Latin',
  lv: 'Latvian',
  lij: 'Ligurian',
  li: 'Limburgish',
  ln: 'Lingala',
  lt: 'Lithuanian',
  jbo: 'Lojban',
  nds: 'Low German',
  'dsb-DE': 'Lower Sorbian',
  lg: 'Luganda',
  luy: 'Luhya',
  lb: 'Luxembourgish',
  mk: 'Macedonian',
  mai: 'Maithili',
  mg: 'Malagasy',
  ms: 'Malay',
  'ms-BN': 'Malay, Brunei',
  'ml-IN': 'Malayalam',
  mt: 'Maltese',
  gv: 'Manx',
  mi: 'Maori',
  arn: 'Mapudungun',
  mr: 'Marathi',
  mh: 'Marshallese',
  moh: 'Mohawk',
  mn: 'Mongolian',
  'sr-Cyrl-ME': 'Montenegrin (Cyrillic)',
  me: 'Montenegrin (Latin)',
  mos: 'Mossi',
  na: 'Nauru',
  ng: 'Ndonga',
  'ne-NP': 'Nepali',
  'ne-IN': 'Nepali, India',
  pcm: 'Nigerian Pidgin',
  se: 'Northern Sami',
  nso: 'Northern Sotho',
  no: 'Norwegian',
  nb: 'Norwegian Bokmal',
  'nn-NO': 'Norwegian Nynorsk',
  oc: 'Occitan',
  oj: 'Ojibwe',
  or: 'Oriya',
  om: 'Oromo',
  os: 'Ossetian',
  pi: 'Pali',
  pap: 'Papiamento',
  ps: 'Pashto',
  fa: 'Persian',
  'en-PT': 'Pirate English',
  pl: 'Polish',
  'pt-PT': 'Portuguese',
  'pt-BR': 'Portuguese, Brazilian',
  'pa-IN': 'Punjabi',
  'pa-PK': 'Punjabi, Pakistan',
  qu: 'Quechua',
  'qya-AA': 'Quenya',
  ro: 'Romanian',
  'rm-CH': 'Romansh',
  rn: 'Rundi',
  ru: 'Russian',
  'ru-BY': 'Russian, Belarus',
  'ru-MD': 'Russian, Moldova',
  'ru-UA': 'Russian, Ukraine',
  'ry-UA': 'Rusyn',
  sah: 'Sakha',
  sg: 'Sango',
  sa: 'Sanskrit',
  sat: 'Santali',
  sc: 'Sardinian',
  sco: 'Scots',
  gd: 'Scottish Gaelic',
  sr: 'Serbian (Cyrillic)',
  'sr-CS': 'Serbian (Latin)',
  sh: 'Serbo-Croatian',
  crs: 'Seychellois Creole',
  sn: 'Shona',
  ii: 'Sichuan Yi',
  sd: 'Sindhi',
  'si-LK': 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  so: 'Somali',
  son: 'Songhay',
  ckb: 'Sorani (Kurdish)',
  nr: 'Southern Ndebele',
  sma: 'Southern Sami',
  st: 'Southern Sotho',
  'es-ES': 'Spanish',
  'es-EM': 'Spanish (Modern)',
  'es-AR': 'Spanish, Argentina',
  'es-BO': 'Spanish, Bolivia',
  'es-CL': 'Spanish, Chile',
  'es-CO': 'Spanish, Colombia',
  'es-CR': 'Spanish, Costa Rica',
  'es-DO': 'Spanish, Dominican Republic',
  'es-EC': 'Spanish, Ecuador',
  'es-SV': 'Spanish, El Salvador',
  'es-GT': 'Spanish, Guatemala',
  'es-HN': 'Spanish, Honduras',
  'es-MX': 'Spanish, Mexico',
  'es-NI': 'Spanish, Nicaragua',
  'es-PA': 'Spanish, Panama',
  'es-PY': 'Spanish, Paraguay',
  'es-PE': 'Spanish, Peru',
  'es-PR': 'Spanish, Puerto Rico',
  'es-US': 'Spanish, United States',
  'es-UY': 'Spanish, Uruguay',
  'es-VE': 'Spanish, Venezuela',
  su: 'Sundanese',
  sw: 'Swahili',
  'sw-KE': 'Swahili, Kenya',
  'sw-TZ': 'Swahili, Tanzania',
  ss: 'Swati',
  'sv-SE': 'Swedish',
  'sv-FI': 'Swedish, Finland',
  syc: 'Syriac',
  tl: 'Tagalog',
  ty: 'Tahitian',
  tg: 'Tajik',
  tzl: 'Talossan',
  ta: 'Tamil',
  'tt-RU': 'Tatar',
  te: 'Telugu',
  kdh: 'Tem (Kotokoli)',
  th: 'Thai',
  'bo-BT': 'Tibetan',
  ti: 'Tigrinya',
  ts: 'Tsonga',
  tn: 'Tswana',
  tr: 'Turkish',
  'tr-CY': 'Turkish, Cyprus',
  tk: 'Turkmen',
  uk: 'Ukrainian',
  'hsb-DE': 'Upper Sorbian',
  'ur-IN': 'Urdu (India)',
  'ur-PK': 'Urdu (Pakistan)',
  ug: 'Uyghur',
  uz: 'Uzbek',
  'val-ES': 'Valencian',
  ve: 'Venda',
  vec: 'Venetian',
  vi: 'Vietnamese',
  wa: 'Walloon',
  cy: 'Welsh',
  wo: 'Wolof',
  xh: 'Xhosa',
  yi: 'Yiddish',
  yo: 'Yoruba',
  zea: 'Zeelandic',
  zu: 'Zulu',
};

ax.extension.lib.locale.timezones = {
  'Pacific/Pago_Pago': '(GMT-11:00) American Samoa',
  'Pacific/Midway': '(GMT-11:00) Midway Island',
  'Pacific/Honolulu': '(GMT-10:00) Hawaii',
  'America/Juneau': '(GMT-09:00) Alaska',
  'America/New_York': '(GMT-05:00) Eastern Time (US & Canada)',
  'America/Tijuana': '(GMT-08:00) Tijuana',
  'America/Phoenix': '(GMT-07:00) Arizona',
  'America/Chihuahua': '(GMT-07:00) Chihuahua',
  'America/Mazatlan': '(GMT-07:00) Mazatlan',
  'America/Guatemala': '(GMT-06:00) Central America',
  'America/Mexico_City': '(GMT-06:00) Mexico City',
  'America/Monterrey': '(GMT-06:00) Monterrey',
  'America/Regina': '(GMT-06:00) Saskatchewan',
  'America/Bogota': '(GMT-05:00) Bogota',
  'America/Indiana/Indianapolis': '(GMT-05:00) Indiana (East)',
  'America/Lima': '(GMT-05:00) Quito',
  'America/Halifax': '(GMT-04:00) Atlantic Time (Canada)',
  'America/Caracas': '(GMT-04:00) Caracas',
  'America/Guyana': '(GMT-04:00) Georgetown',
  'America/La_Paz': '(GMT-04:00) La Paz',
  'America/Santiago': '(GMT-04:00) Santiago',
  'America/St_Johns': '(GMT-03:30) Newfoundland',
  'America/Sao_Paulo': '(GMT-03:00) Brasilia',
  'America/Argentina/Buenos_Aires': '(GMT-03:00) Buenos Aires',
  'America/Godthab': '(GMT-03:00) Greenland',
  'America/Montevideo': '(GMT-03:00) Montevideo',
  'Atlantic/South_Georgia': '(GMT-02:00) Mid-Atlantic',
  'Atlantic/Azores': '(GMT-01:00) Azores',
  'Atlantic/Cape_Verde': '(GMT-01:00) Cape Verde Is.',
  'Africa/Casablanca': '(GMT+00:00) Casablanca',
  'Europe/Dublin': '(GMT+00:00) Dublin',
  'Europe/London': '(GMT+00:00) London',
  'Europe/Lisbon': '(GMT+00:00) Lisbon',
  'Africa/Monrovia': '(GMT+00:00) Monrovia',
  'Etc/UTC': '(GMT+00:00) UTC',
  'Europe/Amsterdam': '(GMT+01:00) Amsterdam',
  'Europe/Belgrade': '(GMT+01:00) Belgrade',
  'Europe/Berlin': '(GMT+01:00) Berlin',
  'Europe/Zurich': '(GMT+01:00) Zurich',
  'Europe/Bratislava': '(GMT+01:00) Bratislava',
  'Europe/Brussels': '(GMT+01:00) Brussels',
  'Europe/Budapest': '(GMT+01:00) Budapest',
  'Europe/Copenhagen': '(GMT+01:00) Copenhagen',
  'Europe/Ljubljana': '(GMT+01:00) Ljubljana',
  'Europe/Madrid': '(GMT+01:00) Madrid',
  'Europe/Paris': '(GMT+01:00) Paris',
  'Europe/Prague': '(GMT+01:00) Prague',
  'Europe/Rome': '(GMT+01:00) Rome',
  'Europe/Sarajevo': '(GMT+01:00) Sarajevo',
  'Europe/Skopje': '(GMT+01:00) Skopje',
  'Europe/Stockholm': '(GMT+01:00) Stockholm',
  'Europe/Vienna': '(GMT+01:00) Vienna',
  'Europe/Warsaw': '(GMT+01:00) Warsaw',
  'Africa/Algiers': '(GMT+01:00) West Central Africa',
  'Europe/Zagreb': '(GMT+01:00) Zagreb',
  'Europe/Athens': '(GMT+02:00) Athens',
  'Europe/Bucharest': '(GMT+02:00) Bucharest',
  'Africa/Cairo': '(GMT+02:00) Cairo',
  'Africa/Harare': '(GMT+02:00) Harare',
  'Europe/Helsinki': '(GMT+02:00) Helsinki',
  'Asia/Jerusalem': '(GMT+02:00) Jerusalem',
  'Europe/Kaliningrad': '(GMT+02:00) Kaliningrad',
  'Europe/Kiev': '(GMT+02:00) Kyiv',
  'Africa/Johannesburg': '(GMT+02:00) Pretoria',
  'Europe/Riga': '(GMT+02:00) Riga',
  'Europe/Sofia': '(GMT+02:00) Sofia',
  'Europe/Tallinn': '(GMT+02:00) Tallinn',
  'Europe/Vilnius': '(GMT+02:00) Vilnius',
  'Asia/Baghdad': '(GMT+03:00) Baghdad',
  'Europe/Istanbul': '(GMT+03:00) Istanbul',
  'Asia/Kuwait': '(GMT+03:00) Kuwait',
  'Europe/Minsk': '(GMT+03:00) Minsk',
  'Europe/Moscow': '(GMT+03:00) St. Petersburg',
  'Africa/Nairobi': '(GMT+03:00) Nairobi',
  'Asia/Riyadh': '(GMT+03:00) Riyadh',
  'Europe/Volgograd': '(GMT+03:00) Volgograd',
  'Asia/Tehran': '(GMT+03:30) Tehran',
  'Asia/Muscat': '(GMT+04:00) Muscat',
  'Asia/Baku': '(GMT+04:00) Baku',
  'Europe/Samara': '(GMT+04:00) Samara',
  'Asia/Tbilisi': '(GMT+04:00) Tbilisi',
  'Asia/Yerevan': '(GMT+04:00) Yerevan',
  'Asia/Kabul': '(GMT+04:30) Kabul',
  'Asia/Yekaterinburg': '(GMT+05:00) Ekaterinburg',
  'Asia/Karachi': '(GMT+05:00) Karachi',
  'Asia/Tashkent': '(GMT+05:00) Tashkent',
  'Asia/Kolkata': '(GMT+05:30) New Delhi',
  'Asia/Colombo': '(GMT+05:30) Sri Jayawardenepura',
  'Asia/Kathmandu': '(GMT+05:45) Kathmandu',
  'Asia/Almaty': '(GMT+06:00) Almaty',
  'Asia/Dhaka': '(GMT+06:00) Dhaka',
  'Asia/Urumqi': '(GMT+06:00) Urumqi',
  'Asia/Rangoon': '(GMT+06:30) Rangoon',
  'Asia/Bangkok': '(GMT+07:00) Hanoi',
  'Asia/Jakarta': '(GMT+07:00) Jakarta',
  'Asia/Krasnoyarsk': '(GMT+07:00) Krasnoyarsk',
  'Asia/Novosibirsk': '(GMT+07:00) Novosibirsk',
  'Asia/Shanghai': '(GMT+08:00) Beijing',
  'Asia/Chongqing': '(GMT+08:00) Chongqing',
  'Asia/Hong_Kong': '(GMT+08:00) Hong Kong',
  'Asia/Irkutsk': '(GMT+08:00) Irkutsk',
  'Asia/Kuala_Lumpur': '(GMT+08:00) Kuala Lumpur',
  'Australia/Perth': '(GMT+08:00) Perth',
  'Asia/Singapore': '(GMT+08:00) Singapore',
  'Asia/Taipei': '(GMT+08:00) Taipei',
  'Asia/Ulaanbaatar': '(GMT+08:00) Ulaanbaatar',
  'Asia/Tokyo': '(GMT+09:00) Tokyo',
  'Asia/Seoul': '(GMT+09:00) Seoul',
  'Asia/Yakutsk': '(GMT+09:00) Yakutsk',
  'Australia/Adelaide': '(GMT+09:30) Adelaide',
  'Australia/Darwin': '(GMT+09:30) Darwin',
  'Australia/Brisbane': '(GMT+10:00) Brisbane',
  'Australia/Melbourne': '(GMT+10:00) Melbourne',
  'Pacific/Guam': '(GMT+10:00) Guam',
  'Australia/Hobart': '(GMT+10:00) Hobart',
  'Pacific/Port_Moresby': '(GMT+10:00) Port Moresby',
  'Australia/Sydney': '(GMT+10:00) Sydney',
  'Asia/Vladivostok': '(GMT+10:00) Vladivostok',
  'Asia/Magadan': '(GMT+11:00) Magadan',
  'Pacific/Noumea': '(GMT+11:00) New Caledonia',
  'Pacific/Guadalcanal': '(GMT+11:00) Solomon Is.',
  'Asia/Srednekolymsk': '(GMT+11:00) Srednekolymsk',
  'Pacific/Auckland': '(GMT+12:00) Wellington',
  'Pacific/Fiji': '(GMT+12:00) Fiji',
  'Asia/Kamchatka': '(GMT+12:00) Kamchatka',
  'Pacific/Majuro': '(GMT+12:00) Marshall Is.',
  'Pacific/Chatham': '(GMT+12:45) Chatham Is.',
  'Pacific/Tongatapu': "(GMT+13:00) Nuku'alofa",
  'Pacific/Apia': '(GMT+13:00) Samoa',
  'Pacific/Fakaofo': '(GMT+13:00) Tokelau Is.',
};

ax.extension.report.field.extras = {};

ax.extension.report.field.extras.components = {};

ax.extension.report.field.extras.components.controls = {};

ax.extension.report.field.extras.components.controls.boolean = (
  r,
  options = {}
) => {
  let a = ax.a;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  let label = options.label || {};

  let trueLabel = label.true || '✔ True';
  let falseLabel = label.false || '❌ False';

  return a['|appkit-report-control'](
    [
      a['|appkit-report-boolean'](
        options.value ? trueLabel : falseLabel,
        options.booleanTag
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.color = (
  r,
  options = {}
) => {
  let a = ax.a;

  let value = options.value;
  let component;

  if (value) {
    component = a.div(null, {
      style: {
        backgroundColor: options.value,
        height: '100%',
      },
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-color'](component, options.colorTag),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.country = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    label = x.lib.locale.countries[value];
    if (label) {
      component = label;
    } else {
      component = value;
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  let selectOptions = {
    ...options,
    selections: x.lib.locale.countries,
    placeholder: options.placeholder || ' ',
    ...options.select,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-country'](component, options.countryTag),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.datetime = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    if (options.only === 'time') {
      component = new Date(value).toTimeString();
    } else if (options.only === 'date') {
      component = new Date(value).toDateString();
    } else {
      component = new Date(value).toString();
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-datetime'](component, options.datetimeTag),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.email = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = a.a(value, {
      href: `mailto: ${value}`,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-email'](component, options.emailTag),
      r.validation({
        controlPattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        controlInvalid: 'Not a valid email address',
        ...options,
      }),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.json = function (
  r,
  options
) {
  let a = ax.a;

  let value = options.value;
  let component;

  if (value) {
    if (options.parse) {
      try {
        component = a.pre(
          JSON.stringify(JSON.parse(value), null, 2),
          options.preTag
        );
      } catch (error) {
        component = a['.error'](`⚠ ${error.message}`);
      }
    } else {
      component = a.pre(JSON.stringify(value, null, 2), options.preTag);
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    a['|appkit-report-json'](component, options.jsonTag),
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.language = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    let label = x.lib.locale.languages[value];
    if (label) {
      component = `${value} - ${label}`;
    } else {
      component = value;
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-language'](component, options.languageTag),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.number = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = Number(value);
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-number'](component, options.numberTag),
      r.validation({
        controlPattern: /^[+-]?([0-9]*[.])?[0-9]+$/,
        controlInvalid: 'Not a number',
        ...options,
      }),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.password = function (
  r,
  options
) {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  let passwordTagOptions = {
    $init: (el) => {
      el.style.fontFamily = 'text-security-disc';
    },
    ...options.passwordTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-password'](
        options.value
          ? [
              a['|appkit-report-password-text'](null, {
                $nodes: (el, flag) => {
                  if (flag > 0) {
                    el.style.fontFamily = 'text-security-disc';
                    el.classList.add('secure-text');
                  } else {
                    el.style.fontFamily = 'monospace';
                    el.classList.remove('secure-text');
                  }
                  return a({
                    $text: options.value || '',
                  });
                },
                $state: 1,
                ...options.textTag,
              }),
              x.button({
                label: '👁',
                onclick: (e, el) => {
                  let text = el.$(
                    '^|appkit-report-password |appkit-report-password-text'
                  );
                  text.$state = text.$state * -1;
                },
                ...options.button,
              }),
            ]
          : a['i.placeholder'](
              ax.is.undefined(options.placeholder)
                ? 'None'
                : options.placeholder
            ),
        options.passwordTag
      ),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.css({
  '|appkit-report-password': {
    button: {
      fontSize: '1em',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      float: 'right',
    },
  },
});

ax.extension.report.field.extras.components.controls.preformatted = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  let component;

  if (options.value) {
    component = a.pre(options.value || '', options.preTag);
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-report-control'](
    [
      a['|appkit-report-preformatted'](component, options.preformattedTag),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.tel = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = a.a(value, {
      href: `tel: ${value}`,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-tel'](component, options.telTag),
      r.validation({
        controlPattern: /^(?:\d{8}(?:\d{2}(?:\d{2})?)?|\(\+?\d{2,3}\)\s?(?:\d{4}[\s*.-]?\d{4}|\d{3}[\s*.-]?\d{3}|\d{2}([\s*.-]?)\d{2}\1\d{2}(?:\1\d{2})?))$/,
        controlInvalid: 'Not a valid phone number',
        ...options,
      }),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.timezone = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    label = x.lib.locale.timezones[value];
    if (label) {
      component = label;
    } else {
      component = value;
    }
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-timezone'](component, options.timezoneTag),
      r.validation(options),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.components.controls.url = (
  r,
  options = {}
) => {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = a.a(value, {
      href: value,
      target: value,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  let controlTagOptions = {
    'data-name': options.name,
    tabindex: 0,
    $value: function () {
      return options.value;
    },
    $focus: function () {
      this.focus();
    },

    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    [
      a['|appkit-report-timezone'](component, options.urlTag),
      r.validation({
        controlPattern: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
        controlInvalid: 'Not a valid URL',
        ...options,
      }),
    ],
    controlTagOptions
  );
};

ax.extension.report.field.extras.shim = {
  controls: {
    boolean: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.boolean(r, options),
    language: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.language(r, options),
    timezone: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.timezone(r, options),
    country: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.country(r, options),
    color: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.color(r, options),
    datetime: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.datetime(r, options),
    email: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.email(r, options),
    tel: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.tel(r, options),
    url: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.url(r, options),
    number: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.number(r, options),
    password: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.password(r, options),
    preformatted: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.preformatted(r, options),
    json: (r, target) => (options = {}) =>
      ax.x.report.field.extras.components.controls.json(r, options),
  },
};

ax.extension.form.field.nest = {};

ax.extension.form.field.nest.components = {};

ax.extension.form.field.nest.components.nest = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let nestForm = options.form || (() => null);

  let ff = this.nest.factory({
    scope: options.name, // name is the scope for child items
    object: options.value,
    singular: options.singular,
    unindexed: options.unindexed,
    formOptions: f.formOptions,
  });
  let rebasedName = function (name, scope, index) {
    let pattern = `^${scope.replace(/(\[|\])/g, '\\$1')}\\[\\d*\\](.*)$`;
    let regex = new RegExp(pattern);
    let match = name.match(regex);
    let i = options.unindexed ? '' : index;
    return `${scope}[${i}]${match[1]}`;
  };

  let nestTagOptions = {
    name: ff.scope,

    $rescopeElement: function (el, scope, index) {
      el.setAttribute(
        'name',
        rebasedName(el.getAttribute('name'), scope, index)
      );
    },

    $rescope: function (scope, index) {
      let name = rebasedName(this.getAttribute('name'), scope, index);
      this.setAttribute('name', name);
      ff.scope = name;

      let namedElements = x.lib.unnested(this, `[name^="${scope}"]`);
      namedElements.forEach(
        function (el) {
          debugger;
          if (el.dataset.axPseudotag == 'appkit-form-nest') {
            el.$rescope(scope, index);
          } else {
            this.$rescopeElement(el, scope, index);
          }
        }.bind(this)
      );
    },

    ...options.nestTag,
  };

  let controlTagOptions = {
    $value: function () {
      let items = this.$('|appkit-form-nest-items');
      if (items) {
        return this.$('|appkit-form-nest-items').$count();
      } else {
        return null;
      }
    },
    $controls: function () {
      return x.lib.unnested(this, '|appkit-form-control');
    },
    $buttons: function () {
      return this.$$('button').$$;
    },
    $disable: function () {
      let controls = [...this.$controls(), ...this.$buttons()];
      for (let i in controls) {
        controls[i].$disable && controls[i].$disable();
      }
    },
    $enable: function () {
      let controls = [...this.$controls(), ...this.$buttons()];
      for (let i in controls) {
        controls[i].$enable && controls[i].$enable();
      }
    },
    $focus: function () {
      let first = this.$('|appkit-form-control');
      if (first) first.$focus();
    },
    $on: {
      'ax.appkit.form.nest.item.move': (e, el) =>
        el.$send('ax.appkit.form.control.change'),
      'ax.appkit.form.nest.item.add': (e, el) =>
        el.$send('ax.appkit.form.control.change'),
      'ax.appkit.form.nest.item.remove': (e, el) =>
        el.$send('ax.appkit.form.control.change'),
    },
    ...options.controlTag,
  };

  return a['|appkit-form-control'](
    a['|appkit-form-nest'](nestForm(ff), nestTagOptions),
    controlTagOptions
  );
};

ax.extension.form.field.nest.components.nest.add = function (f, options) {
  let a = ax.a;

  let singular = f.singular;

  let label = `✚ Add${singular ? ` ${singular}` : ''}`;

  return a['|appkit-form-nest-add-button'](
    f.button({
      label: label,
      onclick: (e, el) => {
        let itemsTag = options.target
          ? options.target(el)
          : el.$('^|appkit-form-nest |appkit-form-nest-items');
        itemsTag.$add();
        itemsTag.$send('ax.appkit.form.nest.item.add');
      },
      ...options,
    }),
    options.addButtonTag
  );
};

ax.extension.form.field.nest.components.nest.factory = function (options) {
  let x = ax.x;

  let ff = x.form.factory({
    scope: options.scope,
    object: options.object,
    formOptions: options.formOptions,
    items: (options = {}) => this.items(ff, options),
    add: (options = {}) => this.add(ff, options),
    unindexed: options.unindexed,
    singular: options.singular,
  });

  return ff;
};

ax.extension.form.field.nest.components.nest.items = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let formFn = options.form || (() => null);
  let item = function (itemData, index) {
    let i = f.unindexed ? '' : index;
    let scope = f.scope ? `${f.scope}[${i}]` : `${i}`;
    let ff = this.items.factory({
      scope: scope,
      object: itemData,
      index: index,
      singular: f.singular,
      unindexed: f.unindexed,
      formOptions: f.formOptions,
    });

    return a['div|appkit-form-nest-item'](formFn(ff), {
      $rescope: function (scope, index) {
        ff.index = index;
        let i = ff.unindexed ? '' : index;
        ff.scope = `${scope}[${i}]`;

        let namedElements = x.lib.unnested(this, `[name^="${scope}"]`);

        namedElements.forEach(function (el) {
          if (el.dataset.axPseudotag == 'appkit-form-nest') {
            el.$rescope(scope, index);
          } else {
            el.$('^|appkit-form-nest').$rescopeElement(el, scope, index);
          }
        });
      },
      ...options.itemTag,
    });
  }.bind(this);

  let itemsData;
  let object = f.object;

  if (ax.is.array(object)) {
    itemsData = object;
  } else if (ax.is.object(object)) {
    itemsData = Object.values(object || {});
  } else {
    itemsData = [];
  }

  return a['div|appkit-form-nest-items'](itemsData.map(item), {
    $add: function () {
      let newItem = item({}, this.children.length);
      this.append(newItem);
      let first = newItem.$('|appkit-form-control');
      if (first) first.$focus();
    },
    $count: function () {
      return this.$$(':scope > |appkit-form-nest-item').$$.length;
    },
    $rescopeItems: function () {
      this.$$(':scope > |appkit-form-nest-item').$$.forEach(function (
        itemTag,
        index
      ) {
        itemTag.$rescope(f.scope, index);
      });
    },
    ...options.itemsTag,
    $on: {
      'ax.appkit.form.nest.item.move': (e, el) => {
        e.stopPropagation();
        el.$rescopeItems();
      },
      'ax.appkit.form.nest.item.remove': (e, el) => {
        e.stopPropagation();
        el.$rescopeItems();
      },
      ...(options.itemsTag || {}).$on,
    },
  });
};

ax.extension.form.field.nest.components.nest.items.down = function (
  f,
  options = {}
) {
  return f.button({
    label: '⏷',
    onclick: function (e, el) {
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^|appkit-form-nest-item');
      var next = target.nextSibling;
      var parent = target.parentElement;
      if (next) {
        parent.insertBefore(target, next.nextSibling);
        el.focus();
        this.$send('ax.appkit.form.nest.item.move');
      }
    },
    ...options,
  });
};

ax.extension.form.field.nest.components.nest.items.factory = function (
  options = {}
) {
  let x = ax.x;

  let f = x.form.factory({
    scope: options.scope,
    object: options.object,
    formOptions: options.formOptions,
    index: options.index,
    unindexed: options.unindexed,
    singular: options.singular,
    remove: (options) => this.remove(f, options),
    up: (options) => this.up(f, options),
    down: (options) => this.down(f, options),
  });

  return f;
};

ax.extension.form.field.nest.components.nest.items.remove = function (
  f,
  options = {}
) {
  let singular = f.singular || 'item';
  let confirmation;

  if (ax.is.false(options.confirm)) {
    confirmation = false;
  } else if (ax.is.string(options.confirm) || ax.is.function(options.confirm)) {
    confirmation = options.confirm;
  } else {
    confirmation = `Are you sure that you want to remove this ${singular}?`;
  }

  return f.button({
    label: '✖',
    confirm: confirmation,
    onclick: function (e, el) {
      var target = el.$('^|appkit-form-nest-item');
      let parent = target.parentElement;
      let index = Array.prototype.indexOf.call(parent.children, target);
      target.remove();
      (ax.x.lib.tabable.next(parent) || window.document.body).focus();
      let length = parent.children.length;
      parent.$send('ax.appkit.form.nest.item.remove', {
        detail: {
          target: el,
          index: index,
          length: length,
        },
      });
    },
    ...options,
  });
};

ax.extension.form.field.nest.components.nest.items.up = function (
  f,
  options = {}
) {
  return f.button({
    label: '⏶',
    onclick: function (e, el) {
      var target = options.itemTarget
        ? options.itemTarget(el)
        : el.$('^|appkit-form-nest-item');
      var previous = target.previousSibling;
      var parent = target.parentElement;
      if (previous) {
        parent.insertBefore(target, previous);
        el.focus();
        this.$send('ax.appkit.form.nest.item.move');
      }
    },
    ...options,
  });
};

ax.extension.form.field.nest.shim = {
  controls: {
    nest: (f, target) => (options = {}) =>
      ax.x.form.field.nest.components.nest(f, options),
  },
};

ax.extension.report.field.nest = {};

ax.extension.report.field.nest.components = {};

ax.extension.report.field.nest.components.nest = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let nestReport = options.report || (() => null);

  let nestFactory = this.nest.factory({
    scope: options.name, // name is the scope for child items
    object: options.value,
    reportOptions: r.reportOptions,
  });

  let nestTagOptions = {
    name: nestFactory.scope,
    ...options.nestTag,
  };

  let controlTagOptions = {
    $value: function () {
      let items = this.$('|appkit-report-nest-items');
      if (items) {
        return this.$('|appkit-report-nest-items').$count();
      } else {
        return null;
      }
    },
    $focus: function () {
      let first = this.$('|appkit-report-control');
      if (first) first.$focus();
    },
    ...options.controlTag,
  };

  return a['|appkit-report-control'](
    a['|appkit-report-nest'](nestReport(nestFactory), nestTagOptions),
    controlTagOptions
  );
};

ax.extension.report.field.nest.components.nest.factory = function (options) {
  let x = ax.x;

  let ff = x.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options.reportOptions,
  });

  ff.items = (options = {}) => this.items(ff, options);

  return ff;
};

ax.extension.report.field.nest.components.nest.items = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let reportFn = options.report || (() => null);
  let item = function (itemData, index) {
    let ff = this.items.factory({
      scope: f.scope ? `${f.scope}[${index}]` : `${index}`,
      object: itemData,
      index: index,
      reportOptions: f.reportOptions,
    });

    return a['|appkit-report-nest-item'](reportFn(ff), options.itemTag);
  }.bind(this);

  let itemsData;
  let object = f.object;

  if (ax.is.array(object)) {
    itemsData = object;
  } else if (ax.is.object(object)) {
    itemsData = Object.values(object || {});
  } else {
    itemsData = [];
  }

  return a['|appkit-report-nest-items'](
    itemsData.length
      ? itemsData.map(item)
      : a['i.placeholder'](
          ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
        ),
    {
      $count: function () {
        return this.$$(':scope > |appkit-report-nest-item').$$.length;
      },
      ...options.itemsTag,
    }
  );
};

ax.extension.report.field.nest.components.nest.items.factory = function (
  options
) {
  let x = ax.x;

  let index = options.index;

  let f = x.report.factory({
    scope: options.scope,
    object: options.object,
    reportOptions: options.reportOptions,
  });

  f.index = index;

  return f;
};

ax.extension.report.field.nest.shim = {
  controls: {
    nest: (f, target) => (options = {}) =>
      ax.x.report.field.nest.components.nest(f, options),
  },
};

ax.extension.form.field.nest.prefab = {};

ax.extension.form.field.nest.prefab.components = {};

ax.extension.form.field.nest.prefab.components.many = function (f, options) {
  let a = ax.a;

  return f.controls.nest({
    ...options,
    form: (ff) => (a, x) => {
      return a['|appkit-form-nest-many-wrapper'](
        [
          ff.items({
            ...options,
            form: (fff) => [
              a['|appkit-form-nest-many-item-header'](
                [
                  a['|appkit-form-nest-many-item-buttons'](
                    [
                      options.moveable ? fff.up(options.upButton) : null,
                      options.moveable ? fff.down(options.downButton) : null,
                      options.removeable
                        ? fff.remove(options.removeButton)
                        : null,
                    ],
                    options.itemButtonsTag
                  ),
                ],
                options.itemHeaderTag
              ),
              a['|appkit-form-nest-many-item-body'](
                options.form(fff),
                options.itemBodyTag
              ),
            ],
            itemsTag: {
              ...options.itemsTag,
              $on: {
                sortstart: (e, el) => {
                  let item = e.detail.item;
                  el.$dragging = item;
                  el.$send('ax.appkit.form.table.drag.start', {
                    detail: e.detail,
                  });
                },
                sortstop: (e, el) => {
                  el.$send('ax.appkit.form.table.drag.stop', {
                    detail: e.detail,
                  });
                },
                sortupdate: (e, el) => {
                  this.$dragging = undefined;
                  el.$rescopeItems();
                  el.$send('ax.appkit.form.table.drag.update', {
                    detail: e.detail,
                  });
                },
                ...(options.itemsTag || {}).$on,
              },
              $startDrag: function () {
                this.$$('|appkit-form-nest-drag-off button').click(); // turn off sort on children
                this.$('^|appkit-form-nest')
                  .$$('|appkit-form-nest-add-button button')
                  .$disable();
                let buttons = this.$(
                  '^|appkit-form-nest |appkit-form-nest-items'
                ).$$('button').$$;
                for (let button of buttons) {
                  button.$disable && button.$disable();
                }
                sortable(this, {
                  forcePlaceholderSize: true,
                });
                this.$drag = true;
              },
              $stopDrag: function () {
                this.$drag = false;
                sortable(this, 'destroy');
                this.$('^|appkit-form-nest')
                  .$$('|appkit-form-nest-add-button button')
                  .$enable();
                let buttons = this.$(
                  '^|appkit-form-nest |appkit-form-nest-items'
                ).$$('button').$$;
                for (let button of buttons) {
                  button.$enable && button.$enable();
                }
              },
            },
          }),

          a['|appkit-form-nest-many-footer'](
            [
              options.addable ? ff.add(options.addButton) : null,

              options.draggable
                ? a['|appkit-form-nest-drag-buttons'](
                    [
                      options.deletable
                        ? a['|appkit-form-nest-delete']('✖', {
                            tabindex: 1,
                            ...options.deleteTag,
                            $on: {
                              click: () =>
                                alert(
                                  `Drag ${
                                    options.singular || 'item'
                                  } here to remove it.`
                                ),
                              dragover: (e, el) => {
                                let items = el.$(
                                  '^|appkit-form-nest |appkit-form-nest-items'
                                );
                                let item = items.$dragging;
                                if (item.contains(item)) {
                                  confirmation = confirm(
                                    `Are you sure that you want to remove this ${
                                      options.singular || 'item'
                                    }?`
                                  );
                                  if (confirmation) item.remove();
                                }
                              },
                              ...(options.deleteTag || {}).$on,
                            },
                            style: {
                              ...(options.deleteTag || {}).style,
                              display: 'none',
                            },
                          })
                        : null,
                      a['|appkit-form-nest-drag-on'](
                        ff.button({
                          label: '⬍',
                          onclick: (e, el) => {
                            let dragOn = el.$('^|appkit-form-nest-drag-on');
                            let dragOff = el.$(
                              '^|appkit-form-nest-drag-buttons |appkit-form-nest-drag-off'
                            );
                            let dragDelete = el.$(
                              '^|appkit-form-nest-drag-buttons |appkit-form-nest-delete'
                            );
                            el.$(
                              '^|appkit-form-nest |appkit-form-nest-items'
                            ).$startDrag();
                            el
                              .$('^|appkit-form-nest')
                              .$$('|appkit-form-nest-item').tabIndex = 1;
                            dragOn.style.display = 'none';
                            if (dragDelete) dragDelete.style.display = '';
                            dragOff.style.display = '';
                            dragOff.$('button').focus();
                          },
                          ...options.dragOnButton,
                        }),
                        options.dragOnTag
                      ),
                      a['|appkit-form-nest-drag-off'](
                        ff.button({
                          label: '⬍',
                          onclick: (e, el) => {
                            let dragOff = el.$('^|appkit-form-nest-drag-off');
                            let dragOn = el.$(
                              '^|appkit-form-nest-drag-buttons |appkit-form-nest-drag-on'
                            );
                            let dragDelete = el.$(
                              '^|appkit-form-nest-drag-buttons |appkit-form-nest-delete'
                            );
                            el.$(
                              '^|appkit-form-nest |appkit-form-nest-items'
                            ).$stopDrag();
                            el.$('^|appkit-form-nest')
                              .$$('|appkit-form-nest-item')
                              .removeAttribute('tabindex');
                            dragOff.style.display = 'none';
                            if (dragDelete) dragDelete.style.display = 'none';
                            dragOn.style.display = '';
                            dragOn.$('button').focus();
                          },
                          ...options.dragOffButton,
                        }),
                        {
                          ...options.dragOffTag,
                          style: {
                            ...(options.dragOffTag || {}).style,
                            display: 'none',
                          },
                        }
                      ),
                    ],
                    options.dragButtonsTag
                  )
                : null,
            ],
            options.footerTag
          ),
        ],
        options.wrapperTag
      );
    },
  });
};

ax.extension.form.field.nest.prefab.components.table = function (f, options) {
  let a = ax.a;

  return f.controls.nest({
    ...options,
    form: (ff) => (a, x) => {
      let form = options.form || (() => {});

      let tableHeader = function () {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                let label = ax.is.false(fieldOptions.label)
                  ? null
                  : fieldOptions.label || x.lib.text.labelize(fieldOptions.key);
                return a.th(
                  a['|appkit-form-field']([
                    label,
                    fieldOptions.help
                      ? ff.helpbutton({
                          helpbuttonTag: {
                            $on: {
                              'click: toggle help': function () {
                                this.$state = !this.$state;
                                this.$(
                                  '^table',
                                  `|appkit-form-field-help[data-field-key="${fieldOptions.key}"]`
                                ).$toggle();
                              },
                            },
                          },
                        })
                      : null,
                  ]),
                  options.thTag
                );
              };
            } else {
              return a.td(null, options.tdTag);
            }
          },
        });

        let headerCells = function () {
          let cells = form(ffP) || [];
          if (options.moveable || options.removeable)
            cells.push(
              a.th(null, {
                width: '10%',
                ...options.thTag,
              })
            );
          return cells;
        };

        return a.thead(a.tr(headerCells(), options.trTag), options.theadTag);
      };

      let tableHelp = function () {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                return a.td(
                  ff.help({
                    help: fieldOptions.help,
                    helpTag: {
                      'data-field-key': fieldOptions.key,
                      ...options.helpTag,
                    },
                  }),
                  options.helpTdTag
                );
              };
            } else {
              return a.td(null, options.helpTdTag);
            }
          },
        });

        let helpCells = function () {
          let cells = form(ffP) || [];
          if (options.moveable || options.removeable)
            cells.push(a.td(null, options.helpTdTag));
          return cells;
        };

        return a.tr(helpCells(), options.helpTrTag);
      };

      let tableHint = function () {
        let ffP = new Proxy(ff, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                return a.td(
                  ff.hint({
                    hint: fieldOptions.hint,
                    hintTag: options.hintTag,
                  }),
                  options.hintTdTag
                );
              };
            } else {
              return a.td(null, options.hintTdTag);
            }
          },
        });

        let hintCells = function () {
          let cells = form(ffP) || [];
          if (options.moveable || options.removeable)
            cells.push(a.td(null, options.helpTdTag));
          return cells;
        };

        return a.tr(hintCells(), options.hintTrTag);
      };

      let tableBody = () =>
        ff.items({
          ...options.items,
          form: (fff) => {
            let fffP = new Proxy(fff, {
              get: (target, property) => {
                if (property == 'field') {
                  return (fieldOptions) => {
                    return a.td(fff.control(fieldOptions), options.tdTag);
                  };
                } else {
                  return target[property];
                }
              },
            });

            let cells = form(fffP);

            if (options.moveable || options.removeable)
              cells.push(
                a.td(
                  a['|appkit-form-nest-table-item-buttons'](
                    [
                      options.moveable
                        ? fffP.up({
                            // itemTarget: (el) => el.$('^tr'),
                            ...options.upButton,
                          })
                        : null,
                      options.moveable
                        ? fffP.down({
                            // itemTarget: (el) => el.$('^tr'),
                            ...options.downButton,
                          })
                        : null,
                      options.removeable
                        ? fffP.remove({
                            // itemTarget: (el) => el.$('^tr'),
                            ...options.removeButton,
                          })
                        : null,
                    ],
                    options.itemButtonsTag
                  ),
                  options.tdTag
                )
              );

            return cells;
          },
          itemsTag: {
            $tag: 'tbody',
            ...options.itemsTag,
            $on: {
              sortstart: (e, el) => {
                let item = e.detail.item;
                el.$dragging = item;
                el.$send('ax.appkit.form.table.drag.start', {
                  detail: e.detail,
                });
              },
              sortstop: (e, el) => {
                el.$send('ax.appkit.form.table.drag.stop', {
                  detail: e.detail,
                });
              },
              sortupdate: (e, el) => {
                this.$dragging = undefined;
                el.$rescopeItems();
                el.$send('ax.appkit.form.table.drag.update', {
                  detail: e.detail,
                });
              },
              ...(options.itemsTag || {}).$on,
            },
            $startDrag: function () {
              this.$$('|appkit-form-nest-drag-off button').click(); // turn off sort on children
              this.$('^|appkit-form-nest')
                .$$('|appkit-form-nest-add-button button')
                .$disable();
              let buttons = this.$(
                '^|appkit-form-nest |appkit-form-nest-items'
              ).$$('button').$$;
              for (let button of buttons) {
                button.$disable && button.$disable();
              }
              sortable(this, {
                items: 'tr',
                forcePlaceholderSize: true,
              });
              this.$drag = true;
            },
            $stopDrag: function () {
              this.$drag = false;
              sortable(this, 'destroy');
              this.$('^|appkit-form-nest')
                .$$('|appkit-form-nest-add-button button')
                .$enable();
              let buttons = this.$(
                '^|appkit-form-nest |appkit-form-nest-items'
              ).$$('button').$$;
              for (let button of buttons) {
                button.$enable && button.$enable();
              }
            },
          },
          itemTag: {
            $tag: 'tr',
            ...options.itemTag,
          },
        });

      let tableButtons = function () {
        return a['|appkit-form-nest-table-footer'](
          [
            options.addable ? ff.add(options.addButton) : null,

            options.draggable
              ? a['|appkit-form-nest-drag-buttons'](
                  [
                    options.deletable
                      ? a['|appkit-form-nest-delete']('✖', {
                          tabindex: 1,
                          ...options.deleteTag,
                          $on: {
                            click: () =>
                              alert(
                                `Drag ${
                                  options.singular || 'item'
                                } here to remove it.`
                              ),
                            dragover: (e, el) => {
                              let items = el.$(
                                '^|appkit-form-nest |appkit-form-nest-items'
                              );
                              let item = items.$dragging;
                              if (item.contains(item)) {
                                confirmation = confirm(
                                  `Are you sure that you want to remove this ${
                                    options.singular || 'item'
                                  }?`
                                );
                                if (confirmation) item.remove();
                              }
                            },
                            ...(options.deleteTag || {}).$on,
                          },
                          style: {
                            ...(options.deleteTag || {}).style,
                            display: 'none',
                          },
                        })
                      : null,
                    a['|appkit-form-nest-drag-on'](
                      ff.button({
                        label: '⬍',
                        onclick: (e, el) => {
                          let dragOn = el.$('^|appkit-form-nest-drag-on');
                          let dragOff = el.$(
                            '^|appkit-form-nest-drag-buttons |appkit-form-nest-drag-off'
                          );
                          let dragDelete = el.$(
                            '^|appkit-form-nest-drag-buttons |appkit-form-nest-delete'
                          );
                          el.$(
                            '^|appkit-form-nest |appkit-form-nest-items'
                          ).$startDrag();
                          el
                            .$('^|appkit-form-nest')
                            .$$('|appkit-form-nest-item').tabIndex = 1;
                          dragOn.style.display = 'none';
                          if (dragDelete) dragDelete.style.display = '';
                          dragOff.style.display = '';
                          dragOff.$('button').focus();
                        },
                        ...options.dragOnButton,
                      }),
                      options.dragOnTag
                    ),
                    a['|appkit-form-nest-drag-off'](
                      ff.button({
                        label: '⬍',
                        onclick: (e, el) => {
                          let dragOff = el.$('^|appkit-form-nest-drag-off');
                          let dragOn = el.$(
                            '^|appkit-form-nest-drag-buttons |appkit-form-nest-drag-on'
                          );
                          let dragDelete = el.$(
                            '^|appkit-form-nest-drag-buttons |appkit-form-nest-delete'
                          );
                          el.$(
                            '^|appkit-form-nest |appkit-form-nest-items'
                          ).$stopDrag();
                          el.$('^|appkit-form-nest')
                            .$$('|appkit-form-nest-item')
                            .removeAttribute('tabindex');
                          dragOff.style.display = 'none';
                          if (dragDelete) dragDelete.style.display = 'none';
                          dragOn.style.display = '';
                          dragOn.$('button').focus();
                        },
                        ...options.dragOffButton,
                      }),
                      {
                        ...options.dragOffTag,
                        style: {
                          ...(options.dragOffTag || {}).style,
                          display: 'none',
                        },
                      }
                    ),
                  ],
                  options.dragButtonsTag
                )
              : null,
          ],
          options.footerTag
        );
      };

      return a['|appkit-form-nest-table-wrapper'](
        [
          a.table(
            [tableHeader(), tableHelp(), tableBody(), tableHint()],
            options.tableTag
          ),
          tableButtons(),
        ],
        options.wrapperTag
      );
    },
  });
};

ax.css({
  '|appkit-form-nest-item[draggable]': {
    cursor: 'grab',
    'input, textarea, select, button': {
      pointerEvents: 'none',
    },
  },
  '|appkit-form-nest-item[draggable]:active': {
    cursor: 'grabbing',
  },
});

ax.extension.form.field.nest.prefab.shim = {
  field: (f, target) => (options = {}) => {
    if (options.collection) {
      if (
        options.as == 'one' ||
        options.control == 'one' ||
        options.as == 'many' ||
        options.control == 'many' ||
        options.as == 'table' ||
        options.control == 'table' ||
        options.as == 'nest' ||
        options.control == 'nest'
      ) {
        options.collection = false;
      }
      options.unindexed = true;
    }
    return target(options);
  },

  controls: {
    table: (f) => (options) =>
      ax.x.form.field.nest.prefab.components.table(f, options),
    many: (f) => (options) =>
      ax.x.form.field.nest.prefab.components.many(f, options),
    one: (f) => (options) => f.controls.nest(options),
  },
};

ax.extension.report.field.nest.prefab = {};

ax.extension.report.field.nest.prefab.components = {};

ax.extension.report.field.nest.prefab.components.many = function (f, options) {
  let a = ax.a;

  return f.controls.nest({
    ...options,
    report: (ff) => (a, x) =>
      a['|appkit-report-nest-many-wrapper'](
        [
          ff.items({
            ...options,
            report: (fff) => [
              a['|appkit-report-nest-many-item-header'](
                null,
                options.itemHeaderTag
              ),
              a['|appkit-report-nest-many-item-body'](
                options.report(fff),
                options.itemBodyTag
              ),
            ],
          }),
        ],
        options.wrapperTag
      ),
  });
};

ax.extension.report.field.nest.prefab.components.table = function (r, options) {
  let a = ax.a;

  return r.controls.nest({
    ...options,
    report: (rr) => (a, x) => {
      let report = options.report || (() => {});

      let tableHeader = function () {
        let rrP = new Proxy(rr, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                let label = ax.is.false(fieldOptions.label)
                  ? null
                  : fieldOptions.label || x.lib.text.labelize(fieldOptions.key);
                return a.th(
                  a['|appkit-report-field']([
                    label,
                    fieldOptions.help
                      ? r.helpbutton({
                          helpbuttonTag: {
                            $on: {
                              'click: toggle help': function () {
                                this.$state = !this.$state;
                                this.$(
                                  '^table',
                                  `|appkit-report-field-help[data-field-key="${fieldOptions.key}"]`
                                ).$toggle();
                              },
                            },
                          },
                        })
                      : null,
                  ]),
                  options.thTag
                );
              };
            } else {
              return a.td(null, options.tdTag); // empty cell
            }
          },
        });

        let headerCells = function () {
          let cells = report(rrP) || [];
          return cells;
        };

        return a.thead(a.tr(headerCells(), options.trTag), options.theadTag);
      };

      let tableHelp = function () {
        let rrP = new Proxy(rr, {
          get: (target, property) => {
            if (property === 'field') {
              return (fieldOptions) => {
                return a.td(
                  rr.help({
                    help: fieldOptions.help,
                    helpTag: {
                      ...options.helpTag,
                      'data-field-key': fieldOptions.key,
                    },
                  }),
                  options.helpTdTag
                );
              };
            } else {
              return a.td(null, options.helpTdTag); // empty cell
            }
          },
        });

        let helpCells = function () {
          let cells = report(rrP) || [];
          return cells;
        };

        return a.tr(helpCells(), options.helpTrTag);
      };

      let tableHint = function () {
        let rrP = new Proxy(rr, {
          get: (target, property) => {
            if (property == 'field') {
              return (fieldOptions) => {
                return a.td(
                  rr.hint({
                    hint: fieldOptions.hint,
                    hintTag: options.hintTag,
                  }),
                  options.hintTdTag
                );
              };
            } else {
              return a.td(null, options.hintTdTag); // empty cell
            }
          },
        });

        let hintCells = function () {
          let cells = report(rrP) || [];
          return cells;
        };

        return a.tr(hintCells(), options.hintTrTag);
      };

      let tableBody = () =>
        rr.items({
          ...options.items,
          report: (rrr) => {
            let rrrP = new Proxy(rrr, {
              get: (target, property) => {
                if (property == 'field') {
                  return (fieldOptions) => {
                    return a.td(rrr.control(fieldOptions), options.tdTag);
                  };
                } else {
                  return target[property];
                }
              },
            });

            let cells = report(rrrP);

            return cells;
          },
          itemsTag: {
            $tag: 'tbody',
            ...options.tbodyTag,
            ...options.itemsTag,
          },
          itemTag: {
            $tag: 'tr',
            ...options.trTag,
            ...options.itemTag,
          },
        });

      return a['|appkit-report-nest-table-wrapper'](
        [
          a.table(
            [tableHeader(), tableHelp(), tableBody(), tableHint()],
            options.tableTag
          ),
        ],
        options.wrapperTag
      );
    },
  });
};

ax.extension.report.field.nest.prefab.shim = {
  controls: {
    table: (r) => (options) =>
      ax.x.report.field.nest.prefab.components.table(r, options),
    many: (r) => (options) =>
      ax.x.report.field.nest.prefab.components.many(r, options),
    one: (r) => (options) => r.controls.nest(options),
  },
};

ax.extension.form.async = {};

ax.extension.form.async.shim = {
  form: (f, target) => (options = {}) =>
    ax.a['|appkit-asyncform'](
      [
        ax.a['div|appkit-asyncform-output'],
        ax.a['|appkit-asyncform-body'](
          target({
            ...options,
            formTag: {
              $controls: function () {
                return ax.x.lib.unnested(this, '|appkit-form-control');
              },
              $buttons: function () {
                return this.$$('button').$$;
              },
              $disable: function () {
                let controls = [...this.$controls(), ...this.$buttons()];
                for (let i in controls) {
                  ax.x.lib.element.visible(controls[i]) &&
                    controls[i].$disable &&
                    controls[i].$disable();
                }
              },
              $enable: function () {
                let controls = [...this.$controls(), ...this.$buttons()];
                for (let i in controls) {
                  ax.x.lib.element.visible(controls[i]) &&
                    controls[i].$enable &&
                    controls[i].$enable();
                }
              },
              ...options.formTag,
              $on: {
                'submit: async submit': (e, el) => {
                  e.preventDefault();

                  let form = el.$('^form');
                  let formData = el.$formData();

                  let submitter = el.$('[type="submit"]:focus');
                  if (submitter && submitter.name) {
                    formData.append(submitter.name, submitter.value);
                  }

                  el.$disable && el.$disable();

                  let outputEl = el.$(
                    '^|appkit-asyncform |appkit-asyncform-output'
                  );
                  let completeFn = () => {
                    el.$enable && el.$enable();
                    var windowTop = $(window).scrollTop();
                    var windowBottom = windowTop + $(window).height();
                    var outputTop = $(outputEl).offset().top;
                    var outputBottom = outputTop + $(outputEl).height();
                    if (outputBottom > windowBottom || outputTop < windowTop) {
                      outputEl.scrollIntoView();
                    }
                    el.$send('ax.appkit.form.async.complete');
                  };

                  if (ax.is.function(options.action)) {
                    let submition = {
                      formData: formData,
                      data: ax.x.lib.form.data.objectify(formData),
                      form: el,
                      output: outputEl,
                      complete: completeFn,
                      submitter: submitter,
                    };

                    options.action(submition) && completeFn();
                  } else {
                    let body;
                    // Do not send empty form data. Some web servers don't lik it.
                    if (Array.from(formData.entries()).length > 0) {
                      body = formData;
                    }

                    outputEl.$nodes = [
                      (a, x) =>
                        ax.x.http({
                          url: el.getAttribute('action'),
                          body: body,
                          method: el.getAttribute('method'),
                          when: options.when,
                          success: options.success,
                          error: options.error,
                          catch: options.catch,
                          complete: completeFn,
                        }),
                    ];
                  }
                },
                ...(options.formTag || {}).$on,
              },
            },
          })
        ),
      ],
      options.asyncformTag
    ),
};

ax.extension.jsoneditor = {};

ax.css({
  '|appkit-form-codemirror': {
    '.jsoneditor-tree': {
      background: 'white',
    },
  },
});

ax.extension.jsoneditor.form = {};

ax.extension.jsoneditor.form.control = function (f, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let controlTagOptions = {
    $init: function () {
      let editor = this;

      let jsoneditorOptions = {
        onEditable: function (node) {
          return !editor.$disabled; // Do not allow editing when disabled.
        },
        onChange: function () {
          editor.$stash();
          editor.$send('ax.appkit.form.control.change');
        },
        ...options.jsoneditor,
      };

      this.$editor = new JSONEditor(this.$('div'), jsoneditorOptions);

      let value = options.value || 'null';

      if (options.parse) {
        try {
          value = JSON.parse(value);
          this.$editor.set(value);
          this.$stash();
        } catch (error) {
          this.$nodes = a['p.error'](`⚠ ${error.message}`);
        }
      } else {
        this.$editor.set(value);
        this.$stash();
      }
    },
    $stash: function () {
      this.$('input').value = this.$value();
    },
    $value: function () {
      return JSON.stringify(this.$editor.get());
    },
    $data: function () {
      return this.$value();
    },
    $focus: function () {
      this.$('.jsoneditor-tree button').focus();
    },
    $disable: function () {
      this.$disabled = true;
    },
    $enable: function () {
      if (!options.disabled) {
        this.$disabled = false;
      }
    },
    $on: {
      'keydown: check for editor exit': (e, el) => {
        if (e.keyCode == 27 && e.shiftKey) {
          // shift+ESC pressed - move focus backward
          ax.x.lib.tabable.previous(el).focus();
        } else if (e.keyCode == 27 && e.ctrlKey) {
          // ctrl+ESC pressed - move focus forward
          ax.x.lib.tabable.next(el).focus();
        }
      },
    },

    ...options.controlTag,
  };

  return a['|appkit-form-control'](
    [
      a['|appkit-form-jsoneditor'](
        [
          a.input(null, {
            name: options.name,
            type: 'hidden',
          }),
          a.div,
        ],
        options.jsoneditorTag
      ),
    ],
    controlTagOptions
  );
};

ax.extension.simplemde = {};

ax.extension.simplemde.form = {};

ax.extension.simplemde.form.control = function (f, options) {
  let a = ax.a;

  let toolbarIcons = [
    {
      name: 'bold',
      action: SimpleMDE.toggleBold,
      className: 'fa fa-bold',
      title: 'Bold',
    },
    {
      name: 'italic',
      action: SimpleMDE.toggleItalic,
      className: 'fa fa-italic',
      title: 'Italic',
    },
    {
      name: 'heading',
      action: SimpleMDE.toggleHeadingSmaller,
      className: 'fa fa-heading',
      title: 'Heading',
    },
    '|',
    {
      name: 'quote',
      action: SimpleMDE.toggleBlockquote,
      className: 'fa fa-quote-left',
      title: 'Quote',
    },
    {
      name: 'unordered-list',
      action: SimpleMDE.toggleUnorderedList,
      className: 'fa fa-list-ul',
      title: 'Generic List',
    },
    {
      name: 'ordered-list',
      action: SimpleMDE.toggleOrderedList,
      className: 'fa fa-list-ol',
      title: 'Numbered List',
    },
    '|',
    {
      name: 'link',
      action: SimpleMDE.drawLink,
      className: 'fa fa-link',
      title: 'Create Link',
    },
    {
      name: 'image',
      action: SimpleMDE.drawImage,
      className: 'fa fa-image',
      title: 'Insert Image',
    },
    {
      name: 'table',
      action: SimpleMDE.drawTable,
      className: 'fa fa-table',
      title: 'Insert Table',
    },
    '|',
    {
      name: 'preview',
      action: SimpleMDE.togglePreview,
      className: 'fa fa-eye no-disable',
      title: 'Toggle Preview',
    },
    {
      name: 'side-by-side',
      action: SimpleMDE.toggleSideBySide,
      className: 'fa fa-columns no-disable',
      title: 'Toggle Side by Side',
    },
    {
      name: 'fullscreen',
      action: SimpleMDE.toggleFullScreen,
      className: 'fa fa-arrows-alt no-disable',
      title: 'Toggle Fullscreen',
    },
  ];

  let simplemdeTagOptions = {
    $init: function () {
      this.$setup();
    },

    $setup: function () {
      this.$simplemde = new SimpleMDE({
        element: this.$('textarea'),
        toolbar: toolbarIcons,
        placeholder: options.placeholder,
        autoDownloadFontAwesome: false,
        spellChecker: false,
        renderingConfig: {
          markedOptions: {
            sanitize: true,
          },
        },
        ...options.simplemde,
      });

      // Set required attribute on the CodeMirror textarea
      let checkRequired = (value) => {
        let textarea = this.$('.CodeMirror textarea');
        if (options.required && !value) {
          textarea.required = options.required;
        } else {
          textarea.removeAttribute('required');
        }
      };

      checkRequired(options.value);

      this.$refresh();

      this.$simplemde.codemirror.on('change', (e) => {
        checkRequired(this.$simplemde.value());
      });
    },
    $refresh: function () {
      setTimeout(
        function () {
          this.$simplemde.codemirror.refresh();
        }.bind(this),
        1
      );
    },

    $on: {
      'keyup: update textarea': (e, el) => {
        el.$('textarea').value = el.$simplemde.value();
        el.$send('ax.appkit.form.control.change');
      },
      'keydown: check for editor exit': (e, el) => {
        if (
          el.$('div.CodeMirror').classList.contains('CodeMirror-fullscreen')
        ) {
          // SimpleMDE closes fullscreen when ESC pressed.
          el.$simplemde.codemirror.focus();
        } else {
          if (e.target.nodeName === 'TEXTAREA') {
            if (e.keyCode == 27 && e.shiftKey) {
              // shift+ESC pressed - move focus backward
              ax.x.lib.tabable.previous(e.target).focus();
            } else if (e.keyCode == 27) {
              // ESC pressed - move focus forward
              ax.x.lib.tabable.next(e.target).focus();
            }
          }
        }
      },
    },

    ...options.simplemdeTag,
  };

  let controlTagOptions = {
    $value: function () {
      return this.$$('textarea').value();
    },
    $disable: function () {
      this.$$('textarea').setAttribute('disabled', 'disabled');
    },
    $enable: function () {
      this.$('|appkit-form-simplemde').$refresh();
      this.$$('textarea').removeAttribute('disabled');
    },
    $focus: function () {
      this.$('|appkit-form-simplemde').$simplemde.codemirror.focus();
    },

    ...options.markdownTag,
  };

  return a['|appkit-form-control'](
    a['|appkit-form-simplemde'](
      f.textarea({
        value: options.value,
        name: options.name,
        ...options.textareaTag,
      }),
      simplemdeTagOptions
    ),
    controlTagOptions
  );
};

ax.css({
  '|appkit-form-simplemde': {
    '.editor-statusbar': {
      padding: '0px 5px',
    },
    '.editor-toolbar': {
      a: {
        color: '#333 !important',
      },
      backgroundColor: 'white',
      opacity: 1,
      border: '1px solid #e6e6e6',
      borderBottom: 'none',
      '&:before': {
        margin: 0,
      },
      '&:after': {
        margin: 0,
      },
    },
  },
});

ax.extension.simplemde.form.shim = {
  controls: {
    markdown: (f, target) => (options = {}) => (a, x) =>
      x.simplemde.form.control(f, options),
  },
};

ax.extension.bootstrap = {};

ax.css({
  '|appkit-form-collection-item-body': {
    width: 'calc( 100% - 120px)',
  },
});

ax.extension.bootstrap.form = {};

ax.extension.bootstrap.form.shim = {
  field: (f, target) => {
    return (options = {}) => {
      let vertical = ax.is.undefined(options.vertical)
        ? f.formOptions.vertical
        : options.vertical;

      let fieldTagClass, headerTagClass, bodyTagClass;

      if (
        options.as == 'one' ||
        options.control == 'one' ||
        options.as == 'many' ||
        options.control == 'many' ||
        options.as == 'table' ||
        options.control == 'table' ||
        options.as == 'nest' ||
        options.control == 'nest'
      ) {
        fieldTagClass = 'd-block mb-0';
      } else if (
        options.as == 'hidden' ||
        options.as == 'input/hidden' ||
        options.type == 'hidden'
      ) {
        fieldTagClass = 'd-none';
      } else {
        fieldTagClass = 'd-block mb-1';
      }

      if (vertical) {
        headerTagClass = '';
        bodyTagClass = '';
      } else {
        fieldTagClass = fieldTagClass + ' form-row';
        headerTagClass = 'd-inline-block align-top mt-2 col-sm-4';
        bodyTagClass = 'd-inline-block col-sm-8';
      }

      return target({
        ...options,
        fieldTag: {
          class: fieldTagClass,
          ...options.fieldTag,
        },
        headerTag: {
          class: headerTagClass,
          ...options.headerTag,
        },
        labelTag: {
          class: 'mb-0',
        },
        bodyTag: {
          class: bodyTagClass,
          ...options.bodyTag,
        },
        hintTag: {
          class: 'text-muted d-block',
          ...options.hintTag,
        },
        helpTag: {
          class: 'text-muted',
          ...options.helpTag,
        },
      });
    };
  },

  fieldset: (f, target) => (options = {}) => {
    let vertical = ax.is.undefined(options.vertical)
      ? f.formOptions.vertical
      : options.vertical;

    let fieldsetTagClass, headerTagClass, bodyTagClass;

    if (vertical) {
      fieldsetTagClass = '';
      headerTagClass = '';
      bodyTagClass = '';
    } else {
      fieldsetTagClass = 'mb-0 form-row';
      headerTagClass = 'd-inline-block align-top mt-2 col-sm-4';
      bodyTagClass = 'd-inline-block col-sm-8';
    }

    return target({
      ...options,
      fieldsetTag: {
        class: fieldsetTagClass,
        ...options.fieldTag,
      },
      headerTag: {
        class: headerTagClass,
        ...options.headerTag,
      },
      bodyTag: {
        class: bodyTagClass,
        ...options.bodyTag,
      },
      hintTag: {
        class: 'form-text text-muted',
        ...options.hintTag,
      },
    });
  },

  button: (f, target) => (options = {}) =>
    target({
      ...options,
      buttonTag: {
        class: 'btn btn-secondary',
        ...options.buttonTag,
      },
    }),

  checkbox: (f, target) => (options = {}) =>
    target({
      ...options,
      checkTag: {
        class: `custom-control custom-checkbox ml-1`,
        ...options.checkTag,
      },
      inputTag: {
        class: 'custom-control-input',
        ...options.inputTag,
      },
      labelTag: {
        class: 'custom-control-label',
        ...options.labelTag,
      },
      checkboxTag: {
        class: 'd-block p-2',
        ...options.checkboxTag,
      },
    }),

  checkboxes: (f, target) => (options = {}) =>
    target({
      ...options,
      checkTag: {
        class: 'custom-control custom-checkbox ml-1',
        ...options.checkTag,
      },
      inputTag: {
        class: 'custom-control-input',
        ...options.inputTag,
      },
      labelTag: {
        class: 'custom-control-label',
        ...options.labelTag,
      },
      checkboxesTag: {
        class: 'd-block p-2',
        ...options.checkboxesTag,
      },
    }),

  radios: (f, target) => (options = {}) =>
    target({
      ...options,
      checkTag: {
        class: 'custom-control custom-radio ml-1',
        ...options.checkTag,
      },
      inputTag: {
        class: 'custom-control-input',
        ...options.inputTag,
      },
      labelTag: {
        class: 'custom-control-label',
        ...options.labelTag,
      },
      radiosTag: {
        class: 'd-block p-2',
        ...options.radiosTag,
      },
    }),

  input: (f, target) => (options = {}) =>
    target({
      ...options,
      inputTag: {
        class: 'form-control',
        ...options.inputTag,
      },
    }),

  select: (f, target) => (options = {}) =>
    target({
      ...options,
      selectTag: {
        class: 'custom-select',
        ...options.selectTag,
      },
    }),

  textarea: (f, target) => (options = {}) =>
    target({
      ...options,
      textareaTag: {
        class: 'form-control',
        ...options.textareaTag,
      },
    }),

  control: (f, target) => (options = {}) => {
    if (options.collection) {
      return target({
        ...options,
        itemsTag: {
          class: 'mb-1 d-block',
          ...options.itemsTag,
        },
        itemTag: {
          class: 'clearfix d-block mb-1',
          ...options.itemTag,
        },
        itemHeaderTag: {
          class: 'd-inline-block float-right',
          ...options.itemHeaderTag,
        },
        itemButtonsTag: {
          class: 'btn-group',
          ...options.itemButtonsTag,
        },
        itemBodyTag: {
          class: 'd-inline-block float-left',
          ...options.itemBodyTag,
        },
        footerTag: {
          class: 'mb-1 d-block',
          ...options.footerTag,
        },
        dragButtonsTag: {
          class: 'float-right',
          ...options.dragButtonsTag,
        },
        dragOffButton: {
          ...options.dragOffButton,
          buttonTag: {
            class: 'btn btn-warning',
            ...(options.dragOffButton || {}).buttonTag,
          },
        },
      });
    } else {
      return target(options);
    }
  },

  controls: {
    multiselect: (f, target) => (options = {}) =>
      target({
        ...options,
        controlTag: {
          class: 'form-control p-0 h-100',
          ...options.controlTag,
        },
        selectedTag: {
          class: 'd-block pl-2',
          ...options.selectedTag,
        },
        select: {
          ...options.select,
          selectTag: {
            class: 'custom-select border-0',
            ...(options.select || {}).selectTag,
          },
        },
      }),
    table: (f, target) => (options = {}) =>
      target({
        ...options,
        wrapperTag: {
          class: 'd-block',
          ...options.wrapperTag,
          style: {
            width: 'calc(100% + 0.25rem)',
            ...(options.wrapperTag || {}).style,
          },
        },
        tableTag: {
          class: 'table table-sm table-borderless mb-0 ml-n1 mr-n1',
          ...options.tableTag,
        },
        helpTdTag: {
          class: 'pl-1 pt-0 pr-0 pb-0',
          ...options.helpTdTag,
        },
        thTag: {
          class: 'py-0',
          ...options.thTag,
        },
        tdTag: {
          class: 'pl-1 pt-0 pr-0 pb-1',
          ...options.tdTag,
        },
        hintTdTag: {
          class: 'pl-1 pt-0 pr-0 pb-0',
          ...options.hintTdTag,
        },
        itemButtonsTag: {
          class: 'btn-group float-right',
          ...options.itemButtonsTag,
        },
        footerTag: {
          class: 'mb-1 mt-0 d-block',
          ...options.footerTag,
        },
        dragButtonsTag: {
          class: 'float-right',
          ...options.dragButtonsTag,
        },
        dragOffButton: {
          ...options.dragOffButton,
          buttonTag: {
            class: 'btn btn-primary',
            ...(options.dragOffButton || {}).buttonTag,
          },
        },
        deleteTag: {
          class: 'btn btn-danger mr-1',
          ...options.deleteTag,
        },
      }),
    many: (f, target) => (options = {}) => {
      let vertical = ax.is.undefined(options.vertical)
        ? f.formOptions.vertical
        : options.vertical;

      return target({
        ...options,
        itemsTag: {
          class: 'mb-1 d-block',
          ...options.itemsTag,
        },
        itemHeaderTag: {
          class: 'clearfix',
          ...options.itemHeaderTag,
        },
        itemButtonsTag: {
          class: `btn-group float-right ${vertical ? 'mb-0 mt-2' : 'mb-1'}`,
          ...options.itemButtonsTag,
        },
        footerTag: {
          class: 'mb-1 d-block',
          ...options.footerTag,
        },
        dragButtonsTag: {
          class: 'float-right',
          ...options.dragButtonsTag,
        },
        dragOffButton: {
          ...options.dragOffButton,
          buttonTag: {
            class: 'btn btn-primary',
            ...(options.dragOffButton || {}).buttonTag,
          },
        },
        deleteTag: {
          class: 'btn btn-danger mr-1',
          ...options.deleteTag,
        },
      });
    },
    selectinput: (f, target) => (options = {}) =>
      target({
        ...options,
        input: {
          ...options.input,
          inputTag: {
            class: 'form-control mt-1',
            ...(options.input || {}).inputTag,
          },
        },
      }),
  },

  submit: (f, target) => (options = {}) =>
    target({
      ...options,
      buttonTag: {
        class: 'btn btn-primary',
        ...options.buttonTag,
      },
    }),
};

ax.extension.bootstrap.report = {};

ax.extension.bootstrap.report.shim = {
  field: (r, target) => (options = {}) => {
    let vertical = ax.is.undefined(options.vertical)
      ? r.reportOptions.vertical
      : options.vertical;

    let fieldTagClass, headerTagClass, bodyTagClass;

    if (
      options.as == 'one' ||
      options.control == 'one' ||
      options.as == 'many' ||
      options.control == 'many' ||
      options.as == 'table' ||
      options.control == 'table' ||
      options.as == 'nest' ||
      options.control == 'nest'
    ) {
      fieldTagClass = 'd-block mb-0';
    } else if (options.as == 'hidden') {
      fieldTagClass = 'd-none';
    } else {
      fieldTagClass = 'd-block mb-1';
    }

    if (vertical) {
      headerTagClass = '';
      bodyTagClass = '';
    } else {
      fieldTagClass = fieldTagClass + ' form-row';
      headerTagClass = 'd-inline-block align-top mt-2 col-sm-4';
      bodyTagClass = 'd-inline-block col-sm-8';
    }

    return target({
      ...options,
      fieldTag: {
        class: fieldTagClass,
        ...options.fieldTag,
      },
      headerTag: {
        class: headerTagClass,
        ...options.headerTag,
      },
      labelTag: {
        class: 'mb-0',
      },
      bodyTag: {
        class: bodyTagClass,
        ...options.bodyTag,
      },
      hintTag: {
        class: 'text-muted d-block',
        ...options.hintTag,
      },
      helpTag: {
        class: 'text-muted',
        ...options.helpTag,
      },
    });
  },

  button: (r, target) => (options = {}) =>
    target({
      ...options,
      buttonTag: {
        class: 'btn btn-secondary',
        ...options.buttonTag,
      },
    }),

  checkbox: (r, target) => (options = {}) =>
    target({
      ...options,
      checkTag: {
        class: `custom-control custom-checkbox ml-1`,
        ...options.checkTag,
      },
      inputTag: {
        class: 'custom-control-input',
        ...options.inputTag,
      },
      labelTag: {
        class: 'custom-control-label',
        ...options.labelTag,
      },
      checkboxTag: {
        class: 'd-block p-2',
        ...options.checkboxTag,
      },
    }),

  checkboxes: (r, target) => (options = {}) =>
    target({
      ...options,
      checkTag: {
        class: 'custom-control custom-checkbox ml-1',
        ...options.checkTag,
      },
      inputTag: {
        class: 'custom-control-input',
        ...options.inputTag,
      },
      labelTag: {
        class: 'custom-control-label',
        ...options.labelTag,
      },
      checkboxesTag: {
        class: 'd-block p-2',
        ...options.checkboxesTag,
      },
    }),

  radios: (r, target) => (options = {}) =>
    target({
      ...options,
      checkTag: {
        class: 'custom-control custom-radio ml-1',
        ...options.checkTag,
      },
      inputTag: {
        class: 'custom-control-input',
        ...options.inputTag,
      },
      labelTag: {
        class: 'custom-control-label',
        ...options.labelTag,
      },
      radiosTag: {
        class: 'd-block p-2',
        ...options.radiosTag,
      },
    }),

  string: (r, target) => (options = {}) =>
    target({
      ...options,
      stringTag: {
        class: 'form-control text-dark bg-white h-100',
        ...options.stringTag,
      },
    }),

  select: (r, target) => (options = {}) =>
    target({
      ...options,
      selectTag: {
        class: 'form-control text-dark h-100',
        ...options.selectTag,
      },
    }),

  text: (r, target) => (options = {}) =>
    target({
      ...options,
      textTag: {
        class: 'form-control text-dark bg-white h-100',
        ...options.textTag,
      },
    }),

  output: (r, target) => (options = {}) =>
    target({
      ...options,
      outputTag: {
        class: 'form-control text-dark bg-white h-100',
        ...options.outputTag,
      },
    }),

  control: (f, target) => (options = {}) => {
    if (options.collection) {
      return target({
        ...options,
        itemsTag: {
          class: 'mb-1 d-block',
          ...options.itemsTag,
        },
        itemTag: {
          class: 'clearfix d-block mb-1',
          ...options.itemTag,
        },
      });
    } else {
      return target(options);
    }
  },

  controls: {
    boolean: (r, target) => (options = {}) =>
      target({
        ...options,
        booleanTag: {
          class: 'form-control text-dark',
          ...options.booleanTag,
        },
      }),

    json: (r, target) => (options = {}) =>
      target({
        ...options,
        jsonTag: {
          class: 'form-control text-dark h-100',
          ...options.jsonTag,
        },
      }),

    preformatted: (r, target) => (options = {}) =>
      target({
        ...options,
        preformattedTag: {
          class: 'form-control text-dark bg-white h-100',
          ...options.preformattedTag,
        },
      }),

    password: (r, target) => (options = {}) =>
      target({
        ...options,
        passwordTag: {
          class: 'form-control text-dark bg-white',
          ...options.passwordTag,
        },
      }),

    color: (r, target) => (options = {}) =>
      target({
        ...options,
        colorTag: {
          class: 'form-control text-dark',
          ...options.colorTag,
        },
      }),

    datetime: (r, target) => (options = {}) =>
      target({
        ...options,
        datetimeTag: {
          class: 'form-control text-dark',
          ...options.datetimeTag,
        },
      }),

    number: (r, target) => (options = {}) =>
      target({
        ...options,
        numberTag: {
          class: 'form-control text-dark',
          ...options.numberTag,
        },
      }),

    tel: (r, target) => (options = {}) =>
      target({
        ...options,
        telTag: {
          class: 'form-control text-dark',
          ...options.telTag,
        },
      }),

    email: (r, target) => (options = {}) =>
      target({
        ...options,
        emailTag: {
          class: 'form-control text-dark',
          ...options.emailTag,
        },
      }),

    country: (r, target) => (options = {}) =>
      target({
        ...options,
        countryTag: {
          class: 'form-control text-dark',
          ...options.countryTag,
        },
      }),

    language: (r, target) => (options = {}) =>
      target({
        ...options,
        languageTag: {
          class: 'form-control text-dark',
          ...options.languageTag,
        },
      }),

    timezone: (r, target) => (options = {}) =>
      target({
        ...options,
        timezoneTag: {
          class: 'form-control text-dark',
          ...options.timezoneTag,
        },
      }),

    url: (r, target) => (options = {}) =>
      target({
        ...options,
        urlTag: {
          class: 'form-control text-dark',
          ...options.urlTag,
        },
      }),

    table: (r, target) => (options = {}) =>
      target({
        ...options,
        wrapperTag: {
          class: 'd-block',
          ...options.wrapperTag,
          style: {
            width: 'calc(100% + 0.25rem)',
            ...(options.wrapperTag || {}).style,
          },
        },
        tableTag: {
          class: 'table table-sm table-borderless mb-0',
          ...options.tableTag,
        },
        helpTdTag: {
          class: 'pl-1 pt-0 pr-0 pb-0',
          ...options.helpTdTag,
        },
        thTag: {
          class: 'py-0',
          ...options.thTag,
        },
        tdTag: {
          class: 'pl-1 pt-0 pr-0 pb-1',
          ...options.tdTag,
        },
        hintTdTag: {
          class: 'pl-1 pt-0 pr-0 pb-0',
          ...options.hintTdTag,
        },
      }),
  },

  submit: (r, target) => (options = {}) =>
    target({
      ...options,
      buttonTag: {
        class: 'btn btn-primary',
        ...options.buttonTag,
      },
    }),
};

ax.extension.chartjs = function (options = {}) {
  var a = ax.a;
  var x = ax.x;

  var wrapperTag = {
    $init: function () {
      this.$chart = new x.chartjs.Chart(
        this.$('canvas').getContext('2d'),
        options.chartjs || {}
      );
    },
    ...options.wrapperTag,
  };

  return a['div|ax-chartjs-chart-wrapper'](
    [a.canvas(null, options.canvasTag)],
    wrapperTag
  );
};

// .chart alias
ax.extension.chart = ax.extension.chartjs;

ax.extension.chartjs.Chart = window.Chart;

ax.extension.codemirror = {};

ax.extension.codemirror.Terminal = window.CodeMirror;

ax.extension.codemirror.form = {};

ax.extension.codemirror.form.control = function (f, options = {}) {
  let a = ax.a;

  return a['|appkit-form-control'](
    a['|appkit-form-codemirror'](
      [this.control.toolbar(f, options), this.control.editor(f, options)],
      {
        $setMode: function () {
          this.$('textarea').$codemirror.setOption(
            'mode',
            this.$('|appkit-form-codemirror-mode').$value()
          );
        },
        $setKeymap: function () {
          this.$('textarea').$codemirror.setOption(
            'keyMap',
            this.$('|appkit-form-codemirror-keymap').$value() || null
          );
        },
      }
    ),
    {
      $value: function () {
        return this.$('textarea').$codemirror.getValue();
      },
      $focus: function () {
        this.$('textarea').$codemirror.focus();
      },
      $disable: function () {
        this.$$('textarea').setAttribute('disabled', 'disabled');
      },
      $enable: function () {
        this.$('textarea').$refresh();
        if (!options.disabled) {
          this.$$('textarea').removeAttribute('disabled');
        }
      },

      ...options.controlTag,
    }
  );
};

ax.css({
  '|appkit-form-codemirror': {
    display: 'block',
    border: '1px solid #b3b3b3',
    '|appkit-form-codemirror-toolbar': {
      display: 'block',
      overflow: 'auto',
      color: '#333',
      backgroundColor: 'white',
      borderBottom: '1px solid #e6e6e6',
      button: {
        fontSize: '1.2em',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
      select: {
        padding: '2px',
        border: 'none',
        backgroundColor: 'transparent',
      },
    },
    '|appkit-form-codemirror-mode, |appkit-form-codemirror-keymap': {
      display: 'inline-block',
      select: {
        height: '30px',
        padding: '4px',
        width: '120px',
      },
      label: {
        margin: '2px 10px',
      },
    },
    '|appkit-form-codemirror-keymap': {
      select: {
        width: '100px',
      },
    },
    '|appkit-form-codemirror-toolbar-left': {
      float: 'left',
    },
    '|appkit-form-codemirror-toolbar-right': {
      float: 'right',
    },
    '&.fullscreen': {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      border: 'none',
      borderRadius: '0px',
      zIndex: 999,
    },
    '|appkit-form-codemirror-editor': {
      'div.CodeMirror': {
        minHeight: '2em',
        border: 'unset',
        borderRadius: 'unset',
        padding: 'unset',
        fontFamily: 'monospace',
        zIndex: 1,
        'div.CodeMirror-scroll': {
          minHeight: 'unset',
        },
      },
    },
  },
});

ax.extension.codemirror.form.control.editor = function (f, options = {}) {
  let a = ax.a;

  return a['|appkit-form-codemirror-editor'](
    f.textarea({
      name: options.name,
      value: options.value,
      textareaTag: {
        $init: function () {
          this.$setup();
        },
        $refresh: function () {
          setTimeout(
            function () {
              this.$codemirror.refresh();
            }.bind(this),
            1
          );
        },
        $setup: function () {
          this.$codemirror = CodeMirror.fromTextArea(this, {
            lineNumbers: true,
            placeholder: options.placeholder,
          });

          this.$('^|appkit-form-codemirror').$setMode();
          this.$('^|appkit-form-codemirror').$setKeymap();

          this.$codemirror.setSize('100%', '100%');

          this.$required();
          this.$refresh();

          this.$codemirror.on('keyup', function (codemirror, e) {
            codemirror.getTextArea().$required();
          });
        },
        $required: function () {
          let value = this.$codemirror.getValue();
          let textarea = this.$('^|appkit-form-codemirror').$$('textarea')[1];
          if (!value && options.required) {
            textarea.setAttribute('required', true);
          } else {
            textarea.removeAttribute('required');
          }
        },
        ...options.textareaTag,
      },
    }),
    {
      $on: {
        'keyup: send control change event': (e, el) =>
          el.$send('ax.appkit.form.control.change'),
        'keyup: update textarea value': function (e) {
          this.$('textarea').$codemirror.save();
        },
        'keydown: check for editor exit': function (e) {
          let container = this.$('^|appkit-form-codemirror');
          let allowEsc = this.$('textarea').$codemirror.options.keyMap != 'vim';

          if (container.classList.contains('fullscreen')) {
            if (e.keyCode == 27 && (allowEsc || e.ctrlKey)) {
              // ESC pressed - close full screen
              container.$('|appkit-form-codemirror-fullscreen button').click();
            }
          } else {
            if (e.keyCode == 27 && e.shiftKey) {
              // shift+ESC pressed - move focus backward
              ax.x.lib.tabable.previous(e.target).focus();
            } else if (e.keyCode == 27 && (allowEsc || e.ctrlKey)) {
              // ESC pressed - move focus forward
              ax.x.lib.tabable.next(e.target).focus();
            }
          }
        },
      },
    }
  );
};

ax.extension.codemirror.form.control.keymap = function (f, options) {
  let a = ax.a;
  let x = ax.x;

  let keymap;
  let component;
  let value;

  let keymapLabel = function (keymap) {
    let labels = {
      vim: 'Vim',
      emacs: 'Emacs',
      sublime: 'Sublime',
    };
    return labels[keymap] || keymap;
  };

  if (ax.is.string(options)) {
    component = a.label(keymapLabel(options));
    value = () => options;
  } else if (options) {
    if (ax.is.not.object(options)) {
      options = {};
    }

    let show;
    let selections = options.selections;

    if (ax.is.undefined(selections)) {
      selections = [['default', '𝍣 Keys']];

      if (CodeMirror.keyMap.vim) {
        show = true;
        selections.push(['vim', 'Vim']);
      }
      if (CodeMirror.keyMap.emacs) {
        show = true;
        selections.push(['emacs', 'Emacs']);
      }
      if (CodeMirror.keyMap.pcSublime) {
        show = true;
        selections.push(['sublime', 'Sublime']);
      }
    } else {
      show = true;
    }

    if (ax.is.true(show)) {
      component = f.select({
        selections: selections,
        value: options.value,
        selectTag: {
          $on: {
            'change: set CodeMirror keymap': function () {
              this.$('^|appkit-form-codemirror').$setKeymap();
            },
          },
          ...options.selectTag,
        },
      });
      value = function () {
        return this.$('select').value;
      };
    } else {
      component = null;
      value = () => 'default';
    }
  } else {
    component = null;
    value = () => 'default';
  }

  return a['|appkit-form-codemirror-keymap'](
    component,
    {
      $value: value,
    },
    options.keymapTag
  );
};

ax.extension.codemirror.form.control.mode = function (f, name, options = {}) {
  let a = ax.a;

  let mode;
  let component;
  let value;

  let selectName;

  if (name.endsWith(']')) {
    selectName = name.replace(/(.*)(\])$/, '$1_mode$2');
  } else {
    selectName = name + '_mode';
  }

  if (ax.is.string(options)) {
    component = a.label(options);
    value = () => options;
  } else if (options) {
    let selections = options.selections;

    if (ax.is.undefined(selections)) {
      selections = Object.keys(CodeMirror.modes); // List of installed language modes
      selections.shift(); // remove null
    }

    if (ax.is.object(selections) && Object.entries(selections).length > 0) {
      component = f.select({
        name: selectName,
        placeholder: '𝍣 Mode',
        selections: selections,
        value: options.value,
        selectTag: {
          $on: {
            'change: set CodeMirror mode': function () {
              this.$('^|appkit-form-codemirror').$setMode();
            },
          },
          ...options.selectTag,
        },
      });
      value = function () {
        return this.$('select').value;
      };
    } else {
      component = null;
      value = () => '';
    }
  } else {
    component = null;
    value = () => '';
  }

  return a['|appkit-form-codemirror-mode'](
    component,
    {
      $value: value,
    },
    options.modeTag
  );
};

ax.extension.codemirror.form.control.toolbar = function (f, options = {}) {
  let a = ax.a;

  return a['|appkit-form-codemirror-toolbar'](
    [
      a['|appkit-form-codemirror-toolbar-left']([
        this.mode(f, options.name || '', options.mode || false),
      ]),
      a['|appkit-form-codemirror-toolbar-right']([
        this.keymap(f, options.keymap || false),
        a['|appkit-form-codemirror-fullscreen'](
          a.button('🗖', {
            type: 'button',
            $on: {
              'click: toggle full screen': function () {
                let container = this.$('^|appkit-form-codemirror');
                let editor = container.$('|appkit-form-codemirror-editor');
                let codemirror = editor.$('textarea').$codemirror;
                if (container.classList.contains('fullscreen')) {
                  this.$text = '🗖';
                  container.classList.remove('fullscreen');
                  editor.style.height = '';
                  codemirror.focus();
                } else {
                  this.$text = '🗗';
                  container.classList.add('fullscreen');
                  codemirror.focus();
                }
              },
            },
          })
        ),
      ]),
    ],
    options.toolbarTag
  );
};

ax.extension.codemirror.form.shim = {
  controls: {
    code: (f, target) => (options = {}) =>
      ax.x.codemirror.form.control(f, options),
  },
};

ax.extension.codemirror.report = {};

ax.extension.codemirror.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;
  let report = x.codemirror.report;

  return a['|appkit-report-control'](
    a['|appkit-report-codemirror'](
      [report.control.toolbar(options), report.control.editor(options)],
      {
        ...options.codeTag,
      }
    ),

    {
      'data-name': options.name,
      $value: function () {
        return options.value;
      },

      tabindex: 0,
      $focus: function () {
        this.focus();
      },

      ...options.controlTag,
    }
  );
};

ax.css({
  '|appkit-report-codemirror': {
    display: 'block',
    border: '1px solid #b3b3b3',
    '|appkit-report-codemirror-toolbar': {
      display: 'block',
      overflow: 'auto',
      color: '#333',
      backgroundColor: 'white',
      borderBottom: '1px solid #e6e6e6',
      button: {
        fontSize: '1.2em',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
      select: {
        padding: '2px',
        border: 'none',
        backgroundColor: 'transparent',
      },
    },
    '|appkit-report-codemirror-mode': {
      select: {
        padding: '4px',
      },
      label: {
        margin: '2px 5px',
      },
    },
    '|appkit-report-codemirror-toolbar-right': {
      float: 'right',
    },
    '&.fullscreen': {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      border: 'none',
      borderRadius: '0px',
      zIndex: '999',
    },
    '|appkit-report-codemirror-editor': {
      'div.CodeMirror': {
        minHeight: '2em',
        border: 'unset',
        borderRadius: 'unset',
        padding: 'unset',
        fontFamily: 'monospace',
        zIndex: 1,
        'div.CodeMirror-scroll': {
          minHeight: 'unset',
        },
      },
    },
  },
});

ax.extension.codemirror.report.control.editor = function (options = {}) {
  let a = ax.a;

  return a['|appkit-report-codemirror-editor'](
    a.textarea(options.value, {
      $init: function () {
        this.$codemirror = CodeMirror.fromTextArea(this, {
          lineNumbers: true,
          readOnly: true,
          placeholder: options.placeholder,
          mode: options.mode || '',
        });
        this.$codemirror.setSize('100%', '100%');
        setTimeout(
          function () {
            this.$codemirror.refresh();
          }.bind(this),
          1
        );
      },
    }),
    {
      $on: {
        'keydown: check for editor exit': function (e) {
          let container = this.$('^|appkit-report-codemirror');

          if (container.classList.contains('fullscreen')) {
            if (e.keyCode == 27) {
              // ESC pressed - close full screen
              container
                .$('|appkit-report-codemirror-fullscreen button')
                .click();
            }
          } else {
            if (e.keyCode == 9 && e.shiftKey) {
              // shift+TAB pressed - move focus backward
              ax.x.lib.tabable.previous(e.target).focus();
            } else if (e.keyCode == 9) {
              // TAB pressed - move focus forward
              ax.x.lib.tabable.next(e.target).focus();
            }
          }
        },
      },
    }
  );
};

ax.extension.codemirror.report.control.toolbar = function (options = {}) {
  let a = ax.a;

  return a['|appkit-report-codemirror-toolbar']([
    a['|appkit-form-codemirror-toolbar-left']([
      a['|appkit-report-codemirror-mode'](a.label(options.mode)),
    ]),
    a['|appkit-report-codemirror-toolbar-right'](
      a['|appkit-report-codemirror-fullscreen'](
        a.button('🗖', {
          type: 'button',
          $on: {
            'click: toggle full screen': function () {
              let container = this.$('^|appkit-report-codemirror');
              let editor = container.$('|appkit-report-codemirror-editor');
              let codemirror = editor.$('textarea').$codemirror;
              if (container.classList.contains('fullscreen')) {
                this.$text = '🗖';
                container.classList.remove('fullscreen');
                editor.style.height = '';
                codemirror.focus();
              } else {
                this.$text = '🗗';
                container.classList.add('fullscreen');
                codemirror.focus();
              }
            },
          },
        })
      )
    ),
  ]);
};

ax.extension.codemirror.report.shim = {
  controls: {
    code: (f, target) => (options = {}) =>
      ax.x.codemirror.report.control(f, options),
  },
};

ax.extension.context = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let component = options.content || null;

  let popupTagOptions = {
    ...options.popupTag,
    style: {
      position: 'fixed',
      zIndex: 1,
      ...(options.popupTag || {}).style,
    },
  };

  let contextTagOptions = {
    $on: {
      click: (e, el) => {
        if (options.menu) {
          let menu = el.$('|appkit-menu');
          menu && menu.$closeSubmenus();
        }
        el.$('|ax-context-popup').style.display = 'none';
      },
    },
    $menu: function () {
      let parent = this.$('^ ^|ax-context');
      let menu = options.menu || [];
      if (parent) {
        menu.push(...parent.$menu());
      }

      return menu;
    },
    ...options.contextTag,
    style: {
      cursor: 'context-menu',
      ...(options.contextTag || {}).style,
    },
  };

  let nudgePopup = function (target) {
    let rect = target.getBoundingClientRect();
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    let bGap = wh - rect.top - rect.height;
    let rGap = ww - rect.left - rect.width;
    if (bGap < 0) target.style.top = `${rect.y + bGap}px`;
    if (rGap < 0) target.style.left = `${rect.x + rGap}px`;
  };

  let contentTagOptions = {
    $init: (el) => {
      let popupContents;
      let context = el.$('^|ax-context');

      if (options.menu) {
        if (ax.is.function(x.menu)) {
          popupContents = x.menu({
            menu: context.$menu(),
          });
        } else {
          popupContents = options.menu;
        }
      } else {
        popupContents = options.popup || null;
      }

      let popup = context.$('|ax-context-popup');

      let clickHandler = function (e) {
        if (!popup.contains(e.target)) {
          if (options.menu) {
            let menu = popup.$('|appkit-menu');
            menu && menu.$closeSubmenus();
          }
          popup.style.display = 'none';
          removeClickHandler();
          el.$send('ax.appkit.context.popup.close');
        }
      };

      let removeClickHandler = function () {
        window.document.removeEventListener('mousedown', clickHandler);
      };

      let addClickHandler = function () {
        window.document.addEventListener('mousedown', clickHandler);
      };

      el.$on({
        contextmenu: (e) => {
          e.preventDefault();
          e.stopPropagation();
          popup.$nodes = [popupContents];
          popup.style.left = `${e.pageX + 1}px`;
          popup.style.top = `${e.pageY + 1}px`;
          popup.style.display = 'inline-block';
          nudgePopup(popup);
          addClickHandler();
          el.$send('ax.appkit.context.popup.show');
        },
      });
    },
    ...options.contentTag,
  };

  return (a, x) =>
    a['|ax-context'](
      [
        a['|ax-context-content'](component, contentTagOptions),
        a['|ax-context-popup'](null, popupTagOptions),
      ],
      contextTagOptions
    );
};

ax.extension.menu = (options = {}) => (a, x) => {
  let items = options.menu || [];

  return a['|appkit-menu'](
    a.menu(
      items.map((item) =>
        ax.is.object(item) ? a.menuitem(x.menu.item(item, options.item)) : item
      )
    ),
    {
      $init: (el) => {
        let z = Number(window.getComputedStyle(el).zIndex);
        el.$$('|appkit-menu-submenu').$setZ(z + 1);
      },
      $closeSubmenus: function () {
        this.$$('|appkit-menu-submenu').style.display = 'none';
      },
      ...options.menuTag,
    }
  );
};

ax.css({
  '|appkit-menu': {
    display: 'block',
    width: '150px',
    zIndex: 1,
    '|appkit-menu-item': {
      display: 'block',
      width: '100%',
      userSelect: 'none',
      position: 'relative',
      '|appkitMenuSubmenuOpen': {
        whiteSpace: 'nowrap',
        display: 'block',
        width: '125px',
        lineHeight: '1.5',
        padding: '0.375rem',
        overflowX: 'hidden',
      },
      appkitMenuSubmenuOpenCaret: {
        float: 'right',
        lineHeight: '1.5',
        padding: '0.375rem',
      },
      appkitMenuSubmenu: {
        position: 'absolute',
        left: '150px',
        top: '0px',
        display: 'none',
      },
      '&:hover': {
        backgroundColor: 'lightgray',
      },
      button: {
        lineHeight: '1.5',
        padding: '0.375rem',
        width: '100%',
        border: 'none',
        background: 'none',
        textAlign: 'left',
      },
    },
    hr: {
      marginTop: '0.375rem',
      marginBottom: '0.375rem',
    },
    menu: {
      margin: 0,
      padding: 0,
      backgroundColor: 'white',
      boxShadow: '0px 0px 5px gray',
    },
  },
});

ax.extension.menu.item = (item, options = {}) => (a, x) => {
  let component;

  if (item.menu) {
    component = [
      a['|appkit-menu-submenu-open-caret']('⯈'),
      a['|appkit-menu-submenu-open'](item.label),
      a['|appkit-menu-submenu'](
        x.menu({
          menu: item.menu,
        }),
        {
          $setZ: function (z) {
            this.style.zIndex = z;
          },
        }
      ),
    ];
  } else {
    component = x.button({
      label: item.label,
      onclick: item.onclick,
    });
  }

  let openSubmenu = (e, el) => {
    e.preventDefault();
    let target = el.$('|appkit-menu-submenu');
    let submenus = el.$('^|appkit-menu').$$('|appkit-menu-submenu').$$;

    for (let i in submenus) {
      let submenu = submenus[i];
      if (submenu.contains(target)) {
        target.style.display = 'unset';
        nudgeSubmenu(target);
      } else {
        submenu.style.display = 'none';
      }
    }
  };

  let nudgeSubmenu = function (target) {
    let rect;
    rect = target.getBoundingClientRect();
    target.style.top = '0px';
    target.style.left = `${rect.width}px`;
    rect = target.getBoundingClientRect();
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    let bGap = wh - rect.top - rect.height;
    let rGap = ww - rect.left - rect.width;
    if (bGap < 0) target.style.top = `${bGap}px`;
    if (rGap < 0) target.style.left = `${rect.width + rGap}px`;
  };

  let itemTagOptions = {
    ...options.itemTag,
    $on: {
      click: (e, el) => {
        if (e.target.tagName == 'APPKIT-MENU-SUBMENU-OPEN') {
          openSubmenu(e, el);
          e.stopPropagation();
        }
      },
      mouseenter: (e, el) => {
        openSubmenu(e, el);
      },
      ...(options.itemTag || {}).$on,
    },
  };

  return a['|appkit-menu-item'](component, itemTagOptions);
};

ax.extension.popup = function (component, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let popupTagOptions = {
    ...options.popupTag,
    style: {
      position: 'fixed',
      zIndex: 1,
      ...(options.popupTag || {}).style,
    },
  };

  let contextTagOptions = {
    $on: {
      'click: close submenus': (e, el) => {
        if (options.menu) {
          let menu = el.$('|appkit-menu');
          menu && menu.$closeSubmenus();
        }
        el.$('|appkit-context-popup').style.display = 'none';
      },
    },
    $menu: function () {
      let parent = this.$('^ ^|appkit-context');
      let menu = options.menu || [];
      if (parent) {
        menu.push(...parent.$menu());
      }

      return menu;
    },
    ...options.contextTag,
  };

  let nudgePopup = function (target) {
    let rect = target.getBoundingClientRect();
    let ww = window.innerWidth;
    let wh = window.innerHeight;
    let bGap = wh - rect.top - rect.height;
    let rGap = ww - rect.left - rect.width;
    if (bGap < 0) target.style.top = `${rect.y + bGap}px`;
    if (rGap < 0) target.style.left = `${rect.x + rGap}px`;
  };

  let contentTagOptions = {
    $init: (el) => {
      let popupContents;
      let context = el.$('^|appkit-context');

      if (options.menu) {
        if (ax.is.function(x.menu)) {
          popupContents = x.menu({
            menu: context.$menu(),
          });
        } else {
          popupContents = options.menu;
        }
      } else {
        popupContents = options.popup || null;
      }

      let popup = context.$('|appkit-context-popup');

      let clickHandler = function (e) {
        if (!popup.contains(e.target)) {
          if (options.menu) {
            let menu = popup.$('|appkit-menu');
            menu && menu.$closeSubmenus();
          }
          popup.style.display = 'none';
          removeClickHandler();
          el.$send('ax.appkit.context.popup.close');
        }
      };

      let removeClickHandler = function () {
        window.document.removeEventListener('mousedown', clickHandler);
      };

      let addClickHandler = function () {
        window.document.addEventListener('mousedown', clickHandler);
      };

      el.$on({
        'click: show popup': (e) => {
          e.preventDefault();
          e.stopPropagation();
          popup.$nodes = [popupContents];
          popup.style.left = `${e.pageX + 1}px`;
          popup.style.top = `${e.pageY + 1}px`;
          popup.style.display = 'inline-block';
          nudgePopup(popup);
          addClickHandler();
          el.$send('ax.appkit.context.popup.show');
        },
      });
    },
    ...options.contentTag,
  };

  return (a, x) =>
    a['|appkit-context'](
      [
        a['|appkit-context-content'](component, contentTagOptions),
        a['|appkit-context-popup'](null, popupTagOptions),
      ],
      contextTagOptions
    );
};

ax.extension.filepond = (options = {}) => {
  return ax.a['|ax-filepond'](null, {
    $init: (el) => {
      el.$nodes = FilePond.create({
        server: options.server,
        ...options.filepond,
      }).element;
    },

    ...options.filepondTag,
  });
};

ax.css({
  '|ax-filepond': {
    display: 'block',
  },
});

ax.extension.markedjs = {};

ax.extension.markedjs.marked = window.marked;

ax.extension.markedjs.markdown = function (options = {}) {
  let a = ax.a;
  let x = ax.x;

  let content = options.markdown || '';
  let html;

  let processMarkdown = function (string) {
    string = (string || '').toString();
    if (options.inline) {
      return x.markedjs.marked.inlineLexer(string, options.markedjs);
    } else {
      return x.markedjs.marked(string, options.markedjs);
    }
  };

  if (content instanceof Array) {
    let result = [];
    content.forEach(function (item) {
      result.push(processMarkdown(item));
    });
    html = result.join('');
  } else {
    html = processMarkdown(content);
  }

  if (options.sanitize) {
    html = options.sanitize(html);
  }

  return a['div|ax-markedjs'](a(html), options.markedjsTag);
};

ax.extension.markedjs.report = {};

ax.extension.markedjs.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  let value = options.value;
  let component;

  if (value) {
    component = x.markedjs.markdown({
      markdown: value,
      markedjsTag: options.markedjsTag,
    });
  } else {
    component = a['i.placeholder'](
      ax.is.undefined(options.placeholder) ? 'None' : options.placeholder
    );
  }

  return a['|appkit-report-control'](
    a['|appkit-report-markdown'](component, options.markdownTag),
    {
      'data-name': options.name,
      $value: function () {
        return options.value;
      },

      tabindex: 0,
      $focus: function () {
        this.focus();
      },

      ...options.controlTag,
    }
  );
};

ax.extension.panes = function (options = {}) {
  let a = ax.a;

  let proximate = options.proximate || null;
  let adjacent = options.adjacent || null;
  let orientation = options.vertical ? 'vertical' : 'horizontal';

  function move(e) {
    let el = e.target.$('^|ax-panes');

    let percent,
      vertical = options.vertical;

    if (vertical) {
      let position = el.clientHeight - (e.clientY - el.offsetTop);
      percent = (100 * position) / el.clientHeight;
    } else {
      let position = el.clientWidth - (e.clientX - el.offsetLeft);
      percent = 100 * (1 - position / el.clientWidth);
    }

    resize(el, percent, vertical);
  }

  function resize(el, percent) {
    let proximateEl = el.$('|ax-panes-proximate'),
      adjacentEl = el.$('|ax-panes-adjacent'),
      drag = el.$('|ax-panes-drag');

    percent = Number(percent || 50);
    if (Number.isNaN(percent)) percent = 50;
    if (percent > 90) percent = 90;
    if (percent < 10) percent = 10;

    if (options.vertical) {
      proximateEl.style.bottom = `calc( 100% - ${percent}% + 2px )`;
      adjacentEl.style.top = `calc( ${percent}% + 2px )`;
      drag.style.top = `calc( ${percent}% - 2px )`;
    } else {
      proximateEl.style.right = `calc( 100% - ${percent}% + 2px )`;
      adjacentEl.style.left = `calc( ${percent}% + 2px )`;
      drag.style.left = `calc( ${percent}% - 2px )`;
    }

    el.$send('ax.panes.resize', {
      detail: {
        percent: percent,
      },
    });
  }

  function clear(e) {
    e.target.$('^|ax-panes').classList.remove('dragable');
    window.document.removeEventListener('mousemove', move);
    window.document.removeEventListener('mouseup', clear);
  }

  return a['|ax-panes'](
    [
      a['|ax-panes-proximate'](proximate),
      a['|ax-panes-drag'](null, {
        $on: {
          mousedown: (e, el) => {
            el.$('^|ax-panes').classList.add('dragable');
            window.document.addEventListener('mousemove', move);
            window.document.addEventListener('mouseup', clear);
          },
        },
      }),
      a['|ax-panes-adjacent'](adjacent),
    ],
    {
      class: orientation,
      $init: function () {
        resize(this, options.percent);
      },
      ...options.panesTag,
    }
  );
};

ax.css({
  '|ax-panes': {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    '|ax-panes-proximate': {
      display: 'block',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      right: 'calc( 50% + 2px )',
      overflowY: 'auto',
      overflowX: 'hidden',
    },

    '|ax-panes-adjacent': {
      display: 'block',
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      left: 'calc( 50% + 2px )',
      overflowY: 'auto',
      overflowX: 'hidden',
    },

    '|ax-panes-drag': {
      display: 'block',
      position: 'absolute',
      left: 'calc( 50% - 2px )',
      top: 0,
      bottom: 0,
      width: '4px',
      background: '#0001',
      '&:hover': {
        background: '#ddd',
      },
    },

    '&.dragable': {
      cursor: 'grabbing',
      '|ax-panes-drag': {
        background: '#aaa',
      },
    },

    '&:not(.dragable)': {
      '|ax-panes-drag': {
        cursor: 'ew-resize',
      },
    },

    '&.vertical': {
      '|ax-panes-proximate': {
        bottom: 'calc( 50% + 2px )',
        right: 0,
      },

      '|ax-panes-adjacent': {
        left: 0,
        top: 'calc( 50% + 2px )',
      },

      '|ax-panes-drag': {
        display: 'block',
        position: 'absolute',
        top: 'calc( 50% - 2px )',
        left: 0,
        right: 0,
        height: '4px',
        width: '100%',
        background: '#eee',
      },

      '&:not(.dragable)': {
        '|ax-panes-drag': {
          cursor: 'ns-resize',
        },
      },
    },
  },
});

ax.extension.xtermjs = (options = {}) => (a, x) =>
  a['|ax-xtermjs'](
    [
      a['|ax-xtermjs-toolbar'](
        [
          a['|ax-xtermjs-toolbar-left'](options.label || null),
          a['|ax-xtermjs-toolbar-right'](
            a['|ax-xtermjs-fullscreen'](
              a.button('🗖', {
                type: 'button',
                $on: {
                  'click: toggle full screen': function () {
                    let terminal = this.$('^|ax-xtermjs');
                    terminal.$fullscreen = !terminal.$fullscreen;
                    if (terminal.$fullscreen) {
                      this.$text = '🗗';
                      this.$('^body').style.overflowY = 'hidden';
                      this.$('^body')
                        .querySelectorAll('|ax-xtermjs')
                        .forEach((el) => {
                          if (el != this.$('^|ax-xtermjs'))
                            el.$('|ax-xtermjs-container').style.display =
                              'none';
                        });
                      terminal.$('^|ax-xtermjs').classList.add('fullscreen');
                    } else {
                      this.$text = '🗖';
                      this.$('^body').style.overflowY = 'auto';
                      this.$('^body')
                        .querySelectorAll('|ax-xtermjs')
                        .forEach((el) => {
                          el.$('|ax-xtermjs-container').style.display = '';
                        });
                      terminal.$('^|ax-xtermjs').classList.remove('fullscreen');
                    }
                    terminal.$xtermFit.fit();
                  },
                },
              })
            )
          ),
        ],
        options.toolbarTag
      ),
      a['div|ax-xtermjs-container'],
    ],
    {
      $init: function () {
        const resizeFn = function () {
          this.$xtermFit.fit();
        }.bind(this);

        window.addEventListener('resize', resizeFn);
        this.$xterm = new x.xtermjs.Terminal(options.terminal);
        this.$xtermFit = new x.xtermjs.FitAddon();
        this.$xterm.loadAddon(this.$xtermFit);
        this.$xterm.open(this.$('|ax-xtermjs-container'));
        this.$xterm.write(options.text || '');
        resizeFn();
      },
      $write: function (text) {
        this.$xterm.write(text);
      },
      ...options.terminalTag,
    }
  );

ax.css({
  '|ax-xtermjs': {
    display: 'block',
    height: 'calc( 300px + 1.8rem )',

    '&.fullscreen': {
      height: 'calc( 100vh - 1.8rem )',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      '|ax-xtermjs-toolbar': {
        zIndex: '257',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      },
      '|ax-xtermjs-container': {
        height: '100%',
        '.xterm-screen': {
          marginTop: '1.8rem',
        },
      },
    },

    '|ax-xtermjs-container': {
      display: 'block',
      height: '300px',
    },

    '|ax-xtermjs-toolbar': {
      display: 'block',
      overflow: 'auto',
      backgroundColor: 'white',
      border: '1px solid #e6e6e6',
      borderBottom: 'none',
      button: {
        fontSize: '1.2rem',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
    },

    '|ax-xtermjs-toolbar-right': {
      float: 'right',
    },

    '|ax-xtermjs-toolbar-left': {
      lineHeight: '1.8',
      paddingLeft: '5px',
    },
  },
});

ax.extension.xtermjs.Terminal = window.Terminal;
ax.extension.xtermjs.FitAddon = (window.FitAddon || {}).FitAddon;

ax.extension.xtermjs.report = {};

ax.extension.xtermjs.report.control = function (r, options = {}) {
  let a = ax.a;
  let x = ax.x;

  return a['|appkit-report-control'](
    a['|appkit-report-terminal'](
      x.xtermjs({
        text: options.value || '',
        ...options.xtermjs,
      }),
      options.terminalTag
    ),
    {
      'data-name': options.name,
      $value: function () {
        return options.value;
      },

      tabindex: 0,
      $focus: function () {
        this.focus();
      },

      ...options.controlTag,
    }
  );
};

return ax;

}));
