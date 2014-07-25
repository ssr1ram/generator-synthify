
ensureAuthenticated = (req, res, next) ->
  if req.isAuthenticated()
    return next()

  res.set('X-Auth-Required', 'true')
  req.session.returnUrl = req.originalUrl
  res.redirect('/signup/')

module.exports.route = (app, opts) ->
    pages = require('./pages')
    app.get("/", pages.getIndex)
    app.get("/foo", pages.getFoo)
    app.get("/isfoo", ensureAuthenticated, pages.getFoo)
    app.get("/bar", pages.getBar)
    app.get("/account/", pages.getBar)

