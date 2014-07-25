'use strict';
var User = require("../../../models/user")
var config = require("../../../config/config")
var jade = require("jade");
var Email = require("../../../config/email");

var emailT = "" +
"| Forgot your password?\n" +
"| \n" +
"| \n" +
"| We received a request to reset the password for your account (#{username}).\n" +
"| \n" +
"| \n" +
"| To reset your password, click on the link below (or copy and paste the URL into your browser):\n" +
"| #{resetLink}\n" +
"| \n" +
"| \n" +
"| Thanks,\n" +
"| #{projectName}\n";

exports.init = function(req, res){
  if (req.isAuthenticated()) {
    res.redirect(req.user.defaultReturnUrl());
  }
  else {
    res.render('login/forgot/index');
  }
};

exports.send = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.email) {
      workflow.outcome.errfor.email = 'required';
      return workflow.emit('response');
    }

    workflow.emit('generateToken');
  });

  workflow.on('generateToken', function() {
    var crypto = require('crypto');
    crypto.randomBytes(21, function(err, buf) {
      if (err) {
        return next(err);
      }

      var token = buf.toString('hex');
      console.log(token);
      workflow.emit('patchUser', token);
    });
  });

  workflow.on('patchUser', function(token) {
    var conditions = { email: req.body.email.toLowerCase() };
    var fieldsToSet = {
      password: "",
      resetPasswordToken: token
    };
    User.doForgot(req.body.email.toLowerCase(), fieldsToSet, function (err, user) {
        console.log('after forgot');
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!user) {
        return workflow.emit('response');
      }

      workflow.emit('sendEmail', token, user);
    });
  });

  workflow.on('sendEmail', function(token, user) {
    var fn = jade.compile(emailT);
    var locals = {
      username: user.username,
      resetLink: req.protocol +'://'+ req.headers.host +'/login/reset/'+ token +'/',
      projectName: config.project_name
    }
    var text = fn(locals)
    var options = {
      "to": req.body.email,
      "subject": 'Your '+ config.project_name +' Account',
      "text": text || "No body here",
    }
    Email.sendMail(options, function () {
      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};
