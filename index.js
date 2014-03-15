module.exports = display;
function display(element, options) {
	if (!(this instanceof display)) return new display(element);
	this.element = element;
	this._nav = (options && options.nav) ? true: false;
	this._pagination = (options && options.pagination) ? true: false;
	this._infinite = (options && options.infinite) ? true: false;
	this._autoPlay = (options && options.autoPlay) ? true: false;
	this._autoPlayDuration = (options && options.autoPlayDuration) ? parseInt(options.autoPlayDuration, 10): 5000;
	this._create();
	for (var ext in this._extensions) {this._extensions[ext](this);}
}
display.prototype._extensions = {}
display.prototype._configurePanels = function () {
	var display = this,
		count,
		panelLength = display.element.querySelectorAll('.display-panel').length,
		lastPanel = display.element.querySelectorAll('.display-panel')[panelLength - 1],
		currentPanel,
		directions = {'nextElementSibling': 'data-coming', 'previousElementSibling': 'data-gone'},
		cleanUp = function () {
			for (direction in directions) {
				currentPanel = display.element.querySelector('.display-panel.current');
				count = 1;
				while (currentPanel[direction] !== null && (currentPanel[direction].className.indexOf('display-panel') !== -1) && (currentPanel[direction].tagName.toUpperCase() === 'DIV' || currentPanel[direction].tagName.toUpperCase() === 'LI')) {
					currentPanel[direction].setAttribute(directions[direction], count);
					if (directions[direction] === 'data-coming') {
						currentPanel[direction].removeAttribute('data-gone');
					} else if (directions[direction] === 'data-gone') {
						currentPanel[direction].removeAttribute('data-coming');
					}
					count ++;
					currentPanel = currentPanel[direction];
				}
			}
		};
	cleanUp();
	if (display._infinite && panelLength >= 3) {
		if (lastPanel.className.indexOf('current') !== -1) {
			if (display.element.lastElementChild.className.indexOf('display-panel') !== -1) {
				display.element.appendChild(display.element.firstElementChild);
			} else {
				display.element.insertBefore(display.element.firstElementChild, lastPanel.nextElementSibling);
			}
			cleanUp();
		} else if (display.element.firstElementChild.className.indexOf('current') !== -1) {
			display.element.insertBefore(lastPanel, display.element.firstElementChild);
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
		var navLeft = document.createElement('i'),
			navRight = document.createElement('i');
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
		var reIndex = function () {
			for (var i = panels.length - 1; i >= 0; i--) {
				display.element.insertBefore(display.element.querySelector('[data-display-panel-index="' + i + '"]'), display.element.firstElementChild);
			};
			display._configurePanels();
		},
			paginationIndicator,
			paginationPen = document.createElement('span');
		paginationPen.className = 'display-pagination-pen';
		for (var i = 0; i < panels.length; i++) {
			var newIndicator = document.createElement('i');
			newIndicator.className = 'display-pagination-indicator';
			newIndicator.setAttribute('data-display-index', i);
			if (i === 0) {
				newIndicator.className += ' current';
			}
			newIndicator.addEventListener('click', function () {
				paginationIndicator = this;
				display._move(parseInt(paginationIndicator.getAttribute('data-display-index'), 10));
			});
			paginationPen.appendChild(newIndicator);
		};
		display.element.appendChild(paginationPen);
	}
	if (display._autoPlay) {
		display.autoPlay(true, display._autoPlayDuration, 'next');
	}
}
display.prototype.autoPlay = function (autoPlay, speed, direction) {
	var display = this;
	if (autoPlay) {
		speed = (speed && typeof(speed) === 'number') ? speed: 5000;
		direction = (direction && typeof(direction) === 'string') ? direction: 'next'; 
		window.display.playInterval = window.setInterval(function () {
			display._move(direction);
		}, speed);
		display._autoPlay = true;
		display._autoPlayID = window.display.playInterval;
	} else {
		window.clearInterval(display._autoPlayID);
		display._autoPlay = false;
	}
}
display.prototype._move = function (direction) {
	var display = this,
		currentPanel = display.element.querySelector('.display-panel.current'),
		panels = display.element.querySelectorAll('.display-panel'),
		newDestination,
		reIndex = function () {
			for (var i = panels.length - 1; i >= 0; i--) {
				display.element.insertBefore(display.element.querySelector('[data-display-panel-index="' + i + '"]'), display.element.firstElementChild);
			};
			display._configurePanels();
		},
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
		} else if (display._autoPlay) {
			display._move(0);
		}
	} else if (direction !== undefined && typeof(direction) === 'number' && direction >= 0) {
		newDestination = display.element.querySelector('[data-display-panel-index="' + direction + '"]');
		if (newDestination !== undefined) {
			reIndex();
			setTimeout(function () {
				makeMove();
			}, 250);
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
	display.element.querySelector('.display-pagination-indicator.current').className = display.element.querySelector('.display-pagination-indicator.current').className.replace("current", "");
	display.element.querySelector('.display-pagination-indicator[data-display-index="' + currentIndex + '"]').className += ' current';
}
display.prototype.next = function () {
	this._move('next');
}
display.prototype.previous = function () {
	this._move('previous');
}