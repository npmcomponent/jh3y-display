# display

  An animated display reel component for displaying information such as forms, pictures, media etc.
  
## Demo

You can see a demo of display [here](http://jsfiddle.net/LJfkS/2/). It's using a basic [side to side theme]() and a [swipe navigation extension]().

## Installation (when using [component](http://component.io))

  Install with [component(1)](http://component.io):

    $ component install jheytompkins/display

## Usage

You can use display with the [component package manager]() or standalone by simply adding [display.js]() to your project.

	var display = require('display'); //THIS IS ONLY NEEDED IF USING THE NON STANDALONE VERSION
	var element = document.querySelector('someElement')
	var myDisplay = new display(element);

Once you've created a display, you need a theme for it so it actually renders. There are a selection of themes available or you can create your own. Currently, available themes are based around being responsive to display height and width so a height and width __MUST__ be set for your display.

## API

###next()

Moves the display to the next panel of content.

###previous()

Moves the display to the previous panel of content.

##Themes

There are some themes available already for display. They all have demos and instructions. Using themes is easy. You simply add the theme class to your display and include the theme CSS in your project. You can see this in the demo, that `side-slide` is added to display and the relevant CSS has been included.

* [side-slide](https://github.com/jheytompkins/display-side-slide.theme): A side sliding theme.
* [top-slide](https://github.com/jheytompkins/display-top-slide.theme): A top sliding theme.
* [carousel](https://github.com/jheytompkins/display-carousel.theme): A carousel theme.
* [vertical-carousel](https://github.com/jheytompkins/vertical-carousel.theme): A vertical version of the carousel theme.
* [scaled-gallery](https://github.com/jheytompkins/display-scaled-gallery.theme): A scaling gallery style theme.
* [scaled-gallery-less](https://github.com/jheytompkins/display-scaled-gallery-less.theme): A reduced version of the scaling gallery style theme.
* [bridge](https://github.com/jheytompkins/display-bridge.theme): A rotating style theme that looks like a bridge.

##Extensions

There are also extensions available for display. They all have demos and instructions. To use an extension you simply include the extension file after including display.

##Contributing

Please do!

Any feedback is very welcome and if you have a theme or extension you would like added that would be awesome. Just submit a pull request with the updated readme.

## License

  MIT
