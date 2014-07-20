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
        var that = this;
        this.installDependencies({
          skipInstall: this.options['skip-install'],
          callback: function() {
            that.spawnCommand('gulp');
          }
        });
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
            name: 'dousers',
            message: 'Would you like a user system?',
            default: true
        }
    ];

    this.prompt(prompts, function (props) {
      this.dousers = props.dousers;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('api');
    this.mkdir('pages');
    var pkg = this.src.readJSON('package.json');
    this.dest.write('package.json', JSON.stringify(pkg, null, 2));
    this.copy('gulpfile.js', 'gulpfile.js');
    this.copy('bowerrc', '.bowerrc');
    this.copy('bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.mkdir('api/foo');
    this.copy('api/foo/getIndex.js', 'api/foo/getIndex.js');
    this.copy('pages/pages.coffee', 'pages/pages.coffee');
    this.copy('pages/route.coffee', 'pages/route.coffee');
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
    this.mkdir('public');
    this.mkdir('public/js');
    if (this.dousers) {
        this.directory('pages/layouts', 'pages/layouts');
        this.directory('pages/login', 'pages/login');
    }
    this.copy('app.coffee', 'app.coffee');
    this.copy('config.js', 'config.js');
    this.copy('server.js', 'server.js');
  }
});

module.exports = SynthifyGenerator;
