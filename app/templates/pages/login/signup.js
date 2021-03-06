'use strict';
var request = require("request");
var jade = require("jade");
var User = require("../../models/user");
var Email = require("../../config/email");
var config = require("../../config/config");

var emailT = "" +
"| Welcome to #{projectName}\n\n" +
"| \n" +
"| Thanks for signing up. As requested, your account has been created. Here are your login credentials:\n\n" +
"| \n" +
"| Username: #{username}" +
"| Profile: #{projectName}/#{username}" +
"| Email: #{email}\n\n" +
"| Login Here: #{loginURL}\n\n" +
"| \n" +
"| Thanks,\n" +
"| #{projectName}";

exports.init = function(req, res){
    if (req.isAuthenticated()) {
        res.redirect("/connect/")
    } else {
        res.render('login/signup', {
        oauthMessage: '',
        oauthLinkedIn: !!config['linkedin_oauth'],
        oauthTwitter: !!config['twitter_oauth'],
        oauthGoogle: !!config['google_oauth'],
        oauthFacebook: !!config['facebook_oauth']
        });
    }
};

exports.signup = function(req, res){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.username) {
      workflow.outcome.errfor.username = 'required';
    }
    else if (!/^[a-zA-Z0-9\-\_]+$/.test(req.body.username)) {
      workflow.outcome.errfor.username = 'only use letters, numbers, \'-\', \'_\'';
    }

    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
    }
    else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)) {
      workflow.outcome.errfor.email = 'invalid email format';
    }

    if (!req.body.password) {
      workflow.outcome.errfor.password = 'required';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('createUser');
  });

  workflow.on('createUser', function() {
      User.register({
        isActive: 'yes',
        username: req.body.username,
        email: req.body.email.toLowerCase(),
        password: req.body.password,
        networks: ['local']
      }, function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.user = user;
        workflow.emit('sendWelcomeEmail');
      });
  });

  workflow.on('sendWelcomeEmail', function() {
    var fn = jade.compile(emailT);
    var locals = {
      username: req.body.username,
      email: req.body.email,
      loginURL: 'http://'+ req.headers.host +'/login/',
      projectName: config.project_name
    };
    var text = fn(locals);
    var options = {
      "to": req.body.email,
      "subject": 'Your '+ config.project_name +' Account',
      "text": text || "No body here",
    }
    Email.sendMail(options, function () {
      workflow.emit('logUserIn');
    });
  });

  workflow.on('logUserIn', function() {
    req._passport.instance.authenticate('local', function(err, user, info) {
        console.log(err);
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!user) {
        workflow.outcome.errors.push('Login failed. That is strange.');
        return workflow.emit('response');
      }
      else {
        req.login(user, function(err) {
          if (err) {
            return workflow.emit('exception', err);
          }

          workflow.outcome.defaultReturnUrl = "/";
          workflow.emit('response');
          // res.redirect("/");
        });
      }
    })(req, res);
  });

  workflow.emit('validate');
};


