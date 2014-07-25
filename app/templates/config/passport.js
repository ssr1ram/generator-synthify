'use strict';
var config = require('./config')
var User = require("../models/user")

exports = module.exports = function(app, passport) {
  var LocalStrategy = require('passport-local').Strategy,
      TwitterStrategy = require('passport-twitter').Strategy,
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
      FacebookStrategy = require('passport-facebook').Strategy,
      LinkedInStrategy = require('passport-linkedin').Strategy;

  passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function(email, password, done) {
      User.getuser(email, password, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Unknown user' });
        }
        return done(null, user);
      })
    })
  )

  if (config['twitter_oauth']) {
    passport.use(new TwitterStrategy({
        consumerKey: config['twitter_api_key'],
        consumerSecret: config['twitter_api_secret'],
        callbackURL: app.hosturl + "/login/twitter/callback/"
      },
      function(token, tokenSecret, profile, done) {
        done(null, false, {
          token: token,
          tokenSecret: tokenSecret,
          profile: profile
        });
      }
    ));
  }

  if (config['google_oauth']) {
    passport.use(new GoogleStrategy({
        clientID: config['google_client_id'],
        clientSecret: config['google_client_secret'],
        callbackURL: app.hosturl + "/login/google/callback/"
      },
      function(accessToken, refreshToken, profile, done) {
        done(null, false, {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profile: profile
        });
      }
    ));
  }

  if (config['facebook_oauth']) {
    passport.use(new FacebookStrategy({
        clientID: config['facebook_app_id'],
        clientSecret: config['facebook_app_secret'],
        callbackURL: app.hosturl + "/login/facebook/callback/"
      },
      function(accessToken, refreshToken, profile, done) {
        done(null, false, {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profile: profile
        });
      }
    ));
  }
  if (config['linkedin_oauth']) {
    passport.use(new LinkedInStrategy({
        consumerKey: config['linkedin_api_key'],
        consumerSecret: config['linkedin_api_secret'],
        callbackURL: app.hosturl + "/login/linkedin/callback/",
        profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'picture-url', 'picture-urls::(original)', 'public-profile-url']
      },
      function(accessToken, refreshToken, profile, done) {
        done(null, false, {
          accessToken: accessToken,
          refreshToken: refreshToken,
          profile: profile
        });
      }
    ));
  }

  passport.serializeUser(function(user, done) {
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser(function(user, done) {
    try {
        u = JSON.parse(user)
    } catch(e) {
    done(null, JSON.parse(user));
    }
  });
};
