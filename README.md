# generator-synthify

> [Yeoman](http://yeoman.io) generator


## Getting Started

### install yeoman

```bash
$ npm install -g yo
```

### install this generator


```bash
$ npm install -g generator-synthify
```

### initiate the generator:

```bash
$ mkdir project
$ cd project
$ yo synthify
```

### configure app

* Rename config.rename.js to config.js
* Required entries
  * project_name
  * hosturl
  * ironio cache - for session store
  * parse.com - database to store user data
  * mailgun - for email
* Optional
  * oauth developer apps for twitter, facebook, google & linkedin

### run app

```bash
$ NODE_ENV=development node server.js
$ open http://localhost:3000
```

### understand the directory structure

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
