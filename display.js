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
 * Main definitions.
 */

require.mains = {};

/**
 * Define a main.
 */

require.main = function(name, path){
  require.mains[name] = path;
};

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
  if ('/' == path.charAt(0)) path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  if (require.mains[path]) {
    paths = [path + '/' + require.mains[path]];
  }

  for (var i = 0, len = paths.length; i < len; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) {
      return path;
    }
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

  for (var i = 0, len = path.length; i < len; ++i) {
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
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var root = require.normalize(parent, '..');

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
    if ('.' == c) return require.normalize(root, path);
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
function display(element, options) {
	if (!(this instanceof display)) return new display(element);
	this.element = element;
	this._nav = (options && options.nav) ? true: false;
	this._pagination = (options && options.pagination) ? true: false;
	this._infinite = (options && options.infinite) ? true: false;
	this._create();
	for (var ext in this._extensions) {this._extensions[ext](this);}
}
display.prototype._extensions = {}
display.prototype._configurePanels = function () {
	var display = this,
		count,
		panelLength = display.element.querySelectorAll('.display-panel').length,
		currentPanel,
		directions = {'nextElementSibling': 'data-coming', 'previousElementSibling': 'data-gone'},
		cleanUp = function () {
			for (direction in directions) {
				currentPanel = display.element.querySelector('.display-panel.current');
				count = 1;
				while (currentPanel[direction] !== null && (currentPanel[direction].className.indexOf('display-panel') !== -1) && (currentPanel[direction].tagName.toUpperCase() === 'DIV' || currentPanel[direction].tagName.toUpperCase() === 'LI')) {
					currentPanel[direction].setAttribute(directions[direction], count);
					if (display._infinite && directions[direction] === 'data-coming') {
						currentPanel[direction].removeAttribute('data-gone');
					} else if (display._infinite && directions[direction] === 'data-gone') {
						currentPanel[direction].removeAttribute('data-coming');
					}
					count ++;
					currentPanel = currentPanel[direction];
				}
			}
		};
	cleanUp();
	if (display._infinite && panelLength >= 3) {
		if (display.element.querySelectorAll('.display-panel')[panelLength - 1].className.indexOf('current') !== -1) {
			if (display._nav || display.element.querySelector('.display-nav-left') || display.element.querySelector('.display-nav-right')) {
				display.element.insertBefore(display.element.firstElementChild, display.element.querySelector('.display-nav-left'));
			} else if (display._pagination || display.element.querySelector('.display-pagination-pen')) {
				display.element.insertBefore(display.element.firstElementChild, display.element.querySelector('.display-pagination-pen'));
			} else {
				display.element.appendChild(display.element.firstElementChild);
			}
			cleanUp();
		} else if (display.element.firstElementChild.className.indexOf('current') !== -1) {
			display.element.insertBefore(display.element.querySelectorAll('.display-panel')[panelLength - 1], display.element.firstElementChild);
			cleanUp();
		}
	}
}
display.prototype._create = function () {
	var display = this,
		panels = display.element.children;
	display.element.className = display.element.className + ' display';
	display.element.setAttribute('data-display', true);
	[].forEach.call(panels, function (panel, index) {
		if (panel.tagName.toUpperCase() === 'DIV' || panel.tagName.toUpperCase() === 'LI') {
			panel.className = (index === 0) ? panel.className + ' current display-panel': panel.className + ' display-panel';
			panel.setAttribute('data-display-panel-index', index);
		}
	});
	display._configurePanels();
	if (this._nav) {
		var navLeft = document.createElement('span'),
			navRight = document.createElement('span');
		navLeft.className = 'display-nav-left';
		navRight.className = 'display-nav-right';
		display.element.appendChild(navLeft);
		display.element.appendChild(navRight);
		navLeft.addEventListener('click', function (event) {
			display.previous();
		});
		navRight.addEventListener('click', function (event) {
			display.next();
		});
	}
	panels = display.element.querySelectorAll('.display-panel');
	if (this._pagination) {
		var paginationPen = document.createElement('span');
		paginationPen.className = 'display-pagination-pen';
		for (var i = 0; i < panels.length; i++) {
			var newPG = document.createElement('span');
			newPG.className = 'PGIndicator';
			newPG.setAttribute('data-display-index', i);
			if (i === 0) {
				newPG.className += ' current';
			}
			newPG.addEventListener('click', function () {
				var currentPanel = display.element.querySelector('.display-panel.current'),
					currentIndex = parseInt(currentPanel.getAttribute('data-display-panel-index'), 10),
					reIndex = function () {
						for (var i = panels.length - 1; i >= 0; i--) {
							display.element.insertBefore(display.element.querySelector('[data-display-panel-index="' + i + '"]'), display.element.firstElementChild);
						};
						display._configurePanels();
					},
					PG = this;
				reIndex();
				setTimeout(function () {
					display._move(parseInt(PG.getAttribute('data-display-index'), 10));
				}, 250);
			});
			paginationPen.appendChild(newPG);
		};
		display.element.appendChild(paginationPen);
	}
}
display.prototype._move = function (direction) {
	var display = this,
		currentPanel = display.element.querySelector('.display-panel.current'),
		newDestination,
		makeMove = function () {
			currentPanel.className = currentPanel.className.replace('current', '');
			currentPanel.removeAttribute('data-gone');
			currentPanel.removeAttribute('data-coming');
			newDestination.removeAttribute('data-gone');
			newDestination.removeAttribute('data-coming');
			newDestination.className += ' current';
			if (display._pagination) {
				display._configurePaginationIndicators();
			}
			display._configurePanels();
		};
	if (direction !== undefined && typeof(direction) === 'string' && (direction === 'next' || direction === 'previous')) {
		var prop = (direction === 'previous') ? 'previousElementSibling' : 'nextElementSibling',
			attr = (direction === 'previous') ? 'data-gone' : 'data-coming';
		newDestination = currentPanel[prop];
		if (newDestination !== null && newDestination.className.indexOf('display-panel') !== -1 && (newDestination.tagName.toUpperCase() === 'DIV' || newDestination.tagName.toUpperCase() === 'LI')) {
			makeMove();
		}
	} else if (direction !== undefined && typeof(direction) === 'number' && direction >= 0) {
		newDestination = display.element.querySelector('[data-display-panel-index="' + direction + '"]');
		if (newDestination !== undefined) {
			makeMove();
		} else {
			throw Error('display: ERROR index is out of bounds for this');
		}
	} else {
		throw Error('display: ERROR invalid direction for moving.');
	}
}
display.prototype._configurePaginationIndicators = function () {
	var display = this,
		currentIndex = parseInt(display.element.querySelector('.display-panel.current').getAttribute('data-display-panel-index'), 10);
	display.element.querySelector('.PGIndicator.current').className = display.element.querySelector('.PGIndicator.current').className.replace("current", "");
	display.element.querySelector('.PGIndicator[data-display-index="' + currentIndex + '"]').className += ' current';
}
display.prototype.next = function () {
	this._move('next');
}
display.prototype.previous = function () {
	this._move('previous');
}
});if (typeof exports == "object") {
  module.exports = require("display");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("display"); });
} else {
  this["display"] = require("display");
}})();