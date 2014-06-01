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
    if (this.dopages) {
        this.mkdir('pages');
        this.copy('_package.gulp.json', 'package.json');
        this.copy('_gulpfile.js', 'gulpfile.js');
    } else {
        this.copy('_package.json', 'package.json');
    }
    // this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    if (this.doapi) {
        this.mkdir('api/foo');
        this.copy('api/foo/getIndex.js', 'api/foo/getIndex.js');
    }
    if (this.dopages) {
        this.copy('pages/pages.json', 'pages/pages.json');
        this.copy('pages/index.jade', 'pages/index.jade');
        this.mkdir('pages/default');
        this.copy('pages/default/layout.jade', 'pages/default/layout.jade');
        this.copy('pages/bar.jade', 'pages/bar.jade');
        this.mkdir('pages/foo');
        this.copy('pages/foo/foo.jade', 'pages/foo/foo.jade');
        this.copy('pages/foo/foo.coffee', 'pages/foo/foo.coffee');
        this.copy('pages/foo/snip.jade', 'pages/foo/snip.jade');
        this.mkdir('pages/jslib');
        this.copy('pages/jslib/libco.coffee', 'pages/jslib/libco.coffee');
        this.copy('pages/jslib/libjs.js', 'pages/jslib/libjs.js');
    }
    this.mkdir('public');
    this.mkdir('public/js');
    this.copy('_app.js', 'app.js');
  }
});

module.exports = SynthifyGenerator;