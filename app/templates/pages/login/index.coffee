config = require("../../config/config")

renderIndex = (options) ->
    res.render("login/index.jade", {
        oauthMessage: options.oauthMessage,
        oauthLinkedIn: !!config['linkedin_oauth'],
        oauthTwitter: !!config['twitter_oauth'],
        oauthGoogle: !!config['google_oauth'],
        oauthFacebook: !!config['facebook_oauth']
    })

module.exports.init = (req, res) ->
    if req.isAuthenticated()
        res.redirect("/account/")
    else
        renderIndex({oauthMessage: ''})

module.exports.login = (req, res) ->
  workflow = req.app.utility.workflow(req, res)

  workflow.on('validate', () ->
    if !req.body.username
      workflow.outcome.errfor.username = 'required'

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
        workflow.outcome.errors.push('Username and password combination not found or your account is inactive.')
        return workflow.emit('response')
      else
        req.login(user, (err) ->
          if err
            return workflow.emit('exception', err)
          workflow.emit('response')
        )
    )(req, res)
  )

  workflow.emit('validate')


module.exports.logout = (req, res) ->
    req.logout()
    res.redirect("/")

module.exports.getGoogle = (req, res) ->
    options =
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    if req.param('refresh')
        options['approvalPrompt'] = 'force'
        options['accessType'] = 'offline'
    req._passport.instance.authenticate('google', options )(req, res)

module.exports.loginGoogle = (req, res, next) ->
  done = (user) ->
      req.login(user, (err) ->
          res.redirect("/")
      )
  req._passport.instance.authenticate('google', (err, user, info) ->
    if err
        renderIndex({oauthMessage: err})
        return
    if req.user
        User.updateSocial('google', req.user, info, (user) ->
            done(user)
        )
    else
        User.createSocial('google', info, (user) ->
            done(user)
        )
  )(req, res, next)
