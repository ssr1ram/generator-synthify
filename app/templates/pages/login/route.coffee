

module.exports.route = (app, options) ->
    mod = require('./index')
    app.get("/login/", mod.init)
    app.post("/login/", mod.login)
    app.get("/logout/", mod.logout)

    #social login
    # app.get('/login/linkedin/', passport.authenticate('linkedin', { callbackURL: '/login/linkedin/callback/' }))
    # app.get('/login/linkedin/callback/', mod.loginLinkedIn)
    # app.get('/login/twitter/', passport.authenticate('twitter', { callbackURL: '/login/twitter/callback/' }))
    # app.get('/login/twitter/callback/', mod.loginTwitter)
    app.get('/login/google/', mod.getGoogle)
    ###
    app.get('/login/google/', options.passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    }))
    ###
    app.get('/login/google/callback/', mod.loginGoogle)
    # app.get('/login/facebook/', passport.authenticate('facebook', { callbackURL: '/login/facebook/callback/' }))
    # app.get('/login/facebook/callback/', mod.loginFacebook)

