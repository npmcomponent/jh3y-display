module.exports = display;
function display(element) {
	if (!(this instanceof display)) return new display(element, options);
	this.element = element;
	this._create();
}
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
	[].forEach.call(panels, function (panel, index) {
		if (panel.tagName.toLowerCase() === 'div') {
			panel.className = (index === 0) ? panel.className + ' current': panel.className;
			panel.className = panel.className + ' display-panel';
		}
	});
	display._configurePanels();
}
display.prototype._move = function (direction) {
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