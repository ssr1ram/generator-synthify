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
            name: 'doit',
            message: 'Create a synthify app in this directory?',
            default: true
        }
    ];

    this.prompt(prompts, function (props) {
      this.doit = props.doit;

      done();
    }.bind(this));
  },

  app: function () {
    if (!this.doit) {
        this.log(yosay('Leaving..'));
        process.exit()
    }
    var pkg = this.src.readJSON('package.json');
    this.dest.write('package.json', JSON.stringify(pkg, null, 2));
    this.copy('gulpfile.js', 'gulpfile.js');
    this.copy('bowerrc', '.bowerrc');
    this.copy('bower.json', 'bower.json');
    this.copy('gitignore', '.gitignore');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.directory('_node_modules', 'node_modules');
    this.directory('api', 'api');
    this.directory('config', 'config');
    this.directory('models', 'models');
    this.directory('pages', 'pages');
    this.directory('public', 'public');
    this.copy('connect-iocache.js', 'connect-iocache.js');
    this.copy('app.coffee', 'app.coffee');
    this.copy('server.js', 'server.js');
  }
});

module.exports = SynthifyGenerator;
