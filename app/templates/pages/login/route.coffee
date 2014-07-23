

module.exports.route = (app) ->
    mod = require('./index')
    app.get("/login/", mod.init)
    app.get("/login", mod.init)
    app.post("/login/", mod.login)
    app.post("/login", mod.login)
    app.get("/logout", mod.logout)

