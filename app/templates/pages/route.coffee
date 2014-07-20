
module.exports.route = (app) ->
    pages = require('./pages')
    app.get("/", pages.getIndex)
    app.get("/foo", pages.getFoo)
    app.get("/bar", pages.getBar)

