*This repository is a mirror of the [component](http://component.io) module [jh3y/display](http://github.com/jh3y/display). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/jh3y-display`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*
# display

  An animated display reel component for displaying information such as forms, pictures, media etc.
  
## Demo

You can see a demo of display [here](http://jsfiddle.net/Wvt4z/1/). It's using a basic [side to side theme](https://github.com/jh3y/display-side-slide.theme) and a [swipe navigation extension](https://github.com/jh3y/display-add-swipe-navigation.extension).

## Installation (when using [component](http://component.io))

  Install with [component(1)](http://component.io):

    $ component install jh3y/display

## Usage

You can use display with the [component package manager](http://component.io) or standalone by simply adding [display.js](https://github.com/jh3y/display/blob/master/display.js) to your project.

	var display = require('display'); //THIS IS ONLY NEEDED IF USING THE NON STANDALONE VERSION
	var element = document.querySelector('someElement')
	var myDisplay = new display(element);

To use display, you need to provide the following structure
	
	div //becomes the display, this is the element you pass in.
		div //becomes a display panel
		div //becomes a display panel
		div //becomes a display panel

Once you've created a display, you need a theme for it so it actually renders. There are a selection of themes available or you can create your own. Currently, available themes are based around being responsive to display height and width so a height and width __MUST__ be set for your display.

## API

###next()

Moves the display to the next panel of content.

###previous()

Moves the display to the previous panel of content.

##Themes

There are some themes available already for display. They all have demos and instructions. Using themes is easy. You simply add the theme class to your display and include the theme CSS in your project. You can see this in the [demo](http://jsfiddle.net/Wvt4z/1/), that `side-slide` is added to display and the relevant CSS has been included.

* [side-slide](https://github.com/jh3y/display-side-slide.theme): side sliding theme.
* [top-slide](https://github.com/jh3y/display-top-slide.theme): top sliding theme.
* [merry-go-round](https://github.com/jh3y/display-merry-go-round.theme): carousel theme.
* [vertical-carousel](https://github.com/jh3y/vertical-merry-go-round.theme): vertical version of the carousel theme.
* [scaled-gallery](https://github.com/jh3y/display-scaled-gallery.theme): scaling gallery style theme.
* [scaled-gallery-less](https://github.com/jh3y/display-scaled-gallery-less.theme): reduced version of the scaling gallery style theme.
* [bridge](https://github.com/jh3y/display-bridge.theme): rotating style theme that looks like a bridge.

##Extensions

There are also extensions available for display. They all have demos and instructions. To use an extension you simply include the extension file after including display.

* [swipe-navigation](https://github.com/jh3y/display-add-swipe-navigation.extension): provides horizontal swipe navigation on touch devices such as mobile.
* [scroll-navigation](https://github.com/jh3y/display-add-scroll-navigation.extension): provides vertical scroll navigation on touch devices such as mobile.

##Example Usage

* [form](http://jsfiddle.net/bMEZR/): An example of a form being presented with display.
* [video gallery](http://jsfiddle.net/vCdc3/5/): An example video gallery of some funny dance lessons.

##Contributing

Please do!

Any feedback is very welcome and if you have a theme or extension you would like added that would be awesome. Just submit a pull request with the updated readme.

## License

  MIT
