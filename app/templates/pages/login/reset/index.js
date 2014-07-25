'use strict';
var User = require("../../../models/user")

exports.init = function(req, res){
  if (req.isAuthenticated()) {
    res.redirect(req.user.defaultReturnUrl());
  }
  else {
    res.render('login/reset/index');
  }
};

exports.set = function(req, res){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.password) {
      workflow.outcome.errfor.password = 'required';
    }

    if (!req.body.confirm) {
      workflow.outcome.errfor.confirm = 'required';
    }

    if (req.body.password !== req.body.confirm) {
      workflow.outcome.errors.push('Passwords do not match.');
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('findUser');
  });

  workflow.on('findUser', function() {
      console.log('a');
      console.log(req.params.token);
      console.log(req.body.password);
      console.log('b');
    User.doReset(req.params.token, req.body.password, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!user) {
        workflow.outcome.errors.push('Invalid request.');
        return workflow.emit('response');
      }

      req.login(user, function(err) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.outcome.defaultReturnUrl = "/";
        workflow.emit('response');
        // res.redirect("/");
      });

    });
  });

  workflow.emit('validate');
};
