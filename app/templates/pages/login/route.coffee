

module.exports.route = (app) ->
    mod = require('./index')
    app.get("/login", mod.getIndex)

