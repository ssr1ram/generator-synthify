config = require("../../config/config")
User = require("../../models/user")

renderIndex = (req, res, options) ->
    if not options.render
        options.render = 'login/index.jade'

    res.render(options.render, {
        oauthMessage: options.oauthMessage,
        oauthLinkedIn: !!config['linkedin_oauth'],
        oauthTwitter: !!config['twitter_oauth'],
        oauthGoogle: !!config['google_oauth'],
        oauthFacebook: !!config['facebook_oauth']
    })

module.exports.init = (req, res) ->
    if req.isAuthenticated()
        res.redirect("/connect/")
    else
        renderIndex(req, res, {oauthMessage: ''})

module.exports.login = (req, res) ->
  workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', () ->
    if !req.body.email
      workflow.outcome.errfor.email = 'required'
    else if !/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.email)
      console.log('email err')
      workflow.outcome.errfor.email = 'invalid email format'

    if !req.body.password
      workflow.outcome.errfor.password = 'required'

    if workflow.hasErrors()
      return workflow.emit('response')

    workflow.emit('attemptLogin')
  )

  workflow.on('attemptLogin', () ->
    req._passport.instance.authenticate('local', (err, user, info) ->
      if err
        return workflow.emit('exception', err)

      if !user
        workflow.outcome.errors.push('email and password combination not found or your account is inactive.')
        return workflow.emit('response')
      else
        req.login(user, (err) ->
          if err
            return workflow.emit('exception', err)
          return workflow.emit('response')
        )
    )(req, res)
  )

  workflow.emit('validate')


module.exports.logout = (req, res) ->
    req.logout()
    res.redirect("/")

module.exports.getSocial = (req, res) ->
    provider = req.param("provider")
    socprod = require("./providers/" + provider)
    options = socprod.getOptions(req, res)
    req._passport.instance.authenticate(provider, options )(req, res)

module.exports.loginSocial = (req, res, next) ->
    provider = req.param("provider")
    try
        socprod = require("./providers/" + provider)
    catch e
        res.redirect("/login/")
        return
    req._passport.instance.authenticate(provider, (err, user, info) ->
      if err
        renderIndex(req, res, {oauthMessage: err})
        return
      socprod.setUser(req, res, info, (err, user) ->
        if (err)
          console.log('have error')
          console.log(err)
          res.redirect("/")
        req.login(user, (err) ->
          res.redirect("/")
        )
      )
    )(req, res, next)


module.exports.connect = (req, res, next) ->
    renderIndex(req, res, {oauthMessage:'', render: 'login/connect.jade'})
