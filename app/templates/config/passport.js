'use strict';
var config = require('./config')
var User = require("../models/user")

exports = module.exports = function(app, passport) {
  var LocalStrategy = require('passport-local').Strategy,
      TwitterStrategy = require('passport-twitter').Strategy,
      GoogleStrategy = require('passport-google-oauth').Strategy,
      FacebookStrategy = require('passport-facebook').Strategy,
      LinkedInStrategy = require('passport-linkedin').Strategy;

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getuser(username, password, function(err, user) {
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

  if (config['twitter-oauth-key']) {
    passport.use(new TwitterStrategy({
        consumerKey: config['twitter-oauth-key'],
        consumerSecret: config['twitter-oauth-secret']
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

  if (config['google-oauth-key']) {
    passport.use(new GoogleStrategy({
        clientID: config['google-ouath-key'],
        clientSecret: config['google-ouath-secret'],
        callbackURL: "http://localhost:8080/auth/google/callback"
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

  if (config['facebook-oauth-key']) {
    passport.use(new FacebookStrategy({
        clientID: config['facebook-oauth-key'],
        clientSecret: config['facebook-oauth-secret']
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
  if (config['linkedin-oauth-key']) {
    passport.use(new LinkedInStrategy({
        consumerKey: config['linkedin-oauth-key'],
        consumerSecret: config['linkedin-oauth-secret'],
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