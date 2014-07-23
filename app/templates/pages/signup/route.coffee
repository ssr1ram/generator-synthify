

module.exports.route = (app, options) ->
    mod = require('./index')
    app.get("/signup", mod.init)
    app.post('/signup/', mod.signup)

