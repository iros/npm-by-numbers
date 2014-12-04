# A visualization of npmjs data

NPM By Numbers is a visualization project that explores the current state of packages on NPM. By current, we actually mean the state as it was on September 22nd [1] of this year.

You can view the visualization live here:

http://npmbynumbers.bocoup.com

## Screenshots

#### Web:

![web](http://i.gyazo.com/9a3c81255e5cf100ac3176d69c22f288.png)

#### Mobile:

![mobile](http://i.gyazo.com/3893564c05f88ecca1a26e4c97b7156d.png)

## Where is the data?

The data for this specific application lives in `assets/data` but that json file is  built elsewhere.
You can see that process here: http://github.com/iros/npm-by-numbers-analysis

### Development

#### Set up

You should have node installed on your system to run this. We are using npm modules for the build process with `grunt` and `bower` for our client-side dependency management.

Once you clone this repo, run:

* `npm install`
* `bower install`

This will get the repo ready for running.

#### Running

You can run the application by calling:

* `grunt dev`

from your console. This will start a development server that will watch for file changes in source and recompile things appropriatly.

If you want to see the production version (which runs minified files) you can run:

* `grunt prod`

to build a production version of the site and run a local server that will serve it.

There is a deploy task, but it requires permissions that you probably won't have =).

### The Code

#### Dependencies

This application is built using:

* `Backbone` - For thin wrappers around models and views, as well as application routing.
* `LayoutManager` - For managing backbone view placement and updating.
* `d3.js` - For visualization powers
* `d3.chart` - For organized/reusable/maintainable visualization powers
* `requirejs` - For modularization and build process
* `Lodash` - For functional things
* `When` - For deferred things, like network requests and animation queue management
* `Slick.js` - For swiping slide stuff
* `Modernizer` - For media query tests (for mobile vs desktop)
* `jQuery Mobile Touch events` - For catching swipe events outside the slide.js library.

#### High level architecture

The application has two separate code paths for a deskop version (`src/modules/web`) and mobile version (`src/modules/mobile`). While some might argue that a responsive layout could have accomplished both, this is fairly impossible for this particular visualization. As a result, we have those two source folders that also utilize shared code in `src/modules/shared` for anything that the two share, such as colors, fetching data etc.

Some really crazy work went into enabling `require.js` builds that would create separate desktop and mobile versions of the code thanks to @tbranyen and @jugglinmike who made that possible. To see how that works start off with `src/pages/index.jade` to see the fork in the code, then follow to `build/contrib-requirejs.js` to see how the building works.

### Contributing

We love pull requests! Feel free to make them.
If you see any issues with the site, open an issue for it and we'll try to take a look at it as soon as possible.

For more urgent matters, questions, comments and animated gifs of dogs, you can always email irene at bocoup.com.

### FAQ

1. Why is this data not updating live?

While it's totally feasible for us to deploy our data pipeline so that it pulls updates from the NPM registry in a recurring manner, it would make it a lot easier for us to make conclusions about _what the data acutally says_. As part of our data analysis we've actually explored all these differnet dimensions, looking at correlation and distribution etc. That's what allowed us to say things like there is or there isn't a relationship between age and releases etc. If those numbers change in the future, it would be pretty challenging to know. We'd have to automatically generate the narrative, which may be far less interesting to read. Data changes and some of the patterns we see might go away and become uninteresting.

As such, while it's totally technically feasible, it wouldn't serve the story of NPM for us to automate this.

2. _Your question here!_

Built with <3 by @iros and Bocoup (http://bocoup.com)



