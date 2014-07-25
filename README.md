# generator-synthify [![Build Status](https://secure.travis-ci.org/ssr1ram/generator-synthify.png?branch=master)](https://travis-ci.org/ssr1ram/generator-synthify)

> [Yeoman](http://yeoman.io) generator


## Getting Started

### What is Yeoman?

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

To install generator-synthify from npm, run:

```bash
$ npm install -g git+https://github.com/ssr1ram/generator-synthify.git
```

Finally, initiate the generator:

```bash
$ mkdir project
$ cd project
$ yo synthify
```

### Getting started on the app

After yeoman has generated the skeleton app, installed node modules and
run gulp, you should.

* Rename config.rename.js to config.js
* Required entries
  * project_name
  * hosturl
  * ironio cache - for session store
  * parse.com - database to store user data
  * mailgun - for email
* Optional
  * oauth developer apps for twitter, facebook, google & linkedin
* Run
  * NODE_ENV=development node server.js

### Directory structure

* api
  * see http://github.com/ssr1ram/synthify for documentation on how to
    layout the files within api
* config
  * copy config.rename.js to config.js and fill in the details
  * passport.js - contains strategies - no modifications necessary

* models
  * user.coffee - all database (Parse) specific code lies here
* pages
  * foo
    * Look at pages.coffee to see how foo.jade is called
    * foo.jade requires and calls other files here and in jslib
  * index
    * index.jade - The html file displayed on route /
    * index.less - gulp turns this into /css/index.css and
    * index_front.coffee - gulp browserifies this into /js/index.js and
      /js/index.min.js
  * jslib - used b foo_front.coffee
  * layouts - used by login and other routes
  * login
    * providers
      * twitter, linkedin, facebook & google - use these as templates to
        add additional providers
      * route.coffee - picked up by synthify.doroutes in app.coffee
      * rest of files - self explanatory
  * app.coffee - main coffee file
  * connect-iocache.js - ironio cache interface for connect as session
    store
  * gulpfile.js - individually watches and browserifies <foo>front files
  * server.js - main entry file
    * NODE_ENV=development node server.js



## License

MIT
