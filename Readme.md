# display
----

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

Once you've created a display, you need a theme for it so it actually renders. There are a selection of themes available or you can create your own. Currently, available themes are based around being responsive to display height and width so a height and width MUST be set for your display.

## API

###next()

Moves the display to the next panel of content.

###previous()

Moves the display to the previous panel of content.

##Themes

There are some themes available already for display. They all have demos and instructions. Using themes is easy. You simply add the theme class to your display and include the theme CSS in your project. You can see this in the demo, that 'side-slide' is added to display and the relevant CSS  has been included.

##Extensions

There are also extensions available for display. They all have demos and instructions. To use an extension you simply include the extension file after including display.

## License

  MIT
