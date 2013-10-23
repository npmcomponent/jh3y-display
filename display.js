;(function(){

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};


require.register("display/index.js", function(exports, require, module){
module.exports = display;
function display(element) {
	if (!(this instanceof display)) return new display(element);
	this.element = element;
	this._create();
	for (var ext in this._extensions) {this._extensions[ext](this);}
}
display.prototype._extensions = {}
display.prototype._configurePanels = function () {
	var display = this,
		count,
		currentPanel,
		directions = {'nextElementSibling': 'data-coming', 'previousElementSibling': 'data-gone'};
	for (direction in directions) {
		currentPanel = display.element.querySelector('.current');
		count = 1;
		while (currentPanel[direction] !== null) {
			currentPanel[direction].setAttribute(directions[direction], count);
			count ++;
			currentPanel = currentPanel[direction];
		}
	}
}
display.prototype._create = function () {
	var display = this,
		panels = display.element.children;
	display.element.className = display.element.className + ' display';
	display.element.setAttribute('data-display', true);
	[].forEach.call(panels, function (panel, index) {
		if (panel.tagName.toLowerCase() === 'div') {
			panel.className = (index === 0) ? panel.className + ' current display-panel': panel.className + ' display-panel';
		}
	});
	display._configurePanels();
}
display.prototype._move = function (direction, element) {
	direction = (direction !== undefined) ? direction : 'next';
	if (direction === 'previous' || direction === 'next') {
		var prop = (direction === 'previous') ? 'previousElementSibling' : 'nextElementSibling',
			attr = (direction === 'previous') ? 'data-gone' : 'data-coming',
			display = this,
			currentPanel = display.element.querySelector('.current');
		if (currentPanel[prop] !== null) {
			currentPanel.className = currentPanel.className.replace('current', '');
			currentPanel.removeAttribute(attr);
			currentPanel[prop].className = currentPanel[prop].className + ' current';
			currentPanel[prop].removeAttribute(attr);
			display._configurePanels();
		}
	}
}
display.prototype.next = function () {
	this._move('next');
}
display.prototype.previous = function () {
	this._move('previous');
}
});




require.alias("display/index.js", "display/index.js");if (typeof exports == "object") {
  module.exports = require("display");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("display"); });
} else {
  this["display"] = require("display");
}})();