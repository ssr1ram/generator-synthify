

module.exports.route = (app, options) ->
    mod = require('./index')
    mods = require('./signup')
    app.get("/login/", mod.init)
    app.post("/login/", mod.login)
    app.get('/login/forgot/', require('./forgot/index').init)
    app.post('/login/forgot/', require('./forgot/index').send)
    app.get('/login/reset/', require('./reset/index').init)
    app.get('/login/reset/:token/', require('./reset/index').init)
    app.put('/login/reset/:token/', require('./reset/index').set)
    app.get("/logout/", mod.logout)
    app.get("/connect/", mod.connect)

    #social login

    app.get('/login/:provider/', mod.getSocial)
    app.get('/login/:provider/callback/', mod.loginSocial)


    app.get("/signup", mods.init)
    app.post('/signup/', mods.signup)

