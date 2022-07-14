// Ax, copyright (c) Lachlan Douglas
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
 * The default insertion method is to append a child. Set options.method
 * 'replaceWith' to replace the target, or 'prependChild' to prepend a child.
 */
let ax = function (node, options = {}) {
  let element = ax.node(node);
  let insert = () => ax.insert(element, options);

  // Ensure that the document is ready to write to.
  if (
    window.document.readyState == 'interactive' ||
    window.document.readyState == 'complete'
  ) {
    insert();
  } else {
    window.document.addEventListener('DOMContentLoaded', insert);
  }

  return element;
};

/**
 * Creates a <style> tag in <head> and inserts css.
 * css can be a string or an object.
 */
ax.css = function (sheet) {
  ax.insert(
    ax.node.create({
      $tag: 'style',
      $html: this.css.sheet(sheet),
    }),
    {
      target: 'head',
    }
  );
};

/**
 * Extension loader.
 * Use this method to load Ax Extensions that are are imported as ES6 modules.
 * For example:
 * import ax from '@engines/ax'
 * import axAppkit from '@engines/ax-appkit'
 * import axChartjs from '@engines/ax-appkit-chartjs'
 * import "chart.js/dist/Chart.css";
 * import Chart from 'chart.js';
 * ax.extend( axAppkit, [axChartjs, {Chart: Chart}] ).
 */
ax.extend = function (...extensions) {
  for (let extension of extensions) {
    if (ax.is.array(extension)) {
      extension[0].extend(this, extension[1] || {});
    } else {
      extension.extend(this);
    }
  }
};

/**
 * Extension namespace.
 * Extensions are installed here.
 */
ax.extensions = {
  lib: {},
};

/**
 * Inserts an element in the DOM.
 */
ax.insert = function (element, options = {}) {
  let target = options.target;
  if (ax.is.string(target)) {
    target = window.document.querySelector(target);
  } else if (ax.is.undefined(target)) {
    target = window.document.body;
  }
  let method = options.method || 'append';
  target[method](element);
};

/**
 * Check value is of a data type.
 */
ax.is = {};

/**
 * Convert string from camelCase to kebab-case.
 */
ax.kebab = (...strings) =>
  strings
    .map(
      (string) =>
        (string[0].match(/[A-Z]/) ? '-' : '') +
        string.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
    )
    .join('-');

/**
 * Creates a <link> tag in <head>.
 */
ax.link = function (attributes = {}) {
  ax.insert(
    ax.node.create({
      $tag: 'link',
      ...attributes,
    }),
    {
      target: 'head',
    }
  );
};

/**
 * Node pre-processor that accepts various component types
 * and returns a node.
 */
ax.node = function (node) {
  if (ax.is.node(node) || ax.is.nodelist(node)) return node;
  if (ax.is.string(node)) return ax.node.text(node);
  if (ax.is.tag(node)) return ax.node.tag(node);
  if (ax.is.function(node)) return ax.node.function(node);
  return ax.node.json(node);
};

/**
 * Creates a <script> tag in <head>.
 */
ax.script = function (...attributes) {
  ax.insert(ax.a(...attributes, { $tag: 'script' }), {
    target: 'head',
  });
};

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

/**
 * Tag Builder namespace.
 * The Tag Builder creates arbitrary HTML elements.
 * It is instantiated as `ax.a`.
 */
ax.tag = {};

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

ax.css.rulesets = function (sheet, keys) {
  return Object.entries(sheet)
    .map(([key, value]) => {
      return key
        .split(/,\s*/)
        .map((key) => {
          return this.ruleset([...keys, key], value);
        })
        .join(' ');
    })
    .join(' ');
};

ax.css.selector = function (keys) {
  return keys.join(' ').replace(/\s&/g, '');
};

ax.css.sheet = function (sheet, keys = []) {
  return [sheet]
    .flat(Infinity)
    .map((section) => {
      if (ax.is.string(section)) {
        return section;
      } else {
        return this.rulesets(section, keys);
      }
    })
    .join(' ');
};

/**
 * Alias for shortcut to Ax Extensions.
 */
ax.x = ax.extensions;

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
  return value && value.constructor === Object;
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
  return ax.is.function(value) && '' + ax.a.function == '' + value;
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
 * Create element from Ax component properties.
 */
ax.node.create = function (properties) {
  try {
    let element = ax.node.create.element(properties);
    this.create.shadow(element);
    this.create.properties(element);
    this.create.tools(element);
    this.create.accessors(element);
    this.create.events(element);
    this.create.render(element);
    this.create.apply(element);
    this.create.init(element);
    return element;
  } catch (err) {
    if (properties.$catch) {
      return ax.node(properties.$catch(err));
    } else {
      console.error(
        `Ax failed to create element with properties: `,
        properties,
        err
      );
      return '';
    }
  }
};

/**
 * Create element for a function.
 * Function is called with the Ax Tag Builder and Extensions.
 * The result, which can be any valid component, is fed back
 * into the Factory.
 */
ax.node.function = function (fn) {
  return ax.node.create({
    $tag: 'code',
    style: 'white-space: break-spaces',
    $text: `𝑓 ${fn}`,
  });
};

/**
 * Create element for an object.
 */
ax.node.json = function (object) {
  return ax.node.create({
    $tag: 'code',
    style: 'white-space: break-spaces',
    $text: JSON.stringify(object, null, 2),
  });
};

/**
 * Creates NodeList from raw HTML.
 */
ax.node.raw = function (...html) {
  let jig = window.document.createElement('div');
  jig.innerHTML = html.flat(Infinity).join('');
  return jig.childNodes;
};

/**
 * Create element for an uncalled Tag Builder function.
 * e.g: a.br or a.hr
 */
ax.node.tag = (tag) => tag();

/**
 * Create element for text.
 */
ax.node.text = (text) => window.document.createTextNode(text);

ax.style.definition = function (definition, keys = []) {
  return Object.entries(definition)
    .map(([key, value]) => {
      if (ax.is.undefined(value)) {
        return '';
      } else if (ax.is.object(value)) {
        return ax.style.definition(value, [...keys, key]);
      } else {
        return `${ax.kebab(...keys, key)}: ${value};`;
      }
    })
    .join(' ');
};

/**
 * Tag Builder proxy namespace.
 */
ax.tag.proxy = {};

/**
 * Add methods to element.
 */
ax.node.create.accessors = function (element) {
  // this.accessors.state(element)
  this.accessors.nodes(element);
  this.accessors.html(element);
  this.accessors.text(element);
  this.accessors.on(element);
  this.accessors.off(element);
  this.accessors.send(element);
};

/**
 * Apply content to element.
 */
ax.node.create.apply = function (element) {
  if (element.$ax.hasOwnProperty('$text')) {
    this.render.text(element);
  } else if (element.$ax.hasOwnProperty('$nodes')) {
    this.render.nodes(element);
  } else if (element.$ax.hasOwnProperty('$html')) {
    this.render.html(element);
  }
};

ax.node.create.element = function (properties) {
  let element;
  if (ax.is.array(properties.$tag)) {
    let tag = ax.node.create.element.tag(properties.$tag[1] || '');
    properties = {
      ...properties,
      ...tag,
      $tag: [properties.$tag[0], tag.$tag],
    };
    element = window.document.createElementNS(...properties.$tag);
  } else {
    properties = {
      ...properties,
      ...ax.node.create.element.tag(properties.$tag || ''),
    };
    element = window.document.createElement(properties.$tag);
  }
  element.$ax = properties;
  return element;
};

/**
 * Add initial events to element.
 */
ax.node.create.events = function (element) {
  if (element.$ax.$on) {
    ax.node.create.events.adds(element, element.$ax.$on);
  }
};

/**
 * Append init script to element.
 */
ax.node.create.init = function (element) {
  if (ax.is.function(element.$ax.$init)) {
    element.appendChild(
      ax.node.create({
        $tag: 'script',
        type: 'text/javascript',
        $text: `(${ax.node.create.init.function})()`,
      })
    );
  }
};

/**
 * Set properties on element.
 */
ax.node.create.properties = function (element) {
  for (let property in element.$ax) {
    if (element.$ax.hasOwnProperty(property)) {
      if (property[0] == '$') {
        if (!property.match(this.reserved)) {
          if (property[1] == '$') {
            this.properties.state(element, property, { reactive: true });
          } else {
            this.properties.state(element, property);
          }
        }
      } else {
        this.properties.attribute(element, property);
      }
    }
  }
};

/**
 * Add render function to element.
 */
ax.node.create.render = function (element) {
  element.$render = () => {
    this.render.empty(element);
    this.apply(element);
  };
};

/**
 * Regexp of property names that are reserved for ax functionality.
 */
ax.node.create.reserved = /^(\$tag|\$init|\$exit|\$text|\$nodes|\$html|\$send|\$on|\$off|\$render|\$ax|$events|\$catch|\$shadow|\$|\$\$)$/;

/**
 * Attach shadow DOM to element and insert styles.
 */
ax.node.create.shadow = function (element) {
  if (element.$ax.$shadow) {
    element.attachShadow({ mode: 'open' });
    if (ax.is.not.true(element.$ax.$shadow)) {
      element.shadowRoot.appendChild(
        ax.a.style(ax.css.sheet([element.$ax.$shadow]))
      );
    }
  }
};

// /**
//  * Extract properties from tag property.
//  */
ax.node.create.element.tag = function (tag) {
  // if the tag starts with a word, use the word as nodename
  // if the tag has a '#' word, use as id
  // if the tag has '.' words, use as class
  // if the tag has '[]' attrs, use as html tag properties
  // e.g. div#myTagId.btn.btn-primary

  let properties = {};

  let nodename = (tag.match(/^([\w-]+)/) || [])[1];
  let id = (tag.match(/#([\w-]+)/) || [])[1];
  let classes = [...tag.matchAll(/\.([\w-]+)/g)].map((match) => match[1]);
  let attrs = [...tag.matchAll(/\[(.*?)=(.*?)\]/g)].map((match) => [
    match[1],
    match[2],
  ]);

  properties.$tag = nodename || 'span';
  if (id) properties.id = id;
  if (classes.length) {
    properties.class = classes.join(' ');
  }
  for (let attr of attrs) {
    properties[attr[0]] = JSON.parse(attr[1]);
  }

  return properties;
};

/**
 * Add traverse and query tools to element.
 */
ax.node.create.tools = function (element) {
  element.$ = this.tools.traverse;
  element.$$ = this.tools.query;
};

ax.tag.proxy.create = (...properties) => {
  return ax.node.create(
    Object.assign({}, ...properties.map(ax.tag.proxy.properties))
  );
};

/**
 * Tag Builder proxy function.
 * Accepts an HTML fragment or an object of Ax component properties.
 * Returns an element.
 */
ax.tag.proxy.function = (...arguments) => ax.tag.proxy.create(...arguments);

/**
 * Set Ax content property based on component type.
 */
ax.tag.proxy.properties = function (properties) {
  if (ax.is.object(properties)) return properties;
  if (ax.is.tag(properties)) return { $nodes: [properties()] };
  if (ax.is.array(properties) || ax.is.nodelist(properties))
    return { $nodes: properties };
  return { $nodes: [properties] };
};

/**
 * Tag Builder proxy shim.
 * Creates arbitrary HTML elements.
 */
ax.tag.proxy.shim = {
  get: (target, property) => {
    if (ax.is.not.string(property)) {
      new Error('Expecting a string but got', property);
    }

    return (...properties) => {
      if (property == '!') return ax.node.raw(properties);
      return ax.tag.proxy.create({ $tag: property }, ...properties);
    };
  },
};

/**
 * Get HTML content, or set new HTML content.
 */
ax.node.create.accessors.html = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$html', {
    get: function () {
      return element.innerHTML;
    },
    set: function (html) {
      accessors.html.set(element, html);
    },
  });
};

/**
 * Get nodes content, or set new nodes content.
 */
ax.node.create.accessors.nodes = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$nodes', {
    get: function () {
      return Array.from(element.childNodes);
    },
    set: function (nodes) {
      accessors.nodes.set(element, nodes);
    },
  });
};

/**
 * Remove an event listener.
 */
ax.node.create.accessors.off = function (element) {
  element.$off = function (handle) {
    if (ax.is.array(handle)) {
      while (element.$events.length) {
        element.$off(handle[0]);
      }
    } else {
      element.removeEventListener(
        handle.split(':')[0],
        element.$events[handle]
      );
      delete element.$events[handle];
    }
  };
};

/**
 * Add an event listener.
 */
ax.node.create.accessors.on = function (element) {
  element.$on = function (adds) {
    ax.node.create.events.adds(element, adds);
  };
};

/**
 * Send an event from the element.
 */
ax.node.create.accessors.send = function (element) {
  element.$send = function (type, options = {}) {
    return element.dispatchEvent(
      new CustomEvent(type, {
        detail: options.detail || {},
        bubbles: options.bubbles == false ? false : true,
        cancelable: options.cancelable == false ? false : true,
      })
    );
  };
};

/**
 * Get text content, or set new text content.
 */
ax.node.create.accessors.text = function (element) {
  let accessors = this;

  Object.defineProperty(element, '$text', {
    get: function () {
      return element.textContent;
    },
    set: function (text) {
      accessors.text.set(element, text);
    },
  });
};

ax.node.create.events.adds = function (element, adds) {
  if (!element.$events) element.$events = {};

  for (let add in adds) {
    element.$events[add] = adds[add];
    for (let event of add.split(':')[0].split(',')) {
      element.addEventListener(
        event.trim(),
        element.$events[add].bind(element),
        false
      );
    }
  }
};

/**
 * init script.
 */
ax.node.create.init.function = function () {
  let script = window.document.currentScript;
  let element = script.parentElement;
  script.remove();
  element.$ax.$init(element);
};

/**
 * Define attribute on element.
 */
ax.node.create.properties.attribute = function (element, property) {
  let value = element.$ax[property];
  if (ax.is.not.undefined(value)) {
    if (property == 'style') {
      element.setAttribute('style', ax.style(value));
    } else {
      this.attribute.set(element, [property], value);
    }
  }
};

ax.node.create.properties.state = function (element, property, options = {}) {
  Object.defineProperty(element, property, {
    get: () => {
      let value = element.$ax[property];
      if (ax.is.function(value)) return value(element);
      return value;
    },
    set: (state) => {
      element.$ax[property] = state;
      if (options.reactive) element.$render();
    },
  });
};

/**
 * Clear exisitng children from element.
 */
ax.node.create.render.empty = function (element) {
  while (element.childNodes.length) {
    let child = element.lastChild;
    ax.node.create.render.exit(child);
    child.remove();
  }
};

/**
 * Recursive removal of event handlers and call of $exit functions.
 */
ax.node.create.render.exit = function (element) {
  for (let child of element.childNodes) ax.node.create.render.exit(child);

  if (element.$ax && ax.is.function(element.$ax.$exit))
    element.$ax.$exit(element);
};

/**
 * Add raw HTML to element.
 */
ax.node.create.render.html = function (element) {
  // Get content for the element.
  let html = element.$ax.$html;

  // Call function, if required.
  if (ax.is.function(html)) html = html(element);
  if (ax.is.array(html)) html = html.flat(Infinity).join('');

  // Add content.
  let target = element.shadowRoot || element;
  target.innerHTML = html;
};

/**
 * Add child nodes to element.
 */
ax.node.create.render.nodes = function (element) {
  // Get content for the element.
  let nodes = element.$ax.$nodes;

  // Call function, if required.
  if (ax.is.function(nodes)) nodes = nodes(element);

  // Add content.
  let target = element.shadowRoot || element;
  this.nodes.append(target, nodes);
};

/**
 * Add text to element.
 */
ax.node.create.render.text = function (element) {
  // Get content for the element.
  let text = element.$ax.$text;

  // Call function, if required.
  if (ax.is.function(text)) text = text(element);
  if (ax.is.array(text)) text = text.flat(Infinity).join('');

  // Add content.
  let target = element.shadowRoot || element;
  target.appendChild(window.document.createTextNode(text));
};

/**
 * Query Tool, for collecting and operating on groups of elements.
 */
ax.node.create.tools.query = function (selector) {
  let collection = Array.from(this.querySelectorAll(selector));

  return ax.node.create.tools.query.proxy(collection);
};

/**
 * Traverse Tool, for traversing the DOM.
 */
ax.node.create.tools.traverse = function (...selectors) {
  let result = this;
  let traverse = ax.node.create.tools.traverse;
  selectors.forEach(function (selector) {
    if (ax.is.array(selector)) {
      result = result.$(...selector);
    } else if (/,\s*/.test(selector)) {
      // comma is OR
      let selectors = selector.split(/,\s*/);
      let selected;
      for (let i in selectors) {
        selected = traverse.select(result, selectors[i]);
        if (selected) break;
      }
      result = selected;
    } else if (/^\S+$/.test(selector)) {
      // string contains a single selector
      result = traverse.select(result, selector);
    } else {
      // string contains multiple selectors
      selectors = selector.match(/(\S+)/g);
      result = result.$(...selectors);
    }
  });
  return result;
};

/**
 * Tag Builder proxy instantiation.
 */
ax.a = new Proxy(ax.tag.proxy.function, ax.tag.proxy.shim);

/**
 * Render html content.
 */
ax.node.create.accessors.html.set = function (element, html) {
  delete element.$ax.$text;
  delete element.$ax.$nodes;
  element.$ax.$html = html;
  ax.node.create.render.empty(element);
  ax.node.create.render.html(element);
};

/**
 * Render nodes content.
 */
ax.node.create.accessors.nodes.set = function (element, nodes) {
  delete element.$ax.$text;
  delete element.$ax.$html;
  element.$ax.$nodes = nodes;
  ax.node.create.render.empty(element);
  ax.node.create.render.nodes(element);
};

/**
 * Render text content.
 */
ax.node.create.accessors.text.set = function (element, text) {
  delete element.$ax.$html;
  delete element.$ax.$nodes;
  element.$ax.$text = text;
  ax.node.create.render.empty(element);
  ax.node.create.render.text(element);
};

/**
 * Set attributes on an element.
 * Value can be a string or an object.
 */
ax.node.create.properties.attribute.set = function (element, keys, value) {
  if (ax.is.object(value)) {
    for (let key of Object.keys(value)) {
      this.set(element, [...keys, key], value[key]);
    }
  } else {
    element.setAttribute(ax.kebab(...keys), value);
  }
};

/**
 * Set attributes on an element.
 * Value can be a string or an object.
 */
ax.node.create.properties.attribute.set = function (element, keys, value) {
  if (ax.is.object(value)) {
    for (let key of Object.keys(value)) {
      this.set(element, [...keys, key], value[key]);
    }
  } else {
    element.setAttribute(ax.kebab(...keys), value);
  }
};

ax.node.create.render.nodes.append = function (element, nodes) {
  if (ax.is.node(nodes)) {
    element.appendChild(nodes);
  } else if (ax.is.nodelist(nodes)) {
    for (let node of Array.from(nodes)) {
      element.appendChild(node);
    }
  } else {
    for (let node of nodes) {
      node = ax.node(node);
      this.append(element, node);
    }
  }
};

/**
 * Instantiate the Query Tool proxy.
 */
ax.node.create.tools.query.proxy = function (collection, pending = []) {
  return new Proxy(function () {}, this.proxy.shim(collection, pending));
};

/**
 * Select an element based on traversal instruction.
 */
ax.node.create.tools.traverse.select = function (element, selector) {
  if (!element) {
    return '';
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
 * Query Tool shim.
 */
ax.node.create.tools.query.proxy.shim = function (collection, pending) {
  return {
    get: ax.node.create.tools.query.proxy.shim.get(collection, pending),
    set: ax.node.create.tools.query.proxy.shim.set(collection, pending),
    apply: ax.node.create.tools.query.proxy.shim.apply(collection, pending),
  };
};

/**
 * Apply a function to selected elements.
 */
ax.node.create.tools.query.proxy.shim.apply = function (collection, pending) {
  return function (target, receiver, args) {
    collection.forEach(function (node, i) {
      collection[i] = pending[i].call(node, ...args);
    });

    return ax.node.create.tools.query.proxy(collection);
  };
};

/**
 * Get values from selected elements.
 */
ax.node.create.tools.query.proxy.shim.get = function (collection, pending) {
  return function (target, property, receiver) {
    if (property == Symbol.iterator)
      return ax.node.create.tools.query.proxy.shim.iterator(collection);
    if (/^\d+$/.test(property)) return collection[property];
    if (/^\$\$$/.test(property)) return collection;
    // if (/^toArray$/.test(property)) return collection;
    // if (/^forEach$/.test(property)) return (fn) => collection.forEach(fn);
    // if (/^toString$/.test(property)) return () => collection.toString();

    if (
      /^toArray$/.test(property) ||
      /^forEach$/.test(property) ||
      /^toString$/.test(property)
    ) {
      debugger;
    }

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

    return ax.node.create.tools.query.proxy(collection, pending);
  };
};

ax.node.create.tools.query.proxy.shim.iterator = (collection) => {
  return function () {
    return {
      current: 0,
      last: collection.length - 1,
      next() {
        if (this.current <= this.last) {
          return { done: false, value: collection[this.current++] };
        } else {
          return { done: true };
        }
      },
    };
  };
};

/**
 * Set a value on selected elements.
 */
ax.node.create.tools.query.proxy.shim.set = function (collection, pending) {
  return function (target, property, value, receiver) {
    collection.forEach(function (node) {
      node[property] = value;
    });

    return true;
  };
};

return ax;

}));
