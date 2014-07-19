'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var SynthifyGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Synthify generator!'));

    var prompts = [
        {
            type: 'confirm',
            name: 'doapi',
            message: 'Would you like to synthify an api?',
            default: true
        },
        {
            type: 'confirm',
            name: 'dopages',
            message: 'Would you like to synthify pages?',
            default: true
        },
        {
            type: 'confirm',
            name: 'dogoogle',
            message: 'Would you like to synthify google oauth?',
            default: true
        },
        {
            type: 'confirm',
            name: 'dofacebook',
            message: 'Would you like to synthify facebook oauth?',
            default: true
        }
    ];

    this.prompt(prompts, function (props) {
      this.doapi = props.doapi;
      this.dopages = props.dopages;

      done();
    }.bind(this));
  },

  app: function () {
    if (this.doapi) {
        this.mkdir('api');
    }
    var pkg = this.src.readJSON('_package.json');
    if (this.dopages) {
        this.mkdir('pages');
        pkg["devDependencies"] = {
            "browserify": "~4.1.6",
            "coffeeify": "~0.6.0",
            "jade": "~1.3.1",
            "jadeify": "~2.3.0",
            "gulp": "~3.6.2",
            "vinyl-source-stream": "~0.1.1"
        }
        this.dest.write('package.json', JSON.stringify(pkg, null, 2));
        this.copy('_gulpfile.js', 'gulpfile.js');
    } else {
        this.copy('_package.json', 'package.json');
    }
    this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    if (this.doapi) {
        this.mkdir('api/foo');
        this.copy('api/foo/getIndex.js', 'api/foo/getIndex.js');
    }
    if (this.dopages) {
        this.copy('pages/pages_back.coffee', 'pages/pages_back.coffee');
        this.copy('pages/index.jade', 'pages/index.jade');
        this.mkdir('pages/default');
        this.copy('pages/default/layout.jade', 'pages/default/layout.jade');
        this.copy('pages/bar.jade', 'pages/bar.jade');
        this.mkdir('pages/foo');
        this.copy('pages/foo/foo.jade', 'pages/foo/foo.jade');
        this.copy('pages/foo/foo_front.coffee', 'pages/foo/foo_front.coffee');
        this.copy('pages/foo/snip.jade', 'pages/foo/snip.jade');
        this.mkdir('pages/jslib');
        this.copy('pages/jslib/libco.coffee', 'pages/jslib/libco.coffee');
        this.copy('pages/jslib/libjs.js', 'pages/jslib/libjs.js');
    }
    this.mkdir('public');
    this.mkdir('public/js');
    this.copy('app.coffee', 'app.coffee');
    this.copy('server.js', 'server.js');
  }
});

module.exports = SynthifyGenerator;
