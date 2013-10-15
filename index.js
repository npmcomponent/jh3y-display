module.exports = display;

function display(element, options) {
	if (!(this instanceof display)) return new display(element, options);
	this._defaults = {
		horizontal: true,
		vertical: false,
		showNext: true,
		showPrevious: true,
		height: '200px',
		width: '200px'
	};
	this.element = element;
	var extend = function (a, b) {
		for(var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}
	this._options = extend(this._defaults, options);
	var createPrivateVariables = function (component, options) {
		for (var option in options) {
			component['_' + option] = options[option];
		}
	}
	createPrivateVariables(this, this._options);
	// this._height = this._options.height;
	// this._width = this._options.width;
	// this._showNext = this._options.showNext;
	// this._showPrevious = this._options.showPrevious;
	// this._horizontal = this._options.horizontal;
	// this._vertical - this._options.vertical;
	this._create();
}
display.prototype._create = function () {
	//element is the container so all children are display panels.
	var display = this,
		panels = display.element.querySelectorAll('div');
	display.className = display.className + ' display';
	display.style.height = display._height;
	display.style.width = display._width;
	[].forEach.call(panels, function (panel) {
		panel.className = panel.className + ' display-panel';
	});
}
display.prototype._next = function () {

}
display.prototype._previous = function () {

}
